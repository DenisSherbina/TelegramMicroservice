// маршруты REST API для взаимодействия с микросервисом.

const express = require("express");
const router = express.Router();
const { notification } = require("../controllers/messageController");

router.post('/send-notification', notification);

module.exports = router;
