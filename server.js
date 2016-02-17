var PORT = process.env.PORT || 5000;
var ENV = process.env.NODE_ENV;

// setup http + express + socket.io
var express = require('express');


var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server, {
    'log level': 0
});
// To resolve socket.io handshake bug : 
io.set("transports", ["xhr-polling"]);

// Because we are behind Apache Proxy :
app.enable('trust proxy');



require('deployd').attach(
    server, {
        socketIo: io, // if not provided, attach will create one for you.
        env: ENV,
        db: {
            host: 'localhost',
            port: 35683,
            name: 'name',
            credentials: {
                username: 'username',
                password: 'password'
            }
        }
    }
);

var dpdRoutes = ["dashboard", "__resources", "links"];

//send our main angular html file if any link without dot is requested, e.g. 'http://someurl/about'
//this is our actual server side redirect, we don't send index.html when there's dot in link assuming such a request
//is for static data like .js, .css or .html
app.get('/[^\.]+$', function(req, res, next) {
    var first_path = req.path.split('/');

    if (dpdRoutes.indexOf(first_path[1]) > -1) // dpd requests
    {
        return next();
    } else // angular requests
    {
        res.sendfile("index.html", {
            root: __dirname + '/public'
        });
    }

});

app.use(server.handleRequest);

// start server
server.listen(PORT);