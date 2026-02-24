// api/auth.js
export default function handler(req, res) {
  // Configura CORS para aceitar o callback
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // Se for o callback com código
  if (req.query.code) {
    // Redireciona para o admin com o token
    res.redirect(`/admin/#access_token=${req.query.code}`);
    return;
  }
  
  // Se for erro
  if (req.query.error) {
    res.redirect(`/admin/#error=${req.query.error}`);
    return;
  }
  
  // Inicia o fluxo OAuth
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = 'https://site-advocacia-one.vercel.app/api/auth';
  
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo,user`;
  
  res.redirect(authUrl);
}