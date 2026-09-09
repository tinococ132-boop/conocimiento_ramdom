// Selecciona los elementos principales del HTML
const categorias = document.querySelector('#categorias');
const botonesCategoria = document.querySelectorAll('.boton-categoria');
const seccionesInfo = document.querySelectorAll('.seccion-info');
const botonesVolver = document.querySelectorAll('.volver');
const botonUsuario = document.querySelector('#boton-usuario');
const panelUsuario = document.querySelector('#panel-usuario');
const cerrarUsuario = document.querySelector('#cerrar-usuario');
const formularioUsuario = document.querySelector('#formulario-usuario');
const cerrarSesion = document.querySelector('#cerrar-sesion');
const mensajeUsuario = document.querySelector('#mensaje-usuario');

// Lee si ya existe un usuario guardado en el navegador
const usuarioGuardado = JSON.parse(localStorage.getItem('usuarioConocimiento') || 'null');

// Agrega una bibliografía breve a cada tarjeta usando la fuente del enlace
const agregarBibliografias = () => {
	document.querySelectorAll('.tarjeta-info').forEach((tarjeta) => {
		if (tarjeta.querySelector('.bibliografia')) {
			return;
		}

		const enlace = tarjeta.querySelector('a');
		if (!enlace) {
			return;
		}

		const fuente = tarjeta.dataset.fuente || (() => {
			try {
				const dominio = new URL(enlace.href).hostname.replace(/^www\./, '');
				const fuentes = {
					'nasa.gov': 'NASA',
					'spaceplace.nasa.gov': 'NASA Space Place',
					'education.nationalgeographic.org': 'National Geographic',
					'nationalgeographic.com': 'National Geographic',
					'medlineplus.gov': 'MedlinePlus',
					'science.nasa.gov': 'NASA Science',
					'climate.nasa.gov': 'NASA Climate',
					'energy.gov': 'U.S. Department of Energy',
					'ibm.com': 'IBM',
					'britannica.com': 'Encyclopaedia Britannica',
					'historiacultural.com': 'Historia Cultural',
					'developer.mozilla.org': 'MDN Web Docs',
					'computerhistory.org': 'Computer History Museum',
					'unesco.org': 'UNESCO',
					'verywellmind.com': 'Verywell Mind',
					'unicef.org': 'UNICEF',
					'un.org': 'Naciones Unidas',
					'internetsegura.net': 'Internet Segura',
					'acm.org': 'ACM'
				};

				return fuentes[dominio] || dominio;
			} catch (error) {
				return 'fuente';
			}
		})();

		const bibliografia = document.createElement('p');
		bibliografia.className = 'bibliografia';
		bibliografia.textContent = `Bibliografía: ${fuente}`;
		tarjeta.appendChild(bibliografia);
	});
};

// Actualiza el texto del botón de usuario y el formulario
const actualizarUsuario = (usuario) => {
	if (usuario) {
		botonUsuario.textContent = `hola, ${usuario.nombre}`;
		mensajeUsuario.textContent = `Tu perfil esta listo, ${usuario.nombre}.`;
		formularioUsuario.hidden = true;
		cerrarSesion.hidden = false;
		return;
	}

	botonUsuario.textContent = 'mi usuario';
	mensajeUsuario.textContent = 'Guarda tu nombre para personalizar tu experiencia.';
	formularioUsuario.hidden = false;
	cerrarSesion.hidden = true;
};

actualizarUsuario(usuarioGuardado);
agregarBibliografias();

botonUsuario.addEventListener('click', () => {
	panelUsuario.hidden = false;
});

cerrarUsuario.addEventListener('click', () => {
	panelUsuario.hidden = true;
});

formularioUsuario.addEventListener('submit', (evento) => {
	evento.preventDefault();
	const datos = new FormData(formularioUsuario);
	const usuario = {
		nombre: datos.get('nombre'),
		correo: datos.get('correo'),
		contrasena: datos.get('contrasena')
	};

	localStorage.setItem('usuarioConocimiento', JSON.stringify(usuario));
	actualizarUsuario(usuario);
});

cerrarSesion.addEventListener('click', () => {
	localStorage.removeItem('usuarioConocimiento');
	actualizarUsuario(null);
});

panelUsuario.addEventListener('click', (evento) => {
	if (evento.target === panelUsuario) {
		panelUsuario.hidden = true;
	}
});

