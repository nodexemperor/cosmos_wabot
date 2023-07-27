//
// Copyright (C) 2023 Salman Wahib (sxlmnwb)
//

require('dotenv').config();
const { useStatus, usePing, useCommand, startWhatsapp } = require('./src');

    const client = startWhatsapp();

    client.on('message', async msg => {

    console.log('received message: ' + msg.body, '| fromID: ' + msg.from);

    const reply = useCommand(msg);
    if (reply) {
    msg.reply(reply);
    }

    if (msg.body.startsWith('/status ')) {
        const network = msg.body.replace('/status ', '');
        if (network !== '--help') {
        useStatus(network)
            .then(info => {
                msg.reply(info);
            })
            .catch(error => {
                console.error(error);
                msg.reply(error.message);
            });
        }
    }

    if (msg.body.startsWith('/ping ')) {
        const url = msg.body.replace('/ping ', '');
        if (url !== '--help') {
        usePing(url)
            .then(response => {
                msg.reply(response);
            })
            .catch(error => {
                console.error(error);
                msg.reply(error.message);
            });
        }
    }

});

client.initialize();
