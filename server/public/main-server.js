var fs = require('fs');
eval(fs.readFileSync('simulation.js')+'');

function create_json(sim){
	return {"traits" : [ 
		{"eu_capital": sim.eu_capital},
		{"domestic_share" : sim.domestic_share},
	    {"us_share" : sim.us_share},
	    {"eu_share" : sim.eu_share},
	    {"eu_capital" : sim.eu_capital},
	    {"us_capital" : sim.us_capital},
	    {"year" : sim.turn * 5 + 2010},
	    {"us_dev" : sim.us_development},
	    {"eu_dev" : sim.eu_devopment},
	    {"dev_add" : sim.development_add},
	    {"eu_dev_add": sim.eu_development_add},
	    {"eu_dev" : sim.eu_dev}
    ]
	};
}

var http = require("http");
var connect = require('connect');

console.log('\n\n--- Node Version: ' + process.version + ' ---');

// Set up Connect routing
var app = connect()
    .use(connect.static(__dirname + '/public'))
    .use(function(req, res) {
        console.log('Could not find handler for: ' + req.url);
        res.end('Could not find handler for: ' + req.url);
    })
    .use(function(err, req, res, next) {
        console.log('Error trapped by Connect: ' + err.message + ' : ' + err.stack);
        res.end('Error trapped by Connect: ' + err.message);
    });

// Start node server listening on specified port -----
http.createServer(app).listen(80);

console.log('HTTP server listening on port 80');