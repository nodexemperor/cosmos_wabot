//
// Copyright (C) 2023 Salman Wahib (sxlmnwb)
//

require('dotenv').config();
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const ping = require('ping');
const validator = require('validator');

const client = new Client();

client.on('qr', async (qr) => {
    console.log('QR Code received, scan please.');
    qrcode.generate(qr, {small: true});
});

client.on('ready', async () => {
    console.log('Whatsapp client bot are ready !!!');
    const groupId = process.env.GROUP_ID;
    const text = '```COMMAND EXECUTION```\n```/ping```\n```/help```\n\n```Author: Salman Wahib <hello@sxlmnwb.xyz>```\nhttps://github.com/sxlmnwb/whatsapp_bot_ibc';
    if (groupId) {
        await client.sendMessage(groupId, text);
    } else {
        console.log('No GROUP_ID set in .env');
    }
});

client.on('message', async msg => {

    // const userName = msg.sender ? (msg.sender.pushname || '') : '';
    // const groupName = msg.chat ? (msg.chat.name || '') : '';

    console.log('received message: ' + msg.body, '| fromID: ' + msg.from);

    ///// PING /////
    if (msg.body === '/ping') {
        console.log('/ping command ' + 'fromID: ' + msg.from);
        msg.reply('```/ping <destination>```\n```/ping --help```');
    }
    if (msg.body === '/ping --help') {
        console.log('/ping --help command ' + 'fromID: ' + msg.from);
        msg.reply('Ping works a see letency on domain or hostname and IPv4.\nFor example:\n/ping domain.com\n/ping http://domain.com\n/ping https://domain.com\n/ping 1.1.1.1');
    }

    else if (msg.body.startsWith('/ping')) {
        
        const url = msg.body.replace('/ping ', '').replace('http://', '').replace('https://', '');
        if (validator.isURL(url)) {
        const res = await ping.promise.probe(url);
        
        if (res.alive) {
            console.log('ping: ' + url, 'success ' + '| fromID: ' + msg.from);
            msg.reply(`PING ${url}\nReply from ${res.numeric_host}\nLatency ${res.time}ms`);
        } else {
            console.log('ping: ' + url, 'error ' + '| fromID: ' + msg.from);
            msg.reply(`${url} ERROR 💀⁉️`);
            }
        }
    }

    ///// HELP /////
    if (msg.body === '/help') {
            console.log('/help command ' + 'fromid: ' + msg.from);
            msg.reply('```COMMAND EXECUTION```\n```/ping```\n```/help```\n\n```Author: Salman Wahib <hello@sxlmnwb.xyz>```\nhttps://github.com/sxlmnwb/whatsapp_bot_ibc');
    }

});

client.initialize();
