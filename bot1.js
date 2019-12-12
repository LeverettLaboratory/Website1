/* This file should contain only the particular definitions that make Bot1 different from all the other bots.
 * This must be included in the load order prior to botAll.js which contains generalized methods used with all
 * the bots and which will access the particular variables defined in this file to get specific operations for
 * this Bot.
 * 
 * Dr Tom Flint, Leverett Laboratory, 29 Jan 2014
 * This version at /var/www/Website1/...
 * 
 */

var botNum = 1;
var imageType = 1;		// The initial image type to load
var imageSrcPre = "/TestOne/PlainCam1?bot=1&cam=3&";	// start of string for image URL prior to type=...
var imageSrcPost="&timestamp=";		// end of string for image URL

var cmdString = "/TestOne/Bot1cmd?command=";
var popupList = new Array(
		'popupArc',
		'popupPivot',
		'popupMove',
		'popupDrive',
		'popupCanvas'
);

var testValue = 0;
var testValue2 = 0;

//These gauges must wait till the window is fully loaded or it throws an error
window.onload = function(){
	// Also check that the gaugesDiv is on this page, it does not appear on image only pages
	if (document.getElementById("gaugesDiv")!=null){
		// Tests for new custom symbology using canvas 1 to 5.  Must wait to assign the canvas
		// functions until after canvas and botAll.js script have loaded
		canvas1fn=drawBatSig;
		canvas2fn=drawPower;
		canvas3fn=drawCam;
		canvas4fn=drawNone;
		canvas5fn=drawNone;
		canvas6fn=drawTurnSpeedIndex;
		canvas7fn=drawFwdSpeedIndex;
	}				
	document.getElementById("status").innerHTML = "Rover 1 Awaits...";   
    getStatus();

};

