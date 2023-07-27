const validator = require('validator');
const ping = require('ping');

module.exports = async function usePing(url) {
    url = url.replace('http://', '').replace('https://', '');
    
    if (validator.isURL(url)) {
        const res = await ping.promise.probe(url);

        if (res.alive) {
            return `PING ${url}\nReply from ${res.numeric_host}\nLatency ${res.time}ms`;
        } else {
            throw new Error(`${url} ERROR 💀⁉️`);
        }
    } else {
        throw new Error('Invalid URL');
    }
}
