let stock = JSON.parse(localStorage.getItem("stock")) || [];
let proveedores = JSON.parse(localStorage.getItem("proveedores")) || [];
let catalogo = JSON.parse(localStorage.getItem("catalogo")) || [
    // 🍺 BEBIDAS
    "Cerveza Lata",
    "Cerveza Botella",
    "Agua sin gas",
    "Agua con gas",
    "Gaseosa Cola",
    "Gaseosa Lima-Limón",
    "Tónica",
    "Jugo Naranja",

    // 🥩 COCINA - BASE
    "Harina 000",
    "Harina 0000",
    "Aceite de girasol",
    "Aceite de oliva",
    "Sal fina",
    "Sal gruesa",
    "Azúcar",
    "Pimienta",
    "Orégano",
    "Pimentón",
    "Levadura",

    // 🥩 CARNES Y FRESCOS
    "Carne picada",
    "Bife de chorizo",
    "Pollo entero",
    "Milanesa",
    "Jamón",
    "Queso cremoso",
    "Queso mozzarella",

    // 🥬 VERDULERÍA
    "Tomate",
    "Lechuga",
    "Cebolla",
    "Ajo",
    "Papa",
    "Zanahoria",
    "Limón",

    // 🍞 PANADERÍA
    "Pan de hamburguesa",
    "Pan de viena",
    "Pan rallado",
    "Pan lactal",

    // 🧽 LIMPIEZA (MUY IMPORTANTE)
    "Lavandina",
    "Detergente",
    "Desengrasante",
    "Desinfectante",
    "Alcohol 70%",
    "Esponjas",
    "Virulana",
    "Trapo de piso",
    "Guantes de limpieza",
    "Bolsa basura grande",
    "Bolsa basura mediana",

    // 🍽️ CRISTALERÍA / BAR
    "Vasos pinta",
    "Vasos chop",
    "Vasos trago",
    "Copas vino",
    "Copas gin tonic",
    "Jarras cerveza",
    "Servilletas papel",
    "Sorbetes",

    // 🍳 COCINA - INSUMOS
    "Salsa tomate",
    "Mayonesa",
    "Mostaza",
    "Ketchup",
    "Crema de leche",
    "Manteca",
    "Aceitunas",
    "Pickles",

    // 📦 DESCARTABLES
    "Papel aluminio",
    "Film plástico",
    "Papel cocina",
    "Envases descartables",
    "Tapas envases",

    // 🧊 BAR / FREEZER
    "Hielo",
    "Frutas congeladas",
    "Pulpa de fruta",

    // 🧾 OTROS
    "Servilletas",
    "Rollos cocina",
    "Cajas delivery",
    "Bolsas delivery"
];

const supabaseClient = supabase.createClient(
    "https://kxjndtiaapclghklhszk.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4am5kdGlhYXBjbGdoa2xoc3prIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NzI1MDEsImV4cCI6MjA5MjA0ODUwMX0._ZxvLwhs3tA7rHIeaMq67MAUZESZiLYDdpFbedMv8X4"
);

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

    if (!datalist) return;

    datalist.innerHTML = "";

    let catalogo = JSON.parse(localStorage.getItem("catalogo")) || [];

    if (catalogo.length === 0) {
        let option = document.createElement("option");
        option.value = "Agregá productos primero";
        datalist.appendChild(option);
        return;
    }

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
    verificarAlertas();
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

//VERIFICAR ALERTAS
function verificarAlertas() {
    let alertas = stock.filter(p => p.cantidad < p.minimo);

    let contenedor = document.getElementById("alertas");
    contenedor.innerHTML = "";

    alertas.forEach(p => {
        let div = document.createElement("div");
        div.classList.add("alerta");

        div.innerHTML = `⚠️ ${p.producto} bajo stock`;

        contenedor.appendChild(div);

        // 📲 notificación
        notificarAlerta(p.producto);
    });
}


function notificarAlerta(producto) {
    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
        new Notification("Stock bajo", {
            body: `${producto} necesita reposición`
        });
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

    if (!select) return;

    select.innerHTML = "";

    if (!proveedores || proveedores.length === 0) {
        let option = document.createElement("option");
        option.textContent = "No hay proveedores";
        select.appendChild(option);
        return;
    }

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

async function guardarPedido(nombre, producto) {
    const { data, error } = await supabaseClient
        .from("Pedidos")
        .insert([{ nombre, productos: producto }])

    if (error) {
        alert("Error al guardar ❌");
        console.error(error);
    } else {
        alert("Pedido guardado ✅");
        console.log(data);
    }
}


async function obtenerPedidos() {
    const { data, error } = await supabaseClient
        .from("pedidos")
        .select("*");

    console.log(data);
}

function enviar() {
    const nombre = document.getElementById("nombre").value;
    const producto = document.getElementById("productoPedido").value;

    guardarPedido(nombre, producto);
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

window.agregarAlCatalogo = function () {
    let nuevo = document.getElementById("nuevoProducto").value.trim();

    if (!nuevo) return;

    let catalogo = JSON.parse(localStorage.getItem("catalogo")) || [];

    if (!catalogo.includes(nuevo)) {
        catalogo.push(nuevo);
        localStorage.setItem("catalogo", JSON.stringify(catalogo));
    }

    document.getElementById("nuevoProducto").value = "";

    cargarCatalogo();
};

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

document.addEventListener("DOMContentLoaded", function () {
    mostrarStock();
    mostrarProveedores();
    cargarProveedoresSelect();
    cargarCatalogo();
    actualizarDashboard();
    verificarAlertas();
});

// 4. 🔥 ESTO VA AL FINAL (IMPORTANTE)
window.agregarProducto = agregarProducto;
window.generarPedido = generarPedido;
window.mostrarStock = mostrarStock;
window.cargarCatalogo = cargarCatalogo;
window.cargarProveedoresSelect = cargarProveedoresSelect;