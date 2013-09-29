//var currentUser = 'bob@example.com';

/*
navigator.id.watch({
  //loggedInUser: currentUser,
  onlogin: function(assertion) {
    // A user has logged in! Here you need to:
    // 1. Send the assertion to your backend for verification and to create a session.
    // 2. Update your UI.
    $.ajax({
      type: 'POST',
      url: '/auth/login', // This is a URL on your website.
      data: {assertion: assertion},
      dataType: 'json',
      success: function(res, status, xhr) { console.log('Logged in!'); },
      error: function(xhr, status, err) {
        navigator.id.logout();
        alert("Login failure: " + err);
      }
    });
  },
  onlogout: function() {
    // A user has logged out! Here you need to:
    // Tear down the user's session by redirecting the user or making a call to your backend.
    // Also, make sure loggedInUser will get set to null on the next page load.
    // (That's a literal JavaScript null. Not false, 0, or undefined. null.)
    $.ajax({
      type: 'POST',
      url: '/auth/logout', // This is a URL on your website.
      dataType: 'json',
      success: function(res, status, xhr) { console.log('Logged out!'); },
      error: function(xhr, status, err) { alert("Logout failure: " + err); }
    });
  }
});
*/

$('#signin' ).click(function() { navigator.id.request(); });
$('#signout').click(function() { navigator.id.logout(); });

