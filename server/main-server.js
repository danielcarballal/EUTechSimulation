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

// Start node server listening on specified port -----
var server = http.createServer(function (req, res) {
 console.log(req);
});

console.log('HTTP server listening on port 3000');

var s = new Simulation();
var a = 1;
while(a === 1){
	a = s.next_turn();
}