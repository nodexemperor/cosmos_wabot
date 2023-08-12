//
// Copyright (C) 2023 Salman Wahib (sxlmnwb)
//

require('dotenv').config();
const { useMainnet, useTestnet, usePing, useCommand, startWhatsapp } = require('./src');
const { startMainnetLoop, startTestnetLoop, stopLoop } = require('./src/useLoopReq');

const start = async () => {
    const client = await startWhatsapp();

client.on('message', async msg => {

    console.log('received message: ' + msg.body, '| fromID: ' + msg.from);

    const chat = await msg.getChat();

    const reply = useCommand(msg);
    if (reply) {
        msg.reply(reply);
    }

    if (msg.body.startsWith('/mainnet ')) {
        const commandParts = msg.body.split(' ');
        if (commandParts.length >= 3) {
            const networks = commandParts.slice(1, -1);
            const intervalString = commandParts[commandParts.length - 1];
            if (intervalString === '--stop') {
                stopLoop(networks, chat);
            } else {
                startMainnetLoop(client, networks, intervalString, chat);
            }
        } else if (commandParts.length === 2) {
            const network = commandParts[1];
            if (network !== '--help') {
                try {
                    const info = await useMainnet(network);
                    msg.reply(info);
                } catch (error) {
                    console.error(error);
                    msg.reply(`WARN ${network} on mainnet not response, please check your log 💀⁉️`);
                }
            }
        }
    }

    if (msg.body.startsWith('/testnet ')) {
        const commandParts = msg.body.split(' ');
        if (commandParts.length >= 3) {
            const networks = commandParts.slice(1, -1);
            const intervalString = commandParts[commandParts.length - 1];
            if (intervalString === '--stop') {
                stopLoop(networks, chat);
            } else {
                startTestnetLoop(client, networks, intervalString, chat);
            }
        } else if (commandParts.length === 2) {
            const network = commandParts[1];
            if (network !== '--help') {
                try {
                    const info = await useTestnet(network);
                    msg.reply(info);
                } catch (error) {
                    console.error(error);
                    msg.reply(`WARN ${network} on testnet not response, please check your log 💀⁉️`);
                }
            }
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

}

start();
