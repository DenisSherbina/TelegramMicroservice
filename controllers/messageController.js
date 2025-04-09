// логика формирования сообщений в ответ пользователю.

const { getUserProcessStep, setUserProcess } = require('../models/processModel');
const { saveMessage } = require('../models/messageModel');
const { handleLoginStep, handleCodeStep } = require('./authController');
const { processUserMessage, actionsWithinProcess } = require('./processController');
const { sendMessage } = require('../services/telegramService');


// Авторизация пользователя телеграмм бота
async function authorizedTelegram(ctx) {
  const chatId = ctx.chat.id;
  const text = ctx.message.text;

  try {
    const userStep = await getUserProcessStep(chatId);

    // Если пользователь только начинает
    if (text === '/start') {
      await ctx.reply('Добро пожаловать, необходима авторизация. Пришлите следующим сообщением ваш логин.');
      await setUserProcess(chatId, 'auth', 'awaiting_login', '');
      return;
    }

    // Обработка шагов авторизации
    if (userStep?.process_name === 'auth') {
      switch (userStep.step) {
        case 'awaiting_login':
          await handleLoginStep(ctx, text);
          return;
        case 'awaiting_code':
          await handleCodeStep(ctx, text, JSON.parse(userStep.value));
          return;
      }
    }

    // Если ничего не подошло
    await ctx.reply('Необходимо авторизоваться. Нажмите /start.');
  } catch (err) {
    console.error('Ошибка в authorizedTelegram:', err);
    await ctx.reply('Произошла ошибка. Попробуйте позже.');
  }
}



// Текстовое сообщение
async function handleIncomingMessage(user, ctx) {
  const chatId = ctx.chat.id;
  const text = ctx.message.text;

  console.log(`\n -> Текстовое сообщение от ${chatId}: ${text}\n`);

  try {
    await saveMessage(chatId, ctx.message.message_id, 'incoming', text);

    const userStep = await getUserProcessStep(chatId);

    // Нет текущего процесса — отдаем на первичную обработку
    if (!userStep || !userStep.process_name) {
      await processUserMessage(user, ctx, text);
      return;
    }

    if (userStep.process_name === 'переписка') {
      // TODO: Дописать обработчик переписки
      return;
    }

    // Все остальные шаги — внутренняя логика процесса
    await actionsWithinProcess(user, ctx, userStep, text);
  } catch (err) {
    console.error('Ошибка в handleIncomingMessage:', err);
    await ctx.reply('Произошла ошибка при обработке сообщения.');
  }
}



// Прикрепил документ
async function handleIncomingDocument(user, ctx) {
  const chatId = ctx.chat.id;
  // . . . TODO . . . 
  await ctx.reply('Документ получен. Обработка пока не реализована.');
}


// Нажатие по кнопке, прикреплённому к сообщению
async function handleIncomingCallbackQuery(user, ctx) {
  const chatId = ctx.chat.id;
  const data = ctx.callbackQuery.data;

  console.log('handleIncomingCallbackQuery отработал')

  // Обработка логики процесса при нажатии кнопки
  await processUserMessage(ctx, data, true);
}


// Отправка уведомления в телеграм из вне
async function notification(req, res) {
  const { chatId, message } = req.body;

  // Базовая проверка на наличие полей
  if (!chatId || !message) {
    return res.status(400).json({ error: 'Поля chatId и message обязательны.' });
  }

  // Дополнительная валидация (по желанию)
  if (typeof chatId !== 'number' || typeof message !== 'string') {
    return res.status(400).json({ error: 'Некорректные типы: chatId должен быть числом, message — строкой.' });
  }

  try {
    await sendMessage(chatId, message);
    return res.status(200).json({ status: 'ok', sentTo: chatId });
  } catch (error) {
    console.error('❌ Ошибка при отправке уведомления:', error);
    return res.status(500).json({ error: 'Ошибка в сервисе при отправке сообщения.' });
  }
}


module.exports = { handleIncomingMessage, handleIncomingDocument, handleIncomingCallbackQuery, notification, authorizedTelegram };
