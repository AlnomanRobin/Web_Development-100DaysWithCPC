// auth.js - handles signup/login and simple LocalStorage user store
document.addEventListener('DOMContentLoaded', ()=>{
  const signupForm = document.getElementById('signupForm');
  const loginForm = document.getElementById('loginForm');

  // helper: get users array from localStorage
  function getUsers(){
    return JSON.parse(localStorage.getItem('patients')||'[]')
  }
  function saveUsers(u){ localStorage.setItem('patients', JSON.stringify(u)) }

  if(signupForm){
    signupForm.addEventListener('submit', e=>{
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const confirm = document.getElementById('confirmPassword').value;

      if(!name||!email||!password){ alert('Please fill required fields'); return }
      if(password!==confirm){ alert('Passwords do not match'); return }

      const users = getUsers();
      if(users.find(u=>u.email===email)){ alert('Email already registered'); return }

      const newUser = {id:Date.now(),name,phone,email,password,profile:{}}
      users.push(newUser); saveUsers(users);
      // auto-login
      localStorage.setItem('sessionUser', JSON.stringify({id:newUser.id,name:newUser.name,email:newUser.email}))
      window.location='dashboard.html'
    })
  }

  if(loginForm){
    loginForm.addEventListener('submit', e=>{
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;
      const users = getUsers();
      const u = users.find(x=>x.email===email && x.password===password);
      if(!u){ alert('Invalid credentials'); return }
      localStorage.setItem('sessionUser', JSON.stringify({id:u.id,name:u.name,email:u.email}))
      window.location='dashboard.html'
    })
  }
})
