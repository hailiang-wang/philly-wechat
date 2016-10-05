'use strict';
/**
 * Philly Wechat Server
 * https://github.com/Samurais/philly-wechat
 */

const co = require('co');
const conf = require('./config/environment');
const { Wechaty, Config, log, Message } = require('Wechaty');
const parseproxy = require('parseproxy');
const bot = new Wechaty({ profile: Config.DEFAULT_PROFILE });
const logger = require('./services/logging.service').getLogger('app');

/** init parse sdk */
parseproxy.init(conf.parse.serverURL, conf.parse.appId, conf.parse.javascriptKey);

/** register handler onCreate event. */
parseproxy.subscribeMessageOutbound({
    onCreate: co.wrap(function*(messageOutbound) {
        logger.debug('messageOutboundData', JSON.stringify(messageOutbound));
        let messageInbound = yield messageOutbound.get('replyToInboundMessage').fetch();
        try {
            yield bot.reply(new Message(messageInbound.get('wechatSource').rawObj),
                    messageOutbound.get('textMessage'))
                .then(() => { logger.info('Bot reply done.') });
        } catch (e) {
            logger.error(e);
        }
    })
}, [{
    ref: 'equalTo',
    key: 'channel',
    value: 'wechat'
}]);

bot.on('login', user => log.info('Bot', `${user.name()} logined`))

.on('logout', user => log.info('Bot', `${user.name()} logouted`))

.on('error', e => log.info('Bot', 'error: %s', e))

.on('scan', ({ url, code }) => {
    if (!/201|200/.test(code)) {
        let loginUrl = url.replace(/\/qrcode\//, '/l/')
        require('qrcode-terminal').generate(loginUrl)
    }
    logger.debug(`${url}\n[${code}] Scan QR Code in above url to login: `);
})

.on('message', m => {
    m.ready()

    .then(co.wrap(function*(msg) {

        let room = m.room();
        let from = m.from();

        logger.debug((room ? '[' + room.topic() + ']' : '') + '<' + from.name() + '>' + ':' + m.toStringDigest());

        let messageInboundData = {
            fromUserId: from.name(),
            fromGroupId: room ? room.topic() : null,
            channel: 'wechat',
            type: 'textMessage',
            textMessage: m.get('content'),
            wechatSource: m
        };
        logger.debug('messageInboundData', messageInboundData);
        // if (/^(ding|ping|bing)$/i.test(m.get('content')) && !bot.self(m)) {
        //     bot.reply(m, 'dong')
        //         .then(() => { logger.info('Bot', 'REPLY: dong') })
        // }
        return yield parseproxy.createMessageInbound(messageInboundData);

    }))

    .then(function(messageInbound) {
        logger.info('messageInbound created', messageInbound.toJSON());
    })

    .catch(e => logger.error('Bot', 'ready: %s', e));
})

bot.init()
    .catch(e => {
        logger.error('Bot', 'init() fail: %s', e);
        bot.quit();
        process.exit(-1);
    });
