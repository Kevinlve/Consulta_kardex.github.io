const { GoogleSpreadsheet } = require('google-spreadsheet');

const doc = new GoogleSpreadsheet('TU_ID_DE_HOJA_DE_CÁLCULO');

async function getData() {
  await doc.useServiceAccountAuth({
    client_email: 'TU_CLIENT_EMAIL',
    private_key: 'TU_PRIVATE_KEY',
  });
  await doc.loadInfo(); // carga la información de la hoja de cálculo
  const sheet = doc.sheetsByIndex[0]; // utiliza la primera hoja
  const rows = await sheet.getRows(); // obtiene todas las filas de la hoja
  return rows;
}

// aquí puedes hacer uso de la función getData() para obtener los datos de la hoja de cálculo

const form = document.querySelector('form');
const searchInput = document.querySelector('#search');
const resultsDiv = document.querySelector('#results');

form.addEventListener('submit', (event) => {
  event.preventDefault(); // evita que el formulario se envíe
  const searchValue = searchInput.value.toLowerCase(); // convierte la entrada del usuario a minúsculas
  getData().then((rows) => {
    const filteredRows = rows.filter((row) => {
      const reference = row.Referencia.toLowerCase();
      const name = row.Nombre_Producto.toLowerCase();
      return reference.includes(searchValue) || name.includes(searchValue);
    });
    displayResults(filteredRows);
  });
});

function displayResults(rows) {
  resultsDiv.innerHTML = ''; // borra cualquier resultado anterior
  if (rows.length === 0) {
    resultsDiv.innerHTML = '<p>No se encontraron resultados.</p>';
  } else {
    const table = document.createElement('table');
    const headerRow = document.createElement('tr');
    const referenceHeader = document.createElement('th');
    referenceHeader.textContent = 'Referencia';
    const nameHeader = document.createElement('th');
    nameHeader.textContent = 'Nombre del producto';
    headerRow.appendChild(referenceHeader);
    headerRow.appendChild(nameHeader);
    table.appendChild(headerRow);
    rows.forEach((row) => {
      const dataRow = document.createElement('tr');
      const referenceCell = document.createElement('td');
      referenceCell.textContent = row.Referencia;
      const nameCell = document.createElement('td');
      nameCell.textContent = row.Nombre_Producto;
      dataRow.appendChild(referenceCell);
      dataRow.appendChild(nameCell);
      table.appendChild(dataRow);
    });
    resultsDiv.appendChild(table);
  }
}    
