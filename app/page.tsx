import SmoothScroll from "@/components/motion/SmoothScroll";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Timeline from "@/components/Timeline";
import Arsenal from "@/components/Arsenal";
import Incidents from "@/components/Incidents";
import Projects from "@/components/Projects";
import Education from "@/components/Education";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Nav />
      <main>
        <Hero />
        <About />
        <Timeline />
        <Arsenal />
        <Incidents />
        <Projects />
        <Education />
        <Contact />
      </main>
    </>
  );
}
