function startProcess() {
  document.getElementById("output").innerText = "Downloading...";

  setTimeout(function() {
    document.getElementById("output").innerText = "Download Complete ✅";
  }, 2000);
}

function nestedExample() {
  function outer() {
    let user = "AR";
    function inner() {
      return `Welcome back, ${user}!`;
    }
    return inner();
  }
  document.getElementById("output").innerText = outer();
}

function returnFunction() {
  function makeAdder(x) {
    return function(y) {
      return x + y;
    };
  }

  const add5 = makeAdder(5);
  document.getElementById("output").innerText = "5 + 10 = " + add5(10);
}
