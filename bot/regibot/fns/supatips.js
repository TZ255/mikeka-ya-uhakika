//midds
const cheerio = require('cheerio')
const axios = require('axios').default
const { nanoid } = require('nanoid')

const supatips_Model = require('../database/supatips')
const bin_supatips_Model = require('../database/supatips-bin')

module.exports = (bot) => {
    bot.command('clear_supabin', async ctx => {
        try {
            await bin_supatips_Model.deleteMany()
            await ctx.reply('supabin cleared successfully')
        } catch (err) {
            console.log(err.message)
        }
    })

    //supatoday
    bot.command('supaleo', async ctx => {
        try {
            let sup_url = `https://www.supatips.com/`

            let html = await axios.get(sup_url)
            let $ = cheerio.load(html.data)

            let text = ''
            let nanoArr = ''

            let tday_table = $('#exTab2 .tab-content div#2 .widget-table-fixtures table tbody')
            tday_table.each(async (i, el) => {
                let time_data = $('td:nth-child(1)', el).text()
                let time_arr = time_data.split(':')
                let hrs = Number(time_arr[0])
                let min = time_arr[1]
                let actual_time = hrs + 2
                if(actual_time >= 24) {
                    actual_time = `23`
                    min = '59'
                }
                let time = `${actual_time}:${min}`

                let siku = new Date().toLocaleDateString('en-GB', { timeZone: 'Africa/Nairobi' })
                let nano = nanoid(4)

                let league = $('td:nth-child(2)', el).text()
                let match = $('td:nth-child(3)', el).text()
                match = match.replace(/ vs /g, ' - ')

                let tip = $('td:nth-child(4)', el).text()
                let matokeo = $('td:nth-child(5)', el).text()
                if (matokeo.length < 2) {
                    matokeo = '-:-'
                }

                //create text
                text = text + `⌚ ${time}, ${league}\n<b>⚽ ${match}</b>\n🎯 Tip: <b>${tip} (${matokeo})</b>\n\n`
                if (i == tday_table.length - 1) {
                    nanoArr = nanoArr + `${nano}`
                } else {
                    nanoArr = nanoArr + `${nano}+`
                }

                await bin_supatips_Model.create({
                    time, league, match, tip, siku, nano, matokeo
                })
            })
            await ctx.reply(text + `Arrs: ${nanoArr}`, {
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: 'upd. as today (trh ya leo +3)', callback_data: `update2d_${nanoArr}` }
                        ],
                        [
                            { text: 'upd. as yesterday (trh ya jana +3)', callback_data: `updateyd_${nanoArr}` }
                        ],
                        [
                            { text: 'Ignore 🤷‍♂️', callback_data: `ignore_bin` }
                        ]
                    ]
                }
            })

        } catch (err) {
            await ctx.reply(err.message)
        }
    })

    //supatomorrow
    bot.command('supakesho', async ctx => {
        try {
            let sup_url = `https://www.supatips.com/`

            let html = await axios.get(sup_url)
            let $ = cheerio.load(html.data)

            let text = ''
            let nanoArr = ''

            let tday_table = $('#exTab2 .tab-content div#3 .widget-table-fixtures table tbody')
            let nd = new Date()
            let siku = nd.toLocaleDateString('en-GB', { timeZone: 'Africa/Nairobi' })
            if (tday_table.length >= 1) {
                tday_table.each(async (i, el) => {
                    let time_data = $('td:nth-child(1)', el).text()
                    let time_arr = time_data.split(':')
                    let hrs = Number(time_arr[0])
                    let min = time_arr[1]
                    let time = `${hrs + 2}:${min}`
                    let nano = nanoid(4)

                    let league = $('td:nth-child(2)', el).text()
                    let match = $('td:nth-child(3)', el).text()
                    match = match.replace(/ vs /g, ' - ')

                    let tip = $('td:nth-child(4)', el).text()
                    let matokeo = $('td:nth-child(5)', el).text()
                    if (matokeo.length < 2) {
                        matokeo = '-:-'
                    }

                    //create text
                    text = text + `⌚ ${time}, ${league}\n<b>⚽ ${match}</b>\n🎯 Tip: <b>${tip} (${matokeo})</b>\n\n`
                    if (i == tday_table.length - 1) {
                        nanoArr = nanoArr + `${nano}`
                    } else {
                        nanoArr = nanoArr + `${nano}+`
                    }

                    await bin_supatips_Model.create({
                        time, league, match, tip, siku, nano, matokeo
                    })
                })

                await ctx.reply(text + `Arrs: ${nanoArr}`, {
                    parse_mode: "HTML",
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: 'update as today (trh ya leo +3)', callback_data: `update2d_${nanoArr}` }
                            ],
                            [
                                { text: 'update as tomorrow (trh ya kesho +3)', callback_data: `updatekesho_${nanoArr}` }
                            ],
                            [
                                { text: 'Ignore 🤷‍♂️', callback_data: `ignore_bin` }
                            ]
                        ]
                    }
                })
            } else { ctx.reply('Mpumbavu za kesho bado hajaandaa 😏') }
        } catch (err) {
            await ctx.reply(err.message)
        }
    })

    bot.command('supajana', async ctx => {
        try {
            let sup_url = `https://www.supatips.com/`

            let html = await axios.get(sup_url)
            let $ = cheerio.load(html.data)

            let text = ''
            let nanoArr = ''

            let tday_table = $('#exTab2 .tab-content div#1 .widget-table-fixtures table tbody')
            let nn = new Date()
            nn.setDate(nn.getDate()-1)
            let siku = nn.toLocaleDateString('en-GB', { timeZone: 'Africa/Nairobi' })
            tday_table.each(async (i, el) => {
                let time_data = $('td:nth-child(1)', el).text()
                let time_arr = time_data.split(':')
                let hrs = Number(time_arr[0])
                let actual_time = hrs + 2
                if(actual_time > 24) {
                    actual_time = '0' + (actual_time - 25)
                }
                let min = time_arr[1]
                let time = `${actual_time}:${min}`

                let nano = nanoid(4)

                let league = $('td:nth-child(2)', el).text()
                let match = $('td:nth-child(3)', el).text()
                match = match.replace(/ vs /g, ' - ')

                let tip = $('td:nth-child(4)', el).text()
                let matokeo = $('td:nth-child(5)', el).text()
                if (matokeo.length < 2) {
                    matokeo = '-:-'
                }

                //create text
                text = text + `⌚ ${time}, ${league}\n<b>⚽ ${match}</b>\n🎯 Tip: <b>${tip} (${matokeo})</b>\n\n`
                if (i == tday_table.length - 1) {
                    nanoArr = nanoArr + `${nano}`
                } else {
                    nanoArr = nanoArr + `${nano}+`
                }

                await bin_supatips_Model.create({
                    time, league, match, tip, siku, nano, matokeo
                })
            })
            await ctx.reply(text + `Arrs: ${nanoArr}`, {
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: 'upd. as yesterday (trh ya jana +3)', callback_data: `updateyd_${nanoArr}` }
                        ],
                        [
                            { text: 'Ignore 🤷‍♂️', callback_data: `ignore_bin` }
                        ]
                    ]
                }
            })

        } catch (err) {
            await ctx.reply(err.message)
        }
    })
}