export const serverRoot = 'http://localhost:3000';
let savedSessionKey;

export const getSessionKey = () => {
  return savedSessionKey;
};

export const login = (user, password) => {
  return fetch(serverRoot + `/api/login?user=${user}&password=${password}`);
};

export default function setupAuthentication() {
  return login('', '')
    .then(response => response.json())
    .then(({sessionkey}) => {
      savedSessionKey = sessionkey;
    });
}