// Cambia entre categorías y muestra la sección correcta
botonesCategoria.forEach((boton) => {
	boton.addEventListener('click', () => {
		const seccion = document.querySelector(`#${boton.dataset.destino}`);

		document.body.classList.add('seccion-activa');
		seccionesInfo.forEach((seccionInfo) => seccionInfo.classList.remove('activa'));
		seccion.classList.add('activa');
		seccion.scrollIntoView({ behavior: 'smooth' });
	});
});

// Vuelve a la vista principal de categorías
botonesVolver.forEach((boton) => {
	boton.addEventListener('click', () => {
		document.body.classList.remove('seccion-activa');
		boton.closest('.seccion-info').classList.remove('activa');
		categorias.scrollIntoView({ behavior: 'smooth' });
	});
});

// Busca entre los temas de la categoría actual
document.querySelectorAll('.campo-busqueda').forEach((campo) => {
	campo.addEventListener('input', () => {
		const consulta = campo.value.toLowerCase().trim();
		const tarjetas = campo.closest('.seccion-info').querySelectorAll('.tarjeta-info');

		tarjetas.forEach((tarjeta) => {
			tarjeta.hidden = !tarjeta.textContent.toLowerCase().includes(consulta);
		});
	});
});

const botonEntrarTest = document.querySelector('#entrar-test');
const nivelesTest = document.querySelector('#niveles-test');
const nivelSeleccionado = document.querySelector('#nivel-seleccionado');
const materiasTest = document.querySelector('#materias-test');
const materiaSeleccionada = document.querySelector('#materia-seleccionada');
const panelTest = document.querySelector('#panel-test');
const comenzarTest = document.querySelector('#comenzar-test');
const preguntaTest = document.querySelector('#pregunta-test');
const progresoTest = document.querySelector('#progreso-test');
const textoPregunta = document.querySelector('#texto-pregunta');
const opcionesPregunta = document.querySelector('#opciones-pregunta');
const relojTest = document.querySelector('#reloj-test');
const tiempoRestante = document.querySelector('#tiempo-restante');
const estadoTest = document.querySelector('#estado-test');
const reiniciarTest = document.querySelector('#reiniciar-test');
const siguientePregunta = document.querySelector('#siguiente-pregunta');
const resultadoTest = document.querySelector('#resultado-test');
const porcentajeTest = document.querySelector('#porcentaje-test');
const aciertosTest = document.querySelector('#aciertos-test');
const mensajeTest = document.querySelector('#mensaje-test');
let nivelActual = '';
let temporizadorTest = null;
let materiaActual = '';
let preguntasActuales = [];
let indicePregunta = 0;
let respuestasCorrectas = 0;
let testIniciado = false;

const duracionPorNivel = {
	facil: null,
	medio: 3 * 60,
	dificil: 2 * 60,
	experto: 60
};

const preguntasPorNivel = {
	facil: { mostrar: 25, banco: 75 },
	medio: { mostrar: 35, banco: 105 },
	dificil: { mostrar: 50, banco: 150 },
	experto: { mostrar: 60, banco: 180 }
};

const dificultadPorNivel = {
	facil: 1,
	medio: 2,
	dificil: 3,
	experto: 4
};

const temasFrecuentesPorMateria = {
	ciencias: [
		'el sistema solar',
		'el cuerpo humano',
		'evolucion y seleccion natural',
		'genetica y adn',
		'cambio climatico'
	],
	historia: [
		'prehistoria',
		'grecia antigua',
		'imperio romano',
		'edad media',
		'revolucion industrial',
		'historia de mexico'
	],
	etica: [
		'que es la etica',
		'valores humanos',
		'toma de decisiones',
		'respeto y convivencia',
		'derechos humanos',
		'etica en internet y redes sociales'
	]
};

temasFrecuentesPorMateria['test general'] = [
	...temasFrecuentesPorMateria.ciencias,
	...temasFrecuentesPorMateria.historia,
	...temasFrecuentesPorMateria.etica
];

const mezclar = (elementos) => [...elementos].sort(() => Math.random() - 0.5);

const prepararPregunta = (pregunta) => ({
	...pregunta,
	opciones: mezclar(pregunta.opciones)
});

const elegirPreguntasAleatorias = (banco, nivel, materia) => {
	const temasPermitidos = temasFrecuentesPorMateria[materia] || [];
	const dificultadMaxima = dificultadPorNivel[nivel];
	const preguntasDisponibles = banco.filter((pregunta) => (
		pregunta.dificultad <= dificultadMaxima && temasPermitidos.includes(pregunta.tema)
	));
	const cantidad = preguntasPorNivel[nivel].mostrar;
	return mezclar(preguntasDisponibles)
		.slice(0, cantidad)
		.map(prepararPregunta);
};

