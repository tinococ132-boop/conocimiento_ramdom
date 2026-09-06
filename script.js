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

		const fuente = (() => {
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
