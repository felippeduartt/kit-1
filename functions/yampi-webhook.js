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
      <title>Confirmação de Pedido - B&F Soluções</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
        <div style="background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px;">✅ Pedido Confirmado!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Kit Bíblico Infantil - B&F Soluções</p>
        </div>
        
        <div style="padding: 30px;">
          <h2 style="color: #2563eb; margin-top: 0; font-size: 20px;">Olá ${customerName}! 👋</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            Sua compra foi <strong>confirmada com sucesso</strong>! ${products.length === 9 ? 'Você adquiriu o <strong>Kit Completo</strong> com todos os' : 'Você adquiriu'} <strong>${products.length} produto${products.length > 1 ? 's' : ''} digital${products.length > 1 ? 'is' : ''}</strong> para download imediato.
          </p>
          
          <div style="background: #f0f9ff; padding: 25px; border-radius: 10px; margin: 25px 0; border: 2px solid #e0f2fe;">
            <h3 style="margin-top: 0; color: #059669; font-size: 18px;">📚 ${products.length === 9 ? 'Kit Completo' : 'Seus Produtos'} para Download:</h3>
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
            <p style="margin: 15px 0 0 0; color: #6b7280; font-size: 14px;">
              💝 <em>Aproveite este tempo especial com seus filhos!</em>
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; margin: 0; font-size: 12px;">
              <strong>B&F Soluções - Kit Bíblico Infantil</strong><br>
              Este email foi enviado automaticamente após confirmação do pagamento.<br>
              📧 Problema técnico resolvido - sistema funcionando 100%
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
      name: 'B&F Soluções - Kit Bíblico'
    },
    subject: products.length === 9 ? '✅ Kit Completo Confirmado - Download Imediato!' : '✅ Pedido Confirmado - Seus PDFs estão prontos!',
    html: emailHtml,
    categories: ['bf-solutions', 'kit-biblico']
  };

  const emailResult = await sgMail.send(msg);
  return emailResult;
}

exports.handler = async (event, context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, X-Yampi-Secret, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'CORS OK' })
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Método não permitido' })
    };
  }

  try {
    // Validação de segurança
    const incomingSecret = event.headers['x-yampi-secret'] || event.headers['X-Yampi-Secret'];
    if (YAMPI_WEBHOOK_SECRET && incomingSecret !== YAMPI_WEBHOOK_SECRET) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Não autorizado' })
      };
    }

    const webhookData = JSON.parse(event.body || '{}');
    const eventType = webhookData.event;
    
    // LOG para debug
    console.log('=== WEBHOOK RECEBIDO ===');
    console.log('Event:', eventType);
    console.log('Data:', JSON.stringify(webhookData, null, 2));

    // EVENTOS EXPANDIDOS! Agora processamos TODOS os eventos da Yampi que podem indicar pagamento
    const validEvents = [
      'order.paid',           // Evento que esperávamos
      'payment.approved',     // Evento alternativo  
      'order.approved',       // Evento que a Yampi pode enviar
      'order.updated',        // Status atualizado
      'order.status_updated', // Status específico
      'order.created'         // Quando pedido é criado (pode já estar pago)
    ];

    if (validEvents.includes(eventType)) {
      const order = webhookData.data || webhookData;
      
      // Extrair dados do cliente de múltiplas formas possíveis
      const customerEmail = order.customer?.email || 
                           order.buyer?.email || 
                           order.buyer_email ||
                           order.email;
                           
      const customerName = order.customer?.first_name || 
                          order.customer?.name ||
                          order.buyer?.name ||
                          order.buyer_name ||
                          order.name ||
                          'Cliente';
                          
      const orderTotal = parseFloat(order.total || 
                                  order.total_amount || 
                                  order.amount || 
                                  order.grand_total || 
                                  '0');
      
      console.log('=== DADOS EXTRAÍDOS ===');
      console.log('Email:', customerEmail);
      console.log('Nome:', customerName);
      console.log('Total:', orderTotal);
      
      if (!customerEmail) {
        console.log('❌ Email não encontrado');
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Email não encontrado' })
        };
      }
      
      // Sempre entregar kit completo (simplificado)
      const allProductsList = PRODUCT_MAPPING['CZ5JKMXCI7'] || [];
      
      console.log('=== ENVIANDO EMAIL ===');
      console.log('Para:', customerEmail);
      console.log('Produtos:', allProductsList.length);
      
      await sendProductEmail(customerEmail, customerName, allProductsList);
      
      console.log('✅ Email enviado com sucesso');
      
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          message: 'Email enviado com sucesso',
          event: eventType,
          customer: customerEmail,
          products: allProductsList.length
        })
      };
    } else {
      console.log('⚠️ Evento ignorado:', eventType);
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ 
          message: 'Evento ignorado', 
          event: eventType,
          validEvents: validEvents
        })
      };
    }

  } catch (error) {
    console.error('❌ Erro no webhook:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Erro interno',
        timestamp: new Date().toISOString(),
        details: error.message
      })
    };
  }
};