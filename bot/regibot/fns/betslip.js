//midds
const cheerio = require('cheerio')
const axios = require('axios').default
const { nanoid } = require('nanoid')

const betslipModel = require('../database/betslip')

module.exports = (bot, imp) => {
    bot.command('betslip', async ctx=> {
        try {
            let url = `https://footballpredictions.com/betslip/`
            let html = await axios.get(url)
            let $ = cheerio.load(html.data)

            let machaguo = $('.entry-content .acca-wrapper .acca-betslip-wrapper .acca-game-wrapper')
            let date = $('.inner .main_container .main-col .mom-post-meta').text()
            date = date.split('Betslip was posted on:')[1].trim()

            let txt = `${date}\n\n`

            machaguo.each(async(i, el)=> {
                let match = $('.acca-game1-match', el).text().trim()
                let tip = $('.acca-game1-bet', el).text().trim()
                let odd = $('.acca-game1-odds', el).text().trim()

                txt = txt + `⚽ ${match}\n🎯 ${tip} @${odd}\n\n`
            })
            await ctx.reply(txt, {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {text: 'post td +3', callback_data: 'post_betslip'},
                            {text: 'ignore', callback_data: 'ignore_slip'},
                        ]
                    ]
                }
            })
        } catch (error) {
            await ctx.reply(error.message)
        }
    })

    bot.action('post_betslip', async ctx => {
        try {
            let mid = ctx.callbackQuery.message.message_id
            let mkStr = ctx.callbackQuery.message

            if(ctx.callbackQuery.message.chat.id == imp.shemdoe) {
                let strArray = mkStr.text.split('⚽ ')
                strArray.shift()
                for(let chaguo of strArray) {
                    let data = chaguo.split('\n🎯')
                    let match = data[0].trim()
                    let tip = data[1].split('@')[0].trim()
                    let odd = data[1].split('@')[1].replace(/\\n/g, '').trim()
                    let date = new Date().toLocaleDateString('en-GB', {timeZone: 'Africa/Nairobi'})
                    
                    await betslipModel.create({match, date, tip, odd})
                }
                await ctx.reply('mkeka posted')
                await ctx.deleteMessage(mid)
            }
        } catch (error) {
            console.log(error.message)
        }
    })

    bot.action('ignore_slip', async ctx=> {
        try {
            await ctx.deleteMessage(ctx.callbackQuery.message.message_id)
        } catch (error) {
            await ctx.reply('error.message')
        }
    })
}