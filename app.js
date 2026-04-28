const contenedorProductos = document.getElementById('contenedor-productos');
const contenedorPaginacion = document.querySelector('.pagination');

// Variables globales para controlar la paginacion
let productos = []; // Aqui se guardan todos los carros
let paginaActual = 1;
const carrosPorPagina = 4;

const cargarCarrosDesdeServidor = async () => {
    try {
        // Checamos si ya tenemos inventario guardado en el localStorage
        let inventarioGuardado = localStorage.getItem('inventario_vortex');
        
        if (inventarioGuardado) {
            // Si ya hay, los convertimos a arreglo y los pintamos
            productos = JSON.parse(inventarioGuardado);
            mostrarPagina(paginaActual);
        } else {
            // Si no hay, los jalamos del json
            const respuesta = await fetch('productos.json');
            productos = await respuesta.json(); 
            
            // Y los guardamos en el local para que el admin los pueda modificar
            localStorage.setItem('inventario_vortex', JSON.stringify(productos));
            
            mostrarPagina(paginaActual);
        }
    } catch (error) {
        console.log("Error al cargar inventario: ", error);
    }
};

const mostrarPagina = (pagina) => {
    // Calculamos de donde a donde cortar el arreglo
    const inicio = (pagina - 1) * carrosPorPagina;
    const fin = inicio + carrosPorPagina;
    
    // Cortamos los carros que tocan para esta pagina
    const carrosA_Mostrar = productos.slice(inicio, fin);

    let cardsHTML = '';

    carrosA_Mostrar.forEach(carro => {
        cardsHTML += `
            <div class="col-12 col-md-4 col-lg-3">
                <div class="card h-100">
                    <img class="card-img-top" src="${carro.imagen}" alt="${carro.nombre}">
                    <div class="card-body text-center d-flex flex-column">
                        <h5 class="card-title text-start">${carro.nombre}</h5>
                        <p class="card-text text-start text-muted">
                            ${carro.descripcion}
                        </p>
                        <button class="btn btn-outline-primary mt-auto" onclick="agregarAlCarrito(${carro.id})">Agregar</button>
                    </div>
                </div>
            </div>
        `;
    });

    contenedorProductos.innerHTML = cardsHTML;
    
    // Actualizamos los numeritos de abajo
    actualizarBotonesPaginacion();
};

const actualizarBotonesPaginacion = () => {
    // Calculamos cuantas paginas salen en total
    const totalPaginas = Math.ceil(productos.length / carrosPorPagina);
    let botonesHTML = '';

    // Boton de "Anterior
    botonesHTML += `
        <li class="page-item ${paginaActual === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="event.preventDefault(); cambiarPagina(${paginaActual - 1})">&laquo;</a>
        </li>
    `;

    // Botones con los numeros de pagina
    for (let i = 1; i <= totalPaginas; i++) {
        botonesHTML += `
            <li class="page-item ${paginaActual === i ? 'active' : ''}">
                <a class="page-link" href="#" onclick="event.preventDefault(); cambiarPagina(${i})">${i}</a>
            </li>
        `;
    }

    // Boton de Siguiente
    botonesHTML += `
        <li class="page-item ${paginaActual === totalPaginas ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="event.preventDefault(); cambiarPagina(${paginaActual + 1})">&raquo;</a>
        </li>
    `;

    contenedorPaginacion.innerHTML = botonesHTML;
};

const cambiarPagina = (nuevaPagina) => {
    const totalPaginas = Math.ceil(productos.length / carrosPorPagina);
    // Aqui se verifica que no se pase de los limites
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
        paginaActual = nuevaPagina;
        mostrarPagina(paginaActual); 
    }
};

cargarCarrosDesdeServidor();

// Declaramos el carrito. Intentamos jalarlo del sessionStorage, si no hay nada, inicia vacio 
let carrito = JSON.parse(sessionStorage.getItem('carrito')) || [];

// Funcion para agregar al carrito
const agregarAlCarrito = (id) => {
    // Buscamos que carro selecciono usando el ID
    const carroSeleccionado = productos.find(carro => carro.id === id);

    //  Revisamos si ya teniamos este carro en el carrito
    const existeEnCarrito = carrito.find(item => item.id === id);

    if (existeEnCarrito) {
        existeEnCarrito.cantidad++;
    } else {
        carrito.push({
            ...carroSeleccionado,
            cantidad: 1
        });
    }

    // Guardamos el carrito actualizado en la memoria del navegador
    sessionStorage.setItem('carrito', JSON.stringify(carrito));

    // Cambiamos el texto del modal y lo mostramos
    document.getElementById('nombreCarroModal').innerText = carroSeleccionado.nombre;
    const modalConfirmacion = new bootstrap.Modal(document.getElementById('modalCarritoExito'));
    modalConfirmacion.show();

    // Actualizamos el numerito rojo de la barra de navegacion
    actualizarIconoCarrito();
};

// Funcion para que el icono del carrito arriba siempre traiga el numero real
const actualizarIconoCarrito = () => {
    const totalArticulos = carrito.reduce((total, item) => total + item.cantidad, 0);
    
    const bolitaRoja = document.querySelector('.fa-cart-shopping').nextElementSibling;
    if(bolitaRoja) {
        bolitaRoja.innerText = totalArticulos;
    }
};

actualizarIconoCarrito();