
function Change(name, percent_change){
    this.type = name;
    this.percent_change = percent_change;
}

function Simulation(){
    this.domestic_share = 18000000; //Check constants
    this.us_share = 24000000;
    this.eu_share = 2000000;
    this.turn = 0;
    this.us_development = .1;
    this.eu_devopment = .1;
    this.development_add = .05;
    this.eu_development_add = 0;//Change 
    this.eu_dev = .5; //Portion of dev done in EU
    this.total_dev = function(){
        return this.us_development + this.eu_devopment
    }
    this.change_sim = function(type, change_val){
        if(type === "us_share"){
            this.us_share *= (1 + change_val);
        }
        if(type === "eu_share"){
            this.eu_share *= 1 + change_val;
        }
        if(type === "development_add"){
            this.development_add *= 1 + change_val;
        }
        if(type === "eu_devopment_add"){
            this.eu_devopment *= 1 + change_val;
        }
        return 1;
    };  

    this.next_turn = function(changes) {
        for (var i in changes){
            var change_type = changes[i]['type'];
            var change_val = changes[i]['percent_change'];
            this.change_sim(change_type, change_val);
        }
        // End of Simulation
        if (this.turn == 5){return 0;}
        //Otherwise, do additions

        else{return 1;}
    };
}

var s = new Simulation();
s.next_turn([new Change("us_share", .05)]);
console.log(s.us_share);