<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Login Page (HTML, CSS, JS, PHP)</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
  <link rel="stylesheet" href="style.css" />
</head>
<body>

  <!-- Sign Up Form -->
  <div class="container" id="signUp" style="display: none;">
    <h1 class="form-title">Register</h1>
    <form method="post" action="register.php">
      <div class="input-group">
        <i class="fas fa-user"></i>
        <input type="text" name="fName" id="fName" placeholder="First Name" required />
        <label for="fName">First Name</label>
      </div>

      <div class="input-group">
        <i class="fas fa-user"></i>
        <input type="text" name="lName" id="lName" placeholder="Last Name" required />
        <label for="lName">Last Name</label>
      </div>

      <div class="input-group">
        <i class="fas fa-envelope"></i>
        <input type="email" name="email" id="emailSignUp" placeholder="Email" required />
        <label for="emailSignUp">Email</label>
      </div>

      <div class="input-group">
        <i class="fas fa-lock"></i>
        <input type="password" name="password" id="passwordSignUp" placeholder="Password" required />
        <label for="passwordSignUp">Password</label>
      </div>

      <input type="submit" class="btn" value="Sign Up" name="signUp" />
    </form>

    <p class="or">---------or--------</p>

    <div class="icons">
      <i class="fab fa-google"></i>
      <i class="fab fa-facebook"></i>
    </div>

    <div class="links">
      <p>Already Have Account?</p>
      <button id="signInButton">Sign In</button>
    </div>
  </div>

  <!-- Sign In Form -->
  <div class="container" id="signIn">
    <h1 class="form-title">Sign In</h1>
    <form method="post" action="register.php">
      <div class="input-group">
        <i class="fas fa-envelope"></i>
        <input type="email" name="email" id="emailSignIn" placeholder="Email" required />
        <label for="emailSignIn">Email</label>
      </div>

      <div class="input-group">
        <i class="fas fa-lock"></i>
        <input type="password" name="password" id="passwordSignIn" placeholder="Password" required />
        <label for="passwordSignIn">Password</label>
      </div>

      <p class="recover">
        <a href="#">Recover Password</a>
      </p>

      <input type="submit" value="Sign In" class="btn" name="signIn" />
    </form>

    <p class="or">---------or--------</p>

    <div class="icons">
      <i class="fab fa-google"></i>
      <i class="fab fa-facebook"></i>
    </div>

    <div class="links">
      <p>Don't Have Account?</p>
      <button id="signUpButton">Sign Up</button>
    </div>
  </div>

  <!-- JS link at end -->
  <script src="script.js"></script>
</body>
</html>
