export function rotationToPoint(
  mx: number,
  my: number,
  px: number,
  py: number
) {
  const dist_Y = my - py;
  const dist_X = mx - px;
  const angle = Math.atan2(dist_Y, dist_X);
  // const degrees = angle * 180/ Math.PI;
  return angle;
}

export function getRandomFromArray(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getRandomIntInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function degreesToRadians(degrees: number) {
  return degrees * (Math.PI / 180);
}
