const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Agrega middleware para manejar CORS, solicitudes POST, etc.
server.use(middlewares);

// Personaliza las rutas si es necesario
server.use('/api', router);

// Define el puerto en el que se ejecutará JSON Server
const port = 3000;

server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
