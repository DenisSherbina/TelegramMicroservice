const { Telegraf } = require('telegraf');
const { getTelegramToken } = require('../config/telegram');

const bot = new Telegraf(getTelegramToken());
module.exports = bot;