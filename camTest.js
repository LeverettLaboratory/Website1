/* Here are the javascript functions for the camTest page */


/* Reload the image when it is clicked on */
var cam1 = document.getElementById("cam1");
cam1.onclick = function(){
	cam1.src = "http://192.168.2.121/jpg/image.jpg?resolution=640x480&compression=0&clock=0&date=0&text=0&timestamp="+new Date().getTime();
		
	// update the timestamp when the image is reloaded
	// scope will be element, ie the image cam1, use a closure to access document.x	
	var x = document.getElementById("timeClient");
	var d = new Date();
	x.innerHTML = d.toLocaleString()+" ( "+d.getTime()+" ) ";

}

var cam2 = document.getElementById("cam2");
cam2.onclick = function(){
	cam2.src = "http://192.168.2.122/jpg/image.jpg?resolution=640x480&compression=0&clock=0&date=0&text=0&timestamp="+new Date().getTime();
		
	// update the timestamp when the image is reloaded
	// scope will be element, ie the image cam1, use a closure to access document.x	
	var x = document.getElementById("timeClient");
	var d = new Date();
	x.innerHTML = d.toLocaleString()+" ( "+d.getTime()+" ) ";

}

var cam3 = document.getElementById("cam3");
cam3.onclick = function(){
	cam3.src = "http://192.168.2.123/jpg/image.jpg?resolution=640x480&compression=0&clock=0&date=0&text=0&timestamp="+new Date().getTime();
		
	// update the timestamp when the image is reloaded
	// scope will be element, ie the image cam1, use a closure to access document.x	
	var x = document.getElementById("timeClient");
	var d = new Date();
	x.innerHTML = d.toLocaleString()+" ( "+d.getTime()+" ) ";

}

var cam4 = document.getElementById("cam4");
cam4.onclick = function(){
	cam4.src = "http://192.168.2.124/jpg/image.jpg?resolution=640x480&compression=0&clock=0&date=0&text=0&timestamp="+new Date().getTime();
		
	// update the timestamp when the image is reloaded
	// scope will be element, ie the image cam1, use a closure to access document.x	
	var x = document.getElementById("timeClient");
	var d = new Date();
	x.innerHTML = d.toLocaleString()+" ( "+d.getTime()+" ) ";

}

