const form = document.getElementById("userForm");
const message = document.getElementById("message");
const formTitle = document.getElementById("formTitle");
const toggleForm = document.getElementById("toggleForm");
const submitBtn = document.getElementById("submitBtn");

let isLogin = false;

toggleForm.addEventListener("click", (e) => {
  e.preventDefault();
  isLogin = !isLogin;

  if (isLogin) {
    formTitle.textContent = "Login";
    submitBtn.textContent = "Login";
    toggleForm.textContent = "Signup";
  } else {
    formTitle.textContent = "Signup";
    submitBtn.textContent = "Signup";
    toggleForm.textContent = "Login";
  }

  message.textContent = "";
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password || (!isLogin && !name)) {
    message.style.color = "red";
    message.textContent = "❌ Please fill all fields!";
    return;
  }

  if (isLogin) {
    // LOGIN LOGIC
    const userData = JSON.parse(localStorage.getItem("userData"));

    if (userData && userData.email === email && userData.password === password) {
      message.style.color = "lightgreen";
      message.textContent = `✅ Welcome back, ${userData.name}!`;
    } else {
      message.style.color = "red";
      message.textContent = "❌ Invalid credentials!";
    }
  } else {
    // SIGNUP LOGIC
    const userData = { name, email, password };
    localStorage.setItem("userData", JSON.stringify(userData));
    message.style.color = "lightgreen";
    message.textContent = "✅ Account created! You can now log in.";
    form.reset();
  }
});
