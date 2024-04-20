import TelegramBot from 'node-telegram-bot-api';
import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';

config();
const prisma = new PrismaClient();
const bot = new TelegramBot(process.env.TOKEN, { polling: true });

const userState = {};

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const hours = new Date(msg.date * 1000).getHours();

    //estado do usuário, se ele enviou o nome ou não, vai fazer que ele não fique pergunta toda hora o nome.
    if (!userState[chatId]) {
        userState[chatId] = 'pergunta_nome';
        bot.sendMessage(chatId, 'Qual é o seu nome?');

      //se o estado for igual
    } else if (userState[chatId] === 'pergunta_nome') {
        userState[chatId] = 'nome_recebido';
        userState[`${chatId}_name`] = msg.text;
      //o horário comercial definido 
        if (hours >= 9 && hours <= 18) {
            bot.sendMessage(chatId, `Prazer em conhecê-lo, ${userState[`${chatId}_name`]}. Estamos dentro do horário de expediente.`);
        } else {
            userState[chatId] = 'pergunta_email';
            bot.sendMessage(chatId, `Prazer em conhecê-lo, ${userState[`${chatId}_name`]}. Fora do expediente. Por favor, insira seu e-mail para contato.`);
        }
    } else if (userState[chatId] === 'pergunta_email') {
        userState[chatId] = 'email_recebido';
        const email = msg.text;

        //caso o email não tenha "@" ele entende como inválido.
        if (email.includes('@')) {
            try {
                await prisma.pessoa.create({ data: { name: userState[`${chatId}_name`], email } });
                bot.sendMessage(chatId, 'Email armazenado com sucesso!');
            } catch (error) {
                bot.sendMessage(chatId, 'Erro ao armazenar o email. Por favor, tente novamente.');
            }
        } else {
            bot.sendMessage(chatId, 'Email inválido. Tente novamente.');
        }
    }
});
