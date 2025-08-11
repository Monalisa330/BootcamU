let sectores = [];
let departamentos = [];

// Cargar datos JSON
fetch('data/data.json')
  .then(response => response.json())
  .then(data => {
    sectores = data.sectores;
    departamentos = data.departamentos;

    const selectorSector = document.getElementById('sector');
    const selectorDepto = document.getElementById('departamento');

    if (selectorSector) {
      sectores.forEach(sector => {
        const option = document.createElement('option');
        option.value = sector.nombre;
        option.textContent = `${sector.nombre} (${sector.porcentaje}%)`;
        selectorSector.appendChild(option);
      });
    }

    if (selectorDepto) {
      departamentos.forEach(depto => {
        const option = document.createElement('option');
        option.value = depto.nombre;
        option.textContent = `${depto.nombre} (${depto.porcentaje}%)`;
        selectorDepto.appendChild(option);
      });
    }
  })
  .catch(error => console.error('Error al cargar los datos:', error));

function evaluar() {
  const ingresos = parseFloat(document.getElementById("ingresos").value);
  const gastos = parseFloat(document.getElementById("gastos").value);
  const tipo = document.getElementById("tipo").value.trim();
  const tiporenta = document.getElementById("tipo-renta").value;
  const sector = document.getElementById("sector").value;
  const departamento = document.getElementById("departamento").value;
  const ganancia = ingresos - gastos;

  if (!tiporenta || isNaN(ingresos) || isNaN(gastos) || !tipo || !sector || !departamento) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor, completa todos los campos requeridos.'
    });
    return;
  }

  let resultado = "";
  let icono = "";
  
  if (tiporenta === "fija") {
    const deseado = parseFloat(document.getElementById("ganancia-deseada").value);
    if (isNaN(deseado)) {
      Swal.fire({
        icon: 'warning',
        title: 'Falta información',
        text: 'Ingresa la ganancia deseada.'
      });
      return;
    }
    if (ganancia >= deseado) {
      resultado = "Excelente 💰 Supera tus expectativas.";
      icono = "success";
    } else if (ganancia > 0) {
      resultado = "Aceptable 📈 Aunque no cumple lo esperado, sigue siendo positiva.";
      icono = "info";
    } else {
      resultado = "Negativa 📉 Revisa tus gastos o ingresos.";
      icono = "error";
    }
  }

  if (tiporenta === "variable") {
    const inversion = parseFloat(document.getElementById("inversion").value);
    if (isNaN(inversion) || inversion <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Falta información',
        text: 'Ingresa una inversión válida.'
      });
      return;
    }
    const porcentaje = (ganancia / inversion) * 100;
    if (porcentaje >= 20) {
      resultado = `Alta 💹 Rentabilidad: ${porcentaje.toFixed(2)}%`;
      icono = "success";
    } else if (porcentaje > 0) {
      resultado = `Moderada 📊 Rentabilidad: ${porcentaje.toFixed(2)}%`;
      icono = "info";
    } else {
      resultado = `Negativa 📉 Rentabilidad: ${porcentaje.toFixed(2)}%`;
      icono = "error";
    }
  }

  const sectorInfo = sectores.find(s => s.nombre === sector);
  const deptoInfo = departamentos.find(d => d.nombre === departamento);

  Swal.fire({
    icon: icono,
    title: resultado,
    html: `
      <b>${tipo}</b> (${sector})<br>
      Departamento: <b>${departamento}</b><br><br>
      Ingresos: <b>$${ingresos.toLocaleString("es-CO")}</b><br>
      Gastos: <b>$${gastos.toLocaleString("es-CO")}</b><br>
      Ganancia mensual: <b>$${ganancia.toLocaleString("es-CO")}</b>
      <hr>
      En Colombia, el sector <b>${sector}</b> representa el <b>${sectorInfo?.porcentaje ?? "?"}%</b> de los emprendimientos.<br>
      En el departamento <b>${departamento}</b>, hay un <b>${deptoInfo?.porcentaje ?? "?"}%</b> del total nacional.
    `
  });
}

// Estilos y campos dinámicos
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".formulario");
  if (form) {
    form.style.margin = "0 auto";
    form.style.maxWidth = "500px";
    form.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
    form.style.padding = "30px";
    form.style.backgroundColor = "#fff";
    form.style.borderRadius = "10px";
    form.style.marginTop = "30px";
  }

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