const datosDePreguntas = {
	ciencias: [
		['el sistema solar', 'El Sol es una estrella.', ['La Luna es una estrella.', 'La Tierra es una estrella.', 'Jupiter es una estrella.']],
		['el cuerpo humano', 'El corazon bombea sangre por el cuerpo.', ['Los pulmones producen sangre.', 'El estomago bombea sangre.', 'Los huesos producen oxigeno.']],
		['evolucion y seleccion natural', 'La seleccion natural favorece rasgos utiles para sobrevivir y reproducirse.', ['Todos los seres vivos permanecen iguales.', 'Los organismos cambian porque lo desean.', 'La evolucion ocurre solo en los seres humanos.']],
		['genetica y adn', 'El ADN contiene informacion hereditaria.', ['El ADN solo se encuentra en las rocas.', 'El ADN produce la luz solar.', 'El ADN es un tipo de musculo.']],
		['cambio climatico', 'El aumento de gases de efecto invernadero contribuye al calentamiento global.', ['El cambio climatico solo modifica las fases de la Luna.', 'Los gases de efecto invernadero enfrían siempre el planeta.', 'El clima no cambia con el tiempo.']]
	],
	historia: [
		['prehistoria', 'La prehistoria comprende el periodo anterior a la escritura.', ['Ocurrio despues de internet.', 'Fue un periodo exclusivamente industrial.', 'Comenzo despues de la Revolucion Industrial.']],
		['grecia antigua', 'Atenas desarrollo una forma de democracia directa.', ['Roma invento la democracia ateniense.', 'Egipto abolio todas las asambleas.', 'La democracia surgio en la Edad Media.']],
		['imperio romano', 'El derecho romano influyo en muchos sistemas legales posteriores.', ['Roma no tuvo leyes escritas.', 'El derecho romano surgio en la prehistoria.', 'Las leyes romanas solo trataban sobre astronomia.']],
		['edad media', 'El feudalismo organizo parte de la sociedad medieval alrededor de tierras y obligaciones.', ['El feudalismo pertenecio a la era espacial.', 'La Edad Media no tuvo agricultura.', 'El feudalismo fue un sistema exclusivamente maritimo.']],
		['revolucion industrial', 'La Revolucion Industrial impulso las fabricas y el uso de maquinas.', ['Elimino todas las maquinas.', 'Ocurrio antes de la agricultura.', 'Solo transformo la escritura.']],
		['historia de mexico', 'La Revolucion Mexicana comenzo en 1910.', ['Comenzo en 1492.', 'Comenzo en 1810 como un proceso identico.', 'Comenzo en el siglo XXI.']]
	],
	etica: [
		['que es la etica', 'La etica analiza las acciones y sus consecuencias segun valores y principios.', ['La etica estudia solo los planetas.', 'La etica elimina la necesidad de decidir.', 'La etica es una ley fisica.']],
		['valores humanos', 'El respeto reconoce la dignidad y los derechos de otras personas.', ['El respeto consiste en ignorar a los demas.', 'El respeto elimina toda diferencia.', 'El respeto obliga a pensar igual.']],
		['toma de decisiones', 'Una buena decision considera alternativas y posibles consecuencias.', ['Decidir bien significa no analizar nada.', 'Solo existe una alternativa en toda situacion.', 'Las consecuencias nunca importan.']],
		['respeto y convivencia', 'El dialogo ayuda a resolver conflictos de forma pacifica.', ['El dialogo siempre aumenta los conflictos.', 'Convivir exige evitar toda comunicacion.', 'Los conflictos solo se resuelven con silencio.']],
		['derechos humanos', 'Los derechos humanos protegen la dignidad de todas las personas.', ['Solo protegen a una profesion.', 'Dependen de tener el mismo origen.', 'Se aplican unicamente en internet.']],
		['etica en internet y redes sociales', 'Proteger la privacidad es una conducta responsable en internet.', ['Compartir contrasenas siempre es seguro.', 'La privacidad no existe en internet.', 'Publicar datos ajenos no tiene consecuencias.']]
	]
};

const iniciosDePregunta = [
	'¿Cual afirmacion describe mejor',
	'¿Que opcion identifica correctamente',
	'En relacion con',
	'¿Que dato es fundamental sobre',
	'¿Cual enunciado distingue mejor',
	'Para comprender, ¿que debes reconocer en'
];

