/* This javascript should be included on every bot controller page.  This contains generalized scripts.
 * The particular settings, strings, and parameters for a bot should be defined in a separate .js file
 * that must precede this file in order of loading so this file can use those pre-defined variables.
 * 
 * Dr Tom Flint, Leverett Laboratory, 29 Jan 2014
 * 
 */


/* Required variables for this set of scripts to work:
 * 
 * var botNum = 8;
 * var imageType = 1;
 * var imageSrcPre = "/TestOne/PlainCam1?bot=8&cam=4&";
 * var imageSrcPost="&timestamp=";
 *
 * var cmdString = "/TestOne/Bot8Cmd?command=";
 * 
 */


/* here we add scripts using XMLHttpRequest to send info back to the server and get a response.  Also to update the page with
   new data when the request is successful.  */

var imageSrc = " ";
var imageCmd = " ";

var statusAuto = 0;			// 0 = off, 1 = once, 2 = repeat
var statusTimer = 0;		// timer reference to allow cancel
var imageAuto = 1;
var imageTimer = 0;

var sensorData;
var sensorGauge;
var sensori;

// request 1 is used for button commands to /TestOne/BotXcmd
var request1 = false;
try{
    request1 = new XMLHttpRequest();
}catch(failed){
    request1 = false;
}
if(!request1){
    alert("Error initializing XMLHttpRequest 1");
}
// request 2 is used for status update to /TestOne/Bot6cmd
var request2 = false;
try{
    request2 = new XMLHttpRequest();
}catch(failed){
    request2 = false;
}
if(!request2){
    alert("Error initializing XMLHttpRequest 2");
}
// request 3 is used for scanning with /TestOne/AutoScan1
var request3 = false;
try{
    request3 = new XMLHttpRequest();
}catch(failed){
    request3 = false;
}
if(!request3){
    alert("Error initializing XMLHttpRequest 3");
}

/* When a button is pressed the sendCommand function is invoked.
 * It passes the botNumber, command, data1, data2, data3 to the BotCmd servlet
 * a timestamp is included so the URL will be unique and avoid cache problems with the browser
 * Updated code will create commands by first calling setupCmd(), then scaleCmd(), and finally
 * execCmd().  This allows a move command to be setup as forward or back and then scaled by
 * how far to move with a single popup menu before executing.
 * 
 */
var command = 0;
var data1 = 0;
var data2 = 0;
var data3 = 0;

function sendCommand(command, data1, data2, data3){
	// This uses request1 object to send key commands
//	var url = "/TestOne/BotCmd?botNum="+botNum+"&command="+command+"&data1="+data1+"&data2="+data2+"&data3="+data3+"&timestamp="+new Date().getTime();
	var url = cmdString+command+"&data1="+data1+"&data2="+data2+"&data3="+data3+"&timestamp="+new Date().getTime();
    request1.open("GET",url,true);
    request1.onreadystatechange = updateCommand;	/* Call updateCommand() when the reply is rx */
    request1.send(null);
    document.getElementById("status").innerHTML = "command "+command+", "+data1+", "+data2+", "+data3;
   
}
/* This accepts replies generated request1 */
function updateCommand(){
    if(request1.readyState==4){
        if(request1.status==200){
//            document.getElementById("status").innerHTML = request1.responseText;	
        }else{
//        	document.getElementById("status").innerHTML = "Request 1 fails with error code " + request1.status; 
        }
    }
}

function setupCmd(cmd, d1, d2, d3){
	command = cmd;
	data1 = d1;
	data2 = d2;
	data3 = d3;
}
function scaleCmd(x,y,z){
	data1 = data1*x;
	data2 = data2*y;
	data3 = data3*z;
}
function execCmd(){
	sendCommand(command,data1,data2,data3);
	command = 0;
	data1 = 0;
	data2 = 0;
	data3 = 0;
}



function getStatus(){
	// This uses request2 to update status using command 1
	// Note that botNum should be globally defined in the botN.js file 
//	var url = "/TestOne/BotCmd?botNum="+botNum+"&command=1&timestamp="+new Date().getTime();
	var url = cmdString+"1&timestamp="+new Date().getTime();
    request2.open("GET",url,true);
    request2.onreadystatechange = updateStatus;	/* Call updateStatus() when the reply is rx */
    request2.send(null);
    // since this is used with auto-update don't indicate the command has been sent just leave last
    // status message showing
}

