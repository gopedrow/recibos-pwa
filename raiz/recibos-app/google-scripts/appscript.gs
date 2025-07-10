function doPost(e) {
  const tipo = e.parameter.tipo;
  const dados = JSON.parse(e.postData.contents);
  if (tipo === 'cliente') {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Clientes');
    sheet.appendRow([dados.nome, dados.email, dados.telefone]);
    return ContentService.createTextOutput(JSON.stringify({ status: "ok" })).setMimeType(ContentService.MimeType.JSON);
  } else {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Recibos');
    sheet.appendRow([dados.nome, dados.descricao, dados.valor, dados.data]);
    return ContentService.createTextOutput(JSON.stringify({ status: "ok" })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  const tipo = e.parameter.tipo;
  if (tipo === 'cliente') {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Clientes');
    const dados = sheet.getDataRange().getValues();
    const resultado = dados.slice(1).map(linha => ({
      nome: linha[0],
      email: linha[1],
      telefone: linha[2]
    }));
    return ContentService.createTextOutput(JSON.stringify(resultado)).setMimeType(ContentService.MimeType.JSON);
  } else {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Recibos');
    const dados = sheet.getDataRange().getValues();
    const resultado = dados.slice(1).map(linha => ({
      nome: linha[0],
      descricao: linha[1],
      valor: linha[2],
      data: linha[3]
    }));
    return ContentService.createTextOutput(JSON.stringify(resultado)).setMimeType(ContentService.MimeType.JSON);
  }
} 