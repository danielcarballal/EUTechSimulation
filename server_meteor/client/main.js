import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';
var actions = new Mongo.Collection("actions");
var simulation_params = new Mongo.Collection("simulation_params");
var issues = new Mongo.Collection("issues");

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
  'turn' : function(){
  	console.log(simulation_params.find());
  	return simulation_params.find();
  }
});

Template.main_display.events({
  'click .next'(event, instance) {
    // increment the counter when button is clicked
    console.log("GOING NEXT");
  },
});

function hover(x) {
  x.childNodes[1].childNodes[1].style.display = "none";
  x.childNodes[1].childNodes[3].style.display = "none"; 
  x.childNodes[1].childNodes[5].style.display = "block";
  x.style.background = "black";
}
function unhover(x) {
  x.childNodes[1].childNodes[1].style.display = "block";
  x.childNodes[1].childNodes[3].style.display = "block"; 
  x.childNodes[1].childNodes[5].style.display = "none";
  x.style.background = "#83aff7";
}

