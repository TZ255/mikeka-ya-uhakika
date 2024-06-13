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

module.exports = {clearDB}