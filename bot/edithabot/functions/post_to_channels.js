


const post_to_channels = (my_channels_db, keChannels, bot, imp) => {
    bot.command('post_to_channels_ke', async ctx => {
        let txt = ctx.message.text
        let ch_link = 'http://t.me/cute_edithabot?start=malaya_kenya'
        let keyb = [
            [{ text: "❌❌ Video za Kutombana ❤️", url: ch_link },],
            [{ text: "🔥 Sex Calls 🔞", url: ch_link },],
            [{ text: "🍑🍑 SUGAR MUMMIES 💋", url: ch_link },],
            [{ text: "🔞 KENYAN XXX VIDEOS ❌❌❌", url: ch_link },],
            [{ text: "🔥🔥 KENYAN HOT GIRLS 🔞", url: ch_link }]
        ]
    
        let mid = Number(txt.split('post_to_channels_ke=')[1])
    
        let channels = await keChannels.find()
    
        for (ch of channels) {
            await bot.api.copyMessage(ch.ch_id, imp.pzone, mid, {
                disable_notification: true,
                reply_markup: {
                    inline_keyboard: keyb
                }
            }).catch(e=> console.log(e.message))
        }
    })

    //ug channels
    bot.command('post_to_channels_ug', async ctx => {
        let txt = ctx.message.text
        let ch_link = 'http://t.me/cute_edithabot?start=ug_whores'
        let keyb = [
            [{ text: "❌❌ UGANDAN ESCORTS | Everywhere ❤️", url: ch_link },],
            [{ text: "🔥 Sexy Calls 🔞", url: ch_link },],
            [{ text: "🍑🍑 SUGAR MUMMIES 💋", url: ch_link },],
            [{ text: "🔞 UGANDAN XXX VIDEOS ❌❌❌", url: ch_link },],
            [{ text: "🔥🔥 KAMPALA HOT GIRLS 🔞", url: ch_link }]
        ]
    
        let mid = Number(txt.split('post_to_channels_ug=')[1])
    
        let channels = await my_channels_db.find()
    
        for (ch of channels) {
            await bot.api.copyMessage(ch.ch_id, imp.pzone, mid, {
                disable_notification: true,
                reply_markup: {
                    inline_keyboard: keyb
                }
            }).catch(e=> console.log(e.message))
        }
    })
}

module.exports = post_to_channels