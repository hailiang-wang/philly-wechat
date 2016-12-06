'use strict';
/**
 * Philly Wechat Server
 * https://github.com/Samurais/philly-wechat
 */

const QrcodeTerminal = require('qrcode-terminal');
const co = require('co');
const _ = require('lodash');
const conf = require('../config/environment');
const { Wechaty, Config, log, Message } = require('../wechaty');
const bot = Wechaty.instance({
    profile: Config.DEFAULT_PROFILE
})
const logger = require('../services/logging.service').getLogger('app');

bot
    .on('scan', (url, code) => {
        if (!/201|200/.test(String(code))) {
            let loginUrl = url.replace(/\/qrcode\//, '/l/');
            QrcodeTerminal.generate(loginUrl);
        }
        logger.debug(`${url}\n[${code}] Scan QR Code in above url to login: `);
    })
    .on('login', user => logger.info('Bot', `bot login: ${user}`))
    .on('logout', e => logger.info('Bot', 'bot logout.'))
    .on('message', m => {
        if (m.self()) {
            return;
        }
        const room = m.room();
        if (room && /Wechaty/i.test(room.topic())) {
            logger.info(room.topic());
        }
        else {
            logger.info('Bot', 'recv: %s', m);
        }
    });

bot.init()
    .catch(e => {
        logger.error('Bot', 'init() fail:' + e);
        bot.quit();
        process.exit(-1);
    });