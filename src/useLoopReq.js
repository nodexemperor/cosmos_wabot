const useMainnet = require('./useMainnet');
const useTestnet = require('./useTestnet');
const chalk = require('chalk');

let networks = {};

const stopLoop = async (networkInputs, chat) => {
    let messages = [];
    for (const networkInput of networkInputs) {
        if (networks[networkInput]) {
            if (networks[networkInput].intervalId) {
                clearInterval(networks[networkInput].intervalId);
                networks[networkInput].intervalId = null;
            }
            // if (networks[networkInput].messageIntervalId) {
            //     clearInterval(networks[networkInput].messageIntervalId);
            //     networks[networkInput].messageIntervalId = null;
            // }
            if (networks[networkInput].lastStatusMessage) {
                await networks[networkInput].lastStatusMessage.delete(true);
                networks[networkInput].lastStatusMessage = null;
            }
            messages.push(`Stopped sending ${networkInput} status updates.`);
            delete networks[networkInput];
        } else {
            messages.push(`No status ${networkInput} updates to stop 💀⁉️`);
        }
    }
    return messages;
};

module.exports = {
    startMainnetLoop: async (client, networkInputs, intervalString, chat) => {
        const stopIndex = networkInputs.indexOf('--stop');
        if (stopIndex !== -1) {
        const networkToStop = networkInputs[stopIndex];
            networkInputs.splice(stopIndex, 1);
                await stopLoop([networkToStop], chat);
            delete networks[networkToStop];
            if (networkInputs.length === 0) return;
    }

        const intervalNumber = parseInt(intervalString.slice(0, -1));
        const intervalUnit = intervalString.slice(-1);
        if (isNaN(intervalNumber) || (intervalUnit !== 'm' && intervalUnit !== 'h')) {
            chat.sendMessage('Invalid command format. Use ```/mainnet <network> <interval | --stop>```, where ```<interval>``` is a number followed by "m" (for minutes) or "h" (for hours).');
            console.log(chalk.white.bgRedBright.bold('ERROR') + " [" + chalk.redBright(`${networkInputs.join(', ')}`) + "] INVALID INPUT OR WRONG INTERVAL");
            return;
        }
        const intervalMillis = intervalUnit === 'm' ? intervalNumber * 60 * 1000 : intervalNumber * 60 * 60 * 1000;

        let intervalUnitWord;
        if (intervalUnit === 'm') {
            intervalUnitWord = intervalNumber > 1 ? 'minutes' : 'minute';
        } else if (intervalUnit === 'h') {
            intervalUnitWord = intervalNumber > 1 ? 'hours' : 'hour';
        }

        networkInputs.forEach(networkInput => {
            if (networks[networkInput] && networks[networkInput].intervalId) {
                clearInterval(networks[networkInput].intervalId);
            }
        
            const updateStatus = async () => {
            try {
                const statusMainnet = await useMainnet(networkInput);
                if (networks[networkInput]) { 
                networks[networkInput].lastStatusMainnet = statusMainnet;
                }
                    } catch (error) {
                    // use only debug
                    // console.error(chalk.white.bgRed.bold('ERROR') + " [" + chalk.redBright(`${error.message}`) + "]");
                }
            };

            updateStatus();

            networks[networkInput] = {
                intervalId: setInterval(updateStatus, intervalMillis)
            };
        });

        const messageIntervalId = setInterval(async () => {
            let statusMessage = '';
            let count = 0;
            for (const networkInput of networkInputs) {
                if (networks[networkInput] && networks[networkInput].lastStatusMainnet) {
            
                if(count > 0) {
                    statusMessage += `\n------------------------------------------------------------------\n`;
                }
                    statusMessage += networks[networkInput].lastStatusMainnet;
                    count++;
                }
            }

            networkInputs.forEach(async networkInput => {
                if (networks[networkInput] && networks[networkInput].lastStatusMessage) {
                    try {
                        await networks[networkInput].lastStatusMessage.delete(true);
                    } catch (log) {
                        console.log(chalk.white.bgYellowBright.bold('WARN') + " [" + chalk.blueBright(`${networkInput}`) + "] MAINNET CONTINUE FOR LOOPING");
                    }
                    networks[networkInput].lastStatusMessage = null;
                }
            });
        
            if (statusMessage.trim() !== '') {
                const newStatusMessage = await chat.sendMessage(statusMessage.trim());
        
                networkInputs.forEach(networkInput => {
                    if (networks[networkInput]) {
                        networks[networkInput].lastStatusMessage = newStatusMessage;
                    }
                });
            }
        }, intervalMillis);

        networkInputs.forEach(networkInput => {
            if (networks[networkInput]) {
                networks[networkInput].messageIntervalId = messageIntervalId;
            }
        });

        chat.sendMessage(`Started sending mainnet ${networkInputs.join(', ')} status updates every ${intervalNumber} ${intervalUnitWord}.`);
        console.log(chalk.white.bgGreenBright.bold('SUCCESS') +
        " [" + chalk.blueBright(`${networkInputs.join(', ')}`) + "] STARTED SENDING LOOPING EVERY" +
        " [" + chalk.blueBright(`${intervalNumber}`) + "] [" + chalk.blueBright(`${intervalUnitWord.toUpperCase()}`) + "]");

    },

    startTestnetLoop: async (client, networkInputs, intervalString, chat) => {
        const stopIndex = networkInputs.indexOf('--stop');
        if (stopIndex !== -1) {
        const networkToStop = networkInputs[stopIndex];
            networkInputs.splice(stopIndex, 1);
                await stopLoop([networkToStop], chat);
            delete networks[networkToStop];
            if (networkInputs.length === 0) return;
        }

        const intervalNumber = parseInt(intervalString.slice(0, -1));
        const intervalUnit = intervalString.slice(-1);
        if (isNaN(intervalNumber) || (intervalUnit !== 'm' && intervalUnit !== 'h')) {
            chat.sendMessage('Invalid command format. Use ```/testnet <network> <interval | --stop>```, where ```<interval>``` is a number followed by "m" (for minutes) or "h" (for hours).');
            console.log(chalk.white.bgRedBright.bold('ERROR') + " [" + chalk.redBright(`${networkInputs.join(', ')}`) + "] INVALID INPUT OR WRONG INTERVAL");
            return;
        }
        const intervalMillis = intervalUnit === 'm' ? intervalNumber * 60 * 1000 : intervalNumber * 60 * 60 * 1000;

        let intervalUnitWord;
        if (intervalUnit === 'm') {
            intervalUnitWord = intervalNumber > 1 ? 'minutes' : 'minute';
        } else if (intervalUnit === 'h') {
            intervalUnitWord = intervalNumber > 1 ? 'hours' : 'hour';
        }

        networkInputs.forEach(networkInput => {
            if (networks[networkInput] && networks[networkInput].intervalId) {
                clearInterval(networks[networkInput].intervalId);
            }

            const updateStatus = async () => {
            try {
                const statusTestnet = await useTestnet(networkInput);
                if (networks[networkInput]) { 
                networks[networkInput].lastStatusTestnet = statusTestnet;
                }
                    } catch (error) {
                    // use only debug
                    // console.error(chalk.white.bgRed.bold('ERROR') + " [" + chalk.redBright(`${error.message}`) + "]");
                }
            };

            updateStatus();

            networks[networkInput] = {
                intervalId: setInterval(updateStatus, intervalMillis)
            };
        });

        const messageIntervalId = setInterval(async () => {
            let statusMessage = '';
            let count = 0;
            for (const networkInput of networkInputs) {
                if (networks[networkInput] && networks[networkInput].lastStatusTestnet) {
            
                if(count > 0) {
                    statusMessage += `\n------------------------------------------------------------------\n`;
                }
                    statusMessage += networks[networkInput].lastStatusTestnet;
                    count++;
                }
            }

            networkInputs.forEach(async networkInput => {
                if (networks[networkInput] && networks[networkInput].lastStatusMessage) {
                    try {
                        await networks[networkInput].lastStatusMessage.delete(true);
                    } catch (log) {
                        console.log(chalk.white.bgYellowBright.bold('WARN') + " [" + chalk.blueBright(`${networkInput}`) + "] TESTNET CONTINUE FOR LOOPING");
                    }
                    networks[networkInput].lastStatusMessage = null;
                }
            });
        
            if (statusMessage.trim() !== '') {
                const newStatusMessage = await chat.sendMessage(statusMessage.trim());
        
                networkInputs.forEach(networkInput => {
                    if (networks[networkInput]) {
                        networks[networkInput].lastStatusMessage = newStatusMessage;
                    }
                });
            }
        }, intervalMillis);

        networkInputs.forEach(networkInput => {
            if (networks[networkInput]) {
                networks[networkInput].messageIntervalId = messageIntervalId;
            }
        });

        chat.sendMessage(`Started sending testnet ${networkInputs.join(', ')} status updates every ${intervalNumber} ${intervalUnitWord}.`);
        console.log(chalk.white.bgGreenBright.bold('SUCCESS') +
        " [" + chalk.blueBright(`${networkInputs.join(', ')}`) + "] STARTED SENDING LOOPING EVERY" +
        " [" + chalk.blueBright(`${intervalNumber}`) + "] [" + chalk.blueBright(`${intervalUnitWord.toUpperCase()}`) + "]");
    },

    stopLoop
};
