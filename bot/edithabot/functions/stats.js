const stats = (bot, ugandanDb, kenyanDb) => {
    bot.command('stats', async ctx => {
        try {
            let ugs = await ugandanDb.countDocuments()
            let kes = await kenyanDb.countDocuments()
            await ctx.reply(`Ugandans Stat is: ${ugs}\n\nKenyans is: ${kes}`)
        } catch (err) {
            console.log(err.message)
        }
    })
}

module.exports = stats