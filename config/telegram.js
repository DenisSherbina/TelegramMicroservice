// настройки Telegram бота (токен и пр.).
// TODO: вынести в env
// const BOT_TOKEN = "*" // промышленный
const BOT_TOKEN = "*" // тестовый

module.exports.getTelegramToken = () => {
    return BOT_TOKEN;
};