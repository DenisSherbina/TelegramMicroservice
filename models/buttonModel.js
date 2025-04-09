// Формируем кнопки к ответам
const { getDB } = require('../config/db');

async function showRoleBasedPersistentButtons(user, actionArray) {
    try {
        const buttons = require('../config/roles.json');

        // Собираем массив кнопок доступных ролям
        let allowedButtons = [];

        let role = user.roles[0]

        let currentAttachment = Object.assign(buttons[role].buttons)

        for (let actionTitle of actionArray) {
            let basisObj = currentAttachment.find(el => el.title === actionTitle)
            
            currentAttachment = basisObj.assets?.buttons || []
            
            if (!currentAttachment || currentAttachment.length === 0) {
                console.warn('Вложеность не найдена на уровне ', actionTitle, ' в ', actionArray)
                return null
            }
        }

        currentAttachment.map(el => {
            allowedButtons = allowedButtons.concat(el.title);
        })

        // Удаляем дубликаты
        allowedButtons = [...new Set(allowedButtons)];

        if (actionArray.length > 0) {
            // Добавляем кнопку отмены процесса
            allowedButtons.push('Отмена')
        }

        // Формируем массив массивов для обычной клавиатуры.
        // Если нужно по одной кнопке в строке, можно оставить как есть, 
        // либо сгруппировать кнопки по несколько штук в строке.
        const keyboard = allowedButtons.map(b => [{ text: b }]);

        return keyboard
    } catch (err) {
        console.error('Ошибка в buttonModel -> showRoleBasedPersistentButtons : ', err)
        return null
    }
}

// Возвращаем все доступные кнопки
async function showRoleBasedButtons(user) {
    const buttons = require('../config/roles.json');

    roles = user.roles

    // Собираем массив кнопок доступных ролям
    let currentAttachment = []
    let allowedButtons = [];
    roles.forEach(role => {
        if (buttons[role]) {
            currentAttachment = currentAttachment.concat(buttons[role].buttons);
        }
    });

    currentAttachment.map(el => {
        allowedButtons = allowedButtons.concat(el.title);
    })

    // Удаляем дубликаты
    allowedButtons = [...new Set(allowedButtons)];

    const inlineKeyboard = allowedButtons.map(b => [{ text: b, callback_data: b }]);

    return inlineKeyboard
}

// Возвращаем только кнопку отмены
async function returnCancelButton() {
    return [[{ text: 'Отмена', callback_data: 'Отмена' }]]
}


module.exports = { showRoleBasedPersistentButtons, showRoleBasedButtons, returnCancelButton };