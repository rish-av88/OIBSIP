"use strict";

// Select the necessary DOM elements
const input = document.querySelector(".input");
const result = document.querySelector(".result");
const buttons = document.querySelectorAll(".button");
let operation = "";
let answer;
let decimalAdded = false;
const operators = ["+", "-", "x", "÷", "√", "^", "%", "(", ")"];

// Handle button clicks
function handleButtonClick(e) {
  const key = e.target.dataset.key;
  const lastChar = operation[operation.length - 1];

  // Ignore the equals key
  if (key === "=") return;

  // Prevent adding multiple decimal points
  if (key === "." && decimalAdded) return;

  // Reset the decimalAdded flag for new operations
  if (operators.indexOf(key) !== -1) decimalAdded = false;

  // Handle negative numbers
  if (operation.length === 0 && key === "-") {
    operation += key;
    input.innerHTML = operation;
    return;
  }

  // Prevent starting with an operator (except for negatives and parentheses)
  if (
    operation.length === 0 &&
    operators.indexOf(key) !== -1 &&
    key !== "(" &&
    key !== "-"
  ) {
    input.innerHTML = operation;
    return;
  }

  // Replace the last operator if the new input is an operator
  if (
    operators.indexOf(lastChar) !== -1 &&
    operators.indexOf(key) !== -1 &&
    key !== "("
  ) {
    operation = operation.replace(/.$/, key);
    input.innerHTML = operation;
    return;
  }

  // Add the key to the operation
  if (key) {
    if (key === ".") decimalAdded = true;
    if (key === "00") {
      operation += "00";
      input.innerHTML = operation;
      return;
    }
    if (key === "ans") {
      operation += answer;
      input.innerHTML = operation;
      return;
    }
    if (key === "del") {
      operation = operation.slice(0, -1);
      input.innerHTML = operation;
      return;
    }
    operation += key;
    input.innerHTML = operation;
    return;
  }
}

// Evaluate the expression
function evaluate() {
  const lastChar = operation[operation.length - 1];

  // Remove the last operator if the operation ends with an operator
  if (operators.indexOf(lastChar) !== -1 && lastChar !== ")") {
    operation = operation.slice(0, -1);
  }

  // Return if the operation is empty
  if (operation.length === 0) {
    answer = "";
    result.innerHTML = answer;
    return;
  }

  try {
    // Remove leading zeros (except for decimal numbers)
    if (operation[0] === "0" && operation[1] !== "." && operation.length > 1) {
      operation = operation.slice(1);
    }

    // Replace operators with their respective symbols
    const final = operation
      .replace(/x/g, "*")
      .replace(/÷/g, "/")
      .replace(/√/g, "Math.sqrt(")
      .replace(/\)/g, ")") // Close the Math.sqrt() function
      .replace(/\^/g, "**")
      .replace(/%/g, "/100");

    // Evaluate the expression and round the result to 5 decimal places
    answer = +(eval(final)).toFixed(5);
    decimalAdded = false;
    operation = `${answer}`;
    answer = "";
    input.innerHTML = operation;
    result.innerHTML = answer;
  } catch (e) {
    // Display an error message if the expression is invalid
    input.innerHTML = `<span class="error">${operation}</span>`;
    result.innerHTML = `<span class="error">Bad Expression</span>`;
    console.log(e);
  }
}

// Clear the input
function clearInput() {
  operation = "";
  answer = "";
  input.innerHTML = operation;
  result.innerHTML = answer;
}

// Event listeners
buttons.forEach((button) => {
  const key = button.dataset.key;
  if (key === "=") {
    button.addEventListener("click", evaluate);
  } else if (key === "delete") {
    button.addEventListener("click", clearInput);
  } else {
    button.addEventListener("click", handleButtonClick);
  }
});

// Handle keyboard input
document.addEventListener("keydown", (e) => {
  const key = e.key;
  // Ignore non-numeric, non-operator, and non-parenthesis keys
  if (
    /^[0-9.()]/g.test(key) || // Fixed regular expression
    operators.includes(key) ||
    key === "Enter" ||
    key === "Backspace" ||
    key === "Delete"
  ) {
    if (key === "Enter") {
      evaluate();
    } else if (key === "Backspace" || key === "Delete") {
      clearInput();
    } else {
      handleButtonClick({ target: { dataset: { key } } });
    }
  }
});