//Centralize all the onclick event handlers for this page
//can recognize buttons by the (unique) labels, need a way
//to recognize the image
document.onclick = function clickHandler(event){
	var target = event.target;
	var text = target.innerHTML;
	var id = target.id;

	if(id=="status"){
		// clicked status, indicate the click
		//document.getElementById("status").innerHTML = "getting status...";   
		getStatus();
	}else if(id=="imageMain"){
		// clicked main image
		imagePopup('popupImage');
	}else{

		// Button is in a button-column which is in either keyDiv or 
		// one of the popupDivs so get the id of the twice parent to
		// figure out which menu.  Then look at the text on the button
		// which must exactly match the text switch for that menu.
		var menu = target.parentNode.parentNode.id;
		// Main menu images need one more parentNode?
		if(menu.length==0)menu="keysDiv";

		// check if this clickable thing has a grey background which
		// indicates that it is disabled, if so return doing nothing
		// TF TEST this doesn't work with images on the keys since the
		// image does not have a background
//		var stext = target.style.background;
//		if(stext.search(/221/)>0) return;

		// take action based on button id (dont use text anymore), for
		// buttons with images, be sure to also include the image id 
		// since it will sometimes be reported instead of the button id

		var stat=document.getElementById("status");
		if(stat!=null) stat.innerHTML = "menu "+menu+" id "+id;
		
		switch(menu){

		// main menu:
		case "keysDiv":
			switch(id){
			
				case "mainFwd":
				case "imgFwd":
					sendCommand(151,0,0,0);
				break;
				case "mainHalt":
				case "imgHalt":
					sendCommand(0,0,0,0);
				break;
				case "mainBack":
				case "imgBack":
					sendCommand(152,0,0,0);
				break;
				case "mainPivR":
				case "imgPivR":
					sendCommand(154,0,0,0);
				break;
				case "mainPivL":
				case "imgPivL":
					sendCommand(153,0,0,0);
				break;

				case "mainStop":
					sendCommand(600,2,0,0);
					break;							
				case "mainUp":
					setupCmd(601,0,0,0);
					execCmd();
					break;
				case "mainDown":
					sendCommand(602,2,0,0);
					break;							
				case "mainStow":
					sendCommand(603,2,0,0);
					break;							
				
				case "canvas1":
					canvasSelect=1;
					keyPopup('popupCanvas','Canvas 1 Menu');
				break;
				case "canvas2":
					canvasSelect=2;
					keyPopup('popupCanvas','Canvas 2 Menu');
				break;
				case "canvas3":
					canvasSelect=3;
					keyPopup('popupCanvas','Canvas 3 Menu');
				break;
				case "canvas4":
					canvasSelect=4;
					keyPopup('popupCanvas','Canvas 4 Menu');
				break;
				case "canvas5":
					canvasSelect=5;
					keyPopup('popupCanvas','Canvas 5 Menu');
				break;
			}
		break;

		// Canvas Menu
		case "popupCanvas":
			switch(id){
			case "canvasBatSig":
				eval("canvas"+canvasSelect+"fn=drawBatSig;");
				break;
			case "canvasPower":
				eval("canvas"+canvasSelect+"fn=drawPower;");
				break;
			case "canvasPitchRoll":
				eval("canvas"+canvasSelect+"fn=drawPitchRoll;");
				break;
			case "canvasCompass":
				eval("canvas"+canvasSelect+"fn=drawCompass;");
				break;
			case "canvasRange":
				eval("canvas"+canvasSelect+"fn=drawRange;");
				break;
			case "canvasClaw":
				eval("canvas"+canvasSelect+"fn=drawClaw;");
				break;
			case "canvasNone":
				eval("canvas"+canvasSelect+"fn=drawNone;");
				break;
			case "canvasCancel":
				hidePopups();
				break;
			}
			break;

			// Move Menu
		case "popupMove":
			switch(id){
			case "move1":
				scaleCmd(1,0,0);
				break;
			case "move2":
				scaleCmd(2,0,0);
				break;
			case "move5":
				scaleCmd(5,0,0);
				break;
			case "move10":
				scaleCmd(10,0,0);
				break;
			case "moveCancel":
				setupCmd(0,0,0,0);
				break;
			}
			execCmd();
			hidePopups();
			break;

			// Pivot Menu
		case "popupPivot":
			switch(id){
			case "pivot1":
				scaleCmd(1,0,0);
				break;
			case "pivot2":
				scaleCmd(2,0,0);
				break;
			case "pivot5":
				scaleCmd(5,0,0);
				break;
			case "pivot15":
				scaleCmd(15,0,0);
				break;
			case "pivot30":
				scaleCmd(30,0,0);
				break;
			case "pivot45":
				scaleCmd(45,0,0);
				break;
			case "pivot60":
				scaleCmd(60,0,0);
				break;
			case "pivot90":
				scaleCmd(90,0,0);
				break;
			case "pivotCancel":
				setupCmd(0,0,0,0);
				break;
			}
			execCmd();
			hidePopups();
			break;

			// Arc Menu
		case "popupArc":
			switch(id){
			case "arc15-5":
				scaleCmd(5,15,0);
				break;
			case "arc15-10":
				scaleCmd(10,15,0);
				break;
			case "arc15-20":
				scaleCmd(20,15,0);
				break;
			case "arc30-5":
				scaleCmd(5,30,0);
				break;
			case "arc30-10":
				scaleCmd(10,30,0);
				break;
			case "arc30-20":
				scaleCmd(20,30,0);
				break;
			case "arc45-5":
				scaleCmd(5,45,0);
				break;
			case "arc45-10":
				scaleCmd(10,45,0);
				break;
			case "arc45-20":
				scaleCmd(20,45,0);
				break;
			case "arc90-5":
				scaleCmd(5,90,0);
				break;
			case "arc90-10":
				scaleCmd(10,90,0);
				break;
			case "arc90-20":
				scaleCmd(20,90,0);
				break;
			case "arcCancel":
				setupCmd(0,0,0,0);
				break;
			}
			execCmd();
			hidePopups();
			break;


			// Drive Menu
		case "popupDrive":
			switch(text){
			case "Fwd":
				sendCommand(151,0,0,0);
				break;
			case "Back":
				sendCommand(152,0,0,0);
				break;
			case "Left":
				sendCommand(153,0,0,0);
				break;
			case "Right":
				sendCommand(154,0,0,0);
				break;
			case "Center":
				sendCommand(155,0,0,0);
				break;
			case "Halt":
				sendCommand(0,0,0,0);
				break;
			case "Claw Stop":
				sendCommand(405,0,0,0);
				break;
			case "Claw Up":
				sendCommand(406,0,0,0);  // claw up
				break;
			case "Claw Down":
				sendCommand(407,0,0,0); // claw down
				break;
			case "Full Down":
				sendCommand(404,0,0,0);
				break;
			case "Full Up":
				sendCommand(403,0,0,0);
				break;

			case "cancel":
				hidePopups();
				break;
			}
			break;


			// Image Menu
		case "popupImage":
			switch(text){
			case "View 0":
				imageType = 0;
				camLoad();				// start a new load
				break;
			case "View 1":
				imageType = 1;
				camLoad();				// start a new load
				break;
			case "View 2":
				imageType = 2;
				camLoad();				// start a new load
				break;
			case "View 3":
				imageType = 3;
				camLoad();				// start a new load
				break;
			case "View 4":
				imageType = 4;
				camLoad();				// start a new load
				break;
			case "View 5":
				imageType = 5;
				camLoad();				// start a new load
				break;
			case "View 6":
				imageType = 6;
				camLoad();				// start a new load
				break;
			case "View 7":
				imageType = 7;
				camLoad();				// start a new load
				break;
			case "Auto":
				if(imageAuto==0){
					imageAuto=1;		// set the image to auto update
					camLoad();			// kickstart the process
				}else{
					clearTimeout(imageTimer);	// stop any pending auto-update
					imageAuto=0;				// turn off auto-update flag
				}
				break;
			case "cancel":
				break;
			}
			hideImagePopup();
			break;

		default:
			alert("unknown menu: "+menu);
		break;

		}  // end of switch(menu)

	}
}


