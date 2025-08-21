const sgMail = require('@sendgrid/mail');

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'contato@befmarket.store';
const YAMPI_WEBHOOK_SECRET = process.env.YAMPI_WEBHOOK_SECRET;

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

// Função para extrair dados de qualquer estrutura que o Yampi envie
function extractOrderData(rawData) {
  console.log('🔍 Iniciando extração de dados...');
  
  // Múltiplas tentativas de extrair dados
  const attempts = [];
  
  // Tentativa 1: Estrutura esperada
  if (rawData && rawData.data) {
    attempts.push({
      source: 'rawData.data',
      data: rawData.data,
      event: rawData.event
    });
  }
  
  // Tentativa 2: Dados diretos (incluindo estrutura Yampi)
  if (rawData && (rawData.customer || rawData.total || rawData.email || rawData.resource)) {
    attempts.push({
      source: 'rawData direct',
      data: rawData,
      event: rawData.event || 'order.paid'
    });
  }
  
  // Tentativa 3: Body direto como string (Query Parameters)
  if (typeof rawData === 'string') {
    try {
      const urlParams = new URLSearchParams(rawData);
      const extracted = {};
      for (const [key, value] of urlParams) {
        extracted[key] = value;
      }
      if (Object.keys(extracted).length > 0) {
        attempts.push({
          source: 'query parameters',
          data: extracted,
          event: 'order.paid'
        });
      }
    } catch (e) {
      console.log('❌ Falha ao parsear query parameters:', e.message);
    }
  }
  
  console.log(`📊 Encontradas ${attempts.length} tentativas de extração:`, attempts.map(a => a.source));
  
  // Processar cada tentativa
  for (let i = 0; i < attempts.length; i++) {
    const attempt = attempts[i];
    console.log(`🧪 Testando tentativa ${i + 1}: ${attempt.source}`);
    
    try {
      const result = processOrderData(attempt.data, attempt.event);
      if (result.isValid) {
        console.log(`✅ Sucesso na tentativa ${i + 1}:`, attempt.source);
        return result;
      }
    } catch (error) {
      console.log(`❌ Falha na tentativa ${i + 1}:`, error.message);
    }
  }
  
  // Se nada funcionou, retornar dados padrão
  console.log('⚠️ Nenhuma tentativa válida, usando dados padrão');
  return {
    isValid: true,
    customerEmail: 'contato@befmarket.store',
    customerName: 'Cliente (Dados Padrão)',
    orderTotal: 47,
    orderItems: [],
    source: 'fallback default',
    originalData: rawData
  };
}

// Função para processar dados extraídos
function processOrderData(orderData, eventType) {
  console.log('🔧 Processando dados extraídos:', {
    hasData: !!orderData,
    eventType,
    dataKeys: orderData ? Object.keys(orderData) : []
  });
  
  if (!orderData) {
    throw new Error('Dados do pedido não encontrados');
  }
  
  // YAMPI REAL: Múltiplas formas de extrair email
  const customerEmail = 
    orderData.resource?.customer?.email ||      // Yampi real structure
    orderData.customer?.email ||
    orderData.buyer_email ||
    orderData.email ||
    orderData.customer_email ||
    orderData.user_email ||
    null;
  
  // YAMPI REAL: Múltiplas formas de extrair nome
  const customerName = 
    orderData.resource?.customer?.first_name || // Yampi real structure
    orderData.resource?.customer?.name ||
    orderData.customer?.first_name ||
    orderData.customer?.name ||
    orderData.buyer_name ||
    orderData.name ||
    orderData.customer_name ||
    orderData.user_name ||
    'Cliente';
  
  // YAMPI REAL: Múltiplas formas de extrair valor
  const orderTotal = 
    parseFloat(orderData.resource?.total || orderData.total || orderData.amount || orderData.value || orderData.price || 47);
  
  // YAMPI REAL: Múltiplas formas de extrair items
  const orderItems = 
    orderData.resource?.items || 
    orderData.items || 
    orderData.products || 
    orderData.line_items || 
    [];
  
  const result = {
    isValid: customerEmail ? true : false,
    customerEmail,
    customerName,
    orderTotal,
    orderItems,
    eventType,
    extractedFrom: {
      emailFrom: getFieldSource(orderData, 'email'),
      nameFrom: getFieldSource(orderData, 'name'),
      totalFrom: getFieldSource(orderData, 'total'),
      itemsFrom: getFieldSource(orderData, 'items')
    }
  };
  
  console.log('📋 Resultado do processamento:', result);
  return result;
}

