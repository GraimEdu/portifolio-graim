const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

if (window.innerWidth > 1024) {

	document.addEventListener('mousemove', function(e) {
		cursor.style.left = e.clientX + 'px';
		cursor.style.top = e.clientY + 'px';

		setTimeout(function() {
			follower.style.left = e.clientX + 'px';
			follower.style.top = e.clientY + 'px';
		}, 60);
	});

	const elementos = document.querySelectorAll('a, button, .skill-card, .project-card, .stat-card, .contact-card, .floating-card');
	elementos.forEach(function(el) {
		el.addEventListener('mouseenter', function() {
			follower.classList.add('expand');
		});
		el.addEventListener('mouseleave', function() {
			follower.classList.remove('expand');
		});
	});
}


const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', function() {
	if (window.scrollY > 50) {
		navbar.classList.add('scrolled');
	} else {
		navbar.classList.remove('scrolled');
	}

	let atual = '';
	sections.forEach(function(sec) {
		const topo = sec.offsetTop - 120;
		if (window.scrollY >= topo) {
			atual = sec.getAttribute('id');
		}
	});

	navLinks.forEach(function(link) {
		link.classList.remove('active');
		if (link.getAttribute('href') === '#' + atual) {
			link.classList.add('active');
		}
	});
});


const menuBtn = document.querySelector('.menu-toggle');
const menu = document.querySelector('.nav-links');

menuBtn.addEventListener('click', function() {
	menuBtn.classList.toggle('active');
	menu.classList.toggle('active');
});

navLinks.forEach(function(link) {
	link.addEventListener('click', function() {
		menuBtn.classList.remove('active');
		menu.classList.remove('active');
	});
});


const txtEl = document.getElementById('typed-text');
const frases = [
	'Estudante de Ciência da Computação',
	'Desenvolvedor Web',
	'Apaixonado por Tecnologia',
	'JavaScript · HTML · CSS · PHP'
];

let idxFrase = 0;
let idxChar = 0;
let apagando = false;

function digita() {
	const frase = frases[idxFrase];

	if (apagando) {
		txtEl.textContent = frase.substring(0, idxChar - 1);
		idxChar--;
	} else {
		txtEl.textContent = frase.substring(0, idxChar + 1);
		idxChar++;
	}

	let velocidade = apagando ? 40 : 80;

	if (!apagando && idxChar === frase.length) {
		velocidade = 2000;
		apagando = true;
	} else if (apagando && idxChar === 0) {
		apagando = false;
		idxFrase = (idxFrase + 1) % frases.length;
		velocidade = 500;
	}

	setTimeout(digita, velocidade);
}

setTimeout(digita, 1500);


const reveals = document.querySelectorAll('.reveal-on-scroll');

const obs = new IntersectionObserver(function(entries) {
	entries.forEach(function(entry, i) {
		if (entry.isIntersecting) {
			setTimeout(function() {
				entry.target.classList.add('visible');
			}, i * 100);

			const barra = entry.target.querySelector('.skill-progress');
			if (barra) {
				const valor = barra.dataset.progress;
				setTimeout(function() {
					barra.style.width = valor + '%';
				}, 300);
			}

			obs.unobserve(entry.target);
		}
	});
}, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });

reveals.forEach(function(el) {
	obs.observe(el);
});


const stats = document.querySelectorAll('.stat-number');

const obs2 = new IntersectionObserver(function(entries) {
	entries.forEach(function(entry) {
		if (entry.isIntersecting) {
			const alvo = parseInt(entry.target.dataset.target);
			const tempoTotal = 2000;
			const inicio = performance.now();

			function anima(agora) {
				const passou = agora - inicio;
				const progresso = Math.min(passou / tempoTotal, 1);

				const ease = 1 - Math.pow(1 - progresso, 3);
				const valor = Math.floor(ease * alvo);

				entry.target.textContent = alvo === 100 ? valor + '%' : valor;

				if (progresso < 1) {
					requestAnimationFrame(anima);
				}
			}

			requestAnimationFrame(anima);
			obs2.unobserve(entry.target);
		}
	});
}, { threshold: 0.5 });

stats.forEach(function(s) {
	obs2.observe(s);
});


const heroVisual = document.querySelector('.hero-visual');
const cards = document.querySelectorAll('.floating-card');

if (heroVisual && window.innerWidth > 968) {
	document.addEventListener('mousemove', function(e) {
		const rect = heroVisual.getBoundingClientRect();
		const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
		const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

		cards.forEach(function(card, i) {
			const profundidade = (i + 1) * 8;
			card.style.transform = 'translate(' + (x * profundidade) + 'px, ' + (y * profundidade) + 'px)';
		});
	});
}


const projetos = document.querySelectorAll('.project-card');

projetos.forEach(function(card) {
	card.addEventListener('mousemove', function(e) {
		const rect = card.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		const cx = rect.width / 2;
		const cy = rect.height / 2;

		const rotX = (y - cy) / 20;
		const rotY = (cx - x) / 20;

		card.style.transform = 'perspective(1000px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) translateY(-10px)';
	});

	card.addEventListener('mouseleave', function() {
		card.style.transform = '';
	});
});


document.querySelectorAll('a[href^="#"]').forEach(function(link) {
	link.addEventListener('click', function(e) {
		const alvo = document.querySelector(this.getAttribute('href'));
		if (alvo) {
			e.preventDefault();
			const offset = 80;
			const pos = alvo.getBoundingClientRect().top + window.pageYOffset - offset;
			window.scrollTo({
				top: pos,
				behavior: 'smooth'
			});
		}
	});
});


window.addEventListener('load', function() {
	document.body.classList.add('loaded');
});
