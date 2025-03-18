import fs from 'fs';
import https from 'https';
import next from 'next';

// Tentukan mode pengembangan
const dev = process.env.NODE_ENV !== 'production';

// Siapkan aplikasi Next.js
const app = next({ dev });
const handle = app.getRequestHandler();

// Path ke sertifikat SSL
const httpsOptions = {
  key: fs.readFileSync('./localhost-key.pem'),
  cert: fs.readFileSync('./localhost.pem'),
};

// Persiapkan aplikasi Next.js
app.prepare().then(() => {
  https
    .createServer(httpsOptions, (req, res) => {
      return handle(req, res);
    })
    .listen(3000, (err) => {
      if (err) throw err;
      console.log('> Ready on https://localhost:3000');
    });
});
