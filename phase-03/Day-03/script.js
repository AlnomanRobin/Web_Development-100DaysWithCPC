// ===== Toggle Sign In / Sign Up =====
const signUpButton = document.getElementById("signUpButton");
const signInButton = document.getElementById("signInButton");
const signUpForm = document.getElementById("signUp");
const signInForm = document.getElementById("signIn");

signUpButton.addEventListener("click", () => {
  signInForm.classList.add("inactive");
  signUpForm.classList.add("active");
});

signInButton.addEventListener("click", () => {
  signUpForm.classList.remove("active");
  signInForm.classList.remove("inactive");
});

// ===== Password Strength & Character Count =====
const password = document.getElementById("passwordSignUp");
const charCount = document.getElementById("charCount");
const upper = document.getElementById("upper");
const lower = document.getElementById("lower");
const number = document.getElementById("number");
const special = document.getElementById("special");

password.addEventListener("input", () => {
  const value = password.value;
  charCount.textContent = `Length: ${value.length}`;

  const hasUpper = /[A-Z]/.test(value);
  const hasLower = /[a-z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecial = /[!@#$%^&*]/.test(value);

  upper.style.color = hasUpper ? "green" : "#d33";
  lower.style.color = hasLower ? "green" : "#d33";
  number.style.color = hasNumber ? "green" : "#d33";
  special.style.color = hasSpecial ? "green" : "#d33";
});
