import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';
var actions = new Mongo.Collection("actions");
var simulation_params = new Mongo.Collection("simulation_params");
var issues = new Mongo.Collection("issues");
var changes = new Mongo.Collection("changes");
var dialog = new Mongo.Collection("dialog");

var is_eu = false;
var name = "Charles";

Template.leaderboard.helpers({
	//Note the switch: We want last turn from the other team
	'last_turn_eu': function(){
		return simulation_params.findOne({"id" : 21})['last_turn_us'];
	},
	'last_turn_us': function(){
		return simulation_params.findOne({"id" : 21})['last_turn_eu'];
	},
	'is_eu' : function(){
		return is_eu;
	}
});

Template.main_display.helpers({
  counter() {
    return Template.instance().counter.get();
  },
  'eu_actions': function(){
  		return actions.find({"id" : {$lt : 5}} );
  	},
  	'us_actions': function(){
  		return actions.find({"id" : {$gt : 4}} );
  },
  'issue' : function(){
  	var a = issues.findOne({"id" : simulation_params.findOne({"id" : 21}).turn});
  	return a;
  },
  'simparams' : function(){
  	return simulation_params.findOne({"id" : 21});
  },
  'dev' : function(){
  	return simulation_params.findOne({"id" : 21}).development * 100;
  },
  'eu_cross' : function(){
  	return simulation_params.findOne({"id" : 21}).eu_cross_share_perc;
  },
  'eu_opinion_check' : function(){
  	return simulation_params.findOne({"id" : 21}).eu_opinion >= 55;
  },
  'us_opinion_check' : function(){
  	return simulation_params.findOne({"id" : 21}).us_opinion >= 55;
  },
  'eu_sales_check' : function(){
  	return simulation_params.findOne({"id" : 21}).eu_share_perc >= 50;
  },
  'eu_cross_check' : function() {
  	return simulation_params.findOne({"id" : 21}).eu_cross_share_perc >= 15;
  },
  'us_sales_check' : function(){
  	return simulation_params.findOne({"id" : 21}).us_share_perc >= 50;
  },
  'dev_check' : function(){
  	return simulation_params.findOne({"id" : 21}).development >= 50;
  },
  'ok' : function(){
  	return "glyphicon-ok green";
  }, 
  'no' : function() {
  	return "glyphicon-minus red";
  },
  'comment' : function(){
  	return dialog.find({},{sort: {'num': -1}});
  }
});


Template.sim_goals.helpers({
'is_eu' : function(){
  	return FlowRouter.getParam('_team') == "eu";
  }
});

