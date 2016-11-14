
import { Meteor } from 'meteor/meteor';

params = new Mongo.Collection('simulation_params');

function Change(name, percent_change){
    this.type = name;
    this.percent_change = percent_change;
}

function Simulation(){
    //Check constants
    params.insert({'domestic_share': 18000000});


	this.turn = 0;

    this.domestic_share = 18000000; 
    this.us_share = 24000000;
    this.eu_cross_share = 2000000;
    this.total_share = function (){
    	return this.domestic_share + this.us_share + this.eu_cross_share;
    }

    this.domestic_factor = 1;
    this.us_factor = 1;
    this.eu_cross_factor = 1;

    //Version 2
    this.eu_capital = 100;
    this.us_capital = 1000;
    
    this.us_development = .05;
    this.eu_development = .05;
    this.development_add = .1;
    this.eu_development_add = 0;//Change 
    this.eu_dev = .5; //Portion of dev done in EU

    this.us_company_opinion = .5;
    this.eu_company_opinion = .5;
    this.eu_opinion = .5;
    this.total_dev = function(){
        return this.us_development + this.eu_development;
    }
    this.change_sim = function(type, change_val){
        if(type === "us_share"){
            this.us_share *= (1 + change_val);
        }
        if(type === "eu_share"){
            this.eu_share *= 1 + change_val;
            this.domestic_share *= 1 + change_val;
        }
        if(type === "eu_cross_share"){
            this.eu_share *= 1 + change_val;
        }
        if(type === "domestic_share"){
            this.domestic_share *= 1 + change_val;
        }
        if(type === "development_add"){
            this.development_add *= 1 + change_val;
        }
        if(type === "eu_devopment_add_change"){
            this.eu_devopment_add *= 1 + change_val;
        }
        if(type === "eu_opinion_shift"){
        	this.eu_opinion += change_val;
        }
        if(type === "eu_company_opinion_shift"){
        	this.eu_company_opinion += change_val;
        }
        if(type === "us_company_opinion_shift"){
        	this.us_company_opinion += change_val;
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

        this.us_development += this.development_add * (1. + this.eu_development / 10) * 2 * (1 - this.eu_dev);
        this.eu_development += this.development_add * (1. + this.us_development / 10) * 2 * this.eu_dev;

        //Will increase as simulation goes on
        var total_growth = this.total_dev() * this.total_share();
        this.us_share += total_growth * (this.us_development / this.total_dev());
        this.domestic_share += total_growth * (this.eu_development / this.total_dev());
        this.eu_cross_share += total_growth * (1.2 * this.eu_development / this.total_dev());

        this.turn += 1;

        // console.log(this);
       // TODO: Fiddle the numbers so the shares end around 50%, 35%, and 15%

        return 1;
    };
    //Helper functions
    this.us_share_percent = function(){
    	return this.us_share / this.total_share();
    }
    this.eu_cross_share_percent = function(){
    	return this.eu_cross_share / this.total_share();
    }
    this.eu_domestic_share_percent = function(){
    	return this.domestic_share / this.total_share();
    }
}

