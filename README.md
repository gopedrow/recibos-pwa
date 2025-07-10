# 📄 Sistema de Recibos

Sistema web para geração e gestão de recibos de pagamento, integrado com Google Sheets.

## ✨ Funcionalidades

- 📝 **Geração de recibos** com dados do cliente
- 👥 **Gestão de clientes** (cadastro, edição, exclusão)
- 📊 **Histórico de recibos** com filtros por cliente
- 📱 **PWA (Progressive Web App)** - instale na tela inicial
- 📄 **Exportação para PDF** dos recibos
- ☁️ **Integração com Google Sheets** para armazenamento

## 🛠️ Tecnologias

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** Google Apps Script
- **Armazenamento:** Google Sheets
- **PWA:** Service Worker, Web App Manifest
- **PDF:** jsPDF

## 🚀 Como Usar

### **1. Configuração do Google Sheets:**
1. Crie uma nova planilha no Google Sheets
2. Crie duas abas: "Clientes" e "Recibos"
3. Configure o Google Apps Script (veja instruções abaixo)

### **2. Deploy:**
1. Faça upload dos arquivos para GitHub Pages, Netlify ou similar
2. Atualize as URLs do Google Apps Script no código
3. Acesse o app pelo navegador

### **3. Instalação como PWA:**
- **Android:** Toque em "Adicionar à tela inicial"
- **iOS:** Toque em "Compartilhar" → "Adicionar à tela inicial"

## 📋 Estrutura do Projeto

```
recibos-app/
├── index.html          # Página principal (gerar recibos)
├── clientes.html       # Gestão de clientes
├── recibos.html        # Histórico de recibos
├── style.css           # Estilos CSS
├── script.js           # Lógica principal
├── clientes.js         # Lógica de clientes
├── recibos.js          # Lógica de histórico
├── manifest.json       # Configuração PWA
├── sw.js              # Service Worker
└── favicon.ico        # Ícone do app
```

## 🔧 Configuração do Google Apps Script

### **1. Criar o Script:**
1. Acesse [script.google.com](https://script.google.com)
2. Crie um novo projeto
3. Cole o código do arquivo `google-scripts/appscript.gs`

### **2. Deploy:**
1. Clique em "Deploy" → "New deployment"
2. Escolha "Web app"
3. Configure as permissões
4. Copie a URL gerada

### **3. Atualizar URLs:**
Substitua as URLs no código JavaScript pelos seus endpoints do Google Apps Script.

## 📱 Características PWA

- ✅ **Instalável** na tela inicial
- ✅ **Funciona offline** (cache básico)
- ✅ **Tela cheia** sem barra do navegador
- ✅ **Responsivo** para todos os dispositivos
- ✅ **Sem zoom** - comportamento de app nativo

## 🎨 Design

- **Paleta:** Tons de cinza elegantes
- **Fontes:** Montserrat (interface) + Dancing Script (títulos)
- **Layout:** Responsivo e moderno
- **UX:** Botões circulares com ícones SVG

## 📄 Licença

Este projeto é de uso livre para fins educacionais e comerciais.

## 🤝 Contribuição

Sinta-se à vontade para contribuir com melhorias e correções!

---

**Desenvolvido com ❤️ para facilitar a gestão de recibos** 