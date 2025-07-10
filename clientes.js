// clientes.js

document.getElementById('clienteForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const telefone = document.getElementById('telefone').value;
  const cpfCnpj = document.getElementById('cpfCnpj').value || '';
  
  // Salvar cliente na base de dados
  salvarClienteNaBase(nome, email, telefone, cpfCnpj);
});

function salvarClienteNaBase(nome, email, telefone, cpfCnpj) {
  console.log("=== DEBUG: Salvando cliente na base de dados ===");
  console.log("Nome:", nome);
  console.log("Email:", email);
  console.log("Telefone:", telefone);
  console.log("CPF/CNPJ:", cpfCnpj);
  
  // Criar FormData para enviar via POST
  const formData = new FormData();
  formData.append('tipo', 'cliente');
  formData.append('nome', nome);
  formData.append('email', email);
  formData.append('telefone', telefone);
  formData.append('cpfCnpj', cpfCnpj);

  fetch('https://script.google.com/macros/s/AKfycbz6nYJc9EbVOc72Hnehx_Zv3TFkLKgmFVeMcqTBRIfnHHaeDn7GwzTrX5rpDl-N_AEl/exec', {
    method: 'POST',
    body: formData
  })
    .then(res => {
      console.log("=== DEBUG: Resposta do servidor ===");
      console.log("Status:", res.status);
      console.log("OK:", res.ok);
      
      if (!res.ok) {
        throw new Error(`Erro HTTP: ${res.status}`);
      }
      
      return res.text();
    })
    .then(responseText => {
      console.log("=== DEBUG: Resposta em texto ===");
      console.log("Resposta:", responseText);
      
      // Se chegou até aqui, o salvamento foi bem-sucedido
      console.log("=== DEBUG: Cliente salvo com sucesso na base de dados ===");
      
      alert('Cliente cadastrado com sucesso na base de dados!');
      document.getElementById('clienteForm').reset();
      carregarClientes();
    })
    .catch(err => {
      console.error("=== DEBUG: Erro ao salvar cliente ===");
      console.error("Erro:", err);
      alert(`Erro ao cadastrar cliente na base de dados: ${err.message}`);
    });
}

function carregarClientes() {
  fetch('https://script.google.com/macros/s/AKfycbz6nYJc9EbVOc72Hnehx_Zv3TFkLKgmFVeMcqTBRIfnHHaeDn7GwzTrX5rpDl-N_AEl/exec?tipo=cliente')
    .then(res => res.json())
    .then(clientes => {
      const lista = document.getElementById('clientesLista');
      if (!clientes.length) {
        lista.innerHTML = '<p>Nenhum cliente cadastrado.</p>';
        return;
      }
      lista.innerHTML = '<ul>' + clientes.map(c => `<li><strong>${c.nome}</strong> - ${c.email || ''} ${c.telefone || ''} ${c.cpfCnpj ? `(${c.cpfCnpj})` : ''}</li>`).join('') + '</ul>';
    });
}

carregarClientes(); 