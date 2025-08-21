// Webhook que só captura e loga TUDO que a Yampi envia
exports.handler = async (event, context) => {
  const timestamp = new Date().toISOString();
  
  console.log('=== WEBHOOK CALL RECEIVED ===');
  console.log('Timestamp:', timestamp);
  console.log('Method:', event.httpMethod);
  console.log('Headers:', JSON.stringify(event.headers, null, 2));
  console.log('Body:', event.body);
  console.log('Query:', event.queryStringParameters);
  console.log('Context:', {
    requestId: context.awsRequestId,
    functionName: context.functionName,
    region: context.invokedFunctionArn
  });
  console.log('=== END LOG ===');
  
  // Sempre retorna sucesso para não perder dados
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, X-Yampi-Secret',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      success: true,
      message: 'Dados capturados',
      timestamp,
      received: {
        method: event.httpMethod,
        headers: Object.keys(event.headers),
        bodyLength: event.body ? event.body.length : 0,
        hasSecret: !!(event.headers['x-yampi-secret'] || event.headers['X-Yampi-Secret'])
      }
    })
  };
};