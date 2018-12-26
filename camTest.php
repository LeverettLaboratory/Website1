<?php readfile("LabHeader.html"); ?>

<body>

<?php readfile("LabBanner.html"); ?>

<?php readfile("LabLinks.html"); ?>

<div id="labMain">
<!--  
<img id="cam1" width="640px" src="http://192.168.2.121/jpg/image.jpg?resolution=640x480&compression=0&clock=0&date=0&text=0" alt="No image from Cam1 yet" />
<img id="cam2" width="640px" src="http://192.168.2.122/jpg/image.jpg?resolution=640x480&compression=0&clock=0&date=0&text=0" alt="No image from Cam2 yet" />
<img id="cam3" width="640px" src="http://192.168.2.123/jpg/image.jpg?resolution=640x480&compression=0&clock=0&date=0&text=0" alt="No image from Cam3 yet" />
<img id="cam4" width="640px" src="http://192.168.2.124/jpg/image.jpg?resolution=640x480&compression=0&clock=0&date=0&text=0" alt="No image from Cam4 yet" />
<p>Click Image to refresh</p>
-->

<p><span id="timeClientText"> Unknown time </span>.</p>

<p><img id="cam1vid" src="http://192.168.2.121/mjpg/video.mjpg?resolution=320x240&fps=4" width="320" alt="No data from Cam1"></img>
<img id="cam2vid" src="http://192.168.2.122/mjpg/video.mjpg?resolution=320x240&fps=4" width="320" alt="No data from Cam2"></img></p>

<p><img id="cam3vid" src="http://192.168.2.123/mjpg/video.mjpg?resolution=320x240&fps=4" width="320" alt="No data from Cam3"></img>
<img id="cam4vid" src="http://192.168.2.124/mjpg/video.mjpg?resolution=320x240&fps=4" width="320" alt="No data from Cam4"></img></p>


</div>

		
		
<?php readfile("LabFooter.html"); ?>				

<!-- camTest.js contains scripts for just this one page -->
<!-- labwide scripts are loaded already in the LabFooter.html -->
<script type="text/javascript" src="camTest.js"></script>
				
</body>
</html>

