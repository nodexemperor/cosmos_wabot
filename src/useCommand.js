const useMainnet = require('./useMainnet');
const useTestnet = require('./useTestnet');
const usePing = require('./usePing');
const { startMainnetLoop, startTestnetLoop, stopLoop } = require('./useLoopReq');
const useHelpCommand = require('./useHelpCommand');
const chalk = require('chalk');

module.exports = async function useCommand(msg, client, chat) {
    
    const user = await msg.getContact();
    const userName = user.pushname || user.verifiedName || user.formattedName;
    const time = new Date().toLocaleString().split(', ')[1];
    const idMessage = msg.id._serialized.split('_').pop();
    // const number = msg.from.replace('@c.us', '');

    console.log(chalk.white.bgYellowBright.bold('RECEIVED') +
    " [" + chalk.blueBright(`${msg.body}`) + "] " +
    chalk.green('ID') +
    " [" + chalk.blueBright(`${idMessage}`) + "] " +
    chalk.green('SENDER') +
    " [" + chalk.blueBright(`${userName}`) + "] " +
    chalk.green('TIME') +
    " [" + chalk.blueBright(`${time}`) + "]");

    switch (msg.body) {
        
        case '/mainnet':
            return '```/mainnet <network>```\n```/mainnet <network> <interval>```\n```/mainnet --help```';
        
        case '/mainnet --help':
            return 'This tool was created to simplify validator monitoring with cosmos based node, with .env COSMOS_* variables that you can customize.\n\nFor use ```/testnet <network> <interval | --stop>```, where ```<interval>``` is a number followed by "m" (for minutes) or "h" (for hours).\n\nFor example :\n```/mainnet cosmos```\n```/mainnet cosmos 1m```\n```/mainnet cosmos 12h```\n```/mainnet cosmos --stop```';
        
        case '/testnet':
            return '```/testnet <network>```\n```/testnet <network> <interval>```\n```/testnet --help```';
            
        case '/testnet --help':
            return 'This tool was created to very simplify validator monitoring with cosmos based node, with .env COSMOST_* variables that you can customize.\n\nFor use ```/testnet <network> <interval | --stop>```, where ```<interval>``` is a number followed by "m" (for minutes) or "h" (for hours).\n\nFor example :\n```/testnet cosmost```\n```/testnet cosmost 1m```\n```/testnet cosmost 12h```\n```/testnet cosmost --stop```';
        
        case '/ping':
            return '```/ping <destination>```\n```/ping --help```';
        
        case '/ping --help':
            return 'Ping works a see letency on domain or hostname and IPv4.\n\nFor example:\n```/ping domain.com```\n```/ping http://domain.com```\n```/ping https://domain.com```\n```/ping 1.1.1.1```';

        case '/help':
            return useHelpCommand();
    
            default:
                if (msg.body.startsWith('/mainnet ')) {
                    const commandParts = msg.body.split(' ');
                    if (commandParts.length >= 3) {
                        const networks = commandParts.slice(1, -1);
                        const intervalString = commandParts[commandParts.length - 1];
                        const errors = [];
    
                        if (intervalString === '--stop') {
                                if (errors.length > 0) {
                                     msg.reply(errors.join('\n'));
                                } else { 
                                    const stopMessages = await stopLoop(networks, chat);
                                    for (const stopMessage of stopMessages) {
                                        const sentMsg = await msg.reply(stopMessage);
                                        const idMessageBot = sentMsg.id._serialized.split('_').pop();
                                        console.log(chalk.white.bgRedBright.bold('STOPING') +
                                            " [" + chalk.redBright(`${stopMessage}`) + "] " +
                                            chalk.green('ID') +
                                            " [" + chalk.blueBright(`${idMessageBot}`) + "] " +
                                            chalk.green('RECIPIENT') +
                                            " [" + chalk.blueBright(`${userName}`) + "] " +
                                            chalk.green('TIME') +
                                            " [" + chalk.blueBright(`${time}`) + "]");
                                        }
                                    }
                        } else {
                            for (const network of networks) {
                                try {
                                    await useMainnet(network);
                                    console.log(chalk.white.bgGreenBright.bold('SUCCESS') + " [" + chalk.greenBright(`${network}`) + "] PREPERING FOR LOOPING");
                                } catch (error) {
                                const sentMsg = await msg.reply(error);
                                const idMessageBot = sentMsg.id._serialized.split('_').pop();
                                    console.log(chalk.white.bgRedBright.bold('ERROR') +
                                        " [" + chalk.redBright(`${error.message}`) + "] " +
                                        chalk.green('ID') +
                                        " [" + chalk.blueBright(`${idMessageBot}`) + "] " +
                                        chalk.green('RECIPIENT') +
                                        " [" + chalk.blueBright(`${userName}`) + "] " +
                                        chalk.green('TIME') +
                                        " [" + chalk.blueBright(`${time}`) + "]");
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
                                console.log(chalk.white.bgGreenBright.bold('SUCCESS') + " [" + chalk.greenBright(`${network}`) + "] STATUS");
                            } catch (error) {
                                const sentMsg = await msg.reply(error.message);
                                const idMessageBot = sentMsg.id._serialized.split('_').pop();
                                    console.log(chalk.white.bgRedBright.bold('ERROR') +
                                        " [" + chalk.redBright(`${error.message}`) + "] " +
                                        chalk.green('ID') +
                                        " [" + chalk.blueBright(`${idMessageBot}`) + "] " +
                                        chalk.green('RECIPIENT') +
                                        " [" + chalk.blueBright(`${userName}`) + "] " +
                                        chalk.green('TIME') +
                                        " [" + chalk.blueBright(`${time}`) + "]");
                            }
                        }
                    }
                } else if (
                    msg.body.startsWith('/testnet ')) {
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
                } else if (msg.body.startsWith('/ping ')) {
                    const url = msg.body.replace('/ping ', '');
                    if (url !== '--help') {
                        try {
                            const response = await usePing(url);
                            msg.reply(response);
                        } catch (error) {
                            console.error(error);
                            msg.reply(error.message);
                        }
                    }
                }
            break;
        }
    }