const finalesDePregunta = [
	'este tema?',
	'este concepto?',
	'este proceso?',
	'esta idea?',
	'este contenido?',
	'la materia estudiada?'
];

const crearTextoDePregunta = (tema, indice) => {
	const inicio = iniciosDePregunta[indice % iniciosDePregunta.length];
	const final = finalesDePregunta[Math.floor(indice / iniciosDePregunta.length)];
	return `${inicio} ${tema}, ${final}`;
};

const generarBanco = (materia) => {
	const preguntas = datosDePreguntas[materia].flatMap(([tema, correcta, distractores]) => (
		Array.from({ length: 36 }, (_, indice) => ({
			tema,
			texto: crearTextoDePregunta(tema, indice),
			opciones: [correcta, ...distractores],
			correcta,
			dificultad: 1,
			id: `${materia}-${tema}-${indice + 1}`
		}))
	));

	return preguntas.map((pregunta, indice) => ({
		...pregunta,
		dificultad: indice < 75 ? 1 : indice < 105 ? 2 : indice < 150 ? 3 : 4
	}));
};

const bancosDePreguntas = {
	ciencias: generarBanco('ciencias'),
	historia: generarBanco('historia'),
	etica: generarBanco('etica'),
	'test general': []
};

const tomarPorDificultad = (banco, dificultad, cantidad) => mezclar(
	banco.filter((pregunta) => pregunta.dificultad === dificultad)
).slice(0, cantidad);

bancosDePreguntas['test general'] = [1, 2, 3, 4].flatMap((dificultad) => {
	const cantidadPorMateria = { 1: 25, 2: 10, 3: 15, 4: 10 }[dificultad];
	return [
		tomarPorDificultad(bancosDePreguntas.ciencias, dificultad, cantidadPorMateria),
		tomarPorDificultad(bancosDePreguntas.historia, dificultad, cantidadPorMateria),
		tomarPorDificultad(bancosDePreguntas.etica, dificultad, cantidadPorMateria)
	].flat();
});

const mostrarTiempo = (segundos) => {
	const minutos = Math.floor(segundos / 60).toString().padStart(2, '0');
	const segundosRestantes = (segundos % 60).toString().padStart(2, '0');
	tiempoRestante.textContent = `${minutos}:${segundosRestantes}`;
};

const iniciarTemporizador = () => {
	if (temporizadorTest) {
		clearInterval(temporizadorTest);
	}

	const duracion = duracionPorNivel[nivelActual];
	if (duracion === null) {
		relojTest.hidden = true;
		return;
	}

	let segundos = duracion;
	relojTest.hidden = false;
	mostrarTiempo(segundos);
	temporizadorTest = setInterval(() => {
		segundos -= 1;
		mostrarTiempo(segundos);

		if (segundos <= 0) {
			clearInterval(temporizadorTest);
			temporizadorTest = null;
			estadoTest.textContent = 'Se acabo el tiempo. Pasando a la siguiente pregunta...';
			siguientePregunta.click();
		}
	}, 1000);
};

const mostrarResultadoTest = (respuestasCorrectas, totalPreguntas) => {
	const porcentaje = totalPreguntas > 0
		? Math.round((respuestasCorrectas / totalPreguntas) * 100)
		: 0;
	const mensaje = porcentaje <= 30
		? 'Sigue mejorando, cada intento te acerca mas a tu meta.'
		: porcentaje <= 70
			? 'Vas avanzando, continua practicando y aprendiendo.'
			: 'Excelente trabajo, has demostrado un gran conocimiento.';

	porcentajeTest.textContent = `${porcentaje}% correcto`;
	aciertosTest.textContent = `${respuestasCorrectas} de ${totalPreguntas} respuestas correctas.`;
	mensajeTest.textContent = mensaje;
	resultadoTest.hidden = false;
};

const terminarTest = () => {
	if (temporizadorTest) {
		clearInterval(temporizadorTest);
		temporizadorTest = null;
	}
	relojTest.hidden = true;
	preguntaTest.hidden = true;
	siguientePregunta.hidden = true;
	comenzarTest.hidden = true;
	mostrarResultadoTest(respuestasCorrectas, preguntasActuales.length);
	estadoTest.textContent = 'Has terminado este intento.';
	testIniciado = false;
};

