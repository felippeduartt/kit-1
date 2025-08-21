const sgMail = require('@sendgrid/mail');

exports.handler = async (event, context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  try {
    // Verificar environment variables
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    const FROM_EMAIL = process.env.FROM_EMAIL || 'contato@befmarket.store';
    
    console.log('=== ENVIRONMENT CHECK ===');
    console.log('SENDGRID_API_KEY exists:', !!SENDGRID_API_KEY);
    console.log('SENDGRID_API_KEY length:', SENDGRID_API_KEY ? SENDGRID_API_KEY.length : 0);
    console.log('FROM_EMAIL:', FROM_EMAIL);
    
    if (!SENDGRID_API_KEY) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ 
          error: 'SENDGRID_API_KEY não configurado',
          debug: {
            allEnvKeys: Object.keys(process.env).filter(key => key.includes('SEND')),
            region: context.awsRequestId?.slice(0, 8)
          }
        })
      };
    }
    
    // Configurar SendGrid
    sgMail.setApiKey(SENDGRID_API_KEY);
    
    // Tentar enviar email de teste
    const msg = {
      to: 'teste.bf.solutions@gmail.com',
      from: {
        email: FROM_EMAIL,
        name: 'BF Solutions - Teste'
      },
      subject: `Teste Email - ${new Date().toISOString()}`,
      html: `
        <h1>Email de Teste</h1>
        <p>Timestamp: ${new Date().toISOString()}</p>
        <p>Region: ${context.awsRequestId?.slice(0, 8)}</p>
        <p>Function: test-email</p>
      `
    };
    
    console.log('=== SENDING EMAIL ===');
    console.log('To:', msg.to);
    console.log('From:', msg.from);
    console.log('Subject:', msg.subject);
    
    const emailResult = await sgMail.send(msg);
    
    console.log('=== EMAIL SUCCESS ===');
    console.log('Status Code:', emailResult[0].statusCode);
    console.log('Message ID:', emailResult[0].headers['x-message-id']);
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        message: 'Email teste enviado com sucesso',
        debug: {
          statusCode: emailResult[0].statusCode,
          messageId: emailResult[0].headers['x-message-id'],
          timestamp: new Date().toISOString(),
          sendgridKeyLength: SENDGRID_API_KEY.length,
          fromEmail: FROM_EMAIL
        }
      })
    };
    
  } catch (error) {
    console.log('=== EMAIL ERROR ===');
    console.log('Error message:', error.message);
    console.log('Error code:', error.code);
    console.log('Response body:', error.response?.body);
    
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: error.message,
        debug: {
          errorCode: error.code,
          statusCode: error.response?.status,
          responseBody: error.response?.body,
          timestamp: new Date().toISOString()
        }
      })
    };
  }
};