/* Assuming we have a sensorData object this should return the value associated with any label */
function getSensor(label){
	var i=0;
	var alabel="init";
	// check that a sensorData object exists before trying to access it.  When this script runs
	// and a rover has not yet sent any status updates there will be no such sensorData object
	if (typeof sensorData === 'object'){
		for(i=0;i<sensorData.length;i++){
			alabel=sensorData[i].label;
	//		alert("seeking "+label+" found "+alabel+" at "+i);
			if(alabel==label) return sensorData[i].value;
		}
	}
	return 0;
}

// This is a canvas drawing function that draws nothing at all
function drawNone(can){
	c=document.getElementById(can);
	var ctx = c.getContext("2d");
	var wide = c.width;
	var high = c.height;
	ctx.clearRect(0, 0, wide, high);	// clear any prior drawing
	return;
}

// These variables hold the functions to call when updating the 5 canvas elements
var canvas0fn = drawNone; 
var canvas1fn = drawNone;
var canvas2fn = drawNone;
var canvas3fn = drawNone;
var canvas4fn = drawNone;
var canvas5fn = drawNone;
var canvas6fn = drawNone;
var canvas7fn = drawNone;
var canvasSelect = 0;

/* This function is called to update the 5 small canvas elements */
function updateCanvas(){	
	try{
		canvas1fn("canvas1");
	}catch(e){
		alert("canvas1 failed");
	}
	try{
		canvas2fn("canvas2");
	}catch(e){
		alert("canvas2 failed");
	}	
	try{
		canvas3fn("canvas3");
	}catch(e){
		alert("canvas3 failed");
	}
	try{
		canvas4fn("canvas4");
	}catch(e){
		alert("canvas4 failed");
	}
	try{
		canvas5fn("canvas5");
	}catch(e){
		alert("canvas5 failed");
	}
	try{
		canvas6fn("canvas6");
	}catch(e){
		alert("canvas6 failed");
	}
	try{
		canvas7fn("canvas7");
	}catch(e){
		alert("canvas7 failed");
	}
}

/* This accepts status replies generated request2 */
function updateStatus(){
    if(request2.readyState==4){
        if(request2.status==200){        	
            try{
	        	// servlet response is JSON text
	            sensorData = eval(request2.responseText);
	            // alert("JSON data: "+request2.responseText);
	            // new symbology for battery and signal
	            updateCanvas();    
	            document.getElementById("status").innerHTML = "Rover is Rocking";   
            }catch(e){
                document.getElementById("status").innerHTML = "Rover bad status";               	
            }
            
//        	if(statusAuto==1) statusTimer=setTimeout("getStatus();",500);
        	statusTimer=setTimeout("getStatus();",500);
        }else{
//        	document.getElementById("status").innerHTML = "Request 1 fails with error code " + request1.status; 
        	statusTimer=setTimeout("getStatus();",5000);
            document.getElementById("status").innerHTML = "Rover no status";   
        }
    }
}


// This function gets called whenever "imageMain" is done loading.  It waits 100 mSec and then
// changes the src so that the image will be reloaded.  Should be ok with variable network delay.
function camReload(){

	clearTimeout(imageTimer);	// stop any pending auto-update

	// Since the image size may have changed, any popups over the keyboard will need to get
	// manually moved since they are absolute positioned when they first pop up
	var keys = document.getElementById("keysDiv");
	if (keys!=null){
		var keyTop = getY(keys);
		var len=popupList.length;
		for(var i=0;i<len;i++){
			document.getElementById(popupList[i]).style.top = keyTop+"px";
		}
	}
	if(imageAuto==1){
		// call the camLoad function after 10 mSec	
		imageTimer=setTimeout(camLoad,10);
		
	}
}
// This forces a new image type immediately
function camLoad(){	
	clearTimeout(imageTimer);
	imageSrc = imageSrcPre+"type="+imageType+imageSrcPost+new Date().getTime();
	document.getElementById("imageMain").src=imageSrc;
}

// This calculates the absolute Y position of any element
function getY( oElement ){
	var iReturnValue = 0;
	while( oElement != null ) {
		iReturnValue += oElement.offsetTop;
		oElement = oElement.offsetParent;
	}
	return iReturnValue;
}

