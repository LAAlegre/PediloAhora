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
        let tr = document.createElement("tr");

        if (p.cantidad < p.minimo) {
            tr.classList.add("alerta");
        }

        tr.innerHTML = `
      <td>${p.producto}</td>
      <td>${p.proveedor}</td>
      <td>${p.cantidad}</td>
      <td>${p.minimo}</td>
    `;

        lista.appendChild(tr);
    });
}

function limpiarStock() {
    if (confirm("¿Seguro?")) {
        stock = [];
        guardarDatos();
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

    let pedidosPorProveedor = {};

    stock.forEach(p => {
        if (p.cantidad < p.minimo) {
            if (!pedidosPorProveedor[p.proveedor]) {
                pedidosPorProveedor[p.proveedor] = [];
            }
            pedidosPorProveedor[p.proveedor].push(p.producto);
        }
    });

    for (let proveedor in pedidosPorProveedor) {
        let li = document.createElement("li");
        li.innerHTML = `<strong>${proveedor}</strong><br>${pedidosPorProveedor[proveedor].join(", ")}`;
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
mostrarStock();
mostrarProveedores();
actualizarDashboard();