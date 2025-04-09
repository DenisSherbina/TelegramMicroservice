// проверка входящих сообщений от Telegram на предмет авторизации.

const { findUserByChatId } = require('../models/authModel');
const { authorizedTelegram } = require('../controllers/messageController');

async function telegramAuthGuard(ctx) {
  const chatId = ctx.chat.id;
  const text = ctx.message.text;
  
  // Если пользователь не найден или не авторизован, но пришел не /start, перевести в режим авторизации
  // Если пользователь присылает /start - мы начинаем авторизацию с нуля.
  // Если пользователь уже авторизован - пропускаем дальше.

  const user = await findUserByChatId(chatId);
  
  if (!user || user.authorized === 0) {
    // Пользователь не авторизован. 
    authorizedTelegram(ctx)
    return null
  }

  if (text === '/start') {
    await ctx.reply('Необходим сброс сессии на стороне сервера');
  }

  console.log('Авторизованный запрос')
  
  // возвращаем управление
  return user;
}

module.exports = { telegramAuthGuard };