// show the popup over the existing keyboard
function keyPopup(popId,text){
	var keys = document.getElementById("keysDiv");
	var keyTop = getY(keys)-2;
	var popup = document.getElementById(popId);
	popup.style.top = keyTop+"px";
	popup.style.visibility = "visible";
	document.getElementById(popId+"Title").innerText=text;
	keys.style.visibility = "hidden";
}

//show the popup over the main image
function imagePopup(popId){
	var img = document.getElementById("imageDiv");
	var imgTop = getY(img)+10;
	var popup = document.getElementById(popId);
	popup.style.top = imgTop+"px";
	popup.style.visibility = "visible";
}

// hide all the keyDiv popups
function hidePopups(){
	var keys = document.getElementById("keysDiv");
	keys.style.visibility = "visible";
	var len=popupList.length;
	for(var i=0;i<len;i++){
		document.getElementById(popupList[i]).style.visibility = "hidden";
	}
}

// hide a specific popup
function hidePopup(popupId){
	var keys = document.getElementById(popupId);
	keys.style.visibility = "visible";
	document.getElementById(popupId).style.visibility = "hidden";
}

// hide just the image popup
function hideImagePopup(){
	document.getElementById('popupImage').style.visibility = "hidden";
}

function drawBatSig(can){
	// This draws the battery and bluetooth signal bars 
	// can is the canvas id to draw into assumed size is 100 high, 118  wide
	
	// Retrieve the signals frm the sensorData object
	var vbat = getSensor("Battery");
	var sig = getSensor("Signal");
	
	// general variables
	c=document.getElementById(can)
	var ctx = c.getContext("2d");
	var wide = c.width;
	var high = c.height;

	
	ctx.shadowOffsetX = 5;
	ctx.shadowOffsetY = 5;
	ctx.shadowBlur = 2;
	ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
	 
	// battery voltage vars
	var batmin = 5000;
	var batmax = 9000;
	var svbat = vbat;
	
	// bluetooth signal vars
	var sigmin = 0;
	var sigmax = 260;
	var ssig = sig;
	
	ctx.clearRect(0, 0, wide, high);	// clear any prior drawing

	// scale the battery voltage
	if(svbat>batmax)svbat=batmax;
	if(svbat<batmin)svbat=batmin;
	svbat=(svbat-batmin)/(batmax-batmin)*high*0.75;
	
	// battery select color
	if(vbat>7000){
		// green
		ctx.fillStyle = "rgb(0,255,0)";
	}else{
		if(vbat>6000){
			// yellow
			ctx.fillStyle = "rgb(240,240,0)";
		}else{
			// red
			ctx.fillStyle = "rgb(255,0,0)";
		}
	}
	// battery draw the bar graph
	ctx.fillRect(10,high*0.75-svbat,wide*0.3,svbat);
	
	// scale the signal
	if(ssig>sigmax)ssig=sigmax;
	if(ssig<sigmin)ssig=sigmin;
	ssig=(ssig-sigmin)/(sigmax-sigmin)*high*0.75;
	
	// signal select color
	if(sig>200){
		// green
		ctx.fillStyle = "rgb(0,255,0)";
	}else{
		if(sig>150){
			// yellow
			ctx.fillStyle = "rgb(240,240,0)";
		}else{
			// red
			ctx.fillStyle = "rgb(255,0,0)";
		}
	}
	// battery draw the bar graph
	ctx.fillRect(10+wide/2,high*0.75-ssig,wide*0.3,ssig);
	
	// label and numeric vbat and signal
	ctx.shadowOffsetX = 2;
	ctx.shadowOffsetY = 2;
	ctx.fillStyle = "Black";
	ctx.font = "16px Arial";
	ctx.fillText(vbat,10,high*0.70);
	ctx.fillText("Battery",10,high*0.95);
	ctx.fillText(sig,10+wide/2,high*0.70);
	ctx.fillText("Signal",10+wide/2,high*0.95);	
}

