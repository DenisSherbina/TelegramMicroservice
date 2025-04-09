// логика авторизации пользователей (логин, проверка кода).

const { setUserProcess, deleteUserProcess } = require('../models/processModel');
const { updateUserAuth, findUserByChatId } = require('../models/authModel');
const { postAuthentication, postAuthorization } = require('../services/httpService');

// Пользователь прислал логин
async function handleLoginStep(ctx, login) {
  const chatId = ctx.chat.id;

  try {
    const resp = await postAuthentication(login); // запрос во внешний сервис
    console.log('\nОтвет от postAuthentication:', resp);

    await ctx.reply('На вашу почту отправлен код подтверждения. Введите его следующим сообщением.');

    const processPayload = {
      login,
      clientId: resp.clientId
    };

    await setUserProcess(chatId, 'auth', 'awaiting_code', JSON.stringify(processPayload));
  } catch (error) {
    console.error('Ошибка в handleLoginStep:', error);
    await ctx.reply('Авторизация не удалась. Попробуйте снова отправить /start.');
  }
}


// Пользователь прислал код подтверждения 
async function handleCodeStep(ctx, code, user) {
  const chatId = ctx.chat.id;

  try {
    const resp = await postAuthorization(user.clientId, code);
    console.log('\nhandleCodeStep response:', resp);

    if (resp.message !== 'Авторизация успешна пройдена') {
      await ctx.reply('Неверный код или ошибка. Попробуйте заново /start.');
      return;
    }

    // На будущее: получать роли с сервера
    const roles = resp.roles || ['finance'];
    const token = user.clientId;

    await updateUserAuth(chatId, {
      login: user.login,
      token,
      roles,
      authorized: true
    });

    await ctx.reply('Вы успешно авторизованы!');
    await showRoleBasedPersistentButtons(ctx, roles);
    await deleteUserProcess(chatId);
  } catch (error) {
    console.error('Ошибка в handleCodeStep:', error);
    await ctx.reply('Неправильный код. Попробуйте снова.');
  }
}


async function showRoleBasedButtons(ctx, roles) {
  const allowedButtons = getAllowedButtonsByRoles(roles);

  const inlineKeyboard = allowedButtons.map(button => [
    { text: button.title, callback_data: button.title }
  ]);

  await ctx.reply('Доступные действия:', {
    reply_markup: { inline_keyboard: inlineKeyboard }
  });
}




async function showRoleBasedPersistentButtons(ctx, roles) {
  const allowedTitles = getAllowedButtonsByRoles(roles, true);

  const keyboard = allowedTitles.map(title => [{ text: title }]);

  await ctx.reply('Выберите действие:', {
    reply_markup: {
      keyboard,
      resize_keyboard: true,
      one_time_keyboard: false
    }
  });
}




// получение кнопок по ролям
function getAllowedButtonsByRoles(roles, asTitles = false) {
  const buttonsConfig = require('../config/roles.json');
  let allowedButtons = [];

  roles.forEach(role => {
    if (buttonsConfig[role]) {
      const buttons = buttonsConfig[role].buttons;
      allowedButtons = allowedButtons.concat(
        asTitles ? buttons.map(b => b.title) : buttons
      );
    }
  });

  return [...new Set(allowedButtons)];
}





module.exports = { handleLoginStep, handleCodeStep };
