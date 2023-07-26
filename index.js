//
// Copyright (C) 2023 Salman Wahib (sxlmnwb)
//

require('dotenv').config();
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const ping = require('ping');
const validator = require('validator');
const axios = require('axios');
const { format } = require('date-fns');

const client = new Client();

client.on('qr', async (qr) => {
    console.log('QR Code received, scan please.');
    qrcode.generate(qr, {small: true});
});

client.on('ready', async () => {
    console.log('Whatsapp client bot are ready !!!');
    const groupId = process.env.GROUP_ID;
    const text = '```COMMAND EXECUTION```\n```/ping```\n```/ibc```\n```/help```\n\n```Author: Salman Wahib <hello@sxlmnwb.xyz>```\nhttps://github.com/sxlmnwb/whatsapp_bot_ibc';
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

    if (msg.body === '/ibc') {
        console.log('/ibc command ' + 'fromID: ' + msg.from);
        msg.reply('```/ibc <network>```\n```/ibc --help```');
    }

    if (msg.body === '/ibc --help') {
        console.log('/ibc --help command ' + 'fromID: ' + msg.from);
        msg.reply('IBC or Inter-Blockchain Communication a cross-chain access by Cosmos Hub to facilitate access to Cosmos Ecosystem.\n\nThis tool was created to simplify validator monitoring with cosmos based node, with .env COSMOS_* variables that you can customize.\n\nFor example :\n/ibc cosmos');
    }

    else if (msg.body.startsWith('/ibc')) {
        const network = msg.body.replace('/ibc ', '');
        const rpcUrl = process.env[network.toUpperCase() + '_RPC'];
        const apiUrl = process.env[network.toUpperCase() + '_API'];
        const valoper = process.env[network.toUpperCase() + '_VALOPER'];
        const exponent = process.env[network.toUpperCase() + '_EXPONENT'];
        const symbol = process.env[network.toUpperCase() + '_SYMBOL'];
        
        try {
             const responseRpc = await axios.get(`${rpcUrl}/status?`);
             const syncInfo = responseRpc.data.result.sync_info;
             const latestBlockTime = format(new Date(syncInfo.latest_block_time), 'yyyy-MM-dd HH:mm:ss');
             const statusNode =   `*STATUS NODE*\n` +
                                  `Latest Block Height: ${syncInfo.latest_block_height}\n` +
                                  `Latest Block Time: ${latestBlockTime}\n` +
                                  `Catching Up: ${syncInfo.catching_up}\n\n`;
            
            const responseApi = await axios.get(`${apiUrl}/cosmos/staking/v1beta1/validators/${valoper}`);
            const validator = responseApi.data.validator;
            const statusval = validator.status.replace('BOND_STATUS_', '');
            const tokensBigInt = BigInt(validator.tokens);
            const tokensInSymbol = Number(tokensBigInt / BigInt(10 ** exponent));
            const formattedTokens = tokensInSymbol.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
            const validatorInfo =   `*VALIDATOR INFO*\n` +
                                    `Moniker: ${validator.description.moniker}\n` +
                                    `Status: ${statusval}\n` +
                                    `Jailed: ${validator.jailed}\n` +
                                    `Total Bonded: ${formattedTokens} ${symbol}`;
            
        msg.reply(statusNode + validatorInfo);
        } catch (error) {
            console.error(error);
            msg.reply('ERROR getting data from endpoint 💀⁉️');
        }
    }
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
            msg.reply('```COMMAND EXECUTION```\n```/ping```\n```/ibc```\n```/help```\n\n```Author: Salman Wahib <hello@sxlmnwb.xyz>```\nhttps://github.com/sxlmnwb/whatsapp_bot_ibc');
    }

});

client.initialize();
