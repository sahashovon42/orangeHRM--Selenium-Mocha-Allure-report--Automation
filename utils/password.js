export function generatePassword(baseName) {
  const symbols = "!@#$%^&*";
  const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
  const randomNum = Math.floor(Math.random() * 1000); // e.g., 482
  const randomUpper = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // random capital letter
  const randomLower = String.fromCharCode(97 + Math.floor(Math.random() * 26)); // random lowercase letter

  // Example pattern: FirstName + Symbol + Uppercase + Lowercase + Number
  return `${baseName}${randomSymbol}${randomUpper}${randomLower}${randomNum}`;
}