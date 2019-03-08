const {createServer} = require('http');
const next = require('next');
const routes = require('./routes');
const app = next({dev: process.env.NODE_ENV !== 'production'});
const handler = routes.getRequestHandler(app);

app.prepare().then(() => {
  createServer(handler).listen(3001,(err)=>{
  	if(err) throw err;
  	console.log("Server 3001 started");
  });
});