const listaCarrito = document.getElementById('lista-carrito');
const subtotalTexto = document.getElementById('subtotal-precio');
const totalTexto = document.getElementById('total-precio');

let carrito = JSON.parse(sessionStorage.getItem('carrito')) || [];

const pintarCarrito = () => {
    listaCarrito.innerHTML = '';
    let totalAcumulado = 0;

    if (carrito.length === 0) {
        listaCarrito.innerHTML = '<div class="alert alert-info text-center">Tu carrito está vacío bro. ¡Ve a agregar algo!</div>';
        subtotalTexto.innerText = '$0.00 MXN';
        totalTexto.innerText = '$0.00 MXN';
        return;
    }

    carrito.forEach((carro, index) => {
        let subtotalCarro = carro.precio * carro.cantidad;
        totalAcumulado += subtotalCarro;

        let precioFormato = subtotalCarro.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

        // Aqui metimos el truco: dos divs. Uno para ver la info normal y otro escondido para editar
        listaCarrito.innerHTML += `
            <div class="d-flex align-items-center border p-3 mb-3 rounded shadow-sm">
                <div class="flex-shrink-0">
                    <img src="${carro.imagen}" alt="${carro.nombre}" class="img-fluid rounded" style="width: 150px; object-fit: contain" />
                </div>
                <div class="flex-grow-1 ms-4">
                    <h5 class="mb-1">${carro.nombre}</h5>
                    
                    <div id="vista-normal-${index}">
                        <p class="text-muted mb-1">Cantidad: <strong>${carro.cantidad}</strong></p>
                        <button class="btn btn-sm btn-outline-primary mt-1" onclick="abrirEdicion(${index})">
                            <i class="fa-solid fa-pen"></i> Editar
                        </button>
                        <button class="btn btn-sm btn-outline-danger mt-1 ms-1" onclick="eliminarItem(${index})">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>

                    <div id="vista-editar-${index}" class="d-none mt-2">
                        <div class="input-group input-group-sm w-50">
                            <span class="input-group-text">Cant:</span>
                            <input type="number" id="input-cant-${index}" class="form-control" value="${carro.cantidad}" min="1">
                        </div>
                        <div class="mt-2">
                            <button class="btn btn-sm btn-success" onclick="guardarEdicion(${index})">Confirmar</button>
                            <button class="btn btn-sm btn-secondary" onclick="cerrarEdicion(${index})">Cancelar</button>
                        </div>
                    </div>

                </div>
                <div class="text-end ms-3">
                    <h5 class="mb-0 fw-bold">${precioFormato}</h5>
                </div>
            </div>
        `;
    });

    let totalFormato = totalAcumulado.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
    subtotalTexto.innerText = totalFormato;
    totalTexto.innerText = totalFormato;
};
// Esta funcion esconde la vista normal y saca el input
const abrirEdicion = (indice) => {
    document.getElementById(`vista-normal-${indice}`).classList.add('d-none');
    document.getElementById(`vista-editar-${indice}`).classList.remove('d-none');
};

// Esta se va para atras y no guarda nada
const cerrarEdicion = (indice) => {
    document.getElementById(`vista-editar-${indice}`).classList.add('d-none');
    document.getElementById(`vista-normal-${indice}`).classList.remove('d-none');
    document.getElementById(`input-cant-${indice}`).value = carrito[indice].cantidad;
};

// Esta es la funcion que guarda la nueva cantidad, actualiza el carrito y vuelve a pintar todo
const guardarEdicion = (indice) => {
    const nuevaCant = parseInt(document.getElementById(`input-cant-${indice}`).value);
    
    // Nomas para que no vayan a meter un 0 o numeros negativos a la mala
    if (nuevaCant > 0) {
        carrito[indice].cantidad = nuevaCant;
        sessionStorage.setItem('carrito', JSON.stringify(carrito));
        pintarCarrito(); 
    }
};

const eliminarItem = (indice) => {
    carrito.splice(indice, 1);
    sessionStorage.setItem('carrito', JSON.stringify(carrito));
    pintarCarrito();
};

const limpiarCarrito = () => {
    carrito = [];
    sessionStorage.removeItem('carrito');
    pintarCarrito();
};

pintarCarrito();