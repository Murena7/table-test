const http = require('http');
const app = require('./app');

const server = http.createServer(app);

const port = 8080;

server.listen(port, () => {
  console.log(`Server has been started on ${ port }`);
});