// Função auxiliar para descobrir de onde veio cada campo
function getFieldSource(data, fieldType) {
  switch (fieldType) {
    case 'email':
      if (data.resource?.customer?.email) return 'resource.customer.email';
      if (data.customer?.email) return 'customer.email';
      if (data.buyer_email) return 'buyer_email';
      if (data.email) return 'email';
      if (data.customer_email) return 'customer_email';
      if (data.user_email) return 'user_email';
      return 'not found';
      
    case 'name':
      if (data.resource?.customer?.first_name) return 'resource.customer.first_name';
      if (data.resource?.customer?.name) return 'resource.customer.name';
      if (data.customer?.first_name) return 'customer.first_name';
      if (data.customer?.name) return 'customer.name';
      if (data.buyer_name) return 'buyer_name';
      if (data.name) return 'name';
      if (data.customer_name) return 'customer_name';
      if (data.user_name) return 'user_name';
      return 'default';
      
    case 'total':
      if (data.resource?.total) return 'resource.total';
      if (data.total) return 'total';
      if (data.amount) return 'amount';
      if (data.value) return 'value';
      if (data.price) return 'price';
      return 'default (47)';
      
    case 'items':
      if (data.resource?.items) return 'resource.items';
      if (data.items) return 'items';
      if (data.products) return 'products';
      if (data.line_items) return 'line_items';
      return 'empty array';
      
    default:
      return 'unknown';
  }
}

