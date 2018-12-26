// LabTest.js contains the javascipts to run the LabTest.php page


// request 1 is an XHR object
var request1 = false;
try{
    request1 = new XMLHttpRequest();
}catch(failed){
    request1 = false;
}
if(!request1){
    alert("Error initializing XMLHttpRequest 1");
}

var fullScale = 1000;
var data0 = 1;
var data1 = 2;
var data2 = 3;

// Here is the gauge setup
 var optsNew = {

		  lines: 12, // The number of lines to draw
		  angle: 0.15, // The length of each line
		  lineWidth: 0.3, // The line thickness
		  pointer: {
		    length: 0.8, // The radius of the inner circle
		    strokeWidth: 0.035, // The rotation offset
		    color: '#000000' // Fill color
		  	},
		  colorStart: '#6FADCF',   // Colors
		  colorStop: '#8FC0DA',    // just experiment with them
		  strokeColor: '#E0E0E0',   // to see which ones work best for you
		  generateGradient: true
 		};

/* gauges should be named for the data they will show, these names must match what is held in the
 * Shared singleton's map so they can be updated with the correct values.  The status update will
 * send a JSON (java script object notation) encoded text string that gets evaluated by this script.
 */

var gaugeBattery = new Gauge(document.getElementById('canvas0')).setOptions(optsNew); // create sexy gauge!
gaugeBattery.maxValue = fullScale; // set max gauge value
gaugeBattery.animationSpeed = 32; // set animation speed (32 is default value)
gaugeBattery.set(fullScale*0.75); // set actual value
gaugeBattery.render();
 
var gaugeSignal = new Gauge(document.getElementById('canvas1')).setOptions(optsNew); // create sexy gauge!
gaugeSignal.maxValue = fullScale; // set max gauge value
gaugeSignal.animationSpeed = 32; // set animation speed (32 is default value)
gaugeSignal.set(fullScale*0.25); // set actual value
gaugeSignal.render();

var gaugePitch = new Gauge(document.getElementById('canvas2')).setOptions(optsNew); // create sexy gauge!
gaugePitch.minValue = -fullScale; // set max gauge value
gaugePitch.maxValue = fullScale; // set max gauge value
gaugePitch.animationSpeed = 32; // set animation speed (32 is default value)
gaugePitch.set(fullScale*0.5); // set actual value
gaugePitch.render();


// document scope click handler
document.onclick = function clickHandler(event){
	var target = event.target;
	var text = target.innerHTML;
	var id = target.id;
	
	
	if(id=="buttonUpdate"){
		updateRequest(123);		
	}
}

function updateRequest(data){
	// This uses request1 object to send key commands
	var url = "/TestOne/LabTest?data="+data+"&timestamp="+new Date().getTime();
    request1.open("GET",url,true);
    request1.onreadystatechange = updateReply;	
    request1.send(null);
    document.getElementById("status").innerHTML = "updateRequest : "+data;
   
}
/* This accepts replies generated request1 */
function updateReply(){
    if(request1.readyState==4){
        if(request1.status==200){        	
            document.getElementById("status").innerHTML = request1.responseText;
            // servlet response is JSON text
            var sensorData = eval(request1.responseText);
            var sensorGauge = "none";
            var sensori = 0;
            for(sensori=0;sensori<sensorData.length;sensori++){
	            sensorGauge = "gauge"+sensorData[sensori].label;
	            if(sensorGauge != null){
	                eval(sensorGauge+".set(sensorData["+sensori+"].value);");
	            }else{
	            	alert(sensorGauge+" not found");
	            }
        	}
            //            eval("gauge"+sensorData[0].label+".set(sensorData[0].value);");
            //gaugeBattery.set(sensorData[0].value);
            //gaugeSignal.set(sensorData[1].value);
            //gaugePitch.set(sensorData[2].value);
        }else{
        	document.getElementById("status").innerHTML = "Request 1 fails with error code " + request1.status; 
        }
    }
}

		 		
