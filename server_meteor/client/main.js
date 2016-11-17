import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';
var actions = new Mongo.Collection("actions");
var simulation_params = new Mongo.Collection("simulation_params");
var issues = new Mongo.Collection("issues");
var changes = new Mongo.Collection("changes");

console.log(FlowRouter.getParam('team'));

Template.main_display.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.main_display.helpers({
  counter() {
    return Template.instance().counter.get();
  },
  'action': function(){
  	var a = actions.find({"id" : {$lt : 5}} );
  	return a;
  },
  'issue' : function(){
  	var a = issues.findOne({"id" : 1});
  	return a;
  },
  'simparams' : function(){
  	return simulation_params.findOne({"id" : 21});
  },
  'dev' : function(){
  	return simulation_params.findOne({"id" : 21}).development * 100;
  },
  'eu_opinion_check' : function(){
  	return simulation_params.findOne({"id" : 21}).eu_opinion >= 50;
  },
  'eu_sales_check' : function(){
  	return simulation_params.findOne({"id" : 21}).eu_share_perc >= 50;
  },
  'eu_cross_check' : function() {
  	return simulation_params.findOne({"id" : 21}).eu_cross_check >= 15;
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
  'is_eu' : function(){
  	return FlowRouter.getParam('team') != "us";
  },
  'is_us' : function(){
  	return false;
  }
});

Template.main_display.events({
  'click .next'(event, instance) {
    // increment the counter when button is clicked
    changes = [];
    console.log(FlowRouter.getParam('team'));
    if(FlowRouter.getParam('team') != "us"){
	    for(var i = 1; i <= 4; i++){
	    	if(document.getElementById("action_" + i).checked){
	    		var act = actions.findOne({"id" : i}).effects;
	    		for(var k = 0; k < act.length; k++){
	    			changes.push(act[k]);
	    		}
	    	}
	    }
	} else {
		for(var i = 5; i <= 8; i++){
	    	if(document.getElementById("action_" + i).checked){
	    		var act = actions.findOne({"id" : i}).effects;
	    		for(var k = 0; k < act.length; k++){
	    			changes.push(act[k]);
	    		}
	    	}
	    }
	}
    //changes.insert({"eu" : changes});
    Meteor.call('change_action', changes);
  }
});

simulation_params.find().observeChanges({
    added : function(id, object){
        console.log("added " + id);
    }
});

FlowRouter.route('/'

);

//Figure this out
function google_chart(cross, us, eu){
	google.charts.load('current', {'packages':['corechart']});
	  google.charts.setOnLoadCallback(drawChart);
	  function drawChart() {

	    var data = google.visualization.arrayToDataTable([
	      ['Task', 'Bn of Euros'],
	      ['Cross-EU sales', cross],
	      ['Domestic sales',  eu],
	      ['Colour placeholder', 0],
	      ['US sales',  us]
	    ]);

	    var options = {
	      backgroundColor: '#83aff7',
	      legend: 'position: none',
	      title: 'European Tech Sector Breakdown'
	    };

	    var chart = new google.visualization.PieChart(document.getElementById('piechart'));

	    chart.draw(data, options);
		}
}

function update_chart(){
	google_chart(simulation_params.findOne({"id" : 21}).domestic_share,
		simulation_params.findOne({"id" : 21}).us_share,
		simulation_params.findOne({"id" : 21}).eu_cross_share);
}

google_chart(4,20,15);
