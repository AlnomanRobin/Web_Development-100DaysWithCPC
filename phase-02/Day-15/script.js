let users = [
  {
    name: "AR",
    age: 21,
    city: "Dhaka",
    skills: ["HTML", "CSS", "JavaScript"],
    image: "https://i.pravatar.cc/150?img=3",
    profession: "Frontend Developer"
  },
  {
    name: "Robin",
    age: 22,
    city: "Chittagong",
    skills: ["C", "C++", "Python"],
    image: "https://i.pravatar.cc/150?img=5",
    profession: "Software Engineer"
  },
  {
    name: "Shawon",
    age: 20,
    city: "Rajshahi",
    skills: ["JavaScript", "React", "Node.js"],
    image: "https://i.pravatar.cc/150?img=8",
    profession: "MERN Stack Developer"
  }
];

function generateProfile() {
  let random = Math.floor(Math.random() * users.length);
  let user = users[random];

  document.getElementById("userImg").src = user.image;
  document.getElementById("userName").innerText = `${user.name} (${user.profession})`;
  document.getElementById("userInfo").innerText = `Age: ${user.age} | City: ${user.city}`;
  document.getElementById("userSkills").innerText = `Skills: ${user.skills.join(", ")}`;

  console.log("User Data:", user);
}
