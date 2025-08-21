# Kit Bíblico Infantil - Webhook Yampi

## 🎯 Objetivo
Sistema de entrega automática de produtos digitais via webhook Yampi + SendGrid.

## 📦 Conteúdo
- **Webhook**: `netlify/functions/yampi-webhook.js` (ultra-robusto)
- **Config**: `netlify.toml` (configuração Netlify)
- **Deps**: `package.json` (dependências SendGrid)

## 🚀 Deploy Netlify

### 1. Configurar Variáveis de Ambiente:
```
SENDGRID_API_KEY=SG.xxxxx
FROM_EMAIL=contato@befmarket.store
YAMPI_WEBHOOK_SECRET=TTiykXpwLwI7tYx0Jk8M0OYzBQT1dP5KhQjU6BAp
```

### 2. Deploy:
- Conectar repositório GitHub ao Netlify
- Configurar build command: `echo "Webhook only"`
- Publish directory: `netlify/functions`

## 🎯 Estrutura Yampi Esperada:
```json
{
  "event": "order.paid",
  "resource": {
    "customer": {
      "email": "cliente@exemplo.com",
      "first_name": "Nome"
    },
    "total": 47
  }
}
```

## ✅ Produtos Configurados (9):
1. Kit Infantil Completo (3-5 anos)
2. Kit Infantil Avançado (6-8 anos)
3. Kit Pré-Adolescente (9-12 anos)
4. Atividades de Pintura Bíblica
5. Quebra-Cabeças Bíblicos
6. Caça-Palavras Cristão
7. Labirintos da Fé
8. Desenhos para Colorir
9. Versículos Ilustrados

---
**Status**: Webhook corrigido para estrutura real do Yampi