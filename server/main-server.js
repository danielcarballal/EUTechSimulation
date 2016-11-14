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
require("fs");
var url_parse = require('url');

var server = http.createServer(function onRequest (req, res) {
  var url = req.url;
  res.writeHeader(200, {"Content-Type": "text/html"}); 
  var url_parts = url_parse.parse(url, true);
  var team = url_parts.query.team;
  var pathname = "/european_home.html";
  if(url_parts.pathname != "/"){
  	pathname = url_parts.pathname;
  }
  res.write(fs.readFileSync("." + pathname));
  res.end();
}).listen(3000);

server.addListener('connection', function onListen (req,res){
} );

var s = new Simulation();