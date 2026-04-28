const form = document.getElementById('form-producto');
const tabla = document.getElementById('tabla-productos');
const btnCancelar = document.getElementById('btn-cancelar');
const tituloForm = document.getElementById('titulo-formulario');

let inventario = JSON.parse(localStorage.getItem('inventario_vortex')) || [];
let editando = false;

function cargarTabla() {
    tabla.innerHTML = '';
    
    inventario.forEach(carro => {
        let tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${carro.id}</td>
            <td><img src="${carro.imagen}" width="50" style="border-radius: 5px;"></td>
            <td>${carro.nombre}</td>
            <td>$${carro.precio.toLocaleString()}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editarProd(${carro.id})">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="btn btn-sm btn-danger ms-1" onclick="borrarProd(${carro.id})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        
        tabla.appendChild(tr);
    });
}

form.addEventListener('submit', function(e) {
    e.preventDefault();

    let idCarro = document.getElementById('carro-id').value;
    let nombre = document.getElementById('nombre').value;
    let desc = document.getElementById('desc').value;
    let precio = document.getElementById('precio').value;
    let imagen = document.getElementById('imagen').value;

    if (editando) {
        let index = inventario.findIndex(c => c.id == idCarro);
        inventario[index].nombre = nombre;
        inventario[index].descripcion = desc;
        inventario[index].precio = parseFloat(precio);
        inventario[index].imagen = imagen;
        
        editando = false;
        tituloForm.innerText = "Agregar Producto";
        btnCancelar.classList.add('d-none');
    } else {
        let nuevoId = inventario.length > 0 ? inventario[inventario.length - 1].id + 1 : 1;
        
        inventario.push({
            id: nuevoId,
            nombre: nombre,
            descripcion: desc,
            precio: parseFloat(precio),
            imagen: imagen
        });
    }

    localStorage.setItem('inventario_vortex', JSON.stringify(inventario));
    cargarTabla();
    form.reset();
});

function editarProd(id) {
    let carro = inventario.find(c => c.id == id);
    
    document.getElementById('carro-id').value = carro.id;
    document.getElementById('nombre').value = carro.nombre;
    document.getElementById('desc').value = carro.descripcion;
    document.getElementById('precio').value = carro.precio;
    document.getElementById('imagen').value = carro.imagen;
    
    editando = true;
    tituloForm.innerText = "Editando: " + carro.nombre;
    btnCancelar.classList.remove('d-none');
}

function borrarProd(id) {
    if(confirm('¿Borrar este producto?')) {
        inventario = inventario.filter(c => c.id != id);
        localStorage.setItem('inventario_vortex', JSON.stringify(inventario));
        cargarTabla();
    }
}

btnCancelar.addEventListener('click', function() {
    form.reset();
    editando = false;
    tituloForm.innerText = "Agregar Producto";
    btnCancelar.classList.add('d-none');
});

cargarTabla();