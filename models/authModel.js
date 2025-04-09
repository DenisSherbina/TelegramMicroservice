// запросы к таблице авторизации.

const { getDB } = require('../config/db');

async function findUserByChatId(chatId) {
  const [rows] = await getDB().execute('SELECT * FROM auth_info WHERE chat_id = ?', [chatId]);
  return rows[0];
}

async function getProcessByChatId(chatId, processName) {
  const [rows] = await getDB().execute('SELECT * FROM user_process WHERE chat_id = ? AND process_name = ?', [chatId, processName]);
  return rows[0];
}

async function updateUserAuth(chatId, { login, token, roles, authorized }) {
  const rolesStr = JSON.stringify(roles);
  await getDB().execute('INSERT INTO auth_info (chat_id, login, token, roles, authorized) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE login=?, token=?, roles=?, authorized=?', 
    [chatId, login, token, rolesStr, authorized, login, token, rolesStr, authorized]);
}

// async function passageTempAuth(chatId, login) {
//   const rolesStr = JSON.stringify(roles);
//   await getDB().execute('INSERT INTO user_temp (chat_id, login) VALUES (?, ?) ON DUPLICATE KEY UPDATE chat_id=?', 
//     [chatId, login, chatId]);
// }

module.exports = { findUserByChatId, updateUserAuth, getProcessByChatId };
