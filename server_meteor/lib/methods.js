import { Meteor } from 'meteor/meteor';

//This function will tell us if array a exists in the
// array of arrays m
function array_exists(m, a){
  for(var i = 0; i < m.length; i++){
    var c_arr = m[i];
    if(c_arr.length == a.length){
      var flag = true;
      for(var j = 0; j < c_arr.length; j++){
        if(c_arr[j] != a[j]){
          flag = false;
        }
      }
      if(flag){
          return true;
      }
    }
  }
  return false;
}

if(Meteor.isServer)
  {
  actions = new Mongo.Collection('actions');
  issues = new Mongo.Collection('issues');
  params = new Mongo.Collection('simulation_params');
  changes = new Mongo.Collection('changes');
  dialog = new Mongo.Collection('dialog');
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
  var store_changes = [];
  var first_entity = "";
  var turn_check = 0;
  var dialog_num = 0;
  Meteor.methods({
      'change_action' : function(entity, changes){
          if(turn_check == 0){
              console.log("first");
              first_entity = entity;
              store_changes = changes;
              turn_check++;
          } else if(entity != first_entity) {
              console.log("second");
              s.next_turn(changes.concat(store_changes));
              turn_check = 0;
              store_changes = [];
          } else {
            console.log("Repeat");
          }
      },
      'add_dialog' : function(name, team, text){
        dialog.insert({"num" : dialog_num, "user" : name, "team" : team, "val" : text});
        dialog_num++;
        console.log(dialog.find().fetch());
      }
  });

  function insert_all_issues(){
    issues.insert(
      {
        "id" : 1,
        "description" : "The EU Commission has had a case brought in front of it against the Silicon Valley startup called Scent. Scent is an app which allows users to have flowers sent to their home or office; anybody can sign up, and anybody can send flowers. The app has hundreds of thousands of downloads in every country, and has reduced flower sales of some countries, such as the Netherlands, by 20%. Many stories have emerged of Scent providers picking flowers from public gardens, country-side roads and, in one case, the EU Headquarters. Florist unions across the continent are in uproar over this app; according to a statement, \"Flowering is a difficult skill that takes years to learn; Scent requires no certificate of floristy excellence, and little training, making it dangerous for the public and the environment at large\". However, Scent refutes this saying that \"people know what their getting when they order a bouquet through Scent. Scent cannot possibly be responsible for every flower-picker in Europe\". How should the EU Commission rule on this matter? Should the Silicon Valley stand behind Scent, or vocalise opposition to their case in the European Courts?",
        "options_eu" :{
          "op_title1" : {
            "title" : "Rule with Scent",
            "effects" :
            [ [ "eu_opinion_shift", -.04],
            ["eu_share", -.02],
            ["development_add", .06] ]
          },
          "op_title2" : {
            "title" : "Rule against Scent",
            "effects" :
            [ ["us_share", -.05],
            ["development_add", -.04],
            [ "eu_opinion_shift", .02] ]
          },
          "op_title3" : {
            "title" : "None",
            "effects" : []
          }
        },
        "options_us" : {
          "op_title1" : {
            "title" : "Disagree",
            "effects" :
            [ ["eu_opinion_shift", -.05] ]
          },
          "op_title2" : {
            "title" : "Work with Unions",
            "effects" :
            [ [ "eu_share", .1],
            ["us_company_opinion_shift", .02] ]
          },
          "op_title3" : {
            "title" : "Nothing",
            "effects" :
            [ ["us_company_opinion_shift", -.02] ]
          }
        }
      }
        );

      issues.insert({
           "id": 4,
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
                  ["condition", ["eu_development_add_change", .02],
                      ["eu_opinion_shift", .07],
                      ["eu_opinion_shift", -.03] ]
                ]
              },
              "op_title3": {
                "title": "Force Repayments",
                "effects" : [
                  ["us_share", -.06],
                  ["eu_opinion_shift", -.05]
                ]
              }
            },
            "options_us": {
              "op_title1": {
                "title": "Placate EU",
                "effects": [
                  ["eu_opinion_shift", .02],
                  ["eu_development_add_change",.02],
                  ["development_add", .02]
                ]
              },
              "op_title2": {
                "title": "Refuse to Pay",
                "effects": [
                  ["us_share", -.03],
                  ["eu_opinion_shift", -.02]
                ]
              },
              "op_title3": {
                "title": "Remove EU HQ",
                "effects": [
                   ["eu_opinion_shift", -.05],
                   ["us_company_opinion_shift", -.06],
                   ["eu_devopment_add_change", .02]
                ]
              }
            }
          }
      );

      issues.insert({"id": 2,
        "description": "The world was shocked when the autonomous region of Western Bohemia voted by popular referendum to form an independent nation. The transition was swift, with both the EU and the newly elected Jan Hus Party taking the hard line. However, one of the largest companies from the new country is Kartenzeichner, a mapping company whose products have been used many self-driving research projects throughout Europe. Kartenzeichner have requested access to the Single Digital Market, arguing that their work is crucial to retaining the relevancy of the European tech sector. Currently, the Single Digital Market was restricted to only companies with permanent headquarters in Europe, which Silicon Valley has long called unfair. Kartenzeichner argues that they began their company in the EU, and reminds the Commission that they are a large contributor to software development across the continent.",
        "options_eu": {
          "op_title1": {
            "title": "Deny Access",
            "effects": [
             ["eu_development_add_change", -.025],
             ["development_add", -.025],
             ["eu_opinion_shift",.08],
             ["eu_cross_share", -.02]
            ]
          },
          "op_title2": {
            "title": "Allow Euro Access",
            "effects": [
            [ "eu_opinion_shift", -.1],
             ["eu_cross_share", .02],
             ["eu_devopment_add_change", .04],
             ["development_add", .01]
            ]
          },
          "op_title3": {
            "title": "Allow Global Access",
            "effects": [
             ["eu_devopment_add_change", -.02],
             ["development_add", .08]
            ]
          }
        },
        "options_us": {
          "op_title1": {
            "title": "Support EU Decision",
            "effects": [
             ["us_company_opinion_shift", .02],
             ["eu_opinion_shift", .02]
            ]
          },
          "op_title2": {
            "title": "Demand Equal Access",
            "effects": [
              ["condition", ["development_add", .08], 
                ["us_company_opinion_shift", .1],
                ["us_company_opinion_shift", -.05]
              ],
            ]
          },
          "op_title3": {
            "title": "None",
            "effects" : []
          }
        }});

      issues.insert({"id": 3,
        "description": "Ever since the release of their revolutionary touch screen phone called “the Jet Prime” in 2007, smartphone use has exploded in Europe, with some 90% of Europeans owning a smartphone. The phone’s creator, Yarra, has added features allowing friends to share their locations and whereabouts at any time. However, many in the European tech community have expressed doubt about how the information was being used, and last week, an article came out that Yarra had been selling the location information to the tune of billions a year.",
        "options_eu": {
          "op_title1": {
            "title": "Limit Traffic Info",
            "effects": [
              ["development_add", -.06],
              ["eu_devopment_add_changeeu_", .04],
              ["eu_opinion_shift", .04],
              ["us_company_opinion_shift", .01]
            ]
          },
          "op_title2": {
            "title": "Allow Tracking Info",
            "effects": [
              ["development_add", .02],
              ["eu_devopment_add_change" , -.02],
              ["eu_opinion_shift" , -.02]
            ]
          },
          "op_title3": {
            "title": "Fund Tracking Info",
            "effects": [
              ["eu_devopment_add_change", .04],
              ["development_add", .04],
              ["eu_cross_share", .02]
            ]
          }
        },
        "options_us": {
          "op_title1": {
            "title": "Stop all tracking programs",
            "effects": [
              ["development_add", -.07],
              ["us_company_opinion_shift", .02],
              ["us_share", -.05]
            ]
          },
          "op_title2": {
            "title": "Continue tracking program",
            "effects": [
              ["us_company_opinion_shift", -.05],
              ["us_share", .05]
            ]

          },
          "op_title3": {
            "title": "None"
          }
        }});

      issues.insert({"id": 6,
        "description": "Thank you so much for playing! I hoped you enjoyed it. How would you describe your experience?",
        "options_eu": {
          "op_title1": {
            "title": "I had fun!",
            "effects": [ ]
          },
          "op_title2": {
            "title": "I learned something!",
            "effects": [
            ]
          },
          "op_title3": {
            "title": "Why did I do this?",
            "effects": []
          }
        },
        "options_us": {
          "op_title1": {
            "title": "I had fun!",
            "effects": [ ]
          },
          "op_title2": {
            "title": "I learned something!",
            "effects": []
          },
          "op_title3": {
            "title": "Why did I do this?",
            "effects": []
          }
        }

    });

      issues.insert(
      {
        "id" : 5,
        "description" : "The election of Prime Minister Hans Bjorkstrom Larson in Sweden has raised serious doubts about the use of social media in populist politics. Mr. Larson has a considerable online following, so much so that entire news websites are dedicated to Mr. Larson's politics. His opponents lament the fact that these sites get thousands of shares for every article. They say that these articles are often blatently false, such as the one which reported that opposition leader Sven Hendriksson was running an illegal surstromming operation from his home in Uppsala. They also claim that \"Facebook and Twitter\'s algorithms give unneeded weight to articles that have already been shared, causing the problem we see today. When asked for a comment, Mr. Larson said \"if Facebook and Twitter want to begin censoring news, of course they would start with me\". His office says that social media giants should not be allowed to meddle in Swedish politics, and most polls of Swedes seem to agree. Should the EU Commission consider a case against Google and Facebook to limit the spread of these articles?",
        "options_eu":{
          "op_title1": {
            "title" : "Provide Ultimatum",
            "effects" : 
            [ ["condition", ["eu_opinion_shift", .05],
                      ["eu_opinion_shift", .07],
                      ["us_share", -.08] ] ]
          },
          "op_title2" : {
            "title" : "Sue Facebook",
            "effects" :
            [ ['us_share', -.05 ],
              ['us_company_opinion_shift',-.03],
              ["eu_opinion_shift", -.05] ]
          },
          "op_title3" : {
            "title" : "Back Mr. Larson",
            "effects" : [ ["eu_opinion_shift", -.05] ]
          }
        },
        "options_us" : {
          "op_title1":{
            "title": "Restrict articles",
            "effects" : [
              ["us_company_opinion_shift", -.03]
            ]
          },
          "op_title2":{
            "title": "Continue articles",
            "effects" : [
              ["us_company_opinion_shift", .04]
            ]
          },
          "op_title3":{
            "title": "None"
          }
        }
      });

      

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
              "effects": [ ["development_add", -.04],
                ["eu_cross_share", .15],
                ["eu_opinion_shift", .02] ]
              
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
              "description": "Silicon Valley is free market run amok, we must warn our citizens about their dangers!",
              "effects": [ ["us_company_opinion_shift", -.02] ]
            }
        );
        actions.insert(
          {
              "id" : 5,
              "title": "Add offices in a European City",
              "description": "This will build good faith with the EU and employ European software engineers and marketing specialists, but will cause some disquiet from American workers",
              "effects": [ ["development_add", .04 ], ["us_company_opinion_shift", -.03 ] ]
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
      params.upsert({'id' : 21}, {$set : {
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
                      'us_share_perc' : Math.round(100 * s.us_share_percent()),
                      'last_turn_us' : s.last_turn_us,
                      'last_turn_eu' : s.last_turn_eu,
                      'eu_dev' : s.eu_dev
                  }});
      console.log(params.find().fetch());
      console.log("EU dev: " + s.eu_development);
      console.log("US dev: " + s.us_development);
      console.log("Dev add: " + s.development_add);
  }

  function Simulation(){
      //Check constants
      this.turn = 1;
      this.domestic_share = 18000000; 
      this.us_share = 27000000;
      this.eu_cross_share = 2000000;
      this.last_turn_eu = [];
      this.last_turn_us = [];
      this.total_share = function (){
          return this.domestic_share + this.us_share + this.eu_cross_share;
      }

      this.domestic_factor = 1;
      this.us_factor = 1;
      this.eu_cross_factor = 1;

      //Version 2
      this.eu_capital = 100;
      this.us_capital = 1000;
      
      this.us_development = 0;
      this.eu_development = 0;
      this.development_add = .05;
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
              this.eu_dev *= change_val;
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

      this.change_added = function(changes, change){
        for (c in changes){
          if( c[0] == change[0] )
            return true;
        }
        return false;
      }


      this.next_turn = function(changes) {
          this.last_turn_eu = [];
          this.last_turn_us = [];
          non_cond_changes = [];
          //calculate the non-conditionals first
          for (var i in changes){
             console.log(changes[i]);
             console.log("*******************");
              if(changes[i][0][0] != "condition") {
                  var change_type = changes[i][0][0];
                  var change_val = changes[i][0][1];
                  this.change_sim(change_type, change_val);
                  non_cond_changes.push(changes[i][0]);
                  //Add option
              if(changes[i][1][2] == true){
                //Ensure each one is only added once
                if(!this.change_added(this.last_turn_eu, changes[i]))
                  this.last_turn_eu.push(changes[i]);
              } else {
                if(!this.change_added(this.last_turn_us, changes[i]))
                  this.last_turn_us.push(changes[i]);
              }
              }

          }
          console.log("---------")
          console.log(non_cond_changes);

          console.log("...........")
          //The conditionals
          for (var i in changes){
            if(changes[i][0][0] == "condition"){
              console.log("Conditional change: ")
              console.log(changes[i][0][1]);
                  if(array_exists(non_cond_changes, changes[i][0][1])){
                    console.log("Took: " + changes[i][0][2]);
                    this.change_sim(changes[i][0][2][0], changes[i][0][2][1]);
                  } else{
                    console.log("Passed " + changes[i][0][3]);
                    this.change_sim(changes[i][0][3][0], changes[i][0][3][1]);
                  }
              }
          }

          console.log(".........")

          this.us_development += this.development_add * (1. + this.us_development / 20) * 2 * (1 - this.eu_dev);
          this.eu_development += this.development_add * (1. + this.eu_development / 20) * 2 * this.eu_dev;

          //Will increase as simulation goes on
          var total_growth = this.total_dev() * this.total_share();
          var total_dev = this.total_dev();
          this.eu_dev = this.eu_development / total_dev;
          this.us_share += total_growth * (1 - this.eu_dev) * this.us_company_opinion * 2;
          this.domestic_share += total_growth * this.eu_dev;
          this.eu_cross_share += total_growth * this.eu_dev * this.eu_opinion;

          this.turn += 1;

          if(this.turn == 7){
            process.exit();
          }

          initialise_params(this);

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
}
