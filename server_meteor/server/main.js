import { Meteor } from 'meteor/meteor';

actions = new Mongo.Collection('actions');
issues = new Mongo.Collection('issues');
params = new Mongo.Collection('simulation_params');
changes = new Mongo.Collection('changes');
var s = new Simulation();
Meteor.startup(() => {
    var globalObject=Meteor.isClient?window:global;
    for(var property in globalObject){
        var object=globalObject[property];
        if(object instanceof Meteor.Collection){
            object.rawCollection().drop();
        }
    }
    insert_all_actions();
    insert_all_issues();

    initialise_params(s);
});

import './simulation.js';


var next_turn = 0;
var store_changes = [];
Meteor.methods({
    'change_action' : function(changes){
        if(next_turn == 0){
            console.log("first");
            store_changes = changes;
            next_turn++;
        } else {
            console.log("second");
            s.next_turn(changes.concat(store_changes));
            next_turn = 0;
            store_changes = [];
        }
    }
})
function insert_all_issues(){
    issues.insert({
         "id": 1,
          "description": "Earlier this week, the small Swiss website “LeMondeBild.ch” picked up a story claiming that tech giant Zoomzain had not paid EU taxes for six years through a tax loophole called “Double Europe”. Zoomzain is the largest producer of laptops in the EU, representing nearly 10% of all American sales in the US. Several EU delegations, including those in France, Italy and Croatia, where Zoomzain has offices located, say that they have been using EU resources while keeping all of their record-breaking profits in the US. Zoomzain president Jeve Stobs claims that the company acted in a legal manner, and that the EU needs to relax tax regulations if it is to remain competitive.",
          "options_eu": {
            "op_title1": {
              "title": "Disregard",
              "effects": [
                ["eu_development_add_change", .02],
                ["development_add", .04]
              ]
            },
            "op_title2": {
              "title": "Demand Reperations",
              "effects": [
                ["condition", ["eu_opinion", .05],
                    ["eu_opinion": .07],
                    ["eu_opinion": -.03] ]
              ]
            },
            "op_title3": {
              "title": "None"
            }
          },
          "options_us": {
            "op_title1": {
              "title": "Placate EU",
              "effects": [
                ["eu_opinion", .02],
                ["eu_development_add_change",.02],
                ["development_add", .02]
              ]
            },
            "op_title2": {
              "title": "Refuse to Pay",
              "effects": {
                "us_share": "-.03",
                "eu_opinion": "-.02"
              }
            },
            "op_title3": {
              "title": "Remove EU HQ",
              "effects": {
                "eu_opinion": "-.05",
                "us_company_opinion_shift": "-.06",
                "eu_devopment_add_change": ".02",
                "development": {}
              }
            }
          }
        }
    );

    issues.insert({"id": 2,
      "description": "The world was shocked when the autonomous region of Western Bohemia voted by popular referendum to form an independent nation. The transition was swift, with both the EU and the newly elected Jan Hus Party taking the hard line. However, one of the largest companies from the new country is Kartenzeichner, a mapping company whose products have been used many self-driving research projects throughout Europe. Kartenzeichner have requested access to the Single Digital Market, arguing that their work is crucial to retaining the relevancy of the European tech sector. The European Commision as well as the general sentiment of the people say that Western Bohemia must negotiate entry into the EU before talking about the future of Kartenzeichner. American maps giants like SudoMap and Zygotic scream that it is unfair to allow Kartenzeichner access to the SDM, but not them.",
      "options_eu": {
        "op_title1": {
          "title": "Deny Access",
          "effects": {
            "eu_development_add_change": "-.025",
            "development_add": "-.025",
            "eu_opinion": ".08",
            "eu_cross_share": "-.02"
          }
        },
        "op_title2": {
          "title": "Allow Access",
          "effects": {
            "eu_opinion": "-.1",
            "eu_cross_share": ".02",
            "eu_development_share": ".04",
            "development_add": ".01"
          }
        },
        "op_title3": {
          "title": "Allow Access to Everybody",
          "effects": {
            "eu_development_share": "-.02",
            "development_add": ".08"
          }
        }
      },
      "options_us": {
        "op_title1": {
          "title": "Support EU Decision",
          "effects": {
            "us_company_opinion_shift": ".02"
          }
        },
        "op_title2": {
          "title": "Demand Equal Access as Bohemia",
          "effects": {
            "condition": "agree",
            "us_company_opinion_shift": ".1"
          }
        },
        "op_title3": {
          "title": "None"
        }
      }});

    //issues.insert();
    //issues.insert();
    //issues.insert();
}

