<?php 
session_start(); 
if ( !isset($_SESSION['logged']) || !$_SESSION['logged'] ){ 
	header("Location: index.php"); 
	exit;
}
?>
<?php include 'head.php'; ?>
<body class="game-page">
	<?php include 'bar.php'; ?>
	<div class="outer-wrapper">
    <div class="inner-wrapper">
      <div class="clearfix" id="game"></div> 
    </div>
  </div>
</body>
</html>