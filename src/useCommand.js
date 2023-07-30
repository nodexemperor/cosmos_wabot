const useHelpCommand = require('./useHelpCommand');

module.exports = function useCommand(msg) {
    switch (msg.body) {
        
        case '/status':
            console.log('/status command ' + 'fromID: ' + msg.from);
            return '```/status <network>```\n```/status <network> <interval>```\n```/status --help```';
        
        case '/status --help':
            console.log('/status --help command ' + 'fromID: ' + msg.from);
            return 'This tool was created to simplify validator monitoring with cosmos based node, with .env COSMOS_* variables that you can customize.\n\nFor use ```/status <network> <interval | stop>```, where ```<interval>``` is a number followed by "m" (for minutes) or "h" (for hours).\n\nFor example :\n```/status cosmos```\n```/status cosmos 1m```\n```/status cosmos 12h```\n```/status cosmos stop```';
        
        case '/ping':
            console.log('/ping command ' + 'fromID: ' + msg.from);
            return '```/ping <destination>```\n```/ping --help```';
        
        case '/ping --help':
            console.log('/ping --help command ' + 'fromID: ' + msg.from);
            return 'Ping works a see letency on domain or hostname and IPv4.\n\nFor example:\n```/ping domain.com```\n```/ping http://domain.com```\n```/ping https://domain.com```\n```/ping 1.1.1.1```';

        case '/help':
            console.log('/help command ' + 'fromid: ' + msg.from);
            return useHelpCommand();
        }
    }
