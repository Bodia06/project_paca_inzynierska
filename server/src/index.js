const http = require('http');
const app = require('./app');

const serverHttp = http.createServer(app);
const PORT = process.env.PORT || 5001;
const HOST = process.env.HOST || '0.0.0.0';

serverHttp.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
