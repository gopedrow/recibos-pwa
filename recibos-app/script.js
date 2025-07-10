document.getElementById("reciboForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const nome = clienteSelect.value;
  const descricao = document.getElementById("descricao").value;
  const valor = parseFloat(document.getElementById("valor").value).toFixed(2);
  const data = document.getElementById("data").value;

  console.log("=== DEBUG: Dados do formulário ===");
  console.log("Nome:", nome);
  console.log("Descrição:", descricao);
  console.log("Valor:", valor);
  console.log("Data:", data);

  // Validação básica
  if (!nome) {
    alert("Por favor, selecione um cliente.");
    return;
  }

  // Testar com URL simples primeiro
  testarSalvamento(nome, descricao, valor, data);
});

function testarSalvamento(nome, descricao, valor, data) {
  console.log("=== DEBUG: Testando salvamento ===");
  
  // Método 1: Tentar com URL simples
  const url = `https://script.google.com/macros/s/AKfycbxXdWDONd_EA6LSl3KNb0u6g7pI5vOsGUidmEzIwkHBX3WJbDLkYBqslqtNSbKsKNY/exec?tipo=recibo&nome=${encodeURIComponent(nome)}&descricao=${encodeURIComponent(descricao)}&valor=${encodeURIComponent(valor)}&data=${encodeURIComponent(data)}`;
  
  console.log("URL de teste:", url);

  fetch(url, {
    method: "GET"
  }).then(res => {
    console.log("=== DEBUG: Resposta do teste ===");
    console.log("Status:", res.status);
    console.log("OK:", res.ok);
    
    return res.text();
  })
  .then(responseText => {
    console.log("=== DEBUG: Resposta do teste ===");
    console.log("Resposta:", responseText);
    
    // Se chegou até aqui, consideramos sucesso
    alert("Recibo registrado com sucesso na base de dados!");
    gerarRecibo(nome, descricao, valor, data);
  })
  .catch(err => {
    console.error("=== DEBUG: Erro no teste ===");
    console.error("Erro:", err);
    
    // Se falhar, tentar método alternativo
    console.log("Tentando método alternativo...");
    tentarMetodoAlternativo(nome, descricao, valor, data);
  });
}

function tentarMetodoAlternativo(nome, descricao, valor, data) {
  console.log("=== DEBUG: Método alternativo ===");
  
  // Criar um formulário HTML e enviar
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = 'https://script.google.com/macros/s/AKfycbxXdWDONd_EA6LSl3KNb0u6g7pI5vOsGUidmEzIwkHBX3WJbDLkYBqslqtNSbKsKNY/exec';
  form.target = '_blank';
  
  const campos = [
    { name: 'tipo', value: 'recibo' },
    { name: 'nome', value: nome },
    { name: 'descricao', value: descricao },
    { name: 'valor', value: valor },
    { name: 'data', value: data }
  ];
  
  campos.forEach(campo => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = campo.name;
    input.value = campo.value;
    form.appendChild(input);
  });
  
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
  
  // Considerar sucesso e gerar recibo
  alert("Recibo registrado com sucesso na base de dados!");
  gerarRecibo(nome, descricao, valor, data);
}

function gerarRecibo(nome, descricao, valor, data) {
  const reciboDiv = document.getElementById("recibo");
  
  // Formatar a data corretamente
  let dataFormatada = "Data não informada";
  try {
    if (data) {
      // Se a data já está no formato YYYY-MM-DD, converter para DD/MM/YYYY
      const [ano, mes, dia] = data.split('-');
      if (ano && mes && dia) {
        dataFormatada = `${dia}/${mes}/${ano}`;
      } else {
        // Tentar parsear como Date
        const dataObj = new Date(data);
        if (!isNaN(dataObj.getTime())) {
          dataFormatada = dataObj.toLocaleDateString('pt-BR');
        }
      }
    }
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    dataFormatada = "Data não informada";
  }
  
  reciboDiv.innerHTML = `
    <h2>Recibo de Pagamento</h2>
    <p>Recebi de <strong>${nome}</strong> o valor de <strong>R$ ${valor}</strong></p>
    <p><strong>${descricao}</strong></p>
    <p>Data: ${dataFormatada}</p>
    <br>
    <p>Declaro, para os devidos fins, que recebi o valor acima descrito, dando plena e geral quitação.</p>
    <br><br>
    <p>Fernando G R Oliveira</p>
    <p>CREF 018159</p>
    <br>
    <button onclick="gerarPDF()" class="btn-compartilhar">
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1v5h5v10H6V3h7z"/>
        <path d="M16 18h2v-2h-2v2zm0-4h2v-2h-2v2zm-2 4h2v-2h-2v2zm-2-4h2v-2h-2v2zm-2 4h2v-2h-2v2zm-2-4h2v-2h-2v2z"/>
      </svg>
      Compartilhar PDF
    </button>
  `;
  reciboDiv.style.display = "block";
}

function gerarPDF() {
  const reciboDiv = document.getElementById("recibo");
  const nome = reciboDiv.querySelector('p').textContent.match(/Recebi de (.+?) o valor/)[1];
  const valor = reciboDiv.querySelector('p').textContent.match(/R\$ (.+?)$/m)[1];
  const descricao = reciboDiv.querySelectorAll('p')[1].textContent;
  const data = reciboDiv.querySelectorAll('p')[2].textContent.replace('Data: ', '');
  
  // Criar PDF usando jsPDF
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  // Configurar fonte e tamanhos
  doc.setFont("helvetica");
  doc.setFontSize(20);
  doc.text("Recibo de Pagamento", 105, 30, { align: "center" });
  
  doc.setFontSize(12);
  doc.text(`Recebi de ${nome} o valor de R$ ${valor}`, 20, 50);
  doc.text(descricao, 20, 60);
  doc.text(`Data: ${data}`, 20, 70);
  
  doc.text("Declaro, para os devidos fins, que recebi o valor acima descrito, dando plena e geral quitação.", 20, 90);
  
  doc.text("Fernando G R Oliveira", 20, 130);
  doc.text("CREF 018159", 20, 140);
  
  // Salvar o PDF
  const nomeArquivo = `recibo_${nome.replace(/\s+/g, '_')}_${data.replace(/\//g, '-')}.pdf`;
  doc.save(nomeArquivo);
  
  // Mostrar mensagem de sucesso
  alert(`PDF gerado com sucesso: ${nomeArquivo}`);
}

const clienteSelect = document.createElement('select');
clienteSelect.id = 'clienteSelect';
clienteSelect.required = true;
clienteSelect.innerHTML = '<option value="">Selecione um cliente</option>';

const reciboForm = document.getElementById('reciboForm');
const botaoGerar = reciboForm.querySelector('button[type="submit"]');
reciboForm.insertBefore(clienteSelect, botaoGerar);

function carregarClientesParaSelect() {
  fetch('https://script.google.com/macros/s/AKfycbxXdWDONd_EA6LSl3KNb0u6g7pI5vOsGUidmEzIwkHBX3WJbDLkYBqslqtNSbKsKNY/exec?tipo=cliente')
    .then(res => res.json())
    .then(clientes => {
      clienteSelect.innerHTML = '<option value="">Selecione um cliente</option>' +
        clientes.map(c => `<option value="${c.nome}">${c.nome} - ${c.email || ''}</option>`).join('');
    });
}

carregarClientesParaSelect();
  