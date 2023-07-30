const useStatus = require('./useStatus');

let intervalId;
let network;

module.exports = {
    startLoop: async (client, networkInput, intervalString, chat) => {
        if (intervalString === 'stop') {
            stopLoop(chat);
            return;
        }

        network = networkInput;

        const intervalNumber = parseInt(intervalString.slice(0, -1));
        const intervalUnit = intervalString.slice(-1);
        if (isNaN(intervalNumber) || (intervalUnit !== 'm' && intervalUnit !== 'h')) {
            chat.sendMessage('Invalid command format. Use ```/status <network> <interval | stop>```, where ```<interval>``` is a number followed by "m" (for minutes) or "h" (for hours).');
            return;
        }
        const intervalMillis = intervalUnit === 'm' ? intervalNumber * 60 * 1000 : intervalNumber * 60 * 60 * 1000;
        if (intervalId) {
            clearInterval(intervalId);
        }

        let intervalUnitWord;
        if (intervalUnit === 'm') {
            intervalUnitWord = intervalNumber > 1 ? 'minutes' : 'minute';
        } else if (intervalUnit === 'h') {
            intervalUnitWord = intervalNumber > 1 ? 'hours' : 'hour';
        }

        intervalId = setInterval(async () => {
            const status = await useStatus(network);
            chat.sendMessage(status);
        }, intervalMillis);
        chat.sendMessage(`Started sending ${network} status updates every ${intervalNumber} ${intervalUnitWord}.`);
    },

    stopLoop: (chat) => {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
            chat.sendMessage(`Stopped sending ${network} status updates.`);
        } else {
            chat.sendMessage(`ERROR no status ${network} updates to stop 💀⁉️`);
        }
    }
}
