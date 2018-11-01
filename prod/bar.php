<div class="top-bar">
	<ul class="clearfix">
		<?php 

		if ( isset($_SESSION['logged']) && $_SESSION['logged'] ) {
			echo '<li class="float-left"><a class="f-icon link-logout" href="logout.php">Logout</a></li>';
		}

		if ( !isset($_SESSION['logged']) || !$_SESSION['logged'] ) {
			if ( !isset($isHomePage) ) {
				echo '<li class="float-left"><a class="f-icon link-login" href="index.php">LogIn</a></li>';	
			}		
		} 

		if ( !isset($isRankingPage) ) {
			echo '<li class="float-right"><a class="f-icon link-ranking" href="ranking.php">Rangliste</a></li>';
		} else {
			if ( isset($_SESSION['logged']) && $_SESSION['logged'] ) {
				echo '<li class="float-right"><a class="f-icon link-game" href="game.php">Zum Spiel</a></li>';
			}
		}

		?>	
	</ul>
</div>