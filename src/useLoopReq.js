const useMainnet = require('./useMainnet');
const useTestnet = require('./useTestnet');

let networks = {};

const stopLoop = async (networkInputs, chat) => {
    networkInputs.forEach(async networkInput => {
        if (networks[networkInput]) {
            if (networks[networkInput].intervalId) {
                clearInterval(networks[networkInput].intervalId);
                networks[networkInput].intervalId = null;
            }
            if (networks[networkInput].lastStatusMessage) {
                await networks[networkInput].lastStatusMessage.delete(true);
                networks[networkInput].lastStatusMessage = null;
            }
            chat.sendMessage(`Stopped sending ${networkInput} status updates.`);
            delete networks[networkInput];
        } else {
            chat.sendMessage(`ERROR no status ${networkInput} updates to stop 💀⁉️`);
        }
    });
};

module.exports = {
    startMainnetLoop: async (client, networkInputs, intervalString, chat) => {
        const stopIndex = networkInputs.indexOf('--stop');
        if (stopIndex !== -1) {
            networkInputs.splice(stopIndex, 1);
            stopLoop(networkInputs, chat);
        return;
    }

        const intervalNumber = parseInt(intervalString.slice(0, -1));
        const intervalUnit = intervalString.slice(-1);
        if (isNaN(intervalNumber) || (intervalUnit !== 'm' && intervalUnit !== 'h')) {
            chat.sendMessage('Invalid command format. Use ```/mainnet <network> <interval | --stop>```, where ```<interval>``` is a number followed by "m" (for minutes) or "h" (for hours).');
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
                const statusMainnet = await useMainnet(networkInput);
                networks[networkInput].lastStatusMainnet = statusMainnet;
            };

            updateStatus();

            networks[networkInput] = {
                intervalId: setInterval(updateStatus, intervalMillis)
            };
        });

        const messageIntervalId = setInterval(async () => {
            let statusMessage = '';
            for (const networkInput of networkInputs) {
                if (networks[networkInput] && networks[networkInput].lastStatusMainnet) {
                    statusMessage += networks[networkInput].lastStatusMainnet + `\n------------------------------------------------------------------\n`;
                }
            }

            networkInputs.forEach(async networkInput => {
                if (networks[networkInput] && networks[networkInput].lastStatusMessage) {
                    try {
                        await networks[networkInput].lastStatusMessage.delete(true);
                    } catch (error) {
                        console.error(`WARN [${networkInput}] not delete`);
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
    },

    startTestnetLoop: async (client, networkInputs, intervalString, chat) => {
        const stopIndex = networkInputs.indexOf('--stop');
        if (stopIndex !== -1) {
            networkInputs.splice(stopIndex, 1);
            stopLoop(networkInputs, chat);
            return;
        }

        const intervalNumber = parseInt(intervalString.slice(0, -1));
        const intervalUnit = intervalString.slice(-1);
        if (isNaN(intervalNumber) || (intervalUnit !== 'm' && intervalUnit !== 'h')) {
            chat.sendMessage('Invalid command format. Use ```/testnet <network> <interval | --stop>```, where ```<interval>``` is a number followed by "m" (for minutes) or "h" (for hours).');
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
                const statusTestnet = await useTestnet(networkInput);
                networks[networkInput].lastStatusTestnet = statusTestnet;
            };

            updateStatus();

            networks[networkInput] = {
                intervalId: setInterval(updateStatus, intervalMillis)
            };
        });

        const messageIntervalId = setInterval(async () => {
            let statusMessage = '';
            for (const networkInput of networkInputs) {
                if (networks[networkInput] && networks[networkInput].lastStatusTestnet) {
                    statusMessage += networks[networkInput].lastStatusTestnet + `\n------------------------------------------------------------------\n`;
                }
            }

            networkInputs.forEach(async networkInput => {
                if (networks[networkInput] && networks[networkInput].lastStatusMessage) {
                    try {
                        await networks[networkInput].lastStatusMessage.delete(true);
                    } catch (error) {
                        console.error(`WARN [${networkInput}] not delete`);
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
    },

    stopLoop
};
