interface IUserData {
  lastLevelFinished: number;
}

const defaultUserData: IUserData = {
  lastLevelFinished: 0,
};

export function getUserData(): IUserData {
  const userDataGetted = localStorage.getItem('userData');
  return userDataGetted
    ? JSON.parse(userDataGetted)
    : JSON.parse(JSON.stringify(defaultUserData)); // Clone the object;
}
export function setUserData(userData: IUserData) {
  localStorage.setItem('userData', JSON.stringify(userData));
}
