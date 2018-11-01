<?php 

include 'config.php';

$mysql = false;
$post_Action = isset($_POST['action']);

//---------------------------------------------------------------
// Helper Functions

function mysqlConnect() {
  // Get global variables 
  global $db_servername, $db_username,$db_password, $db_name, $mysql;
  // Init Connection
  $mysql = new mysqli($db_servername, $db_username, $db_password, $db_name);
  if ($mysql->connect_error) {
    die("Connection failed: " . $mysql->connect_error);
  }
}

function formatMilliseconds($milliseconds) {
  $seconds = floor($milliseconds/1000);
  $hours = floor($seconds / 3600); 
  $minutes = floor($seconds % 3600 / 60); 
  $seconds = $seconds % 60; 
  return sprintf("%d:%02d:%02d", $hours, $minutes, $seconds); 
}

//---------------------------------------------------------------

// Login
if ( $post_Action ) {
  // Create connection
  mysqlConnect();

  if ( $_POST['action'] === 'login') {

    $username = $_POST['username'];
    $password = $_POST['password'];

    if ( strlen($username) < 1 or strpos($username, ' ') ) {
      http_response_code(400);
      $arr = array ('selector'=>'username','error'=>true,'message'=>'Bitte Username eingeben');
    } else {

      if ( strlen($password) < 1 or strpos($password, ' ') ) {
        http_response_code(400);
        $arr = array ('selector'=>'password','error'=>true,'message'=>'Bitte Passwort eingeben');
      } else {

        $queryString = 'SELECT * FROM ' . $db_table . ' WHERE BINARY username="' . $username . '" and password="' . $password .'"';
        $result = $mysql->query($queryString); 
        
        if ( $result ) {

          if ( $result->num_rows > 0 ) {
            // Get Session Info
            if ( session_status() === PHP_SESSION_NONE ) { session_start(); }
            $_SESSION['logged'] = true; 
            $_SESSION['username'] = $username;
            $arr = array ('selector'=>'none','error'=>false,'message'=>'login');

          } else {
            http_response_code(401);
            $arr = array ('selector'=>'username,password','error'=>true,'message'=>'Falscher Benutzername oder Passwort');
          }

        } else {
          echo $mysql->error;
        } 

      }
    }

    // Echo JSON
    echo json_encode($arr);
  }

  //---------------------------------------------------------------

  // Register
  if ( $_POST['action'] === 'register') {

    $username = $_POST['username'];
    $password = $_POST['password'];
    $passwordRepeat = $_POST['passwordRepeat'];
    $alreadyRegistered = false;

    $queryString = 'SELECT * FROM ' . $db_table;
    $result = $mysql->query($queryString);
    
    if ( $result ) {

      if ( $result->num_rows > 0 ) {
        // Check if username already registered
        while ( $row = $result->fetch_assoc() ) { 
          if ( $row["username"] === $username ) {
            $alreadyRegistered = true;
          } 
        }
      }
      
    } else {
      echo $mysql->error;
    }


    if ( !$alreadyRegistered ) {
      if ( strlen($username) < 3 or strpos($username, ' ') ) {
        http_response_code(400);
        $arr = array ('selector'=>'username','error'=>true,'message'=>'Bitte bei Username keine Leerzeichen und minimum 3 Zeichen eingeben');
      } else {

        if ( !$password ) {
          http_response_code(400);
          $arr = array ('selector'=>'password','error'=>true,'message'=>'Bitte Passwort eingeben');
        } else {

        // Check if password has min 5 char an no spaces 
          if ( strlen($password) < 5 or strpos($password, ' ') ) {
            http_response_code(400);
            $arr = array ('selector'=>'password','error'=>true,'message'=>'Bitte bei Passwort keine Leerzeichen und minimum 5 Zeichen eingeben');
          } else {
          // If the passwords are not the same
            if ( $password !== $passwordRepeat ) {
              http_response_code(400);
              $arr = array ('selector'=>'password','error'=>true,'message'=>'Passwörter stimmen nicht überein');
            } else {

              $queryString = 'INSERT INTO ' . $db_table . ' (username, password) VALUES ("' . $username . '", "' . $password . '")';
              $result = $mysql->query($queryString);

              if ( !$result ) { echo $mysql->error; }

              $arr = array ('selector'=>'password','error'=>false,'message'=>'Erfolgreich registriert');
            }   
          }
        }
      }
    } else {
      http_response_code(400);
      $arr = array ('selector'=>'username','error'=>true,'message'=>'Username leider schon vergeben');
    }

    echo json_encode($arr);

  }

  //---------------------------------------------------------------

  // Game
  if ( $_POST['action'] === 'game') {
    // Get Session Info
    if ( session_status() === PHP_SESSION_NONE ) { session_start(); } 
    $username = $_SESSION['username'];
    $time = $_POST['time'];
    $turns = $_POST['turns'];
    
    $queryString = 'SELECT * FROM ' . $db_table . ' WHERE username="' . $username . '"';
    $result = $mysql->query($queryString);
    $bestTime = intval(mysqli_fetch_assoc($result)["time"]);

    // if this time is lower than the best result, or if the besttime is 0
    if ( $bestTime === 0 || $time < $bestTime ) {
      $queryString = 'UPDATE ' . $db_table . ' SET time='. $time . ', turns=' . $turns . ' WHERE username="' . $username .'"';
      $result = $mysql->query($queryString);
      if ( !$result ) { echo $mysql->error; }
    }
  }

  // Close connection
  $mysql->close();

}

if ( isset($isRankingPage) && $isRankingPage ) { 
  // Create connection
  mysqlConnect(); 

  $rankingPlace = 0;

  $queryString = 'SELECT * FROM ' . $db_table . ' ORDER BY time ASC, turns ASC';
  $result = $mysql->query($queryString);

  if ( $result ) {

    echo '<ul class="ranking-header clearfix">';
    echo '<li class="first">Platz</li>';
    echo '<li class="second">Username</li>';
    echo '<li class="third">Zeit</li>';
    echo '<li class="fourth">Aufgedeckte Karten</li>';
    echo '</ul>';

    if ( $result->num_rows > 0 ) {
      echo '<ul class="ranking-list">';
      while ( $row = $result->fetch_assoc() ) {
        if ( $row["turns"] > 0 ) {
          $rankingPlace = $rankingPlace + 1;
          echo '<li class="clearfix">';
          echo '<span class="first">' . $rankingPlace . '</span>';
          echo '<span class="second">' . $row["username"] . '</span>';
          echo '<span class="third">' . formatMilliseconds($row["time"]) . '</span>';
          echo '<span class="fourth">' . $row["turns"] . '</span>';
          echo '</li>';
        }
      }
      echo '</ul>';
    }

  } else {
    echo $mysql->error;
  }


  // Close connection
  $mysql->close();

}

?>