function drawPower(can){
	// This draws power indicators for motors A and B 
	// can is the canvas id to draw into assumed size is 100 high, 118  wide
	
	// Retrieve the signals frm the sensorData object
	var pa = getSensor("PowerA");
	var pb = getSensor("PowerB");
	
	// general variables
	c=document.getElementById(can);
	var ctx = c.getContext("2d");
	var wide = c.width;
	var high = c.height;
	
	ctx.shadowOffsetX = 5;
	ctx.shadowOffsetY = 5;
	ctx.shadowBlur = 2;
	ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
	 
	// power variables
	var pmax = 100;
	var spa = Math.abs(pa);
	var spb = Math.abs(pb);
	
	ctx.clearRect(0, 0, wide, high);	// clear any prior drawing

	// scale the power levels
	if(spa>pmax)spa=pmax;
	spa=spa/pmax*high*0.375;
	
	if(spb>pmax)spb=pmax;
	spb=spb/pmax*high*0.375;

	// draw the bar graphs, B is left motor, A is right
	if(pb==0){
		ctx.fillStyle = "rgb(0,0,0)";
		ctx.fillRect(10,high*0.375-1,wide*0.3,2);		
	}else{
		if(pb>0){
			ctx.fillStyle = "rgb(120,255,120)";
			ctx.fillRect(10,high*0.375-spb,wide*0.3,spb);
		}else{
			ctx.fillStyle = "rgb(120,120,255)";
			ctx.fillRect(10,high*0.375,wide*0.3,spb);
		}
	}
	
	if(pa==0){
		ctx.fillStyle = "rgb(0,0,0)";
		ctx.fillRect(10+wide/2,high*0.375-1,wide*0.3,2);		
	}else{
		if(pa>0){
			ctx.fillStyle = "rgb(120,255,120)";
			ctx.fillRect(10+wide/2,high*0.375-spa,wide*0.3,spa);
		}else{
			ctx.fillStyle = "rgb(120,120,255)";
			ctx.fillRect(10+wide/2,high*0.375,wide*0.3,spa);
		}
	}

	// label and numeric vbat and signal
	ctx.shadowOffsetX = 2;
	ctx.shadowOffsetY = 2;
	ctx.fillStyle = "Black";
	ctx.font = "16px Arial";
	ctx.fillText(pb,10,high*0.70);
	ctx.fillText("Left",10,high*0.95);
	ctx.fillText(pa,10+wide/2,high*0.70);
	ctx.fillText("Right",10+wide/2,high*0.95);
	
	// add stall indicators  B is left, A is right
	var sB = getSensor("StateB");
	if(sB==3){
		ctx.fillStyle = "Red";
		ctx.font = "10px Arial";
		ctx.fillText("Stall",10,high*0.8);
	}
	var sA = getSensor("StateA");
	if(sA==3){
		ctx.fillStyle = "Red";
		ctx.font = "10px Arial";
		ctx.fillText("Stall",10+wide/2,high*0.8);
	}
	
}
function drawClaw(can){
	// This draws the claw indicators for motor C 
	// can is the canvas id to draw into assumed size is 100 high, 118  wide
	
	// Retrieve the signals frm the sensorData object
	var PosC =  getSensor("PosC");
	var Claw = getSensor("Claw");
		
	// general variables
	c=document.getElementById(can)
	var ctx = c.getContext("2d");
	var wide = c.width;
	var high = c.height;
	
	ctx.shadowOffsetX = 5;
	ctx.shadowOffsetY = 5;
	ctx.shadowBlur = 2;
	ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
	 
	// limits and scaled value
	var xmin = -200;
	var xmax = 20;
	var sPosC = PosC;
		
	ctx.clearRect(0, 0, wide, high);	// clear any prior drawing

	if(Claw==0){
		ctx.fillStyle = "Red";
		ctx.font = "10px Arial";
		ctx.fillText("Needs Init",10,high*0.8);
		
	}else{
	
		// scale the motor C position
		if(sPosC>xmax)sPosC=xmax;
		if(sPosC<xmin)sPosC=xmin;
		sPosC=(sPosC-xmin)/(xmax-xmin)*high*0.75;
		
		// select color
		if(PosC<-80){
			// green
			ctx.fillStyle = "rgb(0,255,0)";
		}else{
			if(PosC<-35){
				// yellow
				ctx.fillStyle = "rgb(240,240,0)";
			}else{
				// red
				ctx.fillStyle = "rgb(255,0,0)";
			}
		}
		// battery draw the bar graph
		ctx.fillRect(10,high*0.75-sPosC,wide*0.3,sPosC);
			
		// label and numeric vbat and signal
		ctx.shadowOffsetX = 2;
		ctx.shadowOffsetY = 2;
		ctx.fillStyle = "Black";
		ctx.font = "16px Arial";
		ctx.fillText(PosC,10,high*0.70);
		ctx.fillText("Claw",10,high*0.95);
	//	ctx.fillText(sig,10+wide/2,high*0.70);
	//	ctx.fillText("Signal",10+wide/2,high*0.95);	
	}

}

