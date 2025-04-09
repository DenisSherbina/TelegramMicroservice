const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const { connectDB } = require('./config/db');

const { initTelegramBot } = require('./services/telegramService');
const { telegramAuthGuard } = require('./guards/telegramAuthGuard');
const { handleIncomingMessage, handleIncomingDocument, handleIncomingCallbackQuery } = require('./controllers/messageController');

const app = express();

app.use(bodyParser.json());

app.use('/api', routes);

connectDB();

const PORT = process.env.PORT || 8988;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Инициализируем Telegram бот и передаём обработчики
initTelegramBot({
  authGuard: telegramAuthGuard,
  onText: handleIncomingMessage,
  onDocument: handleIncomingDocument,
  onCallbackQuery: handleIncomingCallbackQuery
});