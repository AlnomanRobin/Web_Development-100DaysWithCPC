let form = document.getElementById("signupForm");
let nameInput = document.getElementById("name");
let emailInput = document.getElementById("email");
let passwordInput = document.getElementById("password");
let errorMsg = document.getElementById("errorMsg");
let successMsg = document.getElementById("successMsg");

form.addEventListener("submit", function(event) {
  event.preventDefault(); // stop form submission

  let name = nameInput.value.trim();
  let email = emailInput.value.trim();
  let password = passwordInput.value.trim();

  // Reset messages
  errorMsg.textContent = "";
  successMsg.textContent = "";

  // Basic validation
  if (name === "" || email === "" || password === "") {
    errorMsg.textContent = "❌ All fields are required!";
    return;
  }

  if (!email.includes("@") || !email.includes(".")) {
    errorMsg.textContent = "❌ Please enter a valid email!";
    return;
  }

  if (password.length < 6) {
    errorMsg.textContent = "❌ Password must be at least 6 characters!";
    return;
  }

  successMsg.textContent = "✅ Signup successful! Welcome, " + name + "!";
  form.reset();
});
