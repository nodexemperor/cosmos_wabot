const useMainnet = require('./useMainnet');
// const useTestnet = require('./useTestnet');

let networks = {};

const stopLoop = async (networkInputs, chat) => {
    networkInputs.forEach(networkInput => {
        if (networks[networkInput] && networks[networkInput].intervalId) {
            clearInterval(networks[networkInput].intervalId);
            networks[networkInput].intervalId = null;
            if (networks[networkInput].lastStatusMessage) {
                networks[networkInput].lastStatusMessage.delete(true);
                networks[networkInput].lastStatusMessage = null;
            }
            chat.sendMessage(`Stopped sending ${networkInput} status updates.`);
        } else {
            chat.sendMessage(`ERROR no status ${networkInput} updates to stop 💀⁉️`);
        }
    });
};

module.exports = {
    startLoop: async (client, networkInputs, intervalString, chat) => {
        if (intervalString === '--stop') {
            stopLoop(networkInputs, chat);
            return;
        }

        const intervalNumber = parseInt(intervalString.slice(0, -1));
        const intervalUnit = intervalString.slice(-1);
        if (isNaN(intervalNumber) || (intervalUnit !== 'm' && intervalUnit !== 'h')) {
            chat.sendMessage('Invalid command format. Use ```/status <network> <interval | --stop>```, where ```<interval>``` is a number followed by "m" (for minutes) or "h" (for hours).');
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
        
        let lastStatusMessage;
        setInterval(async () => {
            let statusMessage = '';
            for (const networkInput of networkInputs) {
                if (networks[networkInput].lastStatusMainnet) {
                    statusMessage += networks[networkInput].lastStatusMainnet + '\n\n';
                }
            }
        
            if (lastStatusMessage) {
                await lastStatusMessage.delete(true);
            }
        
            lastStatusMessage = await chat.sendMessage(statusMessage.trim());

            networkInputs.forEach(networkInput => {
                networks[networkInput].lastStatusMessage = lastStatusMessage;
            });
        }, intervalMillis);

        chat.sendMessage(`Started sending ${networkInputs.join(', ')} status updates every ${intervalNumber} ${intervalUnitWord}.`);
    },

    stopLoop
};