function drawPitchRoll(can){
	// This draws Pitch and Roll indicators for a bot with an accelerometer 
	// can is the canvas id to draw into assumed size is 100 high, 118  wide
	
	// Retrieve the signals frm the sensorData object
	var p = getSensor("Pitch");
	var r = getSensor("Roll");
	
	// general variables
	c=document.getElementById(can);
	var ctx = c.getContext("2d");
	var wide = c.width;
	var high = c.height;
	
	ctx.shadowOffsetX = 5;
	ctx.shadowOffsetY = 5;
	ctx.shadowBlur = 2;
	ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
	 
	// pitch and roll variables
	var pmax = 120;
	var sp = Math.abs(p);
	var sr = Math.abs(r);
	
	ctx.clearRect(0, 0, wide, high);	// clear any prior drawing

	// scale the power levels
	if(sp>pmax)sp=pmax;
	sp=sp/pmax*high*0.375;
	
	if(sr>pmax)sr=pmax;
	sr=sr/pmax*high*0.375;

	// draw the bar graphs, 
	if(p==0){
		ctx.fillStyle = "rgb(0,0,0)";
		ctx.fillRect(10,high*0.375-1,wide*0.3,2);		
	}else{
		if(p>0){
			ctx.fillStyle = "rgb(120,255,120)";
			if(p>50)ctx.fillStyle = "rgb(255,255,120)";
			if(p>100)ctx.fillStyle = "rgb(255,0,0)";
			ctx.fillRect(10,high*0.375-sp,wide*0.3,sp);
		}else{
			ctx.fillStyle = "rgb(120,120,255)";
			if(p<-50)ctx.fillStyle = "rgb(255,255,120)";
			if(p<-100)ctx.fillStyle = "rgb(255,0,0)";
			ctx.fillRect(10,high*0.375,wide*0.3,sp);
		}
	}
	
	if(r==0){
		ctx.fillStyle = "rgb(0,0,0)";
		ctx.fillRect(10+wide/2,high*0.375-1,wide*0.3,2);		
	}else{
		if(r>0){
			ctx.fillStyle = "rgb(120,255,120)";
			if(r>50)ctx.fillStyle = "rgb(120,255,120)";
			if(r>100)ctx.fillStyle = "rgb(255,0,0)";
			ctx.fillRect(10+wide/2,high*0.375-sr,wide*0.3,sr);
		}else{
			ctx.fillStyle = "rgb(120,120,255)";
			if(r<-50)ctx.fillStyle = "rgb(120,255,120)";
			if(r<-100)ctx.fillStyle = "rgb(255,0,0)";
			ctx.fillRect(10+wide/2,high*0.375,wide*0.3,sr);
		}
	}

	// label and numeric vbat and signal
	ctx.shadowOffsetX = 2;
	ctx.shadowOffsetY = 2;
	ctx.fillStyle = "Black";
	ctx.font = "16px Arial";
	ctx.fillText(p,10,high*0.70);
	ctx.fillText("Pitch",10,high*0.95);
	ctx.fillText(r,10+wide/2,high*0.70);
	ctx.fillText("Roll",10+wide/2,high*0.95);
	
}

