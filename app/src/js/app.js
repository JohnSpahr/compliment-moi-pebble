var UI = require('ui');
var Feature = require('platform/feature');
var ajax = require('ajax');
var complimentData = [];
var bigBrain = false;
const listURL = "https://raw.githubusercontent.com/JohnSpahr/compliment-moi-pebble/main/compliments.json";

//get compliment list...
ajax({ url: listURL, type: 'json' },
  function(data) {
    complimentData = data;
  }
);

//home screen
var homeCard = new UI.Card({
  title: 'Welcome!',
  body: 'Compliment Moi for Pebble',
  scrollable: false,
  action: {
    backgroundColor: Feature.color('electric-ultramarine', 'black'),
    up: 'images/bigbrain.png',
    select: 'images/start.png',
    down: 'images/info.png',
  }
});

//compliment screen
var complimentCard = new UI.Card({
  title: "Voila!",
  scrollable: true,
  action: {
    backgroundColor: Feature.color('orange', 'black'),
    up: 'images/up.png',
    select: 'images/refresh.png',
    down: 'images/down.png'
  }
});

//info screen
var infoCard = new UI.Card({
  title: 'App Info',
  body: 'Version 1.2\n\nCreated by John Spahr\n\ntectrasystems.org\n\ngithub.com/johnspahr/compliment-moi-pebble\n\nThanks for trying out my first Pebble app!',
  scrollable: true,
  action: {
    backgroundColor: Feature.color('vivid-violet', 'black'),
    up: 'images/up.png',
    down: 'images/down.png'
  }
});

//big brain mode settings screen
var bigBrainCard = new UI.Card({
  title: 'Big Brain Mode',
  body: 'When enabled, this setting sometimes specifically tailors compliments to better match the current time of day.',
  scrollable: true,
  action: {
    backgroundColor: Feature.color('jazzberry-jam', 'black'),
    up: 'images/up.png',
    select: 'images/disabled.png',
    down: 'images/down.png'
  }
})

//show home screen
homeCard.show();

//handle home screen button presses
homeCard.on('click', function(e) {
  switch (e.button) {
    case "up":
      //big brain mode
      bigBrainCard.show();
      setupBigBrain()
      break;
    case "select":
      //start
      complimentCard.show();
      loadCompliment();
      break;
    case "down":
      //about
      infoCard.show();
      break;
  }
});

//handle big brain mode settings screen button presses
bigBrainCard.on('click', function(e) {
  if (e.button == "select") {
    //toggle big brain mode status
    if (!bigBrain) {
      //enable big brain mode
      bigBrain = true;
      localStorage.setItem('bigBrainMode', 1); //save setting
      bigBrainCard.action('select', 'images/enabled.png');
      bigBrainCard.title("Big Brain Mode: Enabled");
    } else {
      //disable big brain mode
      bigBrain = false;
      localStorage.setItem('bigBrainMode', 0); //save setting
      bigBrainCard.action('select', 'images/disabled.png');
      bigBrainCard.title("Big Brain Mode: Disabled");
    }
  }
});

//when center button clicked on compliment screen...
complimentCard.on('click', function(e) {
  //refresh compliment
  loadCompliment();
});

//get current big brain mode status when settings page opened
function setupBigBrain() {
  if (localStorage.getItem('bigBrainMode') == 1) {
    //if big brain mode is on...
    bigBrainCard.action('select', 'images/enabled.png');
    bigBrainCard.title("Big Brain Mode: Enabled");
    bigBrain = true
  } else {
    //if big brain mode is off...
    bigBrainCard.action('select', 'images/disabled.png');
    bigBrainCard.title("Big Brain Mode: Disabled");
    bigBrain = false
  }
}

//load compliment and display it
function loadCompliment() {
  //pick random compliment from compliment list
  var currentDate = new Date();
  var selectedList = complimentData.anytime;
  //25% chance of a big brain response if enabled...
  if (localStorage.getItem('bigBrainMode') == 1 && Math.floor(Math.random() * 4) == 0) {
    //check time if big brain mode is enabled and big brain response is picked
    if (currentDate.getHours() >= 5 && currentDate.getHours() <= 11) {
      //set to morning list if 5 AM or later and 11 AM or earlier
      selectedList = complimentData.morning;
    } else if (currentDate.getHours() >= 20 || currentDate.getHours() <= 4) {
      //set to evening list if 8 PM or later or 4 AM or earlier
      selectedList = complimentData.evening;
    }
  }
  
  //randomly pick compliment
  complimentCard.body(selectedList[Math.floor(Math.random() * selectedList.length)]);
}