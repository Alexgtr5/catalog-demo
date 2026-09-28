export default function handler(req, res) {
  const vercelHeaders = Object.fromEntries(
    Object.entries(req.headers).filter(([name]) => name.startsWith('x-vercel')),
  );

  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify({ url: req.url, vercelHeaders }));
}
