// script.js
let sectores = [];
let departamentos = [];

// Cargar datos desde el archivo JSON
fetch('data/data.json')
  .then(response => response.json())
  .then(data => {
    sectores = data.sectores;
    departamentos = data.departamentos;

    // Llenar el selector de sectores
    const selectorSector = document.getElementById('sector');
    if (selectorSector) {
      sectores.forEach(sector => {
        const option = document.createElement('option');
        option.value = sector.nombre;
        option.textContent = `${sector.nombre} (${sector.porcentaje}%)`;
        selectorSector.appendChild(option);
      });
    }

    // Llenar el selector de departamentos
    const selectorDepto = document.getElementById('departamento');
    if (selectorDepto) {
      departamentos.forEach(depto => {
        const option = document.createElement('option');
        option.value = depto.nombre;
        option.textContent = `${depto.nombre} (${depto.porcentaje}%)`;
        selectorDepto.appendChild(option);
      });
    }

    // Dibujar gráficos si existen los canvas
    if (document.getElementById("graficoDepartamentos")) {
      crearGraficoBarras(
        "graficoDepartamentos",
        departamentos.map(d => d.nombre),
        departamentos.map(d => d.porcentaje),
        generarColores(departamentos.length),
        "Participación por Departamento"
      );
    }

    if (document.getElementById("graficoSectores")) {
      crearGraficoBarras(
        "graficoSectores",
        sectores.map(s => s.nombre),
        sectores.map(s => s.porcentaje),
        generarColores(sectores.length),
        "Participación por Sector Económico"
      );
    }
  })
  .catch(error => {
    console.error('Error al cargar los datos:', error);
  });

// Función para evaluar rentabilidad
function evaluar() {
  const ingresos = parseFloat(document.getElementById("ingresos").value);
  const gastos = parseFloat(document.getElementById("gastos").value);
  const tipo = document.getElementById("tipo").value.trim();
  const sector = document.getElementById("sector").value;
  const departamento = document.getElementById("departamento").value;

  if (isNaN(ingresos) || isNaN(gastos) || !sector || !departamento) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  const ganancia = ingresos - gastos;
  let mensaje = "";
  let color = "";

  if (ganancia > 1000000) {
    mensaje = "✅ Excelente rentabilidad.";
    color = "#d4edda";
  } else if (ganancia > 0) {
    mensaje = "⚠️ Rentabilidad aceptable. Puedes mejorar.";
    color = "#fff3cd";
  } else {
    mensaje = "❌ Tu negocio tiene pérdidas. Revisa tus gastos.";
    color = "#f8d7da";
  }

  const sectorInfo = sectores.find(s => s.nombre === sector);
  const deptoInfo = departamentos.find(d => d.nombre === departamento);

  const resultadoHTML = `
    <div style="background-color: ${color}; padding: 20px; border-radius: 8px; text-align: center; max-width: 500px; margin: 20px auto; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
      <strong>${tipo || "Tu negocio"} (${sector})</strong><br>
      Departamento: <strong>${departamento}</strong><br>
      Ingresos: <strong>$${ingresos.toLocaleString("es-CO")}</strong><br>
      Gastos: <strong>$${gastos.toLocaleString("es-CO")}</strong><br>
      Ganancia mensual estimada: <strong>$${ganancia.toLocaleString("es-CO")}</strong><br>
      Resultado: <strong>${mensaje}</strong><br><br>
      En Colombia, el sector <strong>${sector}</strong> representa el <strong>${sectorInfo?.porcentaje ?? "?"}%</strong> de los emprendimientos.<br>
      En el departamento <strong>${departamento}</strong> hay un <strong>${deptoInfo?.porcentaje ?? "?"}%</strong> del total de emprendimientos nacionales.
    </div>
  `;

  document.getElementById("resultado").innerHTML = resultadoHTML;
}

// Centrar visualmente el formulario al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".formulario");
  if (form) {
    form.style.margin = "0 auto";
    form.style.maxWidth = "500px";
    form.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
    form.style.padding = "30px";
    form.style.backgroundColor = "#ffffff";
    form.style.borderRadius = "10px";
    form.style.marginTop = "30px";
  }
});

// Función para crear gráficos tipo barras horizontales
function crearGraficoBarras(idCanvas, etiquetas, datos, colores, titulo) {
  const ctx = document.getElementById(idCanvas).getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: etiquetas,
      datasets: [{
        label: "Participación (%)",
        data: datos,
        backgroundColor: colores,
        borderWidth: 1
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: titulo
        },
        datalabels: {
          anchor: 'end',
          align: 'right',
          formatter: value => value.toFixed(1) + '%',
          color: '#000',
          font: { weight: 'bold', size: 12 }
        }
      },
      scales: {
        x: {
          ticks: {
            callback: value => value + "%"
          }
        }
      }
    },
    plugins: [ChartDataLabels]
  });
}