const prepararNuevoIntento = (mensaje) => {
	if (!materiaActual || !nivelActual) {
		return;
	}

	if (temporizadorTest) {
		clearInterval(temporizadorTest);
		temporizadorTest = null;
	}

	preguntasActuales = elegirPreguntasAleatorias(
		bancosDePreguntas[materiaActual],
		nivelActual,
		materiaActual
	);
	indicePregunta = 0;
	respuestasCorrectas = 0;
	testIniciado = false;
	preguntaTest.hidden = true;
	relojTest.hidden = true;
	siguientePregunta.hidden = true;
	resultadoTest.hidden = true;
	opcionesPregunta.innerHTML = '';
	comenzarTest.hidden = false;
	comenzarTest.disabled = preguntasActuales.length === 0;
	estadoTest.textContent = mensaje;
};

const mostrarPreguntaActual = () => {
	const pregunta = preguntasActuales[indicePregunta];
	if (!pregunta) {
		terminarTest();
		return;
	}

	preguntaTest.hidden = false;
	progresoTest.textContent = `Pregunta ${indicePregunta + 1} de ${preguntasActuales.length}`;
	textoPregunta.textContent = pregunta.texto;
	opcionesPregunta.innerHTML = '';
	siguientePregunta.hidden = true;
	estadoTest.textContent = 'Elige una opcion para continuar.';

	pregunta.opciones.forEach((opcion) => {
		const botonOpcion = document.createElement('button');
		botonOpcion.type = 'button';
		botonOpcion.className = 'opcion-pregunta';
		botonOpcion.textContent = opcion;
		botonOpcion.addEventListener('click', () => {
			if (botonOpcion.disabled) {
				return;
			}

			document.querySelectorAll('.opcion-pregunta').forEach((opcionBoton) => {
				opcionBoton.disabled = true;
			});
			if (opcion === pregunta.correcta) {
				respuestasCorrectas += 1;
			}
			estadoTest.textContent = 'Respuesta registrada. Cuando estes listo, continua.';
			siguientePregunta.hidden = false;
		});
		opcionesPregunta.appendChild(botonOpcion);
	});

	iniciarTemporizador();
};

botonEntrarTest.addEventListener('click', () => {
	botonEntrarTest.hidden = true;
	nivelesTest.hidden = false;
});

document.querySelectorAll('.nivel-test:not(.nivel-bloqueado)').forEach((boton) => {
	boton.addEventListener('click', () => {
		document.querySelectorAll('.nivel-test').forEach((nivel) => nivel.classList.remove('seleccionado'));
		boton.classList.add('seleccionado');
		nivelActual = boton.dataset.nivel;
		nivelSeleccionado.textContent = `Has elegido el nivel ${nivelActual}. Ahora elige una materia.`;
		materiasTest.hidden = false;
		panelTest.hidden = true;
		comenzarTest.hidden = false;
	});
});

document.querySelectorAll('.materia-test').forEach((boton) => {
	boton.addEventListener('click', () => {
		document.querySelectorAll('.materia-test').forEach((materia) => materia.classList.remove('seleccionada'));
		boton.classList.add('seleccionada');
		materiaActual = boton.dataset.materia;
		materiaSeleccionada.textContent = `Nivel ${nivelActual}: materia ${materiaActual}.`;
		panelTest.hidden = false;
		const configuracion = preguntasPorNivel[nivelActual];
		estadoTest.textContent = `Se responderan ${configuracion.mostrar} preguntas elegidas al azar de un banco de ${configuracion.banco}. El temporizador comenzara con la primera pregunta.`;
		preguntasActuales = elegirPreguntasAleatorias(
			bancosDePreguntas[materiaActual],
			nivelActual,
			materiaActual
		);
		indicePregunta = 0;
		respuestasCorrectas = 0;
		comenzarTest.disabled = preguntasActuales.length === 0;
		resultadoTest.hidden = true;
	});
});

comenzarTest.addEventListener('click', () => {
	comenzarTest.hidden = true;
	testIniciado = true;
	mostrarPreguntaActual();
});

	siguientePregunta.addEventListener('click', () => {
		indicePregunta += 1;
		mostrarPreguntaActual();
	});

reiniciarTest.addEventListener('click', () => {
	prepararNuevoIntento('El test se reinicio con preguntas nuevas.');
});

document.addEventListener('visibilitychange', () => {
	if (document.hidden && testIniciado) {
		prepararNuevoIntento('El test se reinicio porque saliste de la pagina.');
	}
});

window.addEventListener('pagehide', () => {
	if (testIniciado) {
		prepararNuevoIntento('El test se reinicio porque saliste de la pagina.');
	}
});

