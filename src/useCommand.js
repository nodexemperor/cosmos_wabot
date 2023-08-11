const useHelpCommand = require('./useHelpCommand');

module.exports = function useCommand(msg) {
    switch (msg.body) {
        
        case '/mainnet':
            return '```/mainnet <network>```\n```/mainnet <network> <interval>```\n```/mainnet --help```';
        
        case '/mainnet --help':
            return 'This tool was created to simplify validator monitoring with cosmos based node, with .env COSMOS_* variables that you can customize.\n\nFor use ```/testnet <network> <interval | stop>```, where ```<interval>``` is a number followed by "m" (for minutes) or "h" (for hours).\n\nFor example :\n```/mainnet cosmos```\n```/mainnet cosmos 1m```\n```/mainnet cosmos 12h```\n```/mainnet cosmos stop```';
        
        case '/testnet':
            return '```/testnet <network>```\n```/testnet <network> <interval>```\n```/testnet --help```';
            
        case '/testnet --help':
            return 'This tool was created to very simplify validator monitoring with cosmos based node, with .env COSMOS_* variables that you can customize.\n\nFor use ```/testnet <network> <interval | stop>```, where ```<interval>``` is a number followed by "m" (for minutes) or "h" (for hours).\n\nFor example :\n```/testnet cosmost```\n```/testnet cosmost 1m```\n```/testnet cosmost 12h```\n```/testnet cosmost stop```';
        
        case '/ping':
            return '```/ping <destination>```\n```/ping --help```';
        
        case '/ping --help':
            return 'Ping works a see letency on domain or hostname and IPv4.\n\nFor example:\n```/ping domain.com```\n```/ping http://domain.com```\n```/ping https://domain.com```\n```/ping 1.1.1.1```';

        case '/help':
            return useHelpCommand();
        }
    }
