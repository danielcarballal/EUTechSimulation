actions = new Mongo.Collection('actions');

import './styles/loader.js';
import './styles/bootstrap.js';
import './styles/toggle.css';
import './styles/bootstrap2.css';
//import './styles/jquery.js';

// Work so that hovering is a bit more natural
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

    function insert_all_actions() {
      actions.insert(
        {
          id:"1",
          title:"Give Tax Breakes for Tech",
          description:"As a sign of good faith, we will give tax breaks for both European and American companies willing to employ European software engineers. This will help the tech economy greatly, but hurt our public image",
          effects:{
            type:"eu_share"
          }
        });
    }