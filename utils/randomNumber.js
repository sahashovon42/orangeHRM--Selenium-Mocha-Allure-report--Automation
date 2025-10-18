export function getRandomNumber(min,max) {
  return Math.floor(Math.random() * (max - min) + min);
}

export function getRandomNumberMax(max) {
  return Math.floor(Math.random() * max);
}