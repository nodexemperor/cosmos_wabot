//
// Copyright (C) 2023 Salman Wahib (sxlmnwb)
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
            console.log(reply)
        }
    });

client.initialize();

}

start();
