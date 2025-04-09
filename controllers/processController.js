// логика работы с шагами бизнес-процессов. Вложенности кнопок

const { getUserProcessStep, setUserProcess, deleteUserProcess, updateUserProcess } = require('../models/processModel');
const { postWithClientId } = require('../services/httpService');
const { findUserByChatId } = require('../models/authModel');
const { showRoleBasedPersistentButtons, showRoleBasedButtons, returnCancelButton } = require('../models/buttonModel');

processController = {
  // #region 1 уровень
  // ==============================================================
  processUserMessage: async (user, ctx, content, isCallback = false) => {
    const chatId = ctx.chat.id;
    const userStep = await getUserProcessStep(chatId);

    // await ctx.reply(`Данные получены: ${content}`);

    switch (content) {

      case 'Отмена': {
        const chatId = ctx.chat.id;
        // Отменяем все действий
        deleteUserProcess(chatId)
        let keyboard = await showRoleBasedButtons(user)
        processController.sendReplyInTelegram(ctx, 'Вы в главном меню', keyboard)
      }

      case 'Чаты с поддержкой': {
        console.log('Запущен процесс "Чаты с поддержкой"')
        let keyboard = await showRoleBasedPersistentButtons(user, [content])
        if (!keyboard) {
          processController.processError(user, ctx)
          return
        }
        processController.sendReplyInTelegram(ctx, 'Выберите отдел', keyboard)

        await setUserProcess(chatId, 'supportChat', 'awaiting', '');
        return
      }

      case 'Диспуты': {
        let keyboard = await returnCancelButton()
        processController.sendReplyInTelegram(ctx, 'Список чатов по диспутам', keyboard)
        return
      }

      case 'Подключение мерчантов': {
        let keyboard = await returnCancelButton()
        processController.sendReplyInTelegram(ctx, 'Список чатов с мерчантами', keyboard)
        return
      }

      case 'Управление аккаунтом': {
        let keyboard = await returnCancelButton()
        processController.sendReplyInTelegram(ctx, 'Укажите ID пользователя', keyboard)
        await setUserProcess(chatId, 'accountManagement', 'getID', '');
        return
      }

      case 'Подключение платежей': {
        let keyboard = await returnCancelButton()
        processController.sendReplyInTelegram(ctx, 'Список чатов с провайдерами', keyboard)
        return
      }

      default: {
        processController.actionsWithinProcess(ctx, content, isCallback)
      }

      // case 'btn_processA': {

      //   // Допустим, пользователь авторизован и нажал кнопку "btn_processA"
      //   if (isCallback && content === 'btn_processA') {
      //     await ctx.reply('Вы выбрали процесс A. Введите данные для шага 1.');
      //     await setUserProcess(chatId, 'processA', 'step1', '');
      //     return;
      //   }

      //   // Если пользователь сейчас на шаге processA/step1 и присылает текст
      //   if (userStep && userStep.process_name === 'processA' && userStep.step === 'step1') {
      //     // Обработка данных шаг1
      //     // Отправляем данные на внешний сервис, учитывая token (clientId)
      //     const user = await findUserByChatId(chatId);
      //     const resp = await postWithClientId('https://project-line.online/some-api', user.token, { data: content });
      //     await ctx.reply(`Данные получены: ${content}. Переходим к шагу 2.`);
      //     await setUserProcess(chatId, 'processA', 'step2', '');
      //     return;
      //   }

      //   if (userStep && userStep.process_name === 'processA' && userStep.step === 'step2') {
      //     // И т.д.
      //     await ctx.reply('Процесс A завершён!');
      //     await setUserProcess(chatId, null, null, null);
      //   }

      //   return;

      // };


    }

  },
  // #region 2 уровень
  // ==============================================================
  actionsWithinProcess: async (user, ctx, userStep, content, isCallback = false) => {

    if (userStep.process_name === "supportChat") {
      switch (content) {
        case 'Финансовый': {
          await updateUserProcess(chatId, 'supportChat', 'awaiting', { "type": "Финансовый" });

          // Необходимо запросить по API
          let keyboard = await returnCancelButton()
          processController.sendReplyInTelegram(ctx, 'Список чатов с поддержкой по отделу', keyboard)
          return
        }

        case 'Общий': {
          await updateUserProcess(chatId, 'supportChat', 'awaiting', { "type": "Общий" });

          // Необходимо запросить по API
          let keyboard = await returnCancelButton()
          processController.sendReplyInTelegram(ctx, 'Список чатов с поддержкой по отделу', keyboard)
          return
        }

        case 'Технический': {
          await updateUserProcess(chatId, 'supportChat', 'awaiting', { "type": "Технический" });

          // Необходимо запросить по API
          let keyboard = await returnCancelButton()
          processController.sendReplyInTelegram(ctx, 'Список чатов с поддержкой по отделу', keyboard)
          return
        }

        default: {
          await ctx.reply('Процесс не найден');
        }
      }
    }


  },
  sendReplyInTelegram: async (ctx, message, keyboard) => {
    // await ctx.reply('Выберите действие:', {
    //   reply_markup: {
    //     keyboard: keyboard,
    //     resize_keyboard: true, // клавиатура будет адаптироваться под размер экрана
    //     one_time_keyboard: true // клавиатура останется после нажатия кнопки
    //   }
    // });
    await ctx.reply(message, {
      reply_markup: {
        keyboard: keyboard,
        resize_keyboard: true, // клавиатура будет адаптироваться под размер экрана
        one_time_keyboard: false, // клавиатура останется после нажатия кнопки
        remove_keyboard: true, // убирать клавиатуру (закрывает кнопки)
      }
    });
  },
  processError: async (user, ctx) => {
    // Случилась ошибка, уведомим пользователя, остановим выполение процесса
    const chatId = ctx.chat.id;
    let keyboard = await showRoleBasedButtons(user)
    processController.sendReplyInTelegram(ctx, 'Произошла ошибка при выполнении процесса. Мы уже знаем о ситуации и исправляем её', keyboard)
    deleteUserProcess(chatId)
  }

};


module.exports = processController;