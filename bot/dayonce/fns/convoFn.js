let clearDB = async (bot, ctx, u, index, bads, all_users) => {
    try {
        await ctx.api.sendChatAction(u.chatid, 'typing')
    } catch (error) {
        if (bads.some((b) => err.message.toLowerCase().includes(b))) {
            u.deleteOne()
            console.log(`🚮 ${u.username} deleted`)
        } else { console.log(`🤷‍♂️ ${err.message}`) }
    }
    if (index == all_users.length - 1) {
        await ctx.reply('Nimemaliza conversation').catch(e => console.log(e.message))
    }
}

const mainConvo = async (bot, ctx, imp, u, index, msg_id, defaultReplyMkp) => {
    let bads = ['blocked', 'deactivated']
    try {
        await bot.api.copyMessage(u.chatid, imp.mikekaDB, msg_id, { reply_markup: defaultReplyMkp })
            .catch(async (err) => {
                if (bads.some((b) => err.message.toLowerCase().includes(b))) {
                    await u.deleteOne()
                    console.log(`🚮 ${u.username} deleted`)
                } else { console.log(`🤷‍♂️ ${err.message}`) }
            })
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = { clearDB, mainConvo }