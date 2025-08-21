const sgMail = require('@sendgrid/mail');

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'contato@befmarket.store';

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

const PRODUCT_MAPPING = {
  'CZ5JKMXCI7': [
    { name: 'Aprendendo com Alegria', googleDriveId: '1CEtVnpyKUXXDKnlOt_tpHfUVElbwyf1I', icon: '📚' },
    { name: 'Aprendendo a Orar', googleDriveId: '14r4qCfvQ5Aw-26BmahMRhZITUCrtmMtY', icon: '🙏' },
    { name: 'O Amor de Deus', googleDriveId: '12cKZmzScN4dqGuJDlVP4dN_REBZhpn-Y', icon: '❤️' },
    { name: 'Andando com Jesus', googleDriveId: '1N3YipbKazlgJSCeA2XGFaI9e4C2bfHYC', icon: '✝️' },
    { name: 'Passatempo Bíblico', googleDriveId: '1tpHcCxO0UxRiJvQY3VM-u1qea1vwpR0V', icon: '🎯' },
    { name: 'Aventuras Bíblicas', googleDriveId: '1WlmpV0UQCq5ulSVN60Ej359GxlvYKq0F', icon: '🗺️' },
    { name: 'Alfabeto Bíblico', googleDriveId: '1jTuy3HTvWk9e0i8cajYP1eoGA3rj1CWh', icon: '🔤' },
    { name: 'Colorindo com Propósito', googleDriveId: '1L6zq2gpKwbDk1YTkbOZBfObqAJzjTb0o', icon: '🎨' },
    { name: 'Atividades Bíblicas', googleDriveId: '1HU2kaJf43SayRk-JrgOjnX6nWcMq9HKD', icon: '📝' }
  ]
};

async function sendProductEmail(customerEmail, customerName, products) {
  const productButtons = products.map(product => `
    <div style="margin: 15px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #2563eb;">
      <div style="display: flex; align-items: center; margin-bottom: 10px;">
        <span style="font-size: 24px; margin-right: 10px;">${product.icon}</span>
        <h4 style="margin: 0; color: #2563eb;">${product.name}</h4>
      </div>
      <a href="https://drive.google.com/uc?export=download&id=${product.googleDriveId}" 
         style="display: inline-block; background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">
        📥 Download PDF
      </a>
      <p style="margin: 8px 0 0 0; font-size: 12px; color: #6b7280;">
        Link alternativo: <a href="https://drive.google.com/file/d/${product.googleDriveId}/view" style="color: #2563eb;">Visualizar no Drive</a>
      </p>
    </div>
  `).join('');

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>🚨 ENTREGA MANUAL - B&F Soluções</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
        <div style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px;">🚨 ENTREGA MANUAL ATIVADA</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Kit Bíblico - Problemas no sistema automático resolvidos</p>
        </div>
        
        <div style="padding: 30px;">
          <h2 style="color: #dc2626; margin-top: 0; font-size: 20px;">Olá ${customerName}! 👋</h2>
          
          <div style="background: #fef2f2; padding: 20px; border-radius: 8px; border-left: 4px solid #dc2626; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #dc2626;">⚠️ Pedido de Desculpas</h4>
            <p style="color: #7f1d1d; margin: 0; line-height: 1.5;">
              Detectamos que houve um problema técnico em nosso sistema automático de entrega. 
              Para garantir que você receba seus produtos, estamos enviando manualmente.
            </p>
          </div>
          
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            Sua compra foi <strong>confirmada com sucesso</strong>! Você adquiriu o <strong>Kit Completo</strong> com todos os <strong>${products.length} produtos digitais</strong> para download imediato.
          </p>
          
          <div style="background: #f0f9ff; padding: 25px; border-radius: 10px; margin: 25px 0; border: 2px solid #3b82f6;">
            <h3 style="margin-top: 0; color: #059669; font-size: 18px;">📚 Seu Kit Completo para Download:</h3>
            ${productButtons}
          </div>
          
          <div style="background: #eff6ff; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
            <h4 style="margin-top: 0; color: #1e40af;">💡 Como baixar seus PDFs:</h4>
            <ol style="color: #374151; margin: 10px 0; line-height: 1.5;">
              <li>Clique no botão <strong>"📥 Download PDF"</strong> de cada produto</li>
              <li>Se não funcionar, use o link alternativo "Visualizar no Drive"</li>
              <li>Salve os arquivos em seu dispositivo</li>
              <li>Imprima quantas vezes desejar - não há limite!</li>
            </ol>
          </div>
          
          <div style="background: #dcfdf7; padding: 20px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #059669;">
            <h4 style="margin-top: 0; color: #059669;">✅ Sistema Corrigido</h4>
            <p style="margin: 0; color: #065f46;">
              Já corrigimos o problema técnico. Suas próximas compras funcionarão automaticamente. 
              Obrigado pela paciência! 🙏
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; margin: 0; font-size: 12px;">
              <strong>B&F Soluções - Kit Bíblico Infantil</strong><br>
              Entrega manual executada em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}<br>
              📧 Email enviado diretamente após detecção do problema técnico.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const msg = {
    to: customerEmail,
    from: {
      email: FROM_EMAIL,
      name: 'B&F Soluções - ENTREGA MANUAL'
    },
    subject: '🚨 ENTREGA MANUAL - Seus PDFs estão aqui! (Sistema corrigido)',
    html: emailHtml,
    categories: ['bf-solutions', 'entrega-manual', 'problema-tecnico']
  };

  const emailResult = await sgMail.send(msg);
  return emailResult;
}

exports.handler = async (event, context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ message: 'CORS OK' }) };
  }

  try {
    let customerEmail, customerName;
    
    if (event.httpMethod === 'POST' && event.body) {
      const data = JSON.parse(event.body);
      customerEmail = data.email;
      customerName = data.name || 'Cliente';
    } else {
      // Parametros via query para GET
      customerEmail = event.queryStringParameters?.email;
      customerName = event.queryStringParameters?.name || 'Cliente';
    }
    
    if (!customerEmail) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ 
          error: 'Email necessário', 
          usage: 'POST: {"email":"email@example.com","name":"Nome"} ou GET: ?email=email@example.com&name=Nome'
        })
      };
    }
    
    const allProducts = PRODUCT_MAPPING['CZ5JKMXCI7'] || [];
    
    console.log('=== ENTREGA MANUAL ATIVADA ===');
    console.log('Email:', customerEmail);
    console.log('Nome:', customerName);
    console.log('Produtos:', allProducts.length);
    
    await sendProductEmail(customerEmail, customerName, allProducts);
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        message: 'Entrega manual realizada com sucesso',
        customer: customerEmail,
        products: allProducts.length,
        timestamp: new Date().toISOString(),
        note: 'Email de entrega manual enviado devido a problema técnico detectado'
      })
    };
    
  } catch (error) {
    console.error('Erro na entrega manual:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: 'Erro na entrega manual',
        details: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};