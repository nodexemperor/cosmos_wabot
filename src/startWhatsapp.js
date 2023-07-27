const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const useHelpCommand = require('./useHelpCommand');

module.exports = function startWhatsapp() {
    const client = new Client({
        puppeteer: {
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
    });

    client.on('qr', async (qr) => {
        console.log('QR Code received, scan please.');
        qrcode.generate(qr, {small: true});
    });

    client.on('ready', async () => {
        console.log('Whatsapp client bot are ready !!!');
        const groupId = process.env.GROUP_ID;
        const text = useHelpCommand();
        if (groupId) {
            await client.sendMessage(groupId, text);
        } else {
            console.log('No GROUP_ID set in .env');
        }
    });
    
    return client;
}
