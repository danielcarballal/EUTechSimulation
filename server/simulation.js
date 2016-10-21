
class Change{
	constructor(name, percent_change){
		this.type = name;
		this.percent_change = percent_change;
	}
}

class Simulation{
	constructor(){
		this.domestic_share = 18000000; //Check constants
		this.us_share = 24000000;
		this.eu_share = 2000000;

		this.turn = 0;


		this.development = .2;

	}

	self.


	next_turn(changes) {
		for (var i in changes){
			var change_type = changes[i]['type'];
			var change_val = changes[i]['percent_change'];
			self.change_sim(change_type, change_val);
		}
		// End of Simulation
		if (this.turn == 5){return 0;}
		//Otherwise, continue
		else{return 1;}
	}
}

var s = new Simulation();
s.next_turn([new Change("us_trade", 5)]);
console.log("YES");