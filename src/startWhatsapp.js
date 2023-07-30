const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const useHelpCommand = require('./useHelpCommand');

module.exports = function startWhatsapp() {
    const client = new Client({
        puppeteer: {
            args: ['--no-sandbox --disable-setuid-sandbox']
        }
    });

    client.on('qr', async (qr) => {
        console.log('QR Code received, scan please ...');
        qrcode.generate(qr, {small: true});
    });

    client.on('ready', async () => {
        console.log('cosmos_wabot client is ready and connected !!!');
        const groupId = process.env.GROUP_ID;
        const text = useHelpCommand();
        if (groupId) {
            await client.sendMessage(groupId, text);
        } else {
            console.log('No GROUP_ID set in .env');
        }
    });

    client.on('disconnected', (reason) => {
        console.log('cosmos_wabot was disconnected, reason: ', reason);
        client.initialize();
    });

    client.on('connected', () => {
        console.log('cosmos_wabot are connected !!!');
    });
    
    return client;
}
