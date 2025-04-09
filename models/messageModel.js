// запросы к таблице сообщений.

const { getDB } = require('../config/db');

async function saveMessage(chatId, messageId, direction, content) {
  await getDB().execute(
    'INSERT INTO user_messages (chat_id, message_id, direction, content) VALUES (?, ?, ?, ?)',
    [chatId, messageId, direction, content]
  );
}

async function getUserMessages(chatId) {
  const [rows] = await getDB().execute('SELECT * FROM user_messages WHERE chat_id = ?', [chatId]);
  return rows;
}

async function deleteUserMessages(chatId) {
  await getDB().execute('DELETE FROM user_messages WHERE chat_id = ?', [chatId]);
}

module.exports = { saveMessage, getUserMessages, deleteUserMessages };
