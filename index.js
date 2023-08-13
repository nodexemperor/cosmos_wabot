//
// Copyright (C) 2023 Salman Wahib (sxlmnwb)
//

require('dotenv').config();
const chalk = require('chalk');
const { useCommand, startWhatsapp } = require('./src');

const start = async () => {
    const client = await startWhatsapp();

client.on('message', async msg => {

    const user = await msg.getContact();
    const userName = user.pushname || user.verifiedName || user.formattedName;
    const time = new Date().toLocaleString().split(', ')[1];
    const idMessage = msg.id._serialized.split('_').pop();
    const number = msg.from.replace('@c.us', '');

    console.log(chalk.white.bgGreenBright.bold('RECEIVED') +
    " [" + chalk.blueBright(`${msg.body}`) + "] " +
    chalk.green('ID') +
    " [" + chalk.blueBright(`${idMessage}`) + "] " +
    chalk.green('SENDER') +
    " [" + chalk.blueBright(`${userName}`) + "] " +
    chalk.green('NUMBER') +
    " [" + chalk.blueBright(`+${number}`) + "] " +
    chalk.green('TIME') +
    " [" + chalk.blueBright(`${time}`) + "]");

    const chat = await msg.getChat();

    const reply = await useCommand(msg, client, chat);
    if (reply) {
        msg.reply(reply);
    }

    });

client.initialize();

}

start();
