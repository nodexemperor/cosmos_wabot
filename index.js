//
// Copyright (C) 2023 sxlzptprjkt And NodeX Emperor, LLC
//

require('dotenv').config();
const { useCommand, startWhatsapp } = require('./src');

const start = async () => {
    const client = await startWhatsapp();

    client.on('message', async msg => {
        const chat = await msg.getChat();
        const reply = await useCommand(msg, client, chat);
        if (reply) {
            msg.reply(reply);
        }
    });

client.initialize();

}

start();
