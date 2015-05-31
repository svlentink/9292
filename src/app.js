/*
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
*/

/**
* This is a personal project, not related to any company,
* 9292 just has a public rest api, I never requested and/or got their
* permission to use these 4 digits (i.e. 9292) and/or anything other
* related and/or of this company.
*
* To all dev.; Please use my code (Github Fork) to improve the user experience,
* my strenght/goal has not been to design a GUI.
*
* For this app, I used the documentation of the api found at:
* https://github.com/timvanelsloo/9292-api-spec
*
* @author svlentink
* @date 2015/05/30
*/


var UI = require('ui'),
	Vector2 = require('vector2'),
	statusBarHeight = 18, //pixels
	ajax = require('ajax'),
	userPreferences = {
		updateScreenIntervalInSec : 60,
		defaultDestination: "utrecht/stationsplein-200", //e.g. your bicyclye location https://api.9292.nl/0.1/locations?lang=nl-NL&latlong=52.08881,5.11173
		destinations : [{
				label : 'work',
				days : '12345', // 1 = monday
				fromTime: 6,
				toTime : 13,
				location : 'amsterdam/henk-sneevlietweg-759' // a 9292 location; https://api.9292.nl/0.1/locations?lang=nl-NL&latlong=52.34396,4.82862
			},{
				label : 'church',
				days : '0', // 0 = sunday
				fromTime: 8,
				toTime : 10,
				location : "amsterdam/halvemaansteeg-19" // https://api.9292.nl/0.1/locations?lang=nl-NL&latlong=52.36660,4.89640
			}
		]
	};


/**
* Please update this method, make it all look pretty
*/
function showJourneyDataOnScreen(receivedData){
	if(receivedData.journeys && receivedData.journeys.length)
		receivedData = receivedData.journeys[0];

	log.debug('Entering showJourneyDataOnScreen',receivedData);

	loading.window.hide();//hide init screen

	var displaying = JSON.stringify(receivedData).substr(0,100),
		window = new UI.Window(),
		item = new UI.Text({
				text:displaying,
				position: new Vector2(0, 0),
				color:'white',
				backgroundColor:'black',
				size: new Vector2(144, (168-statusBarHeight)),
				font: 'GOTHIC_18' ,
				textOverflow: 'wrap',
				textAlign: 'right'
			});
	window.add(item);
	window.show();
}


/**
* Looks at the hour and day to determine where the user wants to go
* if not in array, it uses the default location (e.g. home)
*/
function getDestination(){
	log.debug("Entering getDestination");
	var date = new Date(),
		day = date.getDay(), //0=sunday
		hour = date.getHours(),
		dests = userPreferences.destinations;
	
	for(var i = 0;i<dests.length;i++)
		if(dests[i].days) //safety check
			for(var c = 0; c < dests[i].days.length;c++)
				if(dests[i].days[c] === day && //if today
					dests[i].fromTime <= hour &&
					dests[i].toTime >= hour)
					return dests[i].location;
	
	return userPreferences.defaultDestination;
}


var $={}, //because the whole jquery lib is just to much
	log={};
$.param = function(params){
	log.debug('Entering $.param',params);
	var output = '';
	for(var key in params)
		output += key + '=' + encodeURI(params[key]) + '&';
	
	output = output.substring(0,output.length-1); //remove last &
	return output;
};
/**
* Add preceeding zeros to an int
* @param {int} charCount - the length it should be (e.g. 0023 == 4)
*/
Number.prototype.preZeros = function(charCount){
	var result = this.toString();
	while(result.length < charCount)
		result = '0' + result;
	return result;
};
Date.getLogTime = function(date){
	date = date || new Date();

	return date.toTimeString().substring(0,8) +
	'.' + date.getMilliseconds().preZeros(3);
};
function genTextLog(level, desc, obj){
	var time = Date.getLogTime(),
		output;

	output = time + '\t' +
		level + '\t' +
		desc + ' {';

	for(var key in obj)
		output += '\n\t' + key + ' :\t' + (typeof obj[key] === 'object')?JSON.stringify(obj[key]):obj[key];

	return output += ' }';
}
log.debug = function (desc, obj){
	var lvl = 'log';
	//chrome supports console.debug, node doesn't
	if(typeof console[lvl] !== 'function')
		lvl = 'log';

	console[lvl]( genTextLog(lvl, desc, obj) );
};



