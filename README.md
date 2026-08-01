Mi Hogar — Registro de Gastos e Ingresos

Aplicación web simple para el control de finanzas del hogar: permite registrar ingresos y gastos, clasificarlos por categoría, ver quién los generó y navegar el historial mes a mes.

Funcionalidades

- Registro de movimientos: alta de ingresos y gastos con descripción, categoría, responsable, monto y fecha.
- Categorías: Comida, Ingreso, Transporte, Servicios, Combustible, Otro — cada una con su propio color identificador.
- Resumen mensual: tarjetas con el total de ingresos, gastos y ahorro (balance) del mes.
- Navegación por mes: botones para moverse entre meses y años.
- Eliminación de movimientos desde la tabla de historial.
- Persistencia local: los datos se guardan en el `localStorage` del navegador, así que no se pierden al recargar la página.

Tecnologías

- HTML5
- CSS3
- JavaScript (vanilla, sin frameworks ni librerías externas)

También podés probarlo directamente desde GitHub Pages: **[Ver demo en vivo](https://pab10162.github.io/mi-hogar-registro-gastos/)**

Estructura del proyecto

mi-hogar-registro-gastos/
├── index.html   # Estructura de la app
├── style.css    # Estilos visuales
└── app.js       # Lógica: manejo de movimientos, render y persistencia

Mejoras a futuro

- Gráficos de estadísticas por categoría.
- Gestión de múltiples miembros del hogar con roles.
- Exportación de movimientos a Excel/PDF.


Proyecto desarrollado como práctica de desarrollo frontend.
