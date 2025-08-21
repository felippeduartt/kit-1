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
    </div>
  `).join('');

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmação de Pedido</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
        <div style="background: #f8f9fa; padding: 30px; text-align: center; border-bottom: 3px solid #2563eb;">
          <h1 style="color: #1f2937; margin: 0; font-size: 24px;">Confirmação de Pedido</h1>
          <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 16px;">Kit Bíblico Infantil</p>
        </div>
        
        <div style="padding: 30px;">
          <h2 style="color: #2563eb; margin-top: 0; font-size: 20px;">Olá ${customerName}!</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            Sua compra foi confirmada com sucesso! ${products.length === 9 ? 'Você adquiriu o Kit Completo com todos os' : 'Você adquiriu'} ${products.length} produto${products.length > 1 ? 's' : ''} digital${products.length > 1 ? 'is' : ''}.
          </p>
          
          <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 25px 0;">
            <h3 style="margin-top: 0; color: #059669; font-size: 18px;">📚 ${products.length === 9 ? 'Kit Completo' : 'Seus Produtos'} para Download:</h3>
            ${productButtons}
          </div>
          
          <div style="background: #eff6ff; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
            <h4 style="margin-top: 0; color: #1e40af;">💡 Instruções:</h4>
            <ul style="color: #374151; margin: 10px 0;">
              <li>Clique no botão "Download PDF" de cada produto</li>
              <li>Salve os arquivos em seu dispositivo</li>
              <li>Imprima quantas vezes desejar</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; margin: 0;">
              <strong>B&F Soluções - Kit Bíblico Infantil</strong><br>
              Este email foi enviado automaticamente após confirmação do pagamento.
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
    subject: products.length === 9 ? 'Confirmação de Pedido - Kit Completo' : 'Confirmação de Pedido - Kit Bíblico',
    html: emailHtml
  };

  return await sgMail.send(msg);
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
      body: JSON.stringify({ message: 'CORS preflight OK' })
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Método não permitido. Use POST.' })
    };
  }

  try {
    // ✅ NOVA VALIDAÇÃO DE SEGURANÇA (do ChatGPT)
    const incomingSecret = event.headers['x-yampi-secret'] || event.headers['X-Yampi-Secret'];
    
    console.log('=== SECURITY CHECK ===');
    console.log('Expected secret:', YAMPI_WEBHOOK_SECRET ? '***configurado***' : 'não configurado');
    console.log('Incoming secret:', incomingSecret ? '***recebido***' : 'não recebido');
    
    if (YAMPI_WEBHOOK_SECRET && incomingSecret !== YAMPI_WEBHOOK_SECRET) {
      console.log('❌ SECURITY: Chave secreta inválida');
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Chave secreta inválida' })
      };
    }
    
    console.log('✅ SECURITY: Validação de segurança passou');

    // Log completo do evento recebido
    console.log('=== WEBHOOK DEBUG START ===');
    console.log('Raw event body:', event.body);
    console.log('Event headers:', JSON.stringify(event.headers, null, 2));
    console.log('HTTP Method:', event.httpMethod);
    console.log('Timestamp:', new Date().toISOString());
    
    if (!SENDGRID_API_KEY) {
      console.log('ERROR: SENDGRID_API_KEY não configurado');
      throw new Error('SENDGRID_API_KEY não configurado');
    }

    const webhookData = JSON.parse(event.body);
    console.log('Parsed webhook data:', JSON.stringify(webhookData, null, 2));

    if (webhookData.event === 'order.paid' || webhookData.event === 'payment.approved') {
      const order = webhookData.data || webhookData;
      const customerEmail = order.customer?.email || order.buyer_email;
      const customerName = order.customer?.first_name || order.customer?.name || order.buyer_name || 'Cliente';
      const orderTotal = parseFloat(order.total) || 0;
      const orderItems = order.items || [];
      
      if (!customerEmail) {
        console.log('Email do cliente não encontrado');
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Email do cliente não encontrado' })
        };
      }
      
      // CORREÇÃO CRÍTICA: Determinar produtos baseado no valor
      const allProductsList = PRODUCT_MAPPING['CZ5JKMXCI7'] || [];
      let products = [];
      
      if (orderTotal >= 40) {
        // Kit completo: todos os 9 produtos
        products = allProductsList;
        console.log('🎯 Kit Completo detectado (R$', orderTotal, ') - enviando', products.length, 'produtos');
      } else {
        // Produto individual: APENAS 1 produto específico
        if (orderItems && orderItems.length > 0) {
          // Mapear produto específico baseado nos items do pedido
          const itemName = (orderItems[0].product?.name || orderItems[0].name || '').toLowerCase();
          
          // Buscar produto correspondente
          const matchedProduct = allProductsList.find(product => {
            const productName = product.name.toLowerCase();
            return productName.includes(itemName) || 
                   itemName.includes(productName) ||
                   itemName.includes('alegria') && productName.includes('alegria') ||
                   itemName.includes('orar') && productName.includes('orar') ||
                   itemName.includes('amor') && productName.includes('amor') ||
                   itemName.includes('jesus') && productName.includes('jesus') ||
                   itemName.includes('passatempo') && productName.includes('passatempo') ||
                   itemName.includes('aventura') && productName.includes('aventura') ||
                   itemName.includes('alfabeto') && productName.includes('alfabeto') ||
                   itemName.includes('colorin') && productName.includes('colorin') ||
                   itemName.includes('atividade') && productName.includes('atividade');
          });
          
          products = matchedProduct ? [matchedProduct] : [allProductsList[0]];
          console.log('🎯 Produto Individual detectado (R$', orderTotal, ') - produto:', products[0].name);
        } else {
          // Fallback: primeiro produto da lista
          products = [allProductsList[0]];
          console.log('🎯 Produto Individual detectado (R$', orderTotal, ') - produto padrão');
        }
      }
      
      console.log('=== EMAIL SENDING START ===');
      console.log('Customer Email:', customerEmail);
      console.log('Customer Name:', customerName);
      console.log('Products Count:', products.length);
      console.log('Products List:', products.map(p => p.name));
      console.log('Order Total:', orderTotal);
      
      const emailResult = await sendProductEmail(customerEmail, customerName, products);
      console.log('=== EMAIL RESULT ===');
      console.log('SendGrid Response:', JSON.stringify(emailResult, null, 2));
      console.log('Email Status Code:', emailResult[0].statusCode);
      console.log('=== WEBHOOK DEBUG END ===');
      
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          message: 'Email enviado com sucesso',
          customer: customerEmail,
          products: products.length
        })
      };
    }

    console.log('Evento ignorado:', webhookData.event);
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Webhook processado - evento ignorado' })
    };

  } catch (error) {
    console.error('=== WEBHOOK ERROR ===');
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    console.error('Raw Event Body:', event.body);
    console.error('=== WEBHOOK ERROR END ===');
    
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: 'Erro no processamento do webhook',
        details: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};