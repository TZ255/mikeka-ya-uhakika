const mkekaFn = require('./mkeka')

const startFn = (bot, ugandanDb, kenyanDb, imp, delay, InlineKeyboard) => {
    bot.command('start', async ctx => {
        let defaultReplyMkp = {
            keyboard: [
                [{ text: "💰 MONEY" }, { text: "🍑 PU$$Y" }],
                [{ text: "🎯 BET OF THE DAY (🔥)" }]
            ],
            is_persistent: true,
            resize_keyboard: true
        }
        try {
            let payLoad = ctx.match

            if (payLoad) {
                if (payLoad == 'ug_whores') {
                    let user = await ugandanDb.findOne({ chatid: ctx.chat.id })
                    if (!user) {
                        await ugandanDb.create({ chatid: ctx.chat.id, username: ctx.chat.first_name, blocked: false })
                        console.log('ugandan user created')
                    }
                    await bot.api.copyMessage(ctx.chat.id, imp.pzone, 17878, { reply_markup: defaultReplyMkp })
                }

                else if (payLoad == 'malaya_kenya') {
                    let user = await kenyanDb.findOne({ chatid: ctx.chat.id })
                    if (!user) {
                        await kenyanDb.create({ chatid: ctx.chat.id, username: ctx.chat.first_name, blocked: false })
                        console.log('kenyan user created')
                    }
                    await bot.api.copyMessage(ctx.chat.id, imp.pzone, 7589, { reply_markup: defaultReplyMkp })
                } else if (['pussy', 'money'].includes(payLoad)) {
                    let url = `https://getafilenow.com/1584699`
                    let inline_keyboard = new InlineKeyboard().url('🔞 UNLOCK NOW', url)
                    await ctx.api.copyMessage(ctx.chat.id, imp.pzone, 17879, {
                        reply_markup: inline_keyboard
                    })
                }
            } else {
                let url = `https://getafilenow.com/1584699`
                let inline_keyboard = new InlineKeyboard().url('🔞 UNLOCK NOW', url)
                await ctx.api.copyMessage(ctx.chat.id, imp.pzone, 17879, {
                    reply_markup: inline_keyboard
                })
            }
        } catch (err) {
            console.log(err.message)
        }
    })
}

module.exports = startFn