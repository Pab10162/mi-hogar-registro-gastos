// ─────────────────────────────────────────
//  DATOS
// ─────────────────────────────────────────

// Recupera los movimientos guardados en el browser, o arranca con array vacío
let movimientos = JSON.parse(localStorage.getItem("movimientos")) || []

// Mes y año que está viendo el usuario (arranca en el mes actual)
let mesActual  = new Date().getMonth()     // 0 = enero ... 11 = diciembre
let anioActual = new Date().getFullYear()  // ej: 2026

// Nombres de los meses para mostrar en el título
const meses = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
]

// Clases CSS para cada categoría (define el color del tag)
const tagClases = {
  "Comida":     "tag-food",
  "Ingreso":    "tag-income",
  "Transporte": "tag-transport",
  "Servicios":  "tag-services",
  "Combustible": "tag-fuel",
  "Otro":       "tag-other",
}

// ─────────────────────────────────────────
//  FILTRO DE MES
// ─────────────────────────────────────────


function getMovimientosMes() {
  return movimientos.filter(function(mov) {
    let fecha = new Date(mov.fecha)
    return fecha.getMonth()    === mesActual &&
           fecha.getFullYear() === anioActual
  })
}


// ─────────────────────────────────────────
//  RENDER — TÍTULO
// ─────────────────────────────────────────

// Actualiza el h1 con el mes y año actual (ej: "Mayo 2026")
function renderTitulo() {
  document.getElementById("titulo-mes").textContent = meses[mesActual] + " " + anioActual
}


// ─────────────────────────────────────────
//  RENDER — TABLA DE MOVIMIENTOS
// ─────────────────────────────────────────

function renderMovimientos() {
  let lista = document.getElementById("movements-list")
  lista.innerHTML = "" // limpia la tabla para no duplicar filas
  let fila = document.createElement("tr")
  let filtrados = getMovimientosMes()
  let vacio = document.createElement("td")
  vacio.colSpan = "6";
  vacio.textContent = "No hubo movimientos este mes"
  vacio.className = "empty-message"
    if(filtrados.length == 0){
      fila.appendChild(vacio)
      lista.appendChild(fila)
    }
  filtrados.forEach(function(mov, index) {
    // Crea la fila
    let fila = document.createElement("tr")

    // Define signo y color según si es ingreso o gasto
    let signo  = mov.monto > 0 ? "+" : ""
    let clase  = mov.monto > 0 ? "income" : "expense"
    let tagCls = tagClases[mov.categoria] || "tag-other"

    // Rellena las celdas de la fila con los datos del movimiento
    fila.innerHTML = `
      <td>${mov.descripcion}</td>
      <td><span class="tag ${tagCls}">${mov.categoria}</span></td>
      <td>${mov.quien}</td>
      <td class="amount ${clase}">${signo}$${Math.abs(mov.monto).toLocaleString("es-AR")}</td>
      <td>${new Date(mov.fecha).toLocaleDateString("es-AR")}</td>
    `

    // Crea el botón eliminar
    let btnBorrar = document.createElement("button")
    btnBorrar.textContent = "Eliminar"
    btnBorrar.className   = "btn-eliminar"

    // Al clickear, busca el movimiento en el array ORIGINAL por fecha+descripcion
    // y lo elimina (no por index del filtrado, que puede no coincidir)
    btnBorrar.addEventListener("click", function() {
      let indexReal = movimientos.indexOf(
        movimientos.find(m => m.fecha === mov.fecha && m.descripcion === mov.descripcion)
      )
      if (indexReal !== -1) {
        movimientos.splice(indexReal, 1)
        localStorage.setItem("movimientos", JSON.stringify(movimientos))
        renderMovimientos()
        renderCards()
      }
    })

    // Agrega el botón en su celda y la celda a la fila
    let tdBorrar = document.createElement("td")
    tdBorrar.appendChild(btnBorrar)
    fila.appendChild(tdBorrar)

    // Agrega la fila completa a la tabla
    lista.appendChild(fila)
  })
}


// ─────────────────────────────────────────
//  RENDER — CARDS DE RESUMEN
// ─────────────────────────────────────────

function renderCards() {
  let ingresos = 0
  let gastos   = 0

  // Suma ingresos y gastos solo del mes visible
  getMovimientosMes().forEach(function(mov) {
    if (mov.monto > 0) {
      ingresos += mov.monto
    } else {
      gastos += Math.abs(mov.monto)
    }
  })

  let ahorro    = ingresos - gastos
  let ahorroEl  = document.getElementById("total-ahorro")

  // Muestra el ahorro en rojo si es negativo, azul si es positivo
  if (ahorro < 0) {
    ahorroEl.textContent = "-$" + Math.abs(ahorro).toLocaleString("es-AR")
    ahorroEl.style.color = "#e05c3a"
  } else {
    ahorroEl.textContent = "$" + ahorro.toLocaleString("es-AR")
    ahorroEl.style.color = "#3b82f6"
  }

  document.getElementById("total-ingresos").textContent = "$" + ingresos.toLocaleString("es-AR")
  document.getElementById("total-gastos").textContent   = "$" + gastos.toLocaleString("es-AR")
}


// ─────────────────────────────────────────
//  NAVEGACIÓN DE MES
// ─────────────────────────────────────────

document.getElementById("btn-mes-anterior").addEventListener("click", function() {
  // Si estamos en enero, volvemos a diciembre del año anterior
  if (mesActual === 0) {
    mesActual = 11
    anioActual--
  } else {
    mesActual--
  }
  renderTitulo()
  renderMovimientos()
  renderCards()
})

document.getElementById("btn-mes-siguiente").addEventListener("click", function() {
  // Si estamos en diciembre, pasamos a enero del año siguiente
  if (mesActual === 11) {
    mesActual = 0
    anioActual++
  } else {
    mesActual++
  }
  renderTitulo()
  renderMovimientos()
  renderCards()
})


// ─────────────────────────────────────────
//  AGREGAR MOVIMIENTO
// ─────────────────────────────────────────

document.getElementById("btn-agregar").addEventListener("click", function() {
  // Lee los valores del formulario
  let descripcion = document.getElementById("input-descripcion").value
  let categoria   = document.getElementById("input-categoria").value
  let quien       = document.getElementById("input-quien").value
  let monto       = parseFloat(document.getElementById("input-monto").value)
  let tipo        = document.getElementById("input-tipo").value
  let fecha       = new Date().toISOString()

  // Validación: no agrega si faltan datos
  if (!descripcion || !quien || isNaN(monto)) return

  // Los gastos se guardan como número negativo
  if (tipo === "gasto") monto = -Math.abs(monto)
  else                  monto =  Math.abs(monto)

  // Agrega el movimiento al array y guarda en localStorage
  movimientos.push({ descripcion, categoria, quien, monto, tipo, fecha })
  localStorage.setItem("movimientos", JSON.stringify(movimientos))

  // Actualiza la pantalla
  renderMovimientos()
  renderCards()

  // Limpia los campos del formulario
  document.getElementById("input-descripcion").value = ""
  document.getElementById("input-quien").value       = ""
  document.getElementById("input-monto").value       = ""
})


// ─────────────────────────────────────────
//  INICIO — dibuja todo al cargar la página
// ─────────────────────────────────────────

renderTitulo()
renderMovimientos()
renderCards()