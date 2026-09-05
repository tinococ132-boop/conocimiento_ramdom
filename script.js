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

const usuarioGuardado = JSON.parse(localStorage.getItem('usuarioConocimiento') || 'null');

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

botonesCategoria.forEach((boton) => {
	boton.addEventListener('click', () => {
		const seccion = document.querySelector(`#${boton.dataset.destino}`);

		seccionesInfo.forEach((seccionInfo) => seccionInfo.classList.remove('activa'));
		seccion.classList.add('activa');
		seccion.scrollIntoView({ behavior: 'smooth' });
	});
});

botonesVolver.forEach((boton) => {
	boton.addEventListener('click', () => {
		boton.closest('.seccion-info').classList.remove('activa');
		categorias.scrollIntoView({ behavior: 'smooth' });
	});
});

document.querySelectorAll('.campo-busqueda').forEach((campo) => {
	campo.addEventListener('input', () => {
		const consulta = campo.value.toLowerCase().trim();
		const tarjetas = campo.closest('.seccion-info').querySelectorAll('.tarjeta-info');

		tarjetas.forEach((tarjeta) => {
			tarjeta.hidden = !tarjeta.textContent.toLowerCase().includes(consulta);
		});
	});
});
