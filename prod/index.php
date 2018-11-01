<?php 
session_start(); 
if ( isset($_SESSION['logged']) && $_SESSION['logged'] ){ 
  header("Location: game.php"); 
  exit;
}
$isHomePage = true; 

include 'handle-data.php'; 
include 'head.php';
?>
<body class="home-page">
  <?php include 'bar.php'; ?>

  <div class="outer-wrapper">
    <div class="inner-wrapper">

      <h1 class="site-title">Memory</h1>

      <section class="form blank-card">
        <div id="checkform"></div>

        <div class="login clearfix">

          <h2>Login</h2>
          <form class="login-form clearfix" action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post">
            <input type="hidden" name="formname" value="login" />
            <input type="text" placeholder="Username" name="username"  />
            <input type="password" placeholder="Passwort" name="password" />
            <button type="submit" name="Submit">Login</button>
          </form>
          <a class="toggle-register" href="#">Registrieren</a>

        </div>

        <div class="register clearfix">

          <h2>Registrierung</h2>    
          <form class="register-form clearfix" action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post">
            <input type="hidden" name="formname" value="register"/>
            <input type="text" placeholder="Username" name="username" />
            <input type="password" placeholder="Passwort" name="password" />
            <input type="password" placeholder="Passwort wiederholen" name="password-repeat" />
            <button type="submit" name="Submit">Registrieren</button>
          </form>
          <a class="toggle-register" href="#">Zum Login</a>

        </div>
      </section>
    </div>
  </div>

  <?php include 'footer.php'; ?>
</body>
</html>