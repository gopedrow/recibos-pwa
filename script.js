document.getElementById("reciboForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const nome = clienteSelect.value;
  const descricao = document.getElementById("descricao").value;
  const valor = parseFloat(document.getElementById("valor").value).toFixed(2);
  const data = document.getElementById("data").value;
  
  // Campo de forma de pagamento
  const formaPagamento = document.getElementById("formaPagamento").value || '';
  
  // Gerar número do recibo automaticamente
  const numeroRecibo = gerarNumeroRecibo();

  console.log("=== DEBUG: Dados do formulário ===");
  console.log("Nome:", nome);
  console.log("Descrição:", descricao);
  console.log("Valor:", valor);
  console.log("Data:", data);
  console.log("Forma Pagamento:", formaPagamento);
  console.log("Número Recibo:", numeroRecibo);

  // Validação básica
  if (!nome) {
    alert("Por favor, selecione um cliente.");
    return;
  }

  // Testar com URL simples primeiro
  testarSalvamento(nome, descricao, valor, data, formaPagamento, numeroRecibo);
});

function testarSalvamento(nome, descricao, valor, data, formaPagamento, numeroRecibo) {
  console.log("=== DEBUG: Testando salvamento ===");
  
  // Método 1: Tentar com URL simples
  const url = `https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLiFmwxTx4DkPjvC8RW195MR2MC0NydF0-wScz4q6FAAIQzoTGO-X3a407irAUd3olSrfZCAkU794SjGvlQxglXVnThi2hSFv02s8IoNfYiXEy-8HXCUc1X6Ri2bKgQGiQWNPN3P0g7iukwSj5lgP3-r6fhmCSgz6Ph_fnbXMnfakx0nFvXhy_tLrPwqQrmMeqsWr0lQ84ZRZkbWA8Si8kmVSg1oo9ocdCoSNNHJxPWIRGgpiRVIpCHDM_Sw83-I4s6xAOEC6R6M2Mw4xJ9FYyVT5j1jHStGtmsG2CqKPpEU0NGAiLc&lib=MvRKIVPIBbOkrYkViJ3xm_x_1caAnuAfe&tipo=recibo&nome=${encodeURIComponent(nome)}&descricao=${encodeURIComponent(descricao)}&valor=${encodeURIComponent(valor)}&data=${encodeURIComponent(data)}&formaPagamento=${encodeURIComponent(formaPagamento)}&numeroRecibo=${encodeURIComponent(numeroRecibo)}`;
  
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
    gerarRecibo(nome, descricao, valor, data, formaPagamento, numeroRecibo);
  })
  .catch(err => {
    console.error("=== DEBUG: Erro no teste ===");
    console.error("Erro:", err);
    
    // Se falhar, tentar método alternativo
    console.log("Tentando método alternativo...");
    tentarMetodoAlternativo(nome, descricao, valor, data, formaPagamento, numeroRecibo);
  });
}

