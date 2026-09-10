"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import type { ThreeElement } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox } from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import * as THREE from "three";
import { badge } from "@/content/cv";
import { useBadgeTextures } from "./useBadgeTextures";

extend({ MeshLineGeometry, MeshLineMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    meshLineGeometry: ThreeElement<typeof MeshLineGeometry>;
    meshLineMaterial: ThreeElement<typeof MeshLineMaterial>;
  }
}

/* Medidas do crachá, em unidades de cena */
const CARD_W = 1.6;
const CARD_H = 2.4;
const CARD_D = 0.04;
const RING_Y = CARD_H / 2 + 0.26;

type Props = {
  /** Caminho da foto do retrato. null => placeholder tipográfico. */
  photoSrc: string | null;
  className?: string;
  /** Chamado se a GPU desistir — quem chama deve cair para o crachá 2D. */
  onContextLost?: () => void;
};

export default function LanyardScene({
  photoSrc,
  className,
  onContextLost,
}: Props) {
  return (
    <div
      className={className}
      /* pan-y mantém o scroll vertical funcionando em toque mesmo
         com a cena capturando o ponteiro para arrastar o crachá */
      style={{ touchAction: "pan-y" }}
    >
      <Canvas
        camera={{ position: [0, 0, 13], fov: 25 }}
        gl={{ alpha: true, antialias: true, powerPreference: "default" }}
        dpr={[1, 1.75]}
        onCreated={({ gl }) => {
          const canvas = gl.domElement;
          canvas.addEventListener(
            "webglcontextlost",
            (e) => {
              e.preventDefault();
              /* Nem toda perda de contexto é falha de GPU: o descarte de um
                 mount (duplo mount do StrictMode em dev, troca de rota)
                 também dispara este evento. Só é falha real se, no tick
                 seguinte, este canvas ainda estiver na página E o contexto
                 continuar perdido. Sem essa checagem o site rebaixava para
                 o crachá 2D em todo carregamento em dev. */
              setTimeout(() => {
                if (canvas.isConnected && gl.getContext().isContextLost()) {
                  onContextLost?.();
                }
              }, 250);
            },
            { once: true },
          );
        }}
      >
        <ambientLight intensity={Math.PI * 0.35} />
        <Physics gravity={[0, -40, 0]} timeStep={1 / 60}>
          <SizedRig photoSrc={photoSrc} />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="#bfeaf0"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="#8fd7e0"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}

/**
 * Dimensiona o cordão em função da área visível.
 *
 * A cena ocupa a hero inteira, então o alcance do crachá precisa acompanhar:
 * corda curta demais e ele fica preso num cantinho. O comprimento sai de uma
 * fração da largura visível, limitado para não virar um elástico.
 */
function SizedRig({ photoSrc }: { photoSrc: string | null }) {
  const viewport = useThree((s) => s.viewport);

  const rig = useMemo(() => {
    const rope = Math.min(Math.max(viewport.width * 0.17, 1), 2.1);
    /* Âncora à direita do centro: o texto da hero mora à esquerda. */
    const anchorX = Math.min(viewport.width * 0.26, 3.4);
    /* Repouso um pouco acima do meio da tela. */
    const restY = viewport.height * 0.06;
    const anchorY = restY + rope * 3 + RING_Y;
    return { rope, anchorX, anchorY };
  }, [viewport.width, viewport.height]);

  /* As juntas do rapier fixam o comprimento no momento da criação, então uma
     mudança real de tamanho precisa remontar o rig. Bucket grosso para não
     remontar a cada pixel arrastado na borda da janela. */
  const bucket = Math.round(viewport.width / 2);

  return <Band key={bucket} photoSrc={photoSrc} {...rig} />;
}

/** Geometria do meshline expõe setPoints, que não existe em BufferGeometry. */
type BandGeometry = THREE.BufferGeometry & {
  setPoints: (points: THREE.Vector3[]) => void;
};

function Band({
  photoSrc,
  rope,
  anchorX,
  anchorY,
}: {
  photoSrc: string | null;
  rope: number;
  anchorX: number;
  anchorY: number;
}) {
  /* null! e não null: os hooks de junta do rapier exigem RefObject não-nulo,
     mas os corpos só existem depois da montagem. Os acessos em useFrame
     continuam guardados por checagem explícita. */
  const fixed = useRef<RapierRigidBody>(null!);
  const j1 = useRef<RapierRigidBody>(null!);
  const j2 = useRef<RapierRigidBody>(null!);
  const j3 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);
  const band = useRef<THREE.Mesh>(null);

  const { width, height } = useThree((s) => s.size);
  const textures = useBadgeTextures(
    {
      mark: badge.mark,
      holder: badge.holder,
      role: badge.role,
      specialty: badge.specialty,
      location: badge.location,
      serial: badge.serial,
      strapText: badge.strapText,
    },
    photoSrc,
  );

  /* Vetores reaproveitados por frame — alocar dentro do useFrame criaria
     lixo a 60fps e faria o coletor engasgar durante o arrasto. Fica em ref,
     não em useMemo: é estado mutável fora do render. */
  const scratch = useRef({
    vec: new THREE.Vector3(),
    dir: new THREE.Vector3(),
    ang: new THREE.Vector3(),
    rot: new THREE.Vector3(),
    /* Posições suavizadas das juntas do meio: sem isso a fita tremula
       quando o crachá é puxado além do comprimento da corda. */
    lerp1: new THREE.Vector3(),
    lerp2: new THREE.Vector3(),
    seeded: false,
  });

  const curve = useMemo(() => {
    const c = new THREE.CatmullRomCurve3([
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
    ]);
    /* centripetal, não chordal: quando as juntas do meio se aproximam, a
       parametrização chordal gera tangentes enormes e a fita dispara para
       fora da cena (medido: x chegando a -7.8 numa cena de ±2.9). A
       centripetal é garantida contra cúspide e overshoot. */
    c.curveType = "centripetal";
    return c;
  }, []);

  const [dragged, setDragged] = useState<THREE.Vector3 | null>(null);
  const [hovered, setHovered] = useState(false);

  /* args precisa ser estável: uma nova referência a cada render faria o R3F
     reconstruir o material toda vez. O valor real de resolution chega pela
     prop reativa abaixo, que só faz .set() no Vector2 existente. */
  const bandMaterialArgs = useMemo<[{ resolution: THREE.Vector2 }]>(
    () => [{ resolution: new THREE.Vector2(1, 1) }],
    [],
  );

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], rope]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], rope]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], rope]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, RING_Y, 0]]);

  /* A fita PRECISA nascer com pontos válidos.
     Uma MeshLineGeometry sem atributo de posição gera um draw call inválido
     que derruba o contexto WebGL em GPU integrada — e, com o loop de frames
     morto, a física nunca roda e os pontos nunca chegam: impasse permanente.
     Semear aqui garante que o primeiro desenho já seja legítimo. */
  useEffect(() => {
    const geom = band.current?.geometry as BandGeometry | undefined;
    if (!geom) return;
    geom.setPoints([
      new THREE.Vector3(anchorX, anchorY - rope * 3, 0),
      new THREE.Vector3(anchorX, anchorY - rope * 2, 0),
      new THREE.Vector3(anchorX, anchorY - rope, 0),
      new THREE.Vector3(anchorX, anchorY, 0),
    ]);
  }, [anchorX, anchorY, rope]);

  useEffect(() => {
    document.body.style.cursor = dragged
      ? "grabbing"
      : hovered
        ? "grab"
        : "auto";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    const c = card.current;
    const a = fixed.current;
    const b1 = j1.current;
    const b2 = j2.current;
    const b3 = j3.current;
    if (!c || !a || !b1 || !b2 || !b3) return;

    const s = scratch.current;

    /* Arrastando: o corpo do crachá vira cinemático e persegue o cursor */
    if (dragged) {
      const { vec, dir } = s;
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      for (const body of [c, b1, b2, b3, a]) body.wakeUp();
      c.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }

    /* Suavização das juntas do meio */
    const { lerp1, lerp2 } = s;
    if (!s.seeded) {
      lerp1.copy(b1.translation() as THREE.Vector3);
      lerp2.copy(b2.translation() as THREE.Vector3);
      s.seeded = true;
    }
    const smooth = (target: THREE.Vector3, body: RapierRigidBody) => {
      const t = body.translation();
      const d = Math.max(
        0.1,
        Math.min(1, target.distanceTo(t as THREE.Vector3)),
      );
      target.lerp(t as THREE.Vector3, delta * (10 + d * 40));
    };
    smooth(lerp1, b1);
    smooth(lerp2, b2);

    /* Redesenhar a fita a partir das posições atuais */
    curve.points[0].copy(b3.translation() as THREE.Vector3);
    curve.points[1].copy(lerp2);
    curve.points[2].copy(lerp1);
    curve.points[3].copy(a.translation() as THREE.Vector3);
    const geom = band.current?.geometry as BandGeometry | undefined;
    geom?.setPoints(curve.getPoints(36));

    /* Endireitar o crachá de volta para a tela — sem isso ele fica de perfil
       depois de qualquer giro e a foto nunca mais é vista. */
    const { ang, rot } = s;
    ang.copy(c.angvel() as THREE.Vector3);
    rot.copy(c.rotation() as unknown as THREE.Vector3);
    c.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true);
  });

  const segment = {
    type: "dynamic" as const,
    canSleep: true,
    colliders: false as const,
    angularDamping: 3,
    linearDamping: 3,
  };

  return (
    <>
      <group position={[anchorX, anchorY, 0]}>
        <RigidBody ref={fixed} type="fixed" {...{ colliders: false }} />

        {/* Corrente já nasce pendurada, com um leve desvio lateral para
            entrar com um balanço discreto em vez de despencar de lado. */}
        <RigidBody position={[0.12, -rope, 0]} ref={j1} {...segment}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0.24, -rope * 2, 0]} ref={j2} {...segment}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0.36, -rope * 3, 0]} ref={j3} {...segment}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody
          ref={card}
          position={[0.48, -rope * 3 - RING_Y, 0]}
          {...segment}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[CARD_W / 2, CARD_H / 2, CARD_D]} />
          <group
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onPointerDown={(e) => {
              e.stopPropagation();
              (e.target as unknown as HTMLElement).setPointerCapture?.(
                e.pointerId,
              );
              const origin = card.current?.translation();
              if (!origin) return;
              setDragged(
                new THREE.Vector3()
                  .copy(e.point)
                  .sub(
                    scratch.current.vec.set(origin.x, origin.y, origin.z),
                  ),
              );
            }}
            onPointerUp={(e) => {
              (e.target as unknown as HTMLElement).releasePointerCapture?.(
                e.pointerId,
              );
              setDragged(null);
            }}
          >
            {/* Corpo do crachá */}
            <RoundedBox
              args={[CARD_W, CARD_H, CARD_D]}
              radius={0.09}
              smoothness={4}
            >
              <meshPhysicalMaterial
                color="#0d1015"
                roughness={0.4}
                metalness={0.1}
                clearcoat={0.8}
                clearcoatRoughness={0.3}
              />
            </RoundedBox>

            {/* Frente: retrato + identificação */}
            <mesh position={[0, 0, CARD_D / 2 + 0.001]}>
              <planeGeometry args={[CARD_W - 0.08, CARD_H - 0.08]} />
              <meshPhysicalMaterial
                map={textures.front}
                roughness={0.26}
                metalness={0.12}
                clearcoat={1}
                clearcoatRoughness={0.12}
              />
            </mesh>

            {/* Verso */}
            <mesh
              position={[0, 0, -CARD_D / 2 - 0.001]}
              rotation={[0, Math.PI, 0]}
            >
              <planeGeometry args={[CARD_W - 0.08, CARD_H - 0.08]} />
              <meshPhysicalMaterial
                map={textures.back}
                roughness={0.5}
                metalness={0.1}
              />
            </mesh>

            {/* Presilha metálica e anel */}
            <mesh position={[0, CARD_H / 2 + 0.08, 0]}>
              <boxGeometry args={[0.36, 0.16, 0.07]} />
              <meshPhysicalMaterial
                color="#b9c0cc"
                metalness={1}
                roughness={0.3}
              />
            </mesh>
            <mesh position={[0, RING_Y, 0]}>
              <torusGeometry args={[0.1, 0.024, 14, 40]} />
              <meshPhysicalMaterial
                color="#b9c0cc"
                metalness={1}
                roughness={0.32}
              />
            </mesh>
          </group>
        </RigidBody>
      </group>

      {/* Fita do cordão */}
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          args={bandMaterialArgs}
          color="white"
          depthTest={false}
          resolution={[width, height]}
          map={textures.strap}
          useMap={1}
          repeat={[-3, 1]}
          lineWidth={0.5}
        />
      </mesh>
    </>
  );
}