function drawCompass(can){
	// This draws Pitch and Roll indicators for a bot with an accelerometer 
	// can is the canvas id to draw into assumed size is 100 high, 118  wide
	
	// Retrieve the signals frm the sensorData object
	var b = getSensor("Bearing");
	var S=["N","NE","E","SE","S","SW","W","NW","N"];
	
	// general variables
	c=document.getElementById(can);
	var ctx = c.getContext("2d");
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	var wide = c.width;
	var high = c.height;
	
	ctx.clearRect(0, 0, wide, high);	// clear any prior drawing


	// make the compass rose background
	ctx.translate(wide/2,high/2);
	ctx.save();
	ctx.scale(0.8,0.8);
	ctx.translate(0,-0.15*high);
	ctx.beginPath();
	ctx.arc(0, 0, 0.4*high, 0, Math.PI*2, true);
	ctx.closePath();
	ctx.fillStyle = "rgb(230,230,230)";
	ctx.fill();
	ctx.fillStyle = "rgb(0,0,0)";
	ctx.stroke();

	ctx.shadowOffsetX = 5;
	ctx.shadowOffsetY = 5;
	ctx.shadowBlur = 2;
	ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
		
	// compass needle
	ctx.save();
	ctx.rotate(Math.PI*b/180);
	ctx.beginPath();
	ctx.moveTo(0,-0.4*high);
	ctx.lineTo(0.2*high,-0.2*high);
	ctx.lineTo(0.1*high,-0.2*high);
	ctx.lineTo(0.1*high,0.35*high);
	ctx.lineTo(-0.1*high,0.35*high);
	ctx.lineTo(-0.1*high,-0.2*high);
	ctx.lineTo(-0.2*high,-0.2*high);
	ctx.fillStyle = "rgb(0,0,0)";
	ctx.fill();
	ctx.restore();
	ctx.restore();
		
	// label and numeric vbat and signal
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.shadowOffsetX = 2;
	ctx.shadowOffsetY = 2;
	ctx.shadowBlur = 2;
	ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
	ctx.fillStyle = "Black";
	ctx.font = "16px Arial";
	ctx.fillText(S[Math.round(b/45)]+"   "+b+" Deg",10,0.95*high);
	
}

function drawRange(can){
	// This draws the range indicator from ultrasonic data 
	// can is the canvas id to draw into assumed size is 118 high, 118  wide
	
	// Retrieve the signals frm the sensorData object
	var r = getSensor("Range");
	
	// general variables
	c=document.getElementById(can)
	var ctx = c.getContext("2d");
	var wide = c.width;
	var high = c.height;
	
	ctx.shadowOffsetX = 5;
	ctx.shadowOffsetY = 5;
	ctx.shadowBlur = 2;
	ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
	 
	// battery voltage vars
	var rmin = -1;
	var rmax = 128;
	var sr = r;
	
	ctx.clearRect(0, 0, wide, high);	// clear any prior drawing

	// scale the range
	if(sr>rmax)sr=rmax;
	if(sr<rmin)sr=rmin;
	sr=(sr-rmin)/(rmax-rmin)*high*0.75;
	
	// select color
	if(r>60){
		// green
		ctx.fillStyle = "rgb(0,255,0)";
	}else{
		if(r>30){
			// yellow
			ctx.fillStyle = "rgb(240,240,0)";
		}else{
			// red
			ctx.fillStyle = "rgb(255,0,0)";
		}
	}
	if((r==-1)||(r==255)){
		ctx.fillStyle = "rgb(230,230,230)";
	}
		
	// draw the bar graph
	ctx.fillRect(10,high*0.75-sr,wide*0.3,sr);
		
	// label and numeric
	ctx.shadowOffsetX = 2;
	ctx.shadowOffsetY = 2;
	ctx.fillStyle = "Black";
	ctx.font = "16px Arial";
	if(r==-1){
		ctx.fillText("Off",10,high*0.70);
	}else{
		ctx.fillText(r,10,high*0.70);
	}
	ctx.fillText("Range",10,high*0.95);
	
}


function drawFwdSpeedIndex(can){
	// This draws the forward speed index indicator  
	// can is the canvas id to draw into assumed size is 154 high, 20  wide
	
	// Retrieve the signals frm the sensorData object
	var p = getSensor("FwdSpeedIndex");
	
	// Retrieve the signals frm the sensorData object
	// general variables
	c=document.getElementById(can);
	var ctx = c.getContext("2d");
	var wide = c.width;
	var high = c.height;
		 
	// pitch and roll variables
	var pmax = 5;
	var sp = Math.abs(p);
	
	ctx.clearRect(0, 0, wide, high);	// clear any prior drawing

	// scale the power levels
	if(sp>pmax)sp=pmax;
	sp=sp/pmax*high*0.5;
	
	// draw the bar graphs, 
	if(p==0){
		ctx.fillStyle = "rgb(0,0,0)";
		ctx.fillRect(0,high*0.5-1,wide,2);		
	}else{
		if(p>0){
			ctx.fillStyle = "rgb(120,255,120)";
			ctx.fillRect(0,high*0.5-sp,wide,sp);
		}else{
			ctx.fillStyle = "rgb(120,120,255)";
			ctx.fillRect(0,high*0.5,wide,sp);
		}
	}
	
	// label and numeric vbat and signal
	ctx.shadowBlur = 2;
	ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
	ctx.shadowOffsetX = 2;
	ctx.shadowOffsetY = 2;
	ctx.fillStyle = "Black";
	ctx.font = "20px Arial";
	if(p>=0){
		ctx.fillText(p,4,high*0.65);
	}else{
		ctx.fillText(-p,4,high*0.35);
	}
			
}


