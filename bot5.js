/* This file should contain only the particular definitions that make Bot5 different from all the other bots.
 * This must be included in the load order prior to botAll.js which contains generalized methods used with all
 * the bots and which will access the particular variables defined in this file to get specific operations for
 * this Bot.
 * 
 * Dr Tom Flint, Leverett Laboratory, 2 Feb 2014
 * 
 */

var botNum = 5;
var imageType = 4;		// The initial image type to load
//var imageSrcPre = "/TestOne/PlainCam1?bot=9&cam=2&";	// start of string for image URL prior to type=...
//var imageSrcPost="&timestamp=";		// end of string for image URL

var cmdString = "/TestOne/Bot5cmd?command=";

var imageSrcScanCam ="/TestOne/ScanCam1?";
var imageSrcAutoScan ="/TestOne/AutoScan1?";
var imageSrcPre = imageSrcScanCam;
var imageSrcPost="&timestamp=";
var imageSrc = " ";
var imageCmd = " ";

var statusAuto = 0;			// 0 = off, 1 = once, 2 = repeat
var statusTimer = 0;		// timer reference to allow cancel
var imageAuto = 1;
var imageTimer = 0;

var popupList = new Array(
		'popupArc',
		'popupPivot',
		'popupMove',
		'popupDrive',
		'popupProgram',
		'popupCanvas',
		'popupPan',
		'popupLook',
		'popupScan',
		'popupConfig'
		);


function autoScan(arg){
	// 
	var url = "/TestOne/AutoScan1?"+arg+"&timestamp="+new Date().getTime();
    request3.open("GET",url,true);
    request3.onreadystatechange = replyAutoScan;
    request3.send(null);
}

function replyAutoScan(){
    if(request3.readyState==4){
        if(request3.status==200){
            document.getElementById("status").innerHTML = request3.responseText;	
        }
    }
}

// TF TEST
// Bot5 is the scanbot.  It has special handlers for the image section and does not use the
// regular ones included in BotAll.js

// This function gets called whenever "imageMain" is done loading.  It waits 100 mSec and then
// changes the src so that the image will be reloaded.  Should be ok with variable network delay.
function camReload5(){

	clearTimeout(imageTimer);	// stop any pending auto-update

	// Since the image size may have changed, any popups over the keyboard will need to get
	// manually moved since they are absolute positioned when they first pop up
	var keys = document.getElementById("keysDiv");
	if (keys!=null){
		var keyTop = getY(keys)-2;
		var len=popupList.length;
		for(var i=0;i<len;i++){
			document.getElementById(popupList[i]).style.top = keyTop+"px";
		}
	}
	if(imageAuto==1){
		// call the camLoad function after 100 mSec	
		imageTimer=setTimeout(camLoad5,100);
		
	}
}
// This forces a new image type immediately
function camLoad5(){	
	clearTimeout(imageTimer);
	switch(imageType){
		case 0:
		case 1:
		case 2:
		case 3:
		case 4:
		case 5:
			// source is the scancam servlet
			imageSrcPre = imageSrcScanCam;
			imageSrc = imageSrcPre+"type="+imageType+imageSrcPost+new Date().getTime();
			break;
		case 6:
			// autoscan status image
			imageSrcPre = imageSrcAutoScan;
			imageSrc = imageSrcPre+"type=3"+imageSrcPost+new Date().getTime();
			break;
		case 7:
			// autoscan output image
			imageSrcPre = imageSrcAutoScan;
			imageSrc = imageSrcPre+"type=5"+imageSrcPost+new Date().getTime();
			break;
		default:
			// scancam should issue an error page showing the undefined imageType
			imageSrcPre = imageSrcScanCam;
			imageSrc = imageSrcPre+"type="+imageType+imageSrcPost+new Date().getTime();
		break;
	}
	document.getElementById("imageMain").src=imageSrc;
}

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
		canvas3fn=drawRange;
		canvas4fn=drawScanCam;
		canvas5fn=drawNone;
		canvas6fn=drawTurnSpeedIndex;
		canvas7fn=drawFwdSpeedIndex;
	}				
    document.getElementById("status").innerHTML = "ScanBot is ready...";   
}

