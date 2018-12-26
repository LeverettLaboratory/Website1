<?php
require("page.inc");

class PageTwo extends Page{

  public $row2buttons = array(	"Full Scan-o-rama"	=> "bot5AB.php", 
                        		"Video Only" 		=> "bot5A.php",
                        		"Controller Only" 	=> "bot5B.php"
  						);
  												
  						
  public function Display()
  {
    echo "<html>\n<head>\n";
    $this -> DisplayTitle();
    $this -> DisplayKeywords();
    $this -> DisplayStyles();
    echo "</head>\n<body>\n";
    $this -> DisplayHeader();
    $this -> DisplayMenu($this->buttons);
    $this -> DisplayMenu($this->row2buttons);
    echo $this->content;
    $this -> DisplayFooter();
    echo "</body>\n</html>\n";
  }
  						
  
}
  
  $scanpage = new PageTwo();

  $scanpage->content = "<p>Select the Scan-o-rama Camera page that you require.</p>";
  
  $scanpage->Display();

?>