/**
* Loading screen that looks like the logo of 9292
*/
var loading = {};
function showLoadingScreen(){
	log.debug('Entering showLoadingScreen');
	// Show splash screen while waiting for data
	loading.window = new UI.Window();
	loading.font = 'ROBOTO_BOLD_SUBSET_49'; //https://developer.getpebble.com/blog/2013/07/24/Using-Pebble-System-Fonts/
	loading.textOverflow = 'wrap';
	loading.textAlign = 'center';
	loading.size = new Vector2((144/2), (168/2));
	loading.x = 144;
	loading.y = 168-statusBarHeight;
	loading.items = [
		new UI.Text({
			text:'9',
			position: new Vector2(0, 0),
			color:'white',
			backgroundColor:'black',
			size: loading.size,
			font: loading.font,
			textOverflow: loading.textOverflow,
			textAlign: loading.textAlign
		}),
		new UI.Text({
			text:'2',
			position: new Vector2((loading.x/2), 0),
			color:'black',
			backgroundColor:'white',
			size: loading.size,
			font: loading.font,
			textOverflow: loading.textOverflow,
			textAlign: loading.textAlign
		}),
		new UI.Text({
			text:'9',
			position: new Vector2(0, (loading.y/2)),
			color:'black',
			backgroundColor:'white',
			size: loading.size,
			font: loading.font,
			textOverflow: loading.textOverflow,
			textAlign: loading.textAlign
		}),
		new UI.Text({
			text:'2',
			position: new Vector2((loading.x/2), (loading.y/2)),
			color:'white',
			backgroundColor:'black',
			size: loading.size,
			font: loading.font,
			textOverflow: loading.textOverflow,
			textAlign: loading.textAlign
		})
	];
	for(var li=0;li<loading.items.length;li++)
		loading.window.add(loading.items[li]);
	loading.window.show();
}




/**
* The next part sets the location to the location variable.
* The code is based on:
* http://developer.getpebble.com/guides/js-apps/pebblekit-js/js-capabilities#getting-position-updates
*/
var locTimeout = false;
var locationOptions = {
	enableHighAccuracy: true, 
	maximumAge: 1000 * userPreferences.locationUpdateIntervalInSec,
	timeout: 5000
};
function locationSuccess(pos) {
	log.debug('Received position',pos);
	locTimeout = false;
	updateScreen(pos);
}
function locationError(err) {
	locTimeout = false;
	console.log('location error (' + err.code + '): ' + err.message);
}
function updateLocation(){
	log.debug("Entering updateLocation");
	
	locTimeout = true;
	setTimeout(function(){
		if(locTimeout) log.debug("location request timed out");
	},5000);
	
	navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationOptions);
}



//vars to easy update the api, when changed
var version = '0.1',
	baseUrl = 'https://api.9292.nl/';




/**
* 9292 want a fixed point to route from,
* For this reason, we transform the current
* geolocation to a 9292 know point
* For more info:
* // https://github.com/timvanelsloo/9292-api-spec/blob/master/docs/resources/journeys.md
*/
function getLocTo9292locId(lat, long, callback){
	log.debug('Entering getLocTo9292locId',{lat:lat,long:long});
	var latlong = lat + ',' + long,
		queryParams = {
			lang : 'nl-NL',
			latlong : latlong,
			rows : 1 //max = 10, but for ease, we only use one
		},
		paramStr = $.param(queryParams),
		URL = baseUrl + version + '/locations?' + paramStr;

	log.debug('Url in getLocTo9292locId',{url:URL});

	ajax({
			url: URL,
			type: 'json'
		},
		function(data) {
			log.debug('Successfully fetched location id!',data);
			if(callback && data.locations && data.locations[0])
				callback(data.locations[0].id);
			else if(callback)
				callback(data);
		},
		function(error) {
			log.debug('Failed fetching in getLocTo9292locId',error);
			if(callback)
				callback(error);
		}
	);
}

function getNow(){
	var date = new Date();
	return date.getFullYear() + '-' + (date.getMonth() + 1).preZeros(2) + '-' + date.getDate().preZeros(2) + 'T' + date.getHours() + date.getMinutes();
	//return date.toJSON().substr(0,7)
}


/**
* TODO description..
*
* @param {string} from9292loc Current location
* @param {string} to9292loc Destination string that is a known location to 9292 (e.g. 'station-amsterdam-centraal')
* For more info:
* // https://github.com/timvanelsloo/9292-api-spec/blob/master/docs/resources/journeys.md
*/
function getJourney(from9292loc,to9292loc,callback){
	log.debug('Entering getJourney',{from:from9292loc,to:to9292loc});
	var queryParams = {
			before : 1,
			sequence : 1,
			byFerry : true,
			bySubway : true,
			byBus : true,
			byTram : true,
			byTrain : true,
			lang : 'nl-NL', //only option available
			from : from9292loc,
			dateTime : getNow(),
			searchType : 'departure',
			interchangeTime : 'standard',
			after : 5,
			to : to9292loc
		},
		paramStr = $.param(queryParams),
		URL = baseUrl + version + '/journeys?' + paramStr;

	log.debug('Url in getJourney',{url:URL});

	ajax({
			url: URL,
			type: 'json'
		},
		function(data) {
			log.debug('Successfully fetched journey',data);
			if(callback)
				callback(data);
		},
		function(error) {
			log.debug('Failed fetching in getJourney', error);
			if(callback)
				callback(error);
		}
	);
}


function updateScreen(location){
	log.debug('Entering updateScreen');
	if(! (location && location.coords))
		return log.debug('Error, no location found in updateScreen');

	getLocTo9292locId(location.coords.latitude, location.coords.longitude, function(inp){
		var from9292loc = inp,
			to9292loc = getDestination(),
			callback = showJourneyDataOnScreen;
		getJourney(from9292loc,to9292loc,callback);
	});
}

showLoadingScreen();
updateLocation(); //triggers the update screen
setInterval (
	updateLocation,
	userPreferences.updateScreenIntervalInSec * 1000
); //http://stackoverflow.com/questions/26433309/pebble-js-update-view-frequently