//Centralize all the onclick event handlers for this page
//can recognize buttons by the (unique) labels, need a way
//to recognize the image
document.onclick = function clickHandler(event){
	var target = event.target;
	var text = target.innerHTML;
	var id = target.id;
	
	if(id=="status"){
		// clicked status, indicate the click
	    document.getElementById("status").innerHTML = "getting status...";   
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
				case "mainArcL":
				case "imgArcL":
					setupCmd(130,100,1,0);
					keyPopup('popupArc',"Arc Fwd Left");
				break;
				case "mainPivL":
				case "imgPivL":
					keyPopup('popupPivot',"Pivot Left");
					setupCmd(121,1,0,0);
				break;
				case "mainCraL":
				case "imgCraL":
					setupCmd(130,100,-1,0);
					keyPopup('popupArc',"Arc Back Left");
				break;
				case "mainFwd":
				case "imgFwd":
					keyPopup('popupMove',"Move Fwd");
					setupCmd(111,100,0,0);
				break;
				case "mainHalt":
				case "imgHalt":
					setupCmd(0,0,0,0);
					execCmd();
				break;
				case "mainBack":
				case "imgBack":
					keyPopup('popupMove',"Move Back");
					setupCmd(111,-100,0,0);
				break;
				case "mainArcR":
				case "imgArcR":
					setupCmd(130,-100,-1,0);
					keyPopup('popupArc',"Arc Fwd Right");
				break;
				case "mainPivR":
				case "imgPivR":
					keyPopup('popupPivot',"Pivot Right");
					setupCmd(121,-1,0,0);
				break;
				case "mainCraR":
				case "imgCraR":
					setupCmd(130,-100,1,0);
					keyPopup('popupArc',"Arc Back Right");
				break;
				case "mainDrive":
					keyPopup('popupDrive',"Drive Menu");
				break;
				case "mainLamp":
					keyPopup('popupLamp',"Floodlight Menu");
				break;
				case "mainProgram":
					keyPopup('popupProgram',"Program Menu");
				break;
				case "mainConfig":
					keyPopup('popupConfig',"Configuration Menu");
				break;
				case "mainPan":
					keyPopup('popupPan', "Camera Pan Menu");
					break;
				case "mainLook":
					keyPopup('popupLook', "Camera Look Menu");
					break;
				case "mainScan":
					keyPopup('popupScan', "Scan-o-rama Menu");
					break;
				case "testPlus":
					testValue +=10;
					testValue2 +=10;
				break;
				case "testMinus":
					testValue -=10;
					testValue2 -=10;
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
				case "canvasScanCam":
					eval("canvas"+canvasSelect+"fn=drawScanCam;");
				break;
				case "canvasRange":
					eval("canvas"+canvasSelect+"fn=drawRange;");
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
    
		
			case "popupPan":
				switch(text){
					case "Left":
						sendCommand(202,-100,0,0);
						break;
					case "left":
						sendCommand(202,-20,0,0);
						break;
					case "Stop":
						sendCommand(200,0,0,0);
						break;
					case "right":
						sendCommand(202,20,0,0);
						break;
					case "Right":
						sendCommand(202,100,0,0);
						break;
					case "ReZero":
						sendCommand(201,0,0,0);
						break;
					case "Down":
						sendCommand(211,-2520,0,0);
						break;
					case "Goto 0":
						sendCommand(210,0,0,0);
						break;
					case "Up":
						sendCommand(211,2520,0,0);
						break;
					case "cancel":
						hidePopups();
						break;
				}
				break;

			case "popupLook":
				switch(text){
					case "Left":
						sendCommand(210,-630,0,0);
						break;
					case "Fore":
						sendCommand(210,0,0,0);
						break;
					case "Right":
						sendCommand(210,630,0,0);
						break;
					case "Back":
						sendCommand(210,-1260,0,0);
						break;
					case "Left 1":
						sendCommand(211,-105,0,0);
						break;
					case "Right 1":
						sendCommand(211,105,0,0);
						break;
					case "Up":
						sendCommand(211,2520,0,0);
						break;
					case "Down":
						sendCommand(211,-2520,0,0);
						break;
					case "cancel":
						hidePopups();
						break;
				}
				break;

			case "popupScan":
				switch(text){
					case "Full 120":
						imageType = 6;
						imageAuto = 1;	// update continuous
						camLoad5();
						autoScan("type=1&num=120&zero=0&step=105");
						break;
					case "7 Fwd":
						imageType = 6;
						imageAuto = 1;	// update continuous
						camLoad5();
						autoScan("type=1&num=7&zero=-315&step=105");
						break;
					case "7 Zero":
						imageType = 6;
						imageAuto = 1;	// update continuous
						camLoad5();
						autoScan("type=1&num=7&zero=0&step=105");
						break;
					case "144":
						imageType = 6;
						imageAuto = 1;	// update continuous
						camLoad5();
						autoScan("type=1&num=144&zero=0&step=105");
						break;
					case "120n":
						imageType = 6;
						imageAuto = 1;	// update continuous
						camLoad5();
						autoScan("type=1&num=120&zero=0&step=50");
						break;
					case "96":
						imageType = 6;
						imageAuto = 1;	// update continuous
						camLoad5();
						autoScan("type=1&num=96&zero=0&step=105");
						break;
					case "Halt":
						imageType = 4;	// go back to standard controller image
						imageAuto = 1;	// update continuous
						camLoad5();
						autoScan("type=0");
						break;
					case "Show":
						imageType = 7;	// stitched image
						imageAuto = 0;	// turn off auto update
						camLoad5();		// show the new image source
						break;
					case "Pop":
						// Instead of showing the pano in the default image window, pop a new tab in the browser
						window.open("/TestOne/AutoScan1?type=4&dx=1.9&dy=0.06&timestamp="+new Date().getTime());
						break;
					case "cancel":
						hidePopups();
						break;
				}
				break;

				// Program Menu
			case "popupProgram":
				switch(id){
					case "programCircleR":
						setupCmd(0,0,0,0);
					break;
					case "programCircleL":
						setupCmd(0,0,0,0);
					break;
					case "programCancel":
						setupCmd(0,0,0,0);
						hidePopups();
					break;
				}
				execCmd();
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
					case "Pan Left":
						sendCommand(202,-20,0,0);
						break;
					case "Pan Stop":
						sendCommand(200,0,0,0);
						break;
					case "Pan Right":
						sendCommand(202,20,0,0);
						break;
					case "ReZero":
						sendCommand(201,0,0,0);
						break;
					case "Pan Down":
						sendCommand(211,-2520,0,0);
						break;
					case "Goto 0":
						sendCommand(210,0,0,0);
						break;
					case "Pan Up":
						sendCommand(211,2520,0,0);
						break;

					case "cancel":
						hidePopups();
					break;
				}
			break;
			
			// Config Menu
			case "popupConfig":
				switch(id){
					case "configStatOn":
						statusAuto=1;		// set the status line to auto update
						getStatus();	// request status to kickstart the process
					break;
					case "configStatOff":
						statusAuto=0;		// set the status line to auto update
						clearTimeout(statusTimer);	// stop any pending auto-update
					break;
					case "configScreen":
					    document.getElementById("status").innerHTML = "screen: "+window.innerWidth+" x "+window.innerHeight;
					break;
					case "configSonarPing":
						sendCommand(7,1,0,0);
					break;							
					case "configSonarOn":
						sendCommand(7,2,0,0);
					break;							
					case "configSonarOff":
						sendCommand(7,0,0,0);
					break;							
					case "configCancel":
						hidePopups();
					break;
				}
			break;
							
			case "popupImage":
				switch(text){
					case "View 0":
						imageType = 0;
						camLoad5();				// start a new load
						break;
					case "View 1":
						imageType = 1;
						camLoad5();				// start a new load
						break;
					case "View 2":
						imageType = 2;
						camLoad5();				// start a new load
						break;
					case "View 3":
						imageType = 3;
						camLoad5();				// start a new load
						break;
					case "View 4":
						imageType = 4;
						camLoad5();				// start a new load
						break;
					case "View 5":
						imageType = 5;
						camLoad5();				// start a new load
						break;
					case "View 6":
						imageType = 6;
						camLoad5();				// start a new load
						break;
					case "View 7":
						// This is the big panorama so just get it once
						imageAuto=0;				// ask for single update only
						imageType = 7;
						camLoad5();				// start a new load
						break;
					case "Auto":
						if(imageAuto==0){
							imageAuto=1;		// set the image to auto update
							camLoad5();			// kickstart the process
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
		}
	}
}