// Toggle between Sign In and Sign Up
const signUpButton = document.getElementById('signUpButton');
const signInButton = document.getElementById('signInButton');
const signInForm = document.getElementById('signIn');
const signUpForm = document.getElementById('signUp');

signUpButton.addEventListener('click', () => {
  signInForm.style.display = "none";
  signUpForm.style.display = "block";
});

signInButton.addEventListener('click', () => {
  signInForm.style.display = "block";
  signUpForm.style.display = "none";
});

// Password validation and strength info
const passwordInput = document.getElementById('passwordSignUp');
const charCount = document.getElementById('charCount');
const upper = document.getElementById('upper');
const lower = document.getElementById('lower');
const number = document.getElementById('number');
const special = document.getElementById('special');

passwordInput.addEventListener('input', () => {
  const value = passwordInput.value;
  charCount.textContent = `Length: ${value.length}`;

  // Check character types
  const hasUpper = /[A-Z]/.test(value);
  const hasLower = /[a-z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);

  toggleActive(upper, hasUpper);
  toggleActive(lower, hasLower);
  toggleActive(number, hasNumber);
  toggleActive(special, hasSpecial);
});

function toggleActive(element, isActive) {
  if (isActive) element.classList.add('active');
  else element.classList.remove('active');
}
