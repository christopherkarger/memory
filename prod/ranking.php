<?php
session_start();
$isRankingPage = true;
include 'head.php'; 
?>
<body class="ranking-page">
	<?php include 'bar.php'; ?>
	<div class="outer-wrapper">
		<div class="inner-wrapper">
			<h1>Rangliste</h1>   
			<?php include 'handle-data.php'; ?>
		</div>
	</div>
</body>
</html>