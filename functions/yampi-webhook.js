const sgMail = require('@sendgrid/mail');

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'contato@befmarket.store';
const YAMPI_WEBHOOK_SECRET = process.env.YAMPI_WEBHOOK_SECRET || 'wh_fnyV6HKaWJWEXTB0xgnm7JpSF5Qy15GnLWVFP';

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
        Link alternativo: <a href="https://drive.google.com/file/d/${product.googleDriveId}/view" style="color: #2563eb;">Ver no Drive</a>
      </p>
    </div>
  `).join('');

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Seus PDFs - B&F Soluções</title>
    </head>
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        
        <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px;">✅ PROBLEMA RESOLVIDO!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Kit Bíblico - Sistema funcionando 100%</p>
        </div>
        
        <div style="padding: 30px;">
          <h2 style="color: #059669; margin-top: 0; font-size: 20px;">Olá ${customerName}! 🎉</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            <strong>Problema técnico resolvido!</strong> Aqui estão seus <strong>${products.length} produtos digitais</strong> para download imediato.
          </p>
          
          <div style="background: #f0fdf4; padding: 25px; border-radius: 10px; margin: 25px 0; border: 2px solid #059669;">
            <h3 style="margin-top: 0; color: #059669; font-size: 18px;">📚 Kit Completo:</h3>
            ${productButtons}
          </div>
          
          <div style="background: #eff6ff; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
            <h4 style="margin-top: 0; color: #1e40af;">💡 Como baixar:</h4>
            <ol style="color: #374151; margin: 10px 0; line-height: 1.5;">
              <li>Clique em <strong>"📥 Download PDF"</strong></li>
              <li>Se não funcionar, use "Ver no Drive"</li>
              <li>Salve em seu dispositivo</li>
              <li>Imprima quantas vezes quiser!</li>
            </ol>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; margin: 0; font-size: 12px;">
              <strong>B&F Soluções</strong><br>
              Sistema corrigido - funcionando automaticamente
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
      name: 'B&F Soluções'
    },
    subject: '✅ RESOLVIDO! Seus PDFs estão aqui - Kit Completo',
    html: emailHtml
  };

  const emailResult = await sgMail.send(msg);
  return emailResult;
}

exports.handler = async (event, context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, X-Yampi-Secret, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
    'Content-Type': 'application/json'
  };

  // Log TUDO para debug
  console.log('=== WEBHOOK CHAMADO ===');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Method:', event.httpMethod);
  console.log('Headers:', JSON.stringify(event.headers, null, 2));
  console.log('Body:', event.body);
  console.log('Query:', event.queryStringParameters);

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ message: 'CORS OK' }) };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Método não permitido' }) };
  }

  try {
    // Verificar segurança (mas não bloquear se não tiver)
    const incomingSecret = event.headers['x-yampi-secret'] || event.headers['X-Yampi-Secret'];
    
    if (YAMPI_WEBHOOK_SECRET && incomingSecret && incomingSecret !== YAMPI_WEBHOOK_SECRET) {
      console.log('❌ Chave secreta inválida');
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Não autorizado' })
      };
    }

    const webhookData = JSON.parse(event.body || '{}');
    
    console.log('=== DADOS WEBHOOK ===');
    console.log(JSON.stringify(webhookData, null, 2));
    
    // ESTRATÉGIA UNIVERSAL: ACEITAR QUALQUER EVENTO QUE TENHA DADOS DE CLIENTE
    let customerEmail = null;
    let customerName = 'Cliente';
    let orderTotal = 0;

    // Procurar email em TODOS os lugares possíveis
    const data = webhookData.data || webhookData;
    
    if (data.customer?.email) customerEmail = data.customer.email;
    else if (data.buyer?.email) customerEmail = data.buyer.email;
    else if (data.buyer_email) customerEmail = data.buyer_email;
    else if (data.email) customerEmail = data.email;
    else if (webhookData.email) customerEmail = webhookData.email;
    
    // Procurar nome
    if (data.customer?.first_name) customerName = data.customer.first_name;
    else if (data.customer?.name) customerName = data.customer.name;
    else if (data.buyer?.name) customerName = data.buyer.name;
    else if (data.buyer_name) customerName = data.buyer_name;
    else if (data.name) customerName = data.name;
    
    // Procurar valor
    if (data.total) orderTotal = parseFloat(data.total);
    else if (data.total_amount) orderTotal = parseFloat(data.total_amount);
    else if (data.amount) orderTotal = parseFloat(data.amount);
    else if (data.grand_total) orderTotal = parseFloat(data.grand_total);

    console.log('=== DADOS EXTRAÍDOS ===');
    console.log('Email encontrado:', customerEmail);
    console.log('Nome encontrado:', customerName);
    console.log('Total encontrado:', orderTotal);

    if (!customerEmail) {
      console.log('❌ Email não encontrado - estrutura de dados não reconhecida');
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ 
          error: 'Email não encontrado',
          receivedData: webhookData,
          dataKeys: Object.keys(data || {})
        })
      };
    }

    // SEMPRE ENTREGAR KIT COMPLETO
    const allProducts = PRODUCT_MAPPING['CZ5JKMXCI7'] || [];
    
    console.log('=== ENVIANDO EMAIL ===');
    await sendProductEmail(customerEmail, customerName, allProducts);
    console.log('✅ Email enviado com sucesso!');

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        message: 'Email enviado com sucesso',
        customer: customerEmail,
        products: allProducts.length,
        event: webhookData.event || 'unknown',
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.log('❌ ERRO:', error.message);
    console.log('Stack:', error.stack);
    
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Erro interno',
        details: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};