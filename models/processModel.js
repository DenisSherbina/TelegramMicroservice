//  запросы к таблице процесса.

const { getDB } = require('../config/db');

async function getUserProcessStep(chatId) {
  const [rows] = await getDB().execute('SELECT * FROM user_process WHERE chat_id = ?', [chatId]);
  return rows[0];
}

async function deleteUserProcess(chatId) {
  // Удаляем все предыдущие шаги
  await getDB().execute( 'DELETE FROM user_process WHERE chat_id = ?', [chatId] );
}

async function setUserProcess(chatId, processName, step, value) {
  // Удаляем все предыдущие шаги
  await deleteUserProcess(chatId);
  // Записываем новый шаг
  await getDB().execute(
    'INSERT INTO user_process (chat_id, process_name, step, value) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE process_name=?, step=?',
    [chatId, processName, step, value, processName, step]
  );
}

async function updateUserProcess(chatId, process_name, step, value) {
  // Удаляем все предыдущие шаги
  await getDB().execute( 'UPDATE user_process SET step = ?, value = ? WHERE process_name = ? AND chat_id = ?', [step, value, process_name, chatId] );
}

module.exports = { getUserProcessStep, setUserProcess, deleteUserProcess, updateUserProcess };
