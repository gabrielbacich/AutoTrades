const http = require('http');
const config = require('./config.js');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.write("🤖 Steam Trade Farm is running!\n");
  res.write(`⏰ Last ping: ${new Date().toISOString()}\n`);
  res.write(`🎮 Game configured: ${config.gameCode}\n`);
  res.write("✅ Server active and working");
  res.end();
});

const PORT = config.port;

server.listen(PORT, () => {
  console.log(`🌐 Keep-alive server running on port ${PORT}`);
});

process.on('SIGINT', () => {
  console.log('🔄 Shutting down keep-alive server...');
  server.close(() => {
    console.log('✅ Keep-alive server stopped');
    process.exit(0);
  });
});

module.exports = server;
