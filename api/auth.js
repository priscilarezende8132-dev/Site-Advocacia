// api/auth.js
export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Responder a requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { code, error } = req.query;

  // Se houver erro do GitHub
  if (error) {
    console.error('Erro do GitHub:', error);
    res.redirect(`/admin/#error=${error}`);
    return;
  }

  // Se recebeu o código de autorização
  if (code) {
    try {
      console.log('Código recebido:', code);
      
      // Trocar o código por um token de acesso
      const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code: code,
          redirect_uri: 'https://site-advocacia-one.vercel.app/api/auth'
        })
      });

      const tokenData = await tokenResponse.json();
      console.log('Resposta do token:', tokenData);
      
      if (tokenData.error) {
        console.error('Erro ao obter token:', tokenData.error);
        res.redirect(`/admin/#error=${tokenData.error}`);
        return;
      }

      // SUCESSO! Redireciona para o admin com o token
      console.log('Token obtido com sucesso');
      res.redirect(`/admin/#access_token=${tokenData.access_token}`);
      return;
      
    } catch (error) {
      console.error('Erro na troca de token:', error);
      res.redirect('/admin/#error=token_exchange_failed');
      return;
    }
  }

  // Se não tem código, inicia o fluxo OAuth
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = 'https://site-advocacia-one.vercel.app/api/auth';
  
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo,user`;
  
  console.log('Redirecionando para GitHub:', authUrl);
  res.redirect(authUrl);
}