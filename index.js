//
// Copyright (C) 2023 Salman Wahib (sxlmnwb)
//

require('dotenv').config();
const chalk = require('chalk');
const { useMainnet, useTestnet, usePing, useCommand, startWhatsapp } = require('./src');
const { startMainnetLoop, startTestnetLoop, stopLoop } = require('./src/useLoopReq');

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

    const reply = useCommand(msg);
    if (reply) {
        msg.reply(reply);
    }

    if (msg.body.startsWith('/mainnet ')) {
        const commandParts = msg.body.split(' ');
        if (commandParts.length >= 3) {
            const networks = commandParts.slice(1, -1);
            const intervalString = commandParts[commandParts.length - 1];
            const errors = [];
    
            if (intervalString === '--stop') {
                stopLoop(networks, chat);
            } else {
                for (const network of networks) {
                    try {
                        await useMainnet(network);
                    } catch (error) {
                        console.error(error);
                        errors.push(error.message);
                    }
                }
                if (errors.length > 0) {
                    msg.reply(errors.join('\n'));
                } else {
                    startMainnetLoop(client, networks, intervalString, chat);
                }
            }

        } else if (commandParts.length === 2) {
            const network = commandParts[1];
            if (network !== '--help') {
                try {
                    msg.reply(await useMainnet(network));
                } catch (error) {
                    console.error(error);
                    msg.reply(error.message);
                }
            }
        }
    }

    if (msg.body.startsWith('/testnet ')) {
        const commandParts = msg.body.split(' ');
        if (commandParts.length >= 3) {
            const networks = commandParts.slice(1, -1);
            const intervalString = commandParts[commandParts.length - 1];
            const errors = [];
    
            if (intervalString === '--stop') {
                stopLoop(networks, chat);
            } else {
                for (const network of networks) {
                    try {
                        await useTestnet(network);
                    } catch (error) {
                        console.error(error);
                        errors.push(error.message);
                    }
                }
                if (errors.length > 0) {
                    msg.reply(errors.join('\n'));
                } else {
                    startTestnetLoop(client, networks, intervalString, chat);
                }
            }

        } else if (commandParts.length === 2) {
            const network = commandParts[1];
            if (network !== '--help') {
                try {
                    msg.reply(await useTestnet(network));
                } catch (error) {
                    console.error(error);
                    msg.reply(error.message);
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
