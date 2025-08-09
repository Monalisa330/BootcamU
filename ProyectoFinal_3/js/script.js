let sectores = [];
let departamentos = [];

// Cargar datos desde el archivo JSON
fetch('data/data.json')
  .then(response => response.json())
  .then(data => {
    sectores = data.sectores;
    departamentos = data.departamentos;

    const selectorSector = document.getElementById('sector');
    const selectorDepto = document.getElementById('departamento');

    // Llenar sectores
    if (selectorSector) {
      sectores.forEach(sector => {
        const option = document.createElement('option');
        option.value = sector.nombre;
        option.textContent = `${sector.nombre} (${sector.porcentaje}%)`;
        selectorSector.appendChild(option);
      });
    }

    // Llenar departamentos
    if (selectorDepto) {
      departamentos.forEach(depto => {
        const option = document.createElement('option');
        option.value = depto.nombre;
        option.textContent = `${depto.nombre} (${depto.porcentaje}%)`;
        selectorDepto.appendChild(option);
      });
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
  const tiporenta = document.getElementById("tipo-renta").value;
  const sector = document.getElementById("sector").value;
  const departamento = document.getElementById("departamento").value;

  const ganancia = ingresos - gastos;
  let resultado = "";
  let color = "";

  if (!tiporenta || isNaN(ingresos) || isNaN(gastos) || !tipo || !sector || !departamento) {
    alert("Por favor, completa todos los campos requeridos.");
    return;
  }

  if (tiporenta === "fija") {
    const deseado = parseFloat(document.getElementById("ganancia-deseada").value);
    if (isNaN(deseado)) {
      alert("Por favor, ingresa la ganancia deseada.");
      return;
    }

    if (ganancia >= deseado) {
      resultado = "✅ Excelente rentabilidad. Supera tus expectativas.";
      color = "#d4edda";
    } else if (ganancia > 0) {
      resultado = "⚠️ Rentabilidad aceptable. Aunque no cumple con la ganancia deseada, sigue siendo positiva.";
      color = "#fff3cd";
    } else {
      resultado = "❌ Tu negocio tiene pérdidas. Revisa tus gastos o ingresos.";
      color = "#f8d7da";
    }

  } else if (tiporenta === "variable") {
    const inversion = parseFloat(document.getElementById("inversion").value);
    if (isNaN(inversion) || inversion <= 0) {
      alert("Por favor, ingresa una inversión válida.");
      return;
    }

    const porcentaje = (ganancia / inversion) * 100;

    if (porcentaje > 20) {
      resultado = `✅ Rentabilidad alta: ${porcentaje.toFixed(2)}%. Excelente inversión.`;
      color = "#d4edda";
    } else if (porcentaje > 0) {
      resultado = `⚠️ Rentabilidad moderada: ${porcentaje.toFixed(2)}%. Puede mejorar.`;
      color = "#fff3cd";
    } else {
      resultado = `❌ Rentabilidad negativa: ${porcentaje.toFixed(2)}%. Hay pérdidas.`;
      color = "#f8d7da";
    }
  }

  // Obtener info del JSON
  const sectorInfo = sectores.find(s => s.nombre === sector);
  const deptoInfo = departamentos.find(d => d.nombre === departamento);

  const resultadoHTML = `
    <div style="background-color: ${color}; padding: 20px; border-radius: 8px; text-align: center; max-width: 500px; margin: 20px auto;">
      <strong>${tipo} (${sector})</strong><br>
      Departamento: <strong>${departamento}</strong><br>
      Ingresos: <strong>$${ingresos.toLocaleString("es-CO")}</strong><br>
      Gastos: <strong>$${gastos.toLocaleString("es-CO")}</strong><br>
      Ganancia mensual estimada: <strong>$${ganancia.toLocaleString("es-CO")}</strong><br>
      Resultado: <strong>${resultado}</strong><br><br>
      En Colombia, el sector <strong>${sector}</strong> representa el <strong>${sectorInfo?.porcentaje ?? "?"}%</strong> de los emprendimientos.<br>
      En el departamento <strong>${departamento}</strong>, hay un <strong>${deptoInfo?.porcentaje ?? "?"}%</strong> del total de emprendimientos nacionales.
    </div>
  `;

  document.getElementById("resultado").innerHTML = resultadoHTML;
}

// Estilos al cargar
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

  // Campos dinámicos por tipo de renta
  const tipoRenta = document.getElementById("tipo-renta");
  const camposFija = document.getElementById("campos-fija");
  const camposVariable = document.getElementById("campos-variable");

  if (tipoRenta) {
    tipoRenta.addEventListener("change", () => {
      camposFija.classList.add("hidden");
      camposVariable.classList.add("hidden");

      if (tipoRenta.value === "fija") {
        camposFija.classList.remove("hidden");
      } else if (tipoRenta.value === "variable") {
        camposVariable.classList.remove("hidden");
      }
    });
  }
});