function insert_all_actions() {
      actions.insert(
        { 
            "id" : 1,
            "title": "Tax breaks for Tech",
            "description": "As a sign of good faith, we will give tax breaks for both European and American companies willing to employ European software engineers. This will help the tech economy greatly, but hurt our public image",
            "effects": [
              ["eu_share", .1],
              ["us_share", .08],
              ["eu_opinion_shift", -.05]
              ]
        });
      actions.insert(
        {
            "id" : 2,
            "title": "Enforce minor language software",
            "description": "It’s easy enough to find any software in English, and most have other languages like French and Spanish. But the EU should ensure that any software is available in minor languages, from Basque to Hungarian. Some software companies will be unhappy to have to comply.",
            "effects": [ ["us_share", -.04], ["eu_share", -.04],
            ["eu_cross_share", -.04],
              ["eu_opinion_shift": .02] ]
            
        });
      actions.insert(
      {
            "id" : 3,
            "title": "Praise Silicon Valley",
            "description": "Silicon Valley is bringing our world into the 21st century, and it is crucial that we let Europe stands behind it in this endeavour.",
            "effects":
              [ ["us_company_opinion_shift", .02] ]
      });
      actions.insert(
        {
            "id" : 4,
            "title": "Criticise Silicon Valley",
            "description": "Silicon Valley is bringing our world into the 21st century, and it is crucial that we let Europe stands behind it in this endeavour.",
            "effects": [ ["us_company_opinion_shift", -.02] ]
          }
      );
      actions.insert(
        {
            "id" : 5,
            "title": "Add offices in a European City",
            "description": "This will build good faith with the EU and employ European software engineers and marketing specialists, but will cause some disquiet from American workers",
            "effects": [ ["development_add", .1 ], ["us_company_opinion_shift", -.03 ] ]
          }
      );
      actions.insert(
         {
            "id" : 6,
            "title": "Push back release days",
            "description": "There is no better way to protest against EU decisions than to force their citizens to wait a week or two to get the same smartphone or processor that America is clamoring for...",
            "effects": [ ["eu_opinion_shift", -.04], ["us_company_opinion_shift", -.02] ]
          }
      );
      actions.insert(
         {
            "id" : 7,
            "title": "Praise EU",
            "description": "Let the people know that the EU is doing a good job.",
            "effects": [ ["eu_opinion_shift", .02] ]
        }
      );
      actions.insert(
         {
            "id" : 8,
            "title": "Criticise EU",
            "description": "The EU is being too regulatory for us to succeed!",
            "effects": [ ["eu_opinion_shift",-.02] ]
        }
      );
    }

function initialise_params(s){
    params.insert({
                    'id' : 21, 
                    'domestic_share': s.domestic_share,
                    'us_share' : s.us_share,
                    'eu_cross_share' : s.eu_cross_share,
                    'turn' : s.turn,
                    'development' : Math.round(s.total_dev() * 100),
                    'us_opinion' : Math.round(s.us_company_opinion * 100),
                    'eu_opinion' : Math.round(s.eu_opinion * 100),
                    'eu_share_perc' : Math.round( 100 * 
                            (s.eu_domestic_share_percent() + s.eu_cross_share_percent())),
                    'eu_cross_share_perc' : Math.round(100 * s.eu_cross_share_percent()),
                    'us_share_perc' : Math.round(100 * s.us_share_percent())

                });
    /*
    params.insert({'us_share' : 24000000});
    params.insert({'eu_cross_share' : 2000000});
    params.insert({'turn' : 0});
    params.insert({'development' : .1});
    */
    console.log("params initialised");
}

function Simulation(){
    //Check constants
    this.turn = 1;
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
            if(changes[0] == "condition"){
                //Do conditional
            }
            else {
                var change_type = changes[i][0];
                var change_val = changes[i][1];
                this.change_sim(change_type, change_val);
            }
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

        initialise_params(this);

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