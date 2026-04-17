let stock = JSON.parse(localStorage.getItem("stock")) || [];
let proveedores = JSON.parse(localStorage.getItem("proveedores")) || [];

// Cambiar secciones
function mostrarSeccion(seccion) {
    document.querySelectorAll("section").forEach(s => s.style.display = "none");
    document.getElementById(seccion).style.display = "block";
}

// Guardar datos
function guardarDatos() {
    localStorage.setItem("stock", JSON.stringify(stock));
    localStorage.setItem("proveedores", JSON.stringify(proveedores));
}

// STOCK
function agregarProducto() {
    let producto = document.getElementById("producto").value;
    let cantidad = Number(document.getElementById("cantidad").value);
    let minimo = Number(document.getElementById("minimo").value);
    let proveedor = document.getElementById("proveedorSelect").value;

    if (!producto) return;

    stock.push({ producto, cantidad, minimo, proveedor });
    guardarDatos();
    mostrarStock();
}

function mostrarStock() {
    let lista = document.getElementById("listaStock");
    lista.innerHTML = "";

    stock.forEach(p => {
        let li = document.createElement("li");
        li.textContent = `${p.producto} (${p.proveedor}) - ${p.cantidad}`;
        lista.appendChild(li);
    });
}

// PROVEEDORES
function agregarProveedor() {
    let nombre = document.getElementById("nombreProv").value;
    let telefono = document.getElementById("telefonoProv").value;

    proveedores.push({ nombre, telefono });
    guardarDatos();
    mostrarProveedores();
}

function mostrarProveedores() {
    let lista = document.getElementById("listaProveedores");
    lista.innerHTML = "";

    proveedores.forEach(p => {
        let li = document.createElement("li");
        li.textContent = `${p.nombre} - ${p.telefono}`;
        lista.appendChild(li);
    });
}

function cargarProveedoresSelect() {
    let select = document.getElementById("proveedorSelect");
    select.innerHTML = "";

    proveedores.forEach(p => {
        let option = document.createElement("option");
        option.value = p.nombre;
        option.textContent = p.nombre;
        select.appendChild(option);
    });
}


// PEDIDO AUTOMÁTICO
function generarPedido() {
    let lista = document.getElementById("listaPedido");
    lista.innerHTML = "";

    stock.forEach(p => {
        if (p.cantidad < p.minimo) {
            let li = document.createElement("li");
            li.textContent = `Comprar ${p.producto}`;
            lista.appendChild(li);
        }
    });
}

function enviarWhatsApp() {
    let mensaje = "Pedido:\n";

    stock.forEach(p => {
        if (p.cantidad < p.minimo) {
            mensaje += `- ${p.producto} (${p.proveedor})\n`;
        }
    });

    let url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
}

// Inicializar
mostrarStock();
mostrarProveedores();