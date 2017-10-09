require("dotenv").config()
var cutebot = require("cutebot");

var twitter_deets = {
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
};

var bot = new cutebot(twitter_deets);

var conwarray = [];
var old = [];
var width = 6;
var height = 11;
var off = "⬛️";
var on = "⬜️";
var birth = [false,false,false,true,false,false,false,false,false];
var life = [false,false,true,true,false,false,false,false,false];
var kernel = [
    [-1,-1],
    [-1,0],
    [-1,1],
    [0,-1],
    [0,1],
    [1,-1],
    [1,0],
    [1,1]
]
function mod(x,n){
    return ((x%n)+n)%n;
}
function randomise(){
    for (var i=0;i<width*height;i++){
        conwarray[i] = Math.random()>0.5;
    }
    old = [];
}
function clone(){
    var c = []
    for (var i = 0; i<conwarray.length; i++){
        c[i] = conwarray[i];
    }
    return c;
}
function compare(c){
    for (var i = 0; i<conwarray.length; i++){
        if (c[i]!=conwarray[i]){
            return false;
        }
    }
    return true;
}

function compareAll(){
  for (var i = 0; i < old.length; i++) {
    if (compare(old[i])){
      return true;
    }
  }
  return false;
}

function itoxy(i){
    return [mod(i,width),mod(Math.floor(i/width),height)];
}
function xytoi(x,y){
    return mod(x+y*width,width*height);
}

function sim(){
    old.push (clone());
    conwarray = conwarray.map(function(row,i){
        var xy = itoxy(i);
        var x = xy[0];
        var y = xy[1];
        var count = 0;
        for (var k = 0; k<kernel.length; k++){
            var ni = xytoi(x+kernel[k][0],y+kernel[k][1]);
            if (conwarray[ni]) count++;
        }
        if (conwarray[i]){
            return life[count];
        } else {
            return birth[count];
        }
    });
    return compareAll();
}



function conwaystring(){
    var s = "";
    for (var x = 0; x<width; x++){
        for (var y = 0;y<height; y++){
            s+=(conwarray[xytoi(x,y)] ? on : off);
        }
        s+="\n";
    }
    return s;
}

function simandprint(){
    if (sim()){
        console.log("Repetition!");
        randomise();
    }
    return conwaystring();
}

bot.custom(simandprint);


function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}


randomise();

function step(){
  var looped = sim();
  if (looped){
    bot.tweet("Loop detected\nRandomising state\nBegin sequence n°"+s4()+"."+s4());
    randomise();
    bot.tweet(conwaystring());
  } else {
    bot.tweet(conwaystring());
  }
  
  setTimeout(step,1000*60*60);
}

bot.tweet = function(status) {
  this.client.post('statuses/update', {status: status},  function(error, tweet, response) {
    if(error) console.log(error);
    console.log("Tweeted: "+status);  // Tweet body. 
  });
}

bot.tweet("Server restarted\nRandomising state\nBegin sequence n°"+s4()+"."+s4());
setTimeout(step, 5000);











