let stock = JSON.parse(localStorage.getItem("stock")) || [];
let proveedores = JSON.parse(localStorage.getItem("proveedores")) || [];
let catalogo = JSON.parse(localStorage.getItem("catalogo")) || [
    "Cerveza",
    "Agua",
    "Gaseosa",
    "Harina",
    "Aceite",
    "Sal",
    "Azúcar",
    "Levadura",
    "Carne",
    "Pollo",
    "Queso",
    "Tomate",
    "Lechuga",
    "Pan",
    "Helado",
    "Hielo",
    "Vasos",
    "Servilletas",
    "Detergente"
];
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

function agregarAlCatalogo() {
    let nuevo = document.getElementById("nuevoProducto").value.trim();

    if (!nuevo) return;

    if (!catalogo.includes(nuevo)) {
        catalogo.push(nuevo);
        localStorage.setItem("catalogo", JSON.stringify(catalogo));
        cargarCatalogo();
    }

    document.getElementById("nuevoProducto").value = "";
}

function cargarCatalogo() {
    let datalist = document.getElementById("productos");
    datalist.innerHTML = "";

    catalogo.forEach(p => {
        let option = document.createElement("option");
        option.value = p;
        datalist.appendChild(option);
    });
}

// STOCK
function agregarProducto() {
    let producto = document.getElementById("producto").value.trim();
    let cantidad = parseInt(document.getElementById("cantidad").value);
    let minimo = parseInt(document.getElementById("minimo").value);
    let proveedor = document.getElementById("proveedorSelect").value;

    if (!producto) {
        alert("Ingresá un producto");
        return;
    }

    // Guardar en catálogo si no existe
    if (!catalogo.includes(producto)) {
        catalogo.push(producto);
        localStorage.setItem("catalogo", JSON.stringify(catalogo));
    }

    if (isNaN(cantidad)) cantidad = 0;
    if (isNaN(minimo)) minimo = 0;

    stock.push({ producto, cantidad, minimo, proveedor });

    guardarDatos();
    mostrarStock();
    actualizarDashboard();
}
function mostrarStock() {
    let lista = document.getElementById("listaStock");
    lista.innerHTML = "";

    stock.forEach(p => {
        let tr = document.createElement("tr");

        if (p.cantidad < p.minimo) {
            tr.classList.add("alerta");
        }

        tr.innerHTML = `
      <td>${p.producto}</td>
      <td>${p.proveedor || "Sin proveedor"}</td>
      <td>${p.cantidad}</td>
      <td>${p.minimo}</td>
    `;

        lista.appendChild(tr);
    });
}

function limpiarStock() {
    if (confirm("¿Seguro que querés borrar todo el stock?")) {
        stock = [];
        localStorage.removeItem("stock");
        mostrarStock();
        actualizarDashboard();
    }
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

    let pedidos = {};

    stock.forEach(p => {
        if (p.cantidad < p.minimo) {
            if (!pedidos[p.proveedor]) {
                pedidos[p.proveedor] = [];
            }
            pedidos[p.proveedor].push(p.producto);
        }
    });

    let hayPedidos = Object.keys(pedidos).length;

    if (!hayPedidos) {
        lista.innerHTML = "<li>No hay productos para pedir 👍</li>";
        return;
    }

    for (let prov in pedidos) {
        let li = document.createElement("li");
        li.innerHTML = `
      <strong>${prov}</strong><br>
      ${pedidos[prov].join(", ")}
    `;
        lista.appendChild(li);
    }
}

function enviarWhatsApp() {
    let pedidosPorProveedor = {};

    stock.forEach(p => {
        if (p.cantidad < p.minimo) {
            if (!pedidosPorProveedor[p.proveedor]) {
                pedidosPorProveedor[p.proveedor] = [];
            }
            pedidosPorProveedor[p.proveedor].push(p.producto);
        }
    });

    let mensaje = "";

    for (let proveedor in pedidosPorProveedor) {
        mensaje += `📦 ${proveedor}\n`;
        pedidosPorProveedor[proveedor].forEach(prod => {
            mensaje += `- ${prod}\n`;
        });
        mensaje += "\n";
    }

    let url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
}

//DASHBOARD

function actualizarDashboard() {
    document.getElementById("totalProductos").textContent = stock.length;

    let bajos = stock.filter(p => p.cantidad < p.minimo).length;
    document.getElementById("bajoStock").textContent = bajos;

    document.getElementById("totalProveedores").textContent = proveedores.length;
}

function filtrarStock() {
    let texto = document.getElementById("buscador").value.toLowerCase();
    let filas = document.querySelectorAll("#listaStock tr");

    filas.forEach(fila => {
        fila.style.display = fila.textContent.toLowerCase().includes(texto)
            ? ""
            : "none";
    });
}
// Inicializar

window.onload = function () {
    mostrarStock();
    mostrarProveedores();
    cargarProveedoresSelect();
    cargarCatalogo();
    actualizarDashboard();
};