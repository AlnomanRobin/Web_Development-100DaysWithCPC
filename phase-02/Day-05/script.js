let btn = document.getElementById("check");
let output = document.getElementById("output");

btn.addEventListener("click", function() {
  let marks = parseInt(document.getElementById("marks").value);

  if (isNaN(marks) || marks < 0 || marks > 100) {
    output.innerHTML = "⚠️ Please enter valid marks (0-100)";
    return;
  }

  let grade;

  if (marks >= 80) {
    grade = "A+";
  } else if (marks >= 60) {
    grade = "A";
  } else if (marks >= 40) {
    grade = "B";
  } else {
    grade = "F";
  }

  output.innerHTML = `🎓 Your Grade is: <span style="color: crimson;">${grade}</span>`;
});
