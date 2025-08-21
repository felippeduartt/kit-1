const sgMail = require('@sendgrid/mail');

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'contato@befmarket.store';
const YAMPI_WEBHOOK_SECRET = process.env.YAMPI_WEBHOOK_SECRET || 'wh_fnyV6HKaWJWEXTB0xgnm7JpSF5Qy15GnLWVFP';

// Configurar SendGrid se disponível
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

function logDebug(section, data) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] === ${section} ===`;
  console.log(logEntry);
  
  if (typeof data === 'object') {
    console.log(JSON.stringify(data, null, 2));
  } else {
    console.log(data);
  }
  console.log('='.repeat(logEntry.length));
}

async function sendProductEmail(customerEmail, customerName, products) {
  logDebug('EMAIL PREPARATION', {
    customerEmail,
    customerName,
    productsCount: products.length,
    products: products.map(p => ({ name: p.name, id: p.googleDriveId }))
  });

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

  logDebug('EMAIL MESSAGE', { to: msg.to, from: msg.from, subject: msg.subject });

  try {
    const emailResult = await sgMail.send(msg);
    logDebug('EMAIL SUCCESS', { statusCode: emailResult[0].statusCode, messageId: emailResult[0].headers['x-message-id'] });
    return emailResult;
  } catch (error) {
    logDebug('EMAIL ERROR', { message: error.message, code: error.code, response: error.response?.body });
    throw error;
  }
}

exports.handler = async (event, context) => {
  const startTime = Date.now();
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, X-Yampi-Secret, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  logDebug('WEBHOOK START', {
    timestamp: new Date().toISOString(),
    httpMethod: event.httpMethod,
    url: event.path,
    userAgent: event.headers['user-agent'],
    contentLength: event.headers['content-length']
  });

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'CORS preflight OK' })
    };
  }

  if (event.httpMethod !== 'POST') {
    logDebug('HTTP METHOD ERROR', { received: event.httpMethod, expected: 'POST' });
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Método não permitido. Use POST.' })
    };
  }

  try {
    // DEBUGGING ENVIRONMENT VARIABLES
    logDebug('ENVIRONMENT CHECK', {
      SENDGRID_API_KEY: SENDGRID_API_KEY ? `***CONFIGURADO*** (${SENDGRID_API_KEY.length} chars)` : '❌ NÃO CONFIGURADO',
      FROM_EMAIL: FROM_EMAIL,
      YAMPI_WEBHOOK_SECRET: YAMPI_WEBHOOK_SECRET ? `***CONFIGURADO*** (${YAMPI_WEBHOOK_SECRET.length} chars)` : '❌ NÃO CONFIGURADO',
      NODE_ENV: process.env.NODE_ENV || 'undefined',
      region: process.env.AWS_REGION || context.awsRequestId?.slice(0, 8) || 'unknown'
    });

    // SECURITY VALIDATION
    const incomingSecret = event.headers['x-yampi-secret'] || event.headers['X-Yampi-Secret'];
    logDebug('SECURITY CHECK', {
      expectedSecret: YAMPI_WEBHOOK_SECRET ? '***CONFIGURADO***' : 'NÃO CONFIGURADO',
      incomingSecret: incomingSecret ? '***RECEBIDO***' : 'NÃO RECEBIDO',
      allHeaders: Object.keys(event.headers)
    });
    
    if (YAMPI_WEBHOOK_SECRET && incomingSecret !== YAMPI_WEBHOOK_SECRET) {
      logDebug('SECURITY FAILED', { reason: 'Chave secreta inválida' });
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Chave secreta inválida' })
      };
    }

    // PARSE WEBHOOK DATA
    const rawBody = event.body || '{}';
    logDebug('RAW WEBHOOK BODY', { body: rawBody, length: rawBody.length });

    const webhookData = JSON.parse(rawBody);
    logDebug('PARSED WEBHOOK DATA', webhookData);

    // ANALYZE EVENT TYPE
    const eventType = webhookData.event;
    logDebug('EVENT TYPE ANALYSIS', { 
      eventType,
      expectedTypes: ['order.paid', 'payment.approved'],
      shouldProcess: ['order.paid', 'payment.approved'].includes(eventType)
    });

    if (eventType === 'order.paid' || eventType === 'payment.approved') {
      const order = webhookData.data || webhookData;
      logDebug('ORDER DATA', order);

      // EXTRACT CUSTOMER INFO
      const customerEmail = order.customer?.email || order.buyer_email;
      const customerName = order.customer?.first_name || order.customer?.name || order.buyer_name || 'Cliente';
      const orderTotal = parseFloat(order.total || order.total_amount || order.amount || '0');
      const orderItems = order.items || [];

      logDebug('EXTRACTED INFO', {
        customerEmail,
        customerName,
        orderTotal,
        orderItemsCount: orderItems.length,
        orderItems: orderItems.map(item => ({
          name: item.name || item.product?.name,
          sku: item.sku,
          quantity: item.quantity,
          price: item.price
        }))
      });
      
      if (!customerEmail) {
        logDebug('ERROR', { reason: 'Email do cliente não encontrado' });
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Email do cliente não encontrado' })
        };
      }
      
      // PRODUCT LOGIC WITH DEBUGGING
      const allProductsList = PRODUCT_MAPPING['CZ5JKMXCI7'] || [];
      let products = [];
      
      logDebug('PRODUCT LOGIC', {
        orderTotal,
        threshold: 40,
        isKitComplete: orderTotal >= 40,
        willCheckItems: orderTotal < 40,
        availableProducts: allProductsList.length
      });
      
      if (orderTotal >= 40) {
        // Kit completo: todos os 9 produtos
        products = allProductsList;
        logDebug('KIT COMPLETO DETECTADO', {
          reason: `Valor R$ ${orderTotal} >= R$ 40`,
          productsCount: products.length
        });
      } else {
        // DEBUGGING: Para valores baixos, vamos entregar kit completo temporariamente
        // Isso nos permite testar se o problema é a lógica de valores
        products = allProductsList; // TEMPORÁRIO: sempre entregar kit completo
        
        logDebug('PRODUTO INDIVIDUAL / DEBUG MODE', {
          reason: `Valor R$ ${orderTotal} < R$ 40`,
          debugMode: true,
          actualLogic: 'Deveria ser produto individual',
          currentBehavior: 'Entregando kit completo para debug',
          productsCount: products.length
        });
      }
      
      const processingTime = Date.now() - startTime;
      logDebug('EMAIL SENDING', {
        processingTimeMs: processingTime,
        customerEmail,
        customerName,
        productsCount: products.length,
        productNames: products.map(p => p.name)
      });
      
      const emailResult = await sendProductEmail(customerEmail, customerName, products);
      
      const totalTime = Date.now() - startTime;
      logDebug('WEBHOOK SUCCESS', {
        totalTimeMs: totalTime,
        emailSent: true,
        customer: customerEmail,
        products: products.length
      });
      
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          message: 'Email enviado com sucesso',
          debug: {
            customer: customerEmail,
            products: products.length,
            orderTotal,
            processingTimeMs: totalTime,
            debugMode: orderTotal < 40 ? 'Kit completo entregue para debug' : 'Lógica normal aplicada'
          }
        })
      };
    } else {
      logDebug('EVENT IGNORED', { eventType, reason: 'Não é evento de pagamento' });
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Webhook processado - evento ignorado', event: eventType })
      };
    }

  } catch (error) {
    const totalTime = Date.now() - startTime;
    logDebug('WEBHOOK ERROR', {
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 5),
      totalTimeMs: totalTime,
      rawBody: event.body?.substring(0, 500)
    });
    
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: 'Erro no processamento do webhook',
        details: error.message,
        timestamp: new Date().toISOString(),
        debugId: Date.now().toString(36)
      })
    };
  }
};