let sectores = [];
let departamentos = [];


fetch('data.json')
  .then(response => response.json())
  .then(data => {
    sectores = data.sectores;
    departamentos = data.departamentos;

    // Llenar el selector de sectores
    const selectorSector = document.getElementById('sector');
    sectores.forEach(sector => {
      const option = document.createElement('option');
      option.value = sector.nombre;
      option.textContent = `${sector.nombre} (${sector.porcentaje}%)`;
      selectorSector.appendChild(option);
    });

    // Llenar el selector de departamentos
    const selectorDepto = document.getElementById('departamento');
    departamentos.forEach(depto => {
      const option = document.createElement('option');
      option.value = depto.nombre;
      option.textContent = `${depto.nombre} (${depto.porcentaje}%)`;
      selectorDepto.appendChild(option);
    });
  })
  .catch(error => {
    console.error('Error al cargar los datos:', error);
  });

function evaluar() {
  const ingresos = parseFloat(document.getElementById("ingresos").value);
  const gastos = parseFloat(document.getElementById("gastos").value);
  const tipo = document.getElementById("tipo").value;
  const sector = document.getElementById("sector").value;
  const departamento = document.getElementById("departamento").value;

  if (isNaN(ingresos) || isNaN(gastos) || !sector || !departamento) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  const ganancia = ingresos - gastos;
  let mensaje = "";

  if (ganancia > 1000000) {
    mensaje = "✅ Excelente rentabilidad.";
  } else if (ganancia > 0) {
    mensaje = "🟡 Rentabilidad aceptable. Puedes mejorar.";
  } else {
    mensaje = "🔴 Tu negocio tiene pérdidas. Revisa tus gastos.";
  }

  const sectorInfo = sectores.find(s => s.nombre === sector);
  const deptoInfo = departamentos.find(d => d.nombre === departamento);

  const resultadoHTML = `
    <strong>${tipo || "Tu negocio"} (${sector})</strong><br>
    Departamento: <strong>${departamento}</strong><br>
    Ingresos: <strong>$${ingresos.toLocaleString("es-CO")}</strong><br>
    Gastos: <strong>$${gastos.toLocaleString("es-CO")}</strong><br>
    Ganancia mensual estimada: <strong>$${ganancia.toLocaleString("es-CO")}</strong><br>
    Resultado: <strong>${mensaje}</strong><br><br>
    En Colombia, el sector <strong>${sector}</strong> representa el <strong>${sectorInfo?.porcentaje ?? "?"}%</strong> de los emprendimientos.<br>
    En el departamento <strong>${departamento}</strong> hay un <strong>${deptoInfo?.porcentaje ?? "?"}%</strong> del total de emprendimientos nacionales.
  `;

  document.getElementById("resultado").innerHTML = resultadoHTML;
}
