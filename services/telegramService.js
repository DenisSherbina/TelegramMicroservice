// Telegram API
const bot = require('./botInstance');

// Универсальный обработчик событий Telegram
function handleEvent(eventType, handler, authGuard) {
  bot.on(eventType, async (ctx) => {
    try {
      const user = await authGuard(ctx);
      if (user) {
        await handler(user, ctx);
      }
    } catch (error) {
      console.error(`Ошибка при обработке ${eventType}:`, error);
    }
  });
}

// Инициализация и запуск бота
function initTelegramBot({ authGuard, onText, onDocument, onCallbackQuery }) {
  const events = [
    { type: 'text', handler: onText },
    { type: 'document', handler: onDocument },
    { type: 'callback_query', handler: onCallbackQuery },
  ];

  events.forEach(({ type, handler }) => {
    if (typeof handler === 'function') {
      handleEvent(type, handler, authGuard);
    }
  });

  bot.launch();
  console.log('Telegram бот запущен.');
}

// Отправка сообщения
function sendMessage(chatId, message) {
  return bot.telegram.sendMessage(chatId, message);
}

module.exports = {
  initTelegramBot,
  sendMessage
};
