const sgMail = require('@sendgrid/mail');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, X-Yampi-Secret, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Método não permitido. Use POST.' })
    };
  }

  try {
    const webhookData = JSON.parse(event.body || '{}');
    const { event: eventType, data } = webhookData;

    if (eventType === 'order.paid' || eventType === 'payment.approved') {
      const result = await processOrderPaid(data);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Email enviado com sucesso',
          customer: data.customer?.email,
          products: result.productsCount
        })
      };
    } else {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Evento processado (ignorado)',
          event: eventType
        })
      };
    }

  } catch (error) {
    console.error('❌ Erro no webhook:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Erro no processamento do webhook',
        details: error.message
      })
    };
  }
};

async function processOrderPaid(orderData) {
  const { customer, items = [], id: orderId, total, sku } = orderData;
  
  if (!customer?.email) {
    throw new Error('Email do cliente não encontrado');
  }

  const customerName = customer.first_name || customer.name || 'Cliente';
  const customerEmail = customer.email;
  
  const allProducts = [
    { name: 'Aprendendo com Alegria', driveId: '1-JJ5_GuB7bSRNWC6tgU_BJPX-z1v4Eqh' },
    { name: 'Aprendendo a Orar', driveId: '1kzOAZ3wBTjVxPd71y9XCaI7qXEqLSWjq' },
    { name: 'O Amor de Deus', driveId: '1IzJgA3p5LLBqC1Cd4tS8YBnB4jlrOOeH' },
    { name: 'Andando com Jesus', driveId: '1cqAUJOqxQ8dGHmxdnkwV_iXnUTdRz-PZ' },
    { name: 'Passatempo Bíblico', driveId: '1gNlGR1XZmEhELT4XPy2jN6d0tOQUTZJd' },
    { name: 'Aventuras Bíblicas', driveId: '1O_nR7LBxXq4zPGLfhLMVvX9rSN8Q3X8I' },
    { name: 'Alfabeto Bíblico', driveId: '1iLXJo5rAFu1EbAE-5_N2C-7Pk_bO0I6_' },
    { name: 'Colorindo com Propósito', driveId: '1kO1GgIMLRb3I6nLAKPELc0n1w9w2QdFz' },
    { name: 'Atividades Bíblicas', driveId: '1c3_xGJE8OFRV7zZTQ7COyWmjhJN0QzHz' }
  ];

  let products = [];
  const isKitComplete = sku === 'CZ5JKMXCI7' || sku === 'KITCOMPLETO47' || total >= 40;

  if (isKitComplete) {
    products = allProducts;
  } else {
    const productMap = {
      'COQKCHAULS': [allProducts[0]],
      'PJOXYTLWH8': [allProducts[1]],
      'MDVGFF962L': [allProducts[2]],
      'MFYQEZCFXK': [allProducts[3]],
      'F6UAHCRAS9': [allProducts[5]],
      'LHBYMQPBP3': [allProducts[6]],
      'PVFNLJFLRM': [allProducts[7]],
      'IQTJ20EVWO': [allProducts[8]]
    };
    
    products = productMap[sku] || [allProducts[0]];
  }

  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    throw new Error('SENDGRID_API_KEY não configurada');
  }
  
  sgMail.setApiKey(apiKey);

  const downloadLinks = products.map(product => 
    `• **${product.name}**: https://drive.google.com/file/d/${product.driveId}/view?usp=sharing`
  ).join('\n');

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Seus Kits de Atividades Bíblicas</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f8f9fa; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center; color: white; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
        .content { padding: 30px 20px; }
        .greeting { font-size: 18px; margin-bottom: 20px; color: #2c3e50; }
        .download-section { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
        .download-links { font-size: 14px; line-height: 1.8; color: #495057; }
        .download-links a { color: #667eea; text-decoration: none; font-weight: 500; }
        .instructions { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px solid #ffeaa7; }
        .footer { background: #2c3e50; color: white; padding: 20px; text-align: center; font-size: 14px; }
        .support { background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center; }
        .whatsapp { display: inline-block; background: #25D366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Seus Kits de Atividades Bíblicas Estão Prontos!</h1>
        </div>
        
        <div class="content">
            <div class="greeting">
                Olá, <strong>${customerName}</strong>! 👋
            </div>
            
            <p>Muito obrigado pela sua compra! 🙏 Agora você tem acesso aos melhores materiais para ensinar a Palavra de Deus às crianças de forma divertida e educativa.</p>
            
            <div class="download-section">
                <h3>📥 Downloads Disponíveis (${products.length} ${products.length === 1 ? 'produto' : 'produtos'}):</h3>
                <div class="download-links">
                    ${downloadLinks}
                </div>
            </div>
            
            <div class="instructions">
                <h4>💡 Como baixar:</h4>
                <p>1. Clique nos links acima<br>
                2. No Google Drive, clique em "Baixar" (ícone de download)<br>
                3. Os arquivos serão salvos em PDF no seu dispositivo<br>
                4. Imprima e comece a usar!</p>
            </div>
            
            <div class="support">
                <h4>💬 Precisa de ajuda?</h4>
                <p>Nossa equipe está disponível para te ajudar!</p>
                <a href="https://wa.me/5511992584644?text=Olá, comprei os kits de atividades bíblicas e preciso de ajuda com o download" class="whatsapp" target="_blank">
                    📱 Falar no WhatsApp
                </a>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>BF Solutions - Educação Bíblica Infantil</strong><br>
            Transformando vidas através da educação cristã<br>
            <a href="https://befmarket.store" style="color: #b8c6db;">befmarket.store</a></p>
        </div>
    </div>
</body>
</html>`;

  const msg = {
    to: customerEmail,
    from: {
      email: process.env.FROM_EMAIL || 'contato@befmarket.store',
      name: 'BF Solutions'
    },
    subject: `🎉 Seus ${products.length === 1 ? 'Kit de Atividades Bíblicas' : 'Kits de Atividades Bíblicas'} - Download Liberado!`,
    html: emailHtml
  };

  await sgMail.send(msg);

  return {
    productsCount: products.length,
    isKitComplete,
    products: products.map(p => p.name)
  };
}