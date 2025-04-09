// Проверка токена и статуса авторизации для HTTP запросов.

async function authGuard(req, res, next) {
    // Проверка заголовков или токенов
    // Если не авторизован - вернуть 401
    next();
}
  
module.exports = { authGuard };
  