Template.main_display.events({
  'click .next'(event, instance) {
    // increment the counter when button is clicked
    changes = [];
    if(is_eu){
	    oForm = document.forms[0];
	    var option = [];
	    var option_title = "None";
	    var value = oForm.elements["option"].value;
	    var t = simulation_params.findOne({"id" : 21}).turn;
	    if(value == 1){
	    	option = issues.findOne({"id" : t}).options_eu.op_title1.effects;
	    	option_title = issues.findOne({"id" : t}).options_eu.op_title1.title;
	    } else if(value == 2){
	    	option = issues.findOne({"id" : t}).options_eu.op_title2.effects;
	    	option_title = issues.findOne({"id" : t}).options_eu.op_title2.title;
	    } else if(value == 3){
	    	option = issues.findOne({"id" : t}).options_eu.op_title3.effects;
	    	option_title = issues.findOne({"id" : t}).options_eu.op_title3.title;
	    }

	    for(var k = 0; k < option.length; k++){
	    	changes.push([option[k], [option_title, 0, true]] );
	    }

	    for(var i = 1; i <= 4; i++){
	    	if(document.getElementById("action_" + i).checked){
	    		var act = actions.findOne({"id" : t}).effects;
	    		for(var k = 0; k < act.length; k++){
	    			changes.push([act[k], [act.title, 1, true]]);
	    		}
	    	}
	    }
	    console.log("EU : " + changes);
	    Meteor.call('add_dialog', "Team", "EU", "We made a decision for this turn");
	} else {
	    oForm = document.forms[0];
	    var option = [];
	    var option_title = "None";
	    var value = oForm.elements["option"].value;
	    var t = simulation_params.findOne({"id" : 21}).turn;
	    console.log(value);
	    if(value == 1){
	    	option = issues.findOne({"id" : t}).options_us.op_title1.effects;
	    	option_title = issues.findOne({"id" : t}).options_us.op_title1.title;
	    } else if(value == 2){
	    	option = issues.findOne({"id" : t}).options_us.op_title2.effects;
	    	option_title = issues.findOne({"id" : t}).options_us.op_title2.title;
	    } else if(value == 3){
	    	option = issues.findOne({"id" : t}).options_us.op_title3.effects;
	    	option_title = issues.findOne({"id" : t}).options_us.op_title3.title;
	    }

	    for(var k = 0; k < option.length; k++){
	    	changes.push([option[k], [option_title, 1, false]]);
	    }  
	    for(var i = 5; i <= 8; i++){
	    	if(document.getElementById("action_" + i).checked){
	    		var act = actions.findOne({"id" : i}).effects;
	    		for(var k = 0; k < act.length; k++){
	    			changes.push([act[k], [option_title, 2, false]]);
	    		}
	    	}
	    }
	    console.log("US : " + changes);
	    Meteor.call('add_dialog', "Team", "US", "We made a decision for this turn");
		}
	    
	    $(".btn-group button").click(function () {
	    	$("#buttonvalue").val($(this).text());
		});
	    Meteor.call('change_action', is_eu, changes);
	},
	'click .dialog'(event, instance){
		var value = document.getElementById("dialog_box").value;
		if(is_eu){
			Meteor.call('add_dialog', name, "EU", value);
		} else {
			Meteor.call('add_dialog', name, "US", value);
		}
	},
	'keypress .dialog_box'(instance){
		console.log(event);
	}
});

Template.european_home.events({
	'click .us_click'(event, instance){
		name = document.getElementById("name").value;
		BlazeLayout.render('main_display', {is_eu : false});
		is_in_main_display = true;
	},
	'click .eu_click'(event, instance){
		name = document.getElementById("name").value;
		BlazeLayout.render('main_display', {is_eu : true});
		is_eu = true;
		is_in_main_display = true;
	}
});

var is_in_main_display = false;

simulation_params.find().observeChanges({
    changed : function(){
    	if(is_in_main_display){
    		//BlazeLayout.render('contain', {main : 'main_display'});
    		console.log(simulation_params.find({"id" : 21}).fetch());
    		BlazeLayout.render('leaderboard', {is_eu : is_eu});
    		BlazeLayout.render('main_display', {is_eu : is_eu});
    	}
    }
});

dialog.find().observeChanges({
	insert :function(a,b){
		console.log("Inserted");
	},
	changed : function(){
		console.log("Changed");
	}
});

Template.sim_goals.events({
	'click .jsbtn'(event, instance){
		BlazeLayout.render('main_display', {is_eu : true});
	}

});

Template.contain.events({
	'click .us_click'(event, instance){
		console.log("US clicked");
	},
	'click .eu_click'(event, instance){
		console.log("EU clicked");
	}

});

Template.contain.helpers({
	eu() { return ["team", "eu"] },
	us() { return ["team", "us"] }
})


//Testing only
FlowRouter.route('/main_display.html/:_team', {
	name: 'main_display',
	action(params){
		BlazeLayout.render('main_display', {team : FlowRouter.getParam('_team')});
		is_in_main_display = true;
	}
}
);

//Testing only
FlowRouter.route('/home', {
	name: 'european_home',
	action(){
		BlazeLayout.render('european_home');
	}
});

//Leaderboard, to be used by sim runner
FlowRouter.route('/leaderboard', {
	name: "leaderboard",
	action(){
		BlazeLayout.render("leaderboard");
	}
});

//Main enterance
FlowRouter.route('/', {
	name: 'container',
	action(){
		BlazeLayout.render('contain', {main : 'european_home'});
	}
});

function update_chart(){
	google_chart(simulation_params.findOne({"id" : 21}).domestic_share,
		simulation_params.findOne({"id" : 21}).us_share,
		simulation_params.findOne({"id" : 21}).eu_cross_share);
}

//google_chart(4,20,15);
