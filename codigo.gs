function doGet(e) {
  return filtrar(e.parameter);
}

function filtrar(params) {
  var COUNTRY = 9;
  var INDUSTRY = 11;
  var ROLE = 15;
  var CNAE = 16;
  var COUNTER = 17; // Columna 17 (índice 16)

  var filtros = {
    'country': params.country || null,
    'industry': params.industry || null,
    'role': params.role || null,
    'CNAE': params.CNAE ? parseFloat(params.CNAE) : null
  };

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var range = sheet.getDataRange();
  var values = range.getValues();

  var filteredValues = values.filter(function(row, rowIndex) {
    var match = true;
    if (filtros['country'] !== undefined && filtros['country'] !== null) {
      match = match && (row[COUNTRY] === filtros['country']);
    }
    if (filtros['industry'] !== undefined && filtros['industry'] !== null) {
      match = match && (row[INDUSTRY] === filtros['industry']);
    }
    if (filtros['role'] !== undefined && filtros['role'] !== null) {
      match = match && (row[ROLE] === filtros['role']);
    }
    if (filtros['CNAE'] !== undefined && filtros['CNAE'] !== null) {
      match = match && (row[CNAE] === filtros['CNAE']);
    }
    if (match) {
      // Incrementar el contador en la columna 17
      if (!row[COUNTER]) {
        row[COUNTER] = 1;
      }
      row[COUNTER]++;
      // Actualizar la celda en la hoja
      sheet.getRange(rowIndex + 1, COUNTER + 1).setValue(row[COUNTER]);
    }
    return match;
  });

  if (filteredValues.length > 0) {

    const headers = ['emailStatus', 'email', 'fullName', 'firstName', 'lastName',
       'linkedinUrl', 'companyName', 'companyWebsite', 'icebreaker', 'country',
       'location', 'industry', 'companyWebsite.1', 'companyProfileUrl',
       'civility', 'Role', 'CNAE', 'Counter']

    filteredValues.unshift(headers);

    var csv = arrayToCsv(filteredValues);
    return ContentService.createTextOutput(csv)
      .setMimeType(ContentService.MimeType.CSV)
      .downloadAsFile('filtered_data.csv');
  } else {
    return ContentService.createTextOutput("No se encontraron filas que coincidan con los criterios de filtro.")
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

function arrayToCsv(data) {
  return data.map(function(row) {
    return row.map(function(cell) {
      if (typeof cell === 'string') {
        return '"' + cell.replace(/"/g, '""') + '"';
      }
      return cell;
    }).join(',');
  }).join('\n');
}
