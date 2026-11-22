const API_ENDPOINT = 'https://rickandmortyapi.com/api/character';
const STORAGE_KEY = 'rm_ultima_busqueda_varA';

const formBusqueda = document.getElementById('form-busqueda');
const inputNombre = document.getElementById('input-nombre');
const selectEstado = document.getElementById('select-estado');
const btnBuscar = document.getElementById('btn-buscar');
const btnLimpiar = document.getElementById('btn-limpiar');
const mensajeEstado = document.getElementById('mensaje-estado');
const grillaPersonajes = document.getElementById('grilla-personajes');

/**
 * Formatea textos vacíos o "unknown" a "Desconocido" (R6)
 */
const formatearValor = (valor) => {
    if (!valor || String(valor).trim() === '' || String(valor).toLowerCase() === 'unknown') {
        return 'Desconocido';
    }
    return String(valor).trim();
};

/**
 * Traduce el estado de la API y devuelve etiqueta y clase CSS
 */
const obtenerInfoEstado = (status) => {
    const limpio = String(status || '').toLowerCase();
    if (limpio === 'alive') {
        return { texto: 'Vivo', clase: 'estado-vivo' };
    }
    if (limpio === 'dead') {
        return { texto: 'Muerto', clase: 'estado-muerto' };
    }
    return { texto: 'Desconocido', clase: 'estado-desconocido' };
};

/**
 * Muestra u oculta el mensaje de estado/error en pantalla (R7)
 */
const mostrarMensaje = (texto, tipo = 'info') => {
    mensajeEstado.textContent = texto;
    mensajeEstado.className = `mensaje-estado ${tipo}`;
};

const ocultarMensaje = () => {
    mensajeEstado.textContent = '';
    mensajeEstado.className = 'mensaje-estado oculto';
};

/**
 * Limpia el contenedor de resultados de forma segura
 */
const limpiarGrilla = () => {
    while (grillaPersonajes.firstChild) {
        grillaPersonajes.removeChild(grillaPersonajes.firstChild);
    }
};

/**
 * Crea un nodo de párrafo con etiqueta fuerte y valor textual (sin innerHTML)
 */
const crearLineaDato = (etiqueta, valor) => {
    const p = document.createElement('p');
    p.className = 'tarjeta-dato';

    const strong = document.createElement('strong');
    strong.textContent = `${etiqueta}: `;

    const span = document.createElement('span');
    span.textContent = valor;

    p.appendChild(strong);
    p.appendChild(span);
    return p;
};

/**
 * Construye el elemento DOM de una tarjeta de personaje usando createElement y textContent (R6)
 */
const crearTarjetaPersonaje = (personaje) => {
    const article = document.createElement('article');
    article.className = 'tarjeta';

    const img = document.createElement('img');
    img.className = 'tarjeta-imagen';
    img.src = personaje.image || '';
    img.alt = `Retrato de ${formatearValor(personaje.name)}`;
    img.loading = 'lazy';

    const cuerpo = document.createElement('div');
    cuerpo.className = 'tarjeta-cuerpo';

    const titulo = document.createElement('h3');
    titulo.className = 'tarjeta-nombre';
    titulo.textContent = formatearValor(personaje.name);

    const infoEstado = obtenerInfoEstado(personaje.status);
    const pEstado = document.createElement('p');
    pEstado.className = 'tarjeta-dato';

    const strongEstado = document.createElement('strong');
    strongEstado.textContent = 'Estado:';

    const badge = document.createElement('span');
    badge.className = `badge-estado ${infoEstado.clase}`;
    badge.textContent = infoEstado.texto;

    pEstado.appendChild(strongEstado);
    pEstado.appendChild(badge);

    const pEspecie = crearLineaDato('Especie', formatearValor(personaje.species));
    const nombreOrigen = personaje.origin ? personaje.origin.name : '';
    const pOrigen = crearLineaDato('Origen', formatearValor(nombreOrigen));

    cuerpo.appendChild(titulo);
    cuerpo.appendChild(pEstado);
    cuerpo.appendChild(pEspecie);
    cuerpo.appendChild(pOrigen);

    article.appendChild(img);
    article.appendChild(cuerpo);

    return article;
};

