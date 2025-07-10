let recibosPorCliente = {};
let todosRecibos = [];

// Carregar recibos e clientes
function carregarDados() {
  // Carregar recibos
  fetch("https://script.google.com/macros/s/AKfycbxXdWDONd_EA6LSl3KNb0u6g7pI5vOsGUidmEzIwkHBX3WJbDLkYBqslqtNSbKsKNY/exec")
    .then(res => res.json())
    .then(dados => {
      todosRecibos = dados;
      recibosPorCliente = {};
      dados.forEach(linha => {
        if (!recibosPorCliente[linha.nome]) recibosPorCliente[linha.nome] = [];
        recibosPorCliente[linha.nome].push(linha);
      });
      renderizarClientesRecibos();
    });

  // Carregar clientes para o filtro
  fetch('https://script.google.com/macros/s/AKfycbxXdWDONd_EA6LSl3KNb0u6g7pI5vOsGUidmEzIwkHBX3WJbDLkYBqslqtNSbKsKNY/exec?tipo=cliente')
    .then(res => res.json())
    .then(clientes => {
      const filtroSelect = document.getElementById('filtroCliente');
      filtroSelect.innerHTML = '<option value="">Todos os clientes</option>' +
        clientes.map(c => `<option value="${c.nome}">${c.nome}</option>`).join('');
    });
}

function renderizarClientesRecibos(clienteFiltro = '') {
  const tbody = document.querySelector("#tabelaRecibos tbody");
  tbody.innerHTML = '';
  
  let recibosParaMostrar = [];
  
  if (clienteFiltro) {
    // Mostrar apenas recibos do cliente selecionado
    if (recibosPorCliente[clienteFiltro]) {
      recibosParaMostrar = recibosPorCliente[clienteFiltro];
    }
  } else {
    // Mostrar todos os recibos
    Object.keys(recibosPorCliente).forEach(cliente => {
      recibosParaMostrar = recibosParaMostrar.concat(recibosPorCliente[cliente]);
    });
  }
  
  if (recibosParaMostrar.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">Nenhum recibo encontrado.</td></tr>';
    return;
  }
  
  // Agrupar por cliente se não houver filtro
  if (!clienteFiltro) {
    Object.keys(recibosPorCliente).forEach(cliente => {
      const trCliente = document.createElement('tr');
      trCliente.innerHTML = `<td colspan="5" style="background:#f0f0f0;color:#444;font-weight:700;border-radius:12px;">${cliente}</td>`;
      tbody.appendChild(trCliente);
      
      recibosPorCliente[cliente].forEach(linha => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${linha.nome}</td>
          <td>${linha.descricao}</td>
          <td>R$ ${linha.valor}</td>
          <td>${formatarData(linha.data)}</td>
          <td>${formatarInformacoesAdicionais(linha)}</td>
        `;
        tbody.appendChild(tr);
      });
    });
  } else {
    // Mostrar apenas recibos do cliente filtrado
    recibosParaMostrar.forEach(linha => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${linha.nome}</td>
        <td>${linha.descricao}</td>
        <td>R$ ${linha.valor}</td>
        <td>${formatarData(linha.data)}</td>
        <td>${formatarInformacoesAdicionais(linha)}</td>
      `;
      tbody.appendChild(tr);
    });
  }
}

function formatarData(data) {
  try {
    if (data) {
      const [ano, mes, dia] = data.split('-');
      if (ano && mes && dia) {
        return `${dia}/${mes}/${ano}`;
      } else {
        const dataObj = new Date(data);
        if (!isNaN(dataObj.getTime())) {
          return dataObj.toLocaleDateString('pt-BR');
        }
      }
    }
  } catch (error) {
    console.error("Erro ao formatar data:", error);
  }
  return data || "Data não informada";
}

function formatarInformacoesAdicionais(linha) {
  const info = [];
  
  if (linha.nomePagador) info.push(`Pagador: ${linha.nomePagador}`);
  if (linha.cpfCnpjPagador) info.push(`CPF/CNPJ Pagador: ${linha.cpfCnpjPagador}`);
  if (linha.nomeRecebedor) info.push(`Recebedor: ${linha.nomeRecebedor}`);
  if (linha.cpfCnpjRecebedor) info.push(`CPF/CNPJ Recebedor: ${linha.cpfCnpjRecebedor}`);
  if (linha.formaPagamento) info.push(`Forma: ${linha.formaPagamento}`);
  if (linha.numeroRecibo) info.push(`Nº: ${linha.numeroRecibo}`);
  
  return info.length > 0 ? info.join('<br>') : '-';
}

// Event listener para o filtro de cliente
document.addEventListener('DOMContentLoaded', function() {
  carregarDados();
  
  document.getElementById('filtroCliente').addEventListener('change', function(e) {
    renderizarClientesRecibos(e.target.value);
  });
}); 