
class Change{
	constructor(name, percent_change){
		this.name = name;
		this.percent_change = percent_change;
	}
}

class Simulation{
	constructor(){
		this.domestic_share = 18000000; //Check constants
		this.us_share = 24000000;
		this.eu_share = 2000000;


		this.development = .2;

	}



	next_turn(changes) {
		for (var c in changes){
			console.log(changes[c["name"]]);
		}
	}
}

var s = new Simulation();
s.next_turn([new Change("us_trade", 5)]);
console.log("YES");