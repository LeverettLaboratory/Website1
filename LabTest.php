<?php readfile("LabHeader.html"); ?>

	<!-- The LabTest.css file is used to adjust the page appearance -->
	<link rel="stylesheet" href="LabTest.css" type="text/css" />

<body>

<?php readfile("LabBanner.html"); ?>

<?php readfile("LabLinks.html"); ?>

<div id="labMain">

<p>
<div id="gaugesDiv">

  <table>
  <caption><h2>Meters test with update using ajax and json</h2></caption>
  	<tr>
  	<th>    <canvas width=40 height=30 id="canvas0"></canvas>  </th>
  	<th>    <canvas width=40 height=30 id="canvas1"></canvas>  </th>
  	<th>    <canvas width=40 height=30 id="canvas2"></canvas>  </th>
  	</tr>
  	<tr>
	<th>Battery</th>
	<th>Bluetooth</th>
	<th>Pitch</th>
  </table>

</div>

</p>
<p>
<span id="buttonUpdate" class="button" onclick="null">Update</span>
</p>

<p>
<div id="status" onclick="null">No update messages yet...</div>
</p>
  

</div>

		
		
<?php readfile("LabFooter.html"); ?>				

<!-- only 1 required script for the gauges -->
<script src="dist/gauge.js"></script>

<!-- LabTest.js contains scripts for just this one page -->
<!-- labwide scripts are loaded already in the LabFooter.html -->
<script type="text/javascript" src="LabTest.js"></script>
				
</body>
</html>