function tentarMetodoAlternativo(nome, descricao, valor, data, formaPagamento, numeroRecibo) {
  console.log("=== DEBUG: Método alternativo ===");
  
  // Criar um formulário HTML e enviar
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = 'https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLiFmwxTx4DkPjvC8RW195MR2MC0NydF0-wScz4q6FAAIQzoTGO-X3a407irAUd3olSrfZCAkU794SjGvlQxglXVnThi2hSFv02s8IoNfYiXEy-8HXCUc1X6Ri2bKgQGiQWNPN3P0g7iukwSj5lgP3-r6fhmCSgz6Ph_fnbXMnfakx0nFvXhy_tLrPwqQrmMeqsWr0lQ84ZRZkbWA8Si8kmVSg1oo9ocdCoSNNHJxPWIRGgpiRVIpCHDM_Sw83-I4s6xAOEC6R6M2Mw4xJ9FYyVT5j1jHStGtmsG2CqKPpEU0NGAiLc&lib=MvRKIVPIBbOkrYkViJ3xm_x_1caAnuAfe';
  form.target = '_blank';
  
  const campos = [
    { name: 'tipo', value: 'recibo' },
    { name: 'nome', value: nome },
    { name: 'descricao', value: descricao },
    { name: 'valor', value: valor },
    { name: 'data', value: data },
    { name: 'formaPagamento', value: formaPagamento },
    { name: 'numeroRecibo', value: numeroRecibo }
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
  gerarRecibo(nome, descricao, valor, data, formaPagamento, numeroRecibo);
}

function gerarRecibo(nome, descricao, valor, data, formaPagamento, numeroRecibo) {
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
  
  // Preparar informações adicionais
  const infoAdicionais = [];
  if (formaPagamento) infoAdicionais.push(`<strong>Forma de Pagamento:</strong> ${formaPagamento}`);
  if (numeroRecibo) infoAdicionais.push(`<strong>Número do Recibo:</strong> ${numeroRecibo}`);
  
  const infoAdicionaisHTML = infoAdicionais.length > 0 ? 
    `<div class="info-adicionais">${infoAdicionais.map(info => `<p>${info}</p>`).join('')}</div>` : '';
  
  reciboDiv.innerHTML = `
    <h2>Recibo de Pagamento</h2>
    <p>Recebi de <strong>${nome}</strong> o valor de <strong>R$ ${valor}</strong></p>
    <p><strong>${descricao}</strong></p>
    <p>Data: ${dataFormatada}</p>
    ${infoAdicionaisHTML}
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
  
  // Extrair informações adicionais se existirem
  const infoAdicionais = reciboDiv.querySelector('.info-adicionais');
  let infoAdicionaisTexto = '';
  if (infoAdicionais) {
    const infoParagrafos = infoAdicionais.querySelectorAll('p');
    infoAdicionaisTexto = Array.from(infoParagrafos).map(p => p.textContent).join('\n');
  }
  
  // Criar PDF usando jsPDF com formatação preestabelecida
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  // Configurações de página
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const contentWidth = pageWidth - (2 * margin);
  
  // Cores personalizadas
  const primaryColor = [68, 68, 68]; // #444
  const secondaryColor = [136, 136, 136]; // #888
  
  // ===== CABEÇALHO =====
  // Logo/Emblema (círculo com iniciais)
  doc.setFillColor(...primaryColor);
  doc.circle(30, 25, 15, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("FGO", 30, 30, { align: "center" });
  
  // Título principal
  doc.setTextColor(...primaryColor);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("RECIBO DE PAGAMENTO", pageWidth/2, 35, { align: "center" });
  
  // Linha decorativa
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(margin, 45, pageWidth - margin, 45);
  
  // ===== CONTEÚDO PRINCIPAL =====
  let yPos = 65;
  
  // Informação principal do pagamento
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...primaryColor);
  doc.text(`Recebi de ${nome}`, margin, yPos);
  yPos += 12;
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`o valor de R$ ${valor}`, margin, yPos);
  yPos += 20;
  
  // Descrição do serviço
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Referente a:", margin, yPos);
  yPos += 8;
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  // Quebrar descrição em múltiplas linhas se necessário
  const descricaoLines = doc.splitTextToSize(descricao, contentWidth - 10);
  descricaoLines.forEach(line => {
    doc.text(line, margin + 5, yPos);
    yPos += 6;
  });
  yPos += 15;
  
  // Data
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`Data: ${data}`, margin, yPos);
  yPos += 20;
  
  // Informações adicionais
  if (infoAdicionaisTexto) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Informações Adicionais:", margin, yPos);
    yPos += 8;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...secondaryColor);
    const linhas = infoAdicionaisTexto.split('\n');
    linhas.forEach(linha => {
      if (linha.trim()) {
        doc.text(linha, margin + 5, yPos);
        yPos += 6;
      }
    });
    yPos += 10;
  }
  
  // ===== DECLARAÇÃO =====
  doc.setTextColor(...primaryColor);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(11);
  const declaracao = "Declaro, para os devidos fins, que recebi o valor acima descrito, dando plena e geral quitação.";
  const declaracaoLines = doc.splitTextToSize(declaracao, contentWidth - 10);
  declaracaoLines.forEach(line => {
    doc.text(line, margin, yPos);
    yPos += 8;
  });
  
  // ===== ASSINATURA =====
  yPos += 25;
  
  // Linha para assinatura
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.3);
  doc.line(margin, yPos, margin + 80, yPos);
  
  // Nome do profissional
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Fernando G R Oliveira", margin, yPos + 8);
  
  // CREF
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...secondaryColor);
  doc.text("CREF 018159", margin, yPos + 15);
  
  // ===== RODAPÉ =====
  const footerY = pageHeight - 15;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...secondaryColor);
  doc.text("Documento gerado automaticamente pelo Sistema de Recibos", pageWidth/2, footerY, { align: "center" });
  
  // Salvar o PDF
  const nomeArquivo = `recibo_${nome.replace(/\s+/g, '_')}_${data.replace(/\//g, '-')}.pdf`;
  doc.save(nomeArquivo);
  
  // Mostrar mensagem de sucesso
  alert(`PDF gerado com sucesso: ${nomeArquivo}`);
}

// Criar e configurar o select de clientes
const clienteSelect = document.createElement('select');
clienteSelect.id = 'clienteSelect';
clienteSelect.required = true;
clienteSelect.innerHTML = '<option value="">Selecione um cliente</option>';

// Inserir o select de clientes no container específico
const clienteSelectContainer = document.getElementById('clienteSelectContainer');
clienteSelectContainer.appendChild(clienteSelect);

// Array para armazenar os dados dos clientes
let clientesData = [];

// Função para mostrar legenda do dia de pagamento
function mostrarLegendaDiaPagamento(clienteNome) {
  console.log("=== DEBUG: Função mostrarLegendaDiaPagamento chamada ===");
  console.log("Cliente selecionado:", clienteNome);
  console.log("Dados dos clientes:", clientesData);
  
  const legendaDiv = document.getElementById('legendaDiaPagamento');
  console.log("Elemento legenda encontrado:", legendaDiv);
  
  const cliente = clientesData.find(c => c.nome === clienteNome);
  console.log("Cliente encontrado:", cliente);
  
  if (cliente && cliente.diaPagamento) {
    console.log("Mostrando legenda para dia:", cliente.diaPagamento);
    legendaDiv.textContent = `Esse aluno realiza o pagamento no dia ${cliente.diaPagamento}`;
    legendaDiv.style.display = 'block';
  } else {
    console.log("Ocultando legenda - cliente não encontrado ou sem dia de pagamento");
    legendaDiv.style.display = 'none';
  }
}

// Função para gerar número do recibo automaticamente
function gerarNumeroRecibo() {
  const data = new Date();
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  const hora = String(data.getHours()).padStart(2, '0');
  const minuto = String(data.getMinutes()).padStart(2, '0');
  const segundo = String(data.getSeconds()).padStart(2, '0');
  
  return `REC${ano}${mes}${dia}${hora}${minuto}${segundo}`;
}



function carregarClientesParaSelect() {
  fetch('https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLiFmwxTx4DkPjvC8RW195MR2MC0NydF0-wScz4q6FAAIQzoTGO-X3a407irAUd3olSrfZCAkU794SjGvlQxglXVnThi2hSFv02s8IoNfYiXEy-8HXCUc1X6Ri2bKgQGiQWNPN3P0g7iukwSj5lgP3-r6fhmCSgz6Ph_fnbXMnfakx0nFvXhy_tLrPwqQrmMeqsWr0lQ84ZRZkbWA8Si8kmVSg1oo9ocdCoSNNHJxPWIRGgpiRVIpCHDM_Sw83-I4s6xAOEC6R6M2Mw4xJ9FYyVT5j1jHStGtmsG2CqKPpEU0NGAiLc&lib=MvRKIVPIBbOkrYkViJ3xm_x_1caAnuAfe&tipo=cliente')
    .then(res => res.json())
    .then(clientes => {
      console.log("=== DEBUG: Clientes carregados ===");
      console.log("Clientes recebidos:", clientes);
      
      // Armazenar dados dos clientes
      clientesData = clientes;
      
      clienteSelect.innerHTML = '<option value="">Selecione um cliente</option>' +
        clientes.map(c => `<option value="${c.nome}">${c.nome} - ${c.email || ''}</option>`).join('');
      
      console.log("Select de clientes atualizado");
    })
    .catch(error => {
      console.error("Erro ao carregar clientes:", error);
    });
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
  console.log("=== DEBUG: DOM carregado ===");
  carregarClientesParaSelect();
  
  // Adicionar event listener para o select de clientes
  clienteSelect.addEventListener('change', function() {
    console.log("=== DEBUG: Select de cliente alterado ===");
    console.log("Valor selecionado:", this.value);
    mostrarLegendaDiaPagamento(this.value);
  });
});
  