// HTTP клиент для запросов к внешним сервисам.

const axios = require('axios');

async function postAuthentication(login) {
  const response = await axios.post('https://project-line.online/authentication-tg', { login });
  return response.data;
}

async function postAuthorization(clientId, code) {
  const response = await axios.post('https://project-line.online/authorization-tg', { clientId, code });
  return response.data;
}

async function universalPostRequest(action, clientId) {
  const response = await axios.post('https://project-line.online/route-tg', { clientId, action });
  return response.data;
}

// Кастомные запросы
async function postWithClientId(url, clientId, data) {
  const response = await axios.post(url, { ...data, clientId });
  return response.data;
}

module.exports = { postAuthentication, postAuthorization, universalPostRequest, postWithClientId };
