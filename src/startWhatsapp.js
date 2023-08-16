const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const useHelpCommand = require('./useHelpCommand');
const chalk = require('chalk');

module.exports = async function startWhatsapp() {
    const isRoot = (await import('is-root')).default;

    let puppeteerArgs;
    if (isRoot()) {
        puppeteerArgs = ['--no-sandbox'];
    } else {
        puppeteerArgs = ['--disable-setuid-sandbox'];
    }

    const client = new Client({
        puppeteer: {
            args: puppeteerArgs
        }
    });

    client.on('qr', async (qr) => {
        console.log(chalk.white.bgYellowBright.bold('QR CODE') + ' received, scan please ...');
        qrcode.generate(qr, {small: true});
    });

    client.on('ready', async () => {
        console.log(chalk.blueBright('[cosmos_wabot]') + ' client is ready and ' + chalk.white.bgGreenBright.bold('CONNECTED'));
        const groupId = process.env.GROUP_ID;
        const text = useHelpCommand();
        if (groupId) {
            await client.sendMessage(groupId, text);
        } else {
            console.log(chalk.white.bgRedBright.bold('NO GROUP_ID') + ' set in .env');
        }
        console.log();
    });

    client.on('disconnected', (reason) => {
        console.log();
        console.log(chalk.yellowBright('[cosmos_wabot]') + ' was ' + chalk.white.bgRedBright.bold('DISCONNECTED') + chalk.white(', reason: ') + chalk.white.bgRedBright.bold(`${reason}`));
        client.initialize();
    });

    client.on('connected', () => {
        console.log(chalk.blueBright('[cosmos_wabot]') + ' are ' + chalk.white.bgGreenBright.bold('CONNECTED'));
    });
    
    return client;
}
