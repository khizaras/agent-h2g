// This file tests date handling for the Hands2gether application
const moment = require("moment");

console.log("Testing date handling...");

// Test 1: Regular date string
const dateStr = "2023-05-18";
console.log(`\nTest 1: Regular date string - "${dateStr}"`);
const date1 = moment(dateStr);
console.log(`Is valid moment object? ${moment.isMoment(date1)}`);
console.log(`Date is valid? ${date1.isValid()}`);
console.log(`Formatted date: ${date1.format("YYYY-MM-DD")}`);

// Test 2: Null date
console.log(`\nTest 2: Null date`);
const date2 = null;
console.log(`Is valid moment object? ${moment.isMoment(date2)}`);
console.log(
  `Can check if valid? ${
    date2 && date2.isValid ? "Yes" : "No - would cause error"
  }`
);
console.log(
  `Safe check: ${
    date2 && moment.isMoment(date2) && date2.isValid()
      ? "Valid date"
      : "Not a valid moment date"
  }`
);

// Test 3: Invalid date
console.log(`\nTest 3: Invalid date string - "not-a-date"`);
const date3 = moment("not-a-date");
console.log(`Is valid moment object? ${moment.isMoment(date3)}`);
console.log(`Date is valid? ${date3.isValid()}`);
console.log(`Format attempt: ${date3.format("YYYY-MM-DD")}`);

// Test 4: "null" as string
console.log(`\nTest 4: "null" as string`);
const date4 = moment("null");
console.log(`Is valid moment object? ${moment.isMoment(date4)}`);
console.log(`Date is valid? ${date4.isValid()}`);
console.log(`Format attempt: ${date4.format("YYYY-MM-DD")}`);

// Test 5: Safe handling
console.log(`\nTest 5: Safe handling examples`);
const safeFormat = (date) =>
  date && moment.isMoment(date) && date.isValid()
    ? date.format("YYYY-MM-DD")
    : "";
console.log(`Safe format valid date: ${safeFormat(moment())}`);
console.log(`Safe format null: ${safeFormat(null)}`);
console.log(`Safe format invalid: ${safeFormat(moment("garbage"))}`);

console.log("\nTest completed.");
