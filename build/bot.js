"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const dotenv_1 = require("dotenv");
const console_1 = require("console");
(0, dotenv_1.config)();
const token = process.env.TOKEN;
const bot = new node_telegram_bot_api_1.default(process.env.TOKEN, { polling: true });
console.log(console_1.timeStamp);
bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];
    bot.sendMessage(chatId, resp);
});
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Athos é maluco');
});
