var finalhandler = require('finalhandler');
var http = require('http');
var serveStatic = require('serve-static');
var geoip = require('geoip-lite');

// Serve up public/ftp folder
var serve = serveStatic('.', {'index': ['index.html', 'index.htm']});

// Create server
var server = http.createServer(function onRequest (req, res) {
  var ip = req.headers['x-forwarded-for'] ||
     req.connection.remoteAddress ||
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;
  var geo = geoip.lookup(ip);
  console.log(ip);
  if(geo){
    if(geo.country !== 'IN'){
      console.log('ip allowed : '+ip);
      return serve(req, res, finalhandler(req, res));
    }
    else{
      console.log('blocking ip : '+ip);
    }
  }
  res.writeHead(404);
  res.end();
});

// Listen
server.listen(3000,function (err,success) {
  if(err){
    throw new Error(err);
  }
  else{
    console.log('server started');
  }
});
