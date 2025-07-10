// clientes.js

document.getElementById('clienteForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const nome = document.getElementById('clienteNome').value;
  const email = document.getElementById('clienteEmail').value;
  const telefone = document.getElementById('clienteTelefone').value;
  
  // Salvar cliente na base de dados
  salvarClienteNaBase(nome, email, telefone);
});

function salvarClienteNaBase(nome, email, telefone) {
  console.log("=== DEBUG: Salvando cliente na base de dados ===");
  console.log("Nome:", nome);
  console.log("Email:", email);
  console.log("Telefone:", telefone);
  
  // Criar FormData para enviar via POST
  const formData = new FormData();
  formData.append('tipo', 'cliente');
  formData.append('nome', nome);
  formData.append('email', email);
  formData.append('telefone', telefone);

  fetch('https://script.google.com/macros/s/AKfycbxXdWDONd_EA6LSl3KNb0u6g7pI5vOsGUidmEzIwkHBX3WJbDLkYBqslqtNSbKsKNY/exec', {
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
  fetch('https://script.google.com/macros/s/AKfycbxXdWDONd_EA6LSl3KNb0u6g7pI5vOsGUidmEzIwkHBX3WJbDLkYBqslqtNSbKsKNY/exec?tipo=cliente')
    .then(res => res.json())
    .then(clientes => {
      const lista = document.getElementById('clientesLista');
      if (!clientes.length) {
        lista.innerHTML = '<p>Nenhum cliente cadastrado.</p>';
        return;
      }
      lista.innerHTML = '<ul>' + clientes.map(c => `<li><strong>${c.nome}</strong> - ${c.email || ''} ${c.telefone || ''}</li>`).join('') + '</ul>';
    });
}

carregarClientes(); 