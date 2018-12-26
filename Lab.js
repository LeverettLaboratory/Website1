/* Here are the javascript functions for the main Lab pages */

// This code runs when any page with the LabFooter is loaded

// Look for an element called timeNow, replace it with the current time.
var d = new Date();
var x = document.getElementById("timeClient");
if(x!=null){
	var timeClient = d.getTime();
	
	x.innerHTML = timeClient;
}
x = document.getElementById("timeClientText");
if(x!=null){
	x.innerHTML = d.toLocaleString();
}
x = document.getElementById("timeDelta");
if(x!=null){
	var x2 = document.getElementById("timeServer");
	if(x2!=null){
		var timeServer = x2.innerHTML;
		x.innerHTML = timeServer-timeClient;
	}
}

// Look for an element called screenSize and fill it with pixel dimensions
var y = document.getElementById("screenSize");
if(y!=null){
	y.innerHTML = "This window is "+ window.innerWidth +" wide by "+window.innerHeight+" high."
}