# 🚀 BF Solutions - Deploy GitHub/Netlify

## Sistema E-commerce Bíblico Infantil

**Status:** ✅ Funcionando (2.847+ vendas)  
**Tecnologia:** React + Netlify Functions + SendGrid  
**Email:** Automático com links Google Drive reais

---

## 📦 CONTEÚDO

```
bf-solutions-github/
├── index.html          # Site compilado (3.8KB)
├── assets/             # CSS + JS (513KB)
├── functions/          # Netlify Functions
│   ├── yampi-webhook.js    # Webhook + SendGrid
│   └── test.js             # Validação
├── netlify.toml        # Config Netlify
├── package.json        # Deps SendGrid
└── README.md          # Este arquivo
```

---

## 🚀 DEPLOY RÁPIDO

### 1. GitHub
- Criar repo: `bf-solutions-netlify`
- Upload todos os arquivos
- Commit: "Deploy sistema funcionando"

### 2. Netlify
- Import from Git → GitHub
- Selecionar repositório
- Deploy automaticamente

### 3. Variáveis
```env
SENDGRID_API_KEY = SG.xxxxxxxx...
FROM_EMAIL = contato@seudominio.com
```

### 4. Webhook Yampi
```
URL: https://seudominio.netlify.app/.netlify/functions/yampi-webhook
Eventos: payment.approved, order.paid
```

---

## ✅ VALIDAÇÃO

**Site:** `https://seudominio.netlify.app`  
**Test:** `/.netlify/functions/test`  
**Webhook:** Funciona com compras reais

---

## 📞 SUPORTE

WhatsApp: +55 11 99258-4644  
Email: contato@befmarket.store

**Deploy em 5 minutos → Sistema vendendo!**