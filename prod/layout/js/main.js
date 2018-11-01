;( function( $, window, document, undefined ) {
  
  var href= location.href,
    url = href.substr(0, href.lastIndexOf("/"));
  
  url += '/handle-data.php';

  var ajaxCall = function($form, data) {
    $.ajax({
      type: 'POST',
      cache: false,
      url: url,
      data: data,
      error: function(result) {
        ajaxError($form, result);
      },

      success: function(result) {
        ajaxSuccess($form, result);
      }
    });
  };

  var ajaxError = function($form, result) {
    var response = JSON.parse(result.responseText);
    if ( response.selector.indexOf(',') ) {
      // If there are more than 1 selector
      var selectorArr = response.selector.split(',');
      for ( var i=0; i<selectorArr.length; i++ ) {
        $form.find('input[name=' + selectorArr[i] + ']').addClass('error');
      }
    } else {
      $input = $form.find('input[name=' + response.selector + ']').addClass('error');
    }

    $('#checkform').html('<p>' + response.message + '</p>');

  };

  var ajaxSuccess = function($form, result) {
    var response = JSON.parse(result),
    $input = $form.find('input[name=' + response.selector + ']');

    $form.find('input').removeClass('error');
    if ( response.message === 'login' ) {
      window.location = 'game.php';
    } else {
      $('#checkform').html('<p>' + response.message + '</p>');
    }
  };

  var handleForm = function($form) {
    var data = {
      action: 'login', 
      username: $form.find('input[name="username"]').val(),
      password: $form.find('input[name="password"]').val()
    };

    if ( $form.is('.register-form') ) {
      data.action = 'register';
      data.passwordRepeat = $form.find('input[name="password-repeat"]').val();
    }
    ajaxCall($form, data);
  };

  var init = function() {

    $('.home-page form').on('submit', function(event) {
      event.preventDefault();
      var $form = $(event.target);
      handleForm($form);
      return false;
    });

    $('.toggle-register').on('click',function(event) {
      event.preventDefault();
      $('#checkform p').remove();
      $('input.error').removeClass('error');
      $('body').toggleClass('register-active');
      return false;
    });

    var memory = new Memory({
      url: url,
      selector: '#game',
      pairs: 20
    });

  };



  $(document).ready(function() {
    init();
  });


})( jQuery, window, document );