function drawTurnSpeedIndex(can){
	// This draws the turn speed index indicator
	// can is the canvas id to draw into assumed size is 20 high, 370  wide
	
	// Retrieve the signals frm the sensorData object
	var p = -getSensor("TurnSpeedIndex");
	
	// Canvas graphical context
	c=document.getElementById(can);
	var ctx = c.getContext("2d");
	var wide = c.width;
	var high = c.height;
		 
	// variables
	var pmax = 5;
	var sp = Math.abs(p);
	
	ctx.clearRect(0, 0, wide, high);	// clear any prior drawing

	// scale 
	if(sp>pmax)sp=pmax;
	sp=sp/pmax*wide*0.5;
	
	// draw the bar graphs, 
	if(p==0){
		ctx.fillStyle = "rgb(0,0,0)";
		ctx.fillRect(wide*0.5-1,0,2,high);		
	}else{
		if(p>0){
			ctx.fillStyle = "rgb(120,255,120)";
			ctx.fillRect(wide*0.5-sp,0,sp,high);
		}else{
			ctx.fillStyle = "rgb(120,120,255)";
			ctx.fillRect(wide*0.5,0,sp,high);
		}
	}
	
	// label 
	ctx.shadowBlur = 2;
	ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
	ctx.shadowOffsetX = 2;
	ctx.shadowOffsetY = 2;
	ctx.fillStyle = "Black";
	ctx.font = "20px Arial";
	if(p>=0){
		ctx.fillText(p,wide*0.65,17);
	}else{
		ctx.fillText(-p,wide*0.35,17);
	}
			
}

function drawScanCam(can){
	// This draws angle and elevation symbols for the scancam 
	// can is the canvas id to draw into assumed size is 118 high, 118  wide
	
	// Retrieve the signals frm the sensorData object
	var b = getSensor("CamDegree");
	var t = getSensor("CamTurns");
	
	// general variables
	c=document.getElementById(can);
	var ctx = c.getContext("2d");
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	var wide = c.width;
	var high = c.height;
	
	ctx.clearRect(0, 0, wide, high);	// clear any prior drawing

	// make the compass rose background
	ctx.translate(wide/2,high/2);
	ctx.save();
	ctx.scale(0.8,0.8);
	ctx.translate(0,-0.15*high);
	ctx.beginPath();
	ctx.arc(0, 0, 0.4*high, 0, Math.PI*2, true);
	ctx.closePath();
	ctx.fillStyle = "rgb(230,230,255)";
	ctx.fill();
	ctx.fillStyle = "rgb(0,0,0)";
	ctx.stroke();

	ctx.shadowOffsetX = 5;
	ctx.shadowOffsetY = 5;
	ctx.shadowBlur = 2;
	ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
		
	// compass needle
	ctx.save();
	ctx.rotate(Math.PI*b/180);
	ctx.beginPath();
	ctx.moveTo(0,-0.4*high);
	ctx.lineTo(0.2*high,-0.2*high);
	ctx.lineTo(0.1*high,-0.2*high);
	ctx.lineTo(0.1*high,0.35*high);
	ctx.lineTo(-0.1*high,0.35*high);
	ctx.lineTo(-0.1*high,-0.2*high);
	ctx.lineTo(-0.2*high,-0.2*high);
	ctx.fillStyle = "rgb(0,0,0)";
	ctx.fill();
	ctx.restore();
	ctx.restore();
		
	// label and numeric vbat and signal
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.shadowOffsetX = 2;
	ctx.shadowOffsetY = 2;
	ctx.shadowBlur = 2;
	ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
	ctx.fillStyle = "Black";
	ctx.font = "16px Arial";
	ctx.fillText(b+" "+String.fromCharCode(176)+"  "+t+" Turn",10,0.95*high);
	
}



