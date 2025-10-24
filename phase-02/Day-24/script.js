let display = document.getElementById("display");

// 🧮 Append numbers/operators
function appendValue(value) {
  display.value += value;
}

// ❌ Clear all
function clearDisplay() {
  display.value = "";
}

// 🔙 Delete last character
function deleteLast() {
  display.value = display.value.slice(0, -1);
}

// ✅ Calculate result
function calculate() {
  try {
    display.value = eval(display.value);
  } catch (error) {
    display.value = "Error";
  }
}
