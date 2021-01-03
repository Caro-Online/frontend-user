import { message as antMessage } from 'antd'
export const removeItem = (array, id) => {
  let cloneArray = [...array];
  return cloneArray.filter((x) => x._id !== id);
};
export const addItem = (array, audience) => {
  let cloneArray = [...array];
  let flag = true;
  // cloneArray.map((x) => {
  //   if (x._id === audience._id) {
  //     flag = false;
  //   }
  // });
  cloneArray.forEach((x) => {
    if (x._id === audience._id) {
      flag = false;
    }
  });
  if (flag) cloneArray.push(audience);
  return cloneArray;
};

export const setTokenToStorage = (token) => {
  localStorage.setItem("token", token);
};

export const removeTokenFromStorage = () => {
  localStorage.removeItem("token");
};

export const getTokenFromStorage = () => {
  return localStorage.getItem("token");
};

export const setUserToStorage = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const removeUserFromStorage = () => {
  localStorage.removeItem("user");
};

export const getUserFromStorage = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export const getUserIdFromStorage = () => {
  return getUserFromStorage()?._id;
};

export const getUsernameFromStorage = () => {
  return getUserFromStorage()?.name;
};

export const getUserImageUrlFromStorage = () => {
  return getUserFromStorage().imageUrl;
};

export const setExpirationDateToStorage = (expirationDate) => {
  localStorage.setItem("expirationDate", expirationDate);
};

export const removeExpirationDateFromStorage = () => {
  localStorage.removeItem("expirationDate");
};

export const getExpirationDateFromStorage = () => {
  return localStorage.getItem("expirationDate");
};

export const getCupChangeMessage = (updatedMatch, cupDataChange) => {
  console.log(updatedMatch.winner)
  const userId = getUserIdFromStorage();
  for (let i = 0; i < updatedMatch.players.length; i++) {
    if (updatedMatch.players[i]._id === userId) {
      if (updatedMatch.players[i]._id === updatedMatch.winner) {
        antMessage.success(`Bạn được cộng ${cupDataChange[0]} cúp`)
      } else {
        antMessage.warning(`Bạn bị trừ ${cupDataChange[1]} cúp`)
      }
    }
  }
}