/**
 * Renderiza la lista completa de tarjetas en la grilla
 */
const renderizarPersonajes = (personajes) => {
    limpiarGrilla();
    const fragmento = document.createDocumentFragment();
    personajes.forEach((personaje) => {
        fragmento.appendChild(crearTarjetaPersonaje(personaje));
    });
    grillaPersonajes.appendChild(fragmento);
};

/**
 * Guarda los criterios de búsqueda en localStorage (R8)
 */
const guardarBusqueda = (nombre, status) => {
    const datos = { nombre, status };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
};

/**
 * Consulta la API usando new URL(), searchParams, fetch y async/await (R4, R5, R7)
 */
const buscarPersonajes = async (nombre, status) => {
    const url = new URL(API_ENDPOINT);
    if (nombre) {
        url.searchParams.set('name', nombre);
    }
    if (status) {
        url.searchParams.set('status', status);
    }

    btnBuscar.disabled = true;
    btnBuscar.textContent = 'Buscando…';
    mostrarMensaje('Buscando personajes en el multiverso…', 'info');
    limpiarGrilla();

    try {
        const respuesta = await fetch(url.toString());

        if (respuesta.status === 404) {
            mostrarMensaje('Sin resultados: no se encontraron personajes con esos criterios.', 'aviso');
            return;
        }

        if (!respuesta.ok) {
            throw new Error(`Error HTTP ${respuesta.status}`);
        }

        const datos = await respuesta.json();
        const resultados = Array.isArray(datos.results) ? datos.results : [];

        if (resultados.length === 0) {
            mostrarMensaje('Sin resultados para la búsqueda realizada.', 'aviso');
            return;
        }

        ocultarMensaje();
        renderizarPersonajes(resultados);
    } catch (error) {
        console.error('Error al consultar la API de Rick y Morty:', error);
        mostrarMensaje('Ocurrió un error de conexión al consultar la API. Verifica tu internet e intenta nuevamente.', 'error');
    } finally {
        btnBuscar.disabled = false;
        btnBuscar.textContent = 'Buscar';
    }
};

/**
 * Manejador del envío del formulario (R5)
 */
const manejarSubmit = (evento) => {
    evento.preventDefault();

    const nombre = inputNombre.value.trim();
    const status = selectEstado.value.trim();

    if (!nombre && !status) {
        limpiarGrilla();
        mostrarMensaje('Por favor, ingresa un nombre o selecciona un estado antes de buscar.', 'aviso');
        return;
    }

    guardarBusqueda(nombre, status);
    buscarPersonajes(nombre, status);
};

/**
 * Restaura la última búsqueda almacenada en localStorage al cargar (R8)
 */
const restaurarUltimaBusqueda = () => {
    const guardado = localStorage.getItem(STORAGE_KEY);
    if (!guardado) return;

    try {
        const { nombre = '', status = '' } = JSON.parse(guardado);
        inputNombre.value = nombre;
        selectEstado.value = status;

        if (nombre || status) {
            buscarPersonajes(nombre, status);
        }
    } catch (error) {
        console.error('No se pudo leer la búsqueda guardada:', error);
        localStorage.removeItem(STORAGE_KEY);
    }
};

/**
 * Limpia formulario, resultados y almacenamiento local
 */
const manejarLimpiar = () => {
    inputNombre.value = '';
    selectEstado.value = '';
    localStorage.removeItem(STORAGE_KEY);
    limpiarGrilla();
    ocultarMensaje();
};

formBusqueda.addEventListener('submit', manejarSubmit);
btnLimpiar.addEventListener('click', manejarLimpiar);
document.addEventListener('DOMContentLoaded', restaurarUltimaBusqueda);
