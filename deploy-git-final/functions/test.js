exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      success: true,
      message: 'Sistema BF Solutions funcionando!',
      timestamp: new Date().toISOString(),
      environment: 'netlify-production'
    })
  };
};