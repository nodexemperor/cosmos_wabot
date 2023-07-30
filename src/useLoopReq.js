const useStatus = require('./useStatus');

let networks = {};

const stopLoop = async (networkInput, chat) => {
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
};

module.exports = {
    startLoop: async (client, networkInput, intervalString, chat) => {
        if (intervalString === 'stop') {
            stopLoop(networkInput, chat);
            return;
        }

        const intervalNumber = parseInt(intervalString.slice(0, -1));
        const intervalUnit = intervalString.slice(-1);
        if (isNaN(intervalNumber) || (intervalUnit !== 'm' && intervalUnit !== 'h')) {
            chat.sendMessage('Invalid command format. Use ```/status <network> <interval | stop>```, where ```<interval>``` is a number followed by "m" (for minutes) or "h" (for hours).');
            return;
        }
        const intervalMillis = intervalUnit === 'm' ? intervalNumber * 60 * 1000 : intervalNumber * 60 * 60 * 1000;

        if (networks[networkInput] && networks[networkInput].intervalId) {
            clearInterval(networks[networkInput].intervalId);
        }

        let intervalUnitWord;
        if (intervalUnit === 'm') {
            intervalUnitWord = intervalNumber > 1 ? 'minutes' : 'minute';
        } else if (intervalUnit === 'h') {
            intervalUnitWord = intervalNumber > 1 ? 'hours' : 'hour';
        }

        networks[networkInput] = {
            intervalId: setInterval(async () => {
                if (networks[networkInput].lastStatusMessage) {
                    networks[networkInput].lastStatusMessage.delete(true);
                }
                const status = await useStatus(networkInput);
                networks[networkInput].lastStatusMessage = await chat.sendMessage(status);
            }, intervalMillis)
        };
        chat.sendMessage(`Started sending ${networkInput} status updates every ${intervalNumber} ${intervalUnitWord}.`);
    },

    stopLoop

};