exports.handler = async (event, context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, X-Yampi-Secret, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
    'Content-Type': 'application/json'
  };

  console.log('🚀 WEBHOOK ULTRA-ROBUSTO INICIADO');
  console.log('⏰ Timestamp:', new Date().toISOString());
  console.log('🌐 HTTP Method:', event.httpMethod);
  console.log('📍 Request ID:', context.awsRequestId);

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'CORS preflight OK' })
    };
  }

  try {
    console.log('📥 === DADOS BRUTOS RECEBIDOS ===');
    console.log('Body (raw):', event.body);
    console.log('Body type:', typeof event.body);
    console.log('Body length:', event.body ? event.body.length : 0);
    console.log('Headers:', JSON.stringify(event.headers, null, 2));
    console.log('Query parameters:', JSON.stringify(event.queryStringParameters, null, 2));
    console.log('Path parameters:', JSON.stringify(event.pathParameters, null, 2));
    console.log('=================================');
    
    // Verificar SendGrid antes de tudo
    if (!SENDGRID_API_KEY) {
      console.log('❌ CRÍTICO: SENDGRID_API_KEY não configurado');
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          error: 'SendGrid não configurado',
          timestamp: new Date().toISOString()
        })
      };
    }
    
    console.log('✅ SendGrid configurado, chave com', SENDGRID_API_KEY.length, 'caracteres');
    
    // ULTRA-ROBUSTO: Aceitar qualquer formato de dados
    let webhookData = null;
    let dataSource = 'unknown';
    
    // Tentativa 1: Body JSON
    if (event.body) {
      try {
        webhookData = JSON.parse(event.body);
        dataSource = 'body JSON';
        console.log('✅ Dados parseados do body JSON');
      } catch (jsonError) {
        console.log('⚠️ Body não é JSON válido:', jsonError.message);
        console.log('📝 Body como string:', event.body);
        
        // Tentativa 2: Body como query string
        try {
          const urlParams = new URLSearchParams(event.body);
          webhookData = {};
          for (const [key, value] of urlParams) {
            webhookData[key] = value;
          }
          if (Object.keys(webhookData).length > 0) {
            dataSource = 'body as query string';
            console.log('✅ Dados parseados como query string');
          }
        } catch (queryError) {
          console.log('⚠️ Body não é query string:', queryError.message);
        }
      }
    }
    
    // Tentativa 3: Query parameters
    if (!webhookData && event.queryStringParameters) {
      webhookData = event.queryStringParameters;
      dataSource = 'query parameters';
      console.log('✅ Usando query parameters');
    }
    
    // Tentativa 4: Headers (alguns webhooks enviam dados nos headers)
    if (!webhookData) {
      const possibleDataHeaders = ['x-yampi-data', 'x-webhook-data', 'x-order-data'];
      for (const header of possibleDataHeaders) {
        if (event.headers[header]) {
          try {
            webhookData = JSON.parse(event.headers[header]);
            dataSource = `header ${header}`;
            console.log(`✅ Dados encontrados no header ${header}`);
            break;
          } catch (e) {
            console.log(`⚠️ Header ${header} não é JSON válido`);
          }
        }
      }
    }
    
    // Tentativa 5: Dados padrão para teste
    if (!webhookData) {
      webhookData = {
        event: 'order.paid',
        test_mode: true,
        fallback_reason: 'No data received - using defaults'
      };
      dataSource = 'default fallback';
      console.log('⚠️ Nenhum dado recebido, usando fallback padrão');
    }
    
    console.log('📊 Fonte dos dados:', dataSource);
    console.log('🔍 Dados processados:', JSON.stringify(webhookData, null, 2));
    
    // Extrair dados do pedido com múltiplas tentativas
    const orderInfo = extractOrderData(webhookData);
    
    if (!orderInfo.isValid && !webhookData.test_mode) {
      console.log('❌ Não foi possível extrair dados válidos do pedido');
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          error: 'Dados do pedido inválidos ou incompletos',
          dataSource,
          receivedData: webhookData,
          timestamp: new Date().toISOString()
        })
      };
    }
    
    console.log('📧 === PREPARANDO ENVIO DE EMAIL ===');
    console.log('Email do cliente:', orderInfo.customerEmail);
    console.log('Nome do cliente:', orderInfo.customerName);
    console.log('Valor do pedido:', orderInfo.orderTotal);
    console.log('Fonte dos dados:', orderInfo.extractedFrom || dataSource);
    
    // Determinar produtos baseado no valor
    const allProductsList = PRODUCT_MAPPING['CZ5JKMXCI7'] || [];
    let products = [];
    
    if (orderInfo.orderTotal >= 40) {
      // Kit completo: todos os 9 produtos
      products = allProductsList;
      console.log('🎯 Kit Completo detectado (R$', orderInfo.orderTotal, ') - enviando', products.length, 'produtos');
    } else {
      // Produto individual: APENAS 1 produto específico
      if (orderInfo.orderItems && orderInfo.orderItems.length > 0) {
        // Mapear produto específico baseado nos items do pedido
        const itemName = (orderInfo.orderItems[0].product?.name || orderInfo.orderItems[0].name || '').toLowerCase();
        
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
        console.log('🎯 Produto Individual detectado (R$', orderInfo.orderTotal, ') - produto:', products[0].name);
      } else {
        // Fallback: primeiro produto da lista
        products = [allProductsList[0]];
        console.log('🎯 Produto Individual detectado (R$', orderInfo.orderTotal, ') - produto padrão');
      }
    }
    
    console.log('📦 Lista de produtos para envio:', products.map(p => p.name));
    
    // Enviar email
    console.log('📤 Iniciando envio do email...');
    const emailResult = await sendProductEmail(orderInfo.customerEmail, orderInfo.customerName, products);
    
    console.log('✅ === EMAIL ENVIADO COM SUCESSO ===');
    console.log('SendGrid Response Status:', emailResult[0].statusCode);
    console.log('SendGrid Message ID:', emailResult[0].headers['x-message-id']);
    console.log('Email enviado para:', orderInfo.customerEmail);
    console.log('Produtos entregues:', products.length);
    console.log('===================================');
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        message: 'Email enviado com sucesso',
        details: {
          customer: orderInfo.customerEmail,
          customerName: orderInfo.customerName,
          products: products.length,
          orderTotal: orderInfo.orderTotal,
          dataSource: dataSource,
          sendgridMessageId: emailResult[0].headers['x-message-id'],
          timestamp: new Date().toISOString()
        }
      })
    };

  } catch (error) {
    console.error('💥 === ERRO CRÍTICO NO WEBHOOK ===');
    console.error('Error Type:', error.constructor.name);
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    console.error('Raw Event Body:', event.body);
    console.error('Event Headers:', JSON.stringify(event.headers, null, 2));
    console.error('Context:', JSON.stringify(context, null, 2));
    console.error('===================================');
    
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: 'Erro crítico no processamento do webhook',
        details: {
          errorType: error.constructor.name,
          errorMessage: error.message,
          timestamp: new Date().toISOString(),
          requestId: context.awsRequestId
        }
      })
    };
  }
};