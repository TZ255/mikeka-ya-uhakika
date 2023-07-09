//midds
const cheerio = require('cheerio')
const axios = require('axios').default
const { nanoid } = require('nanoid')

const supatips_Model = require('../database/supatips')
const bin_supatips_Model = require('../database/supatips-bin')


const checkOdds = async (bot, imp, tablehusika, siku) => {
    try {
        let sup_url = `https://www.supatips.com/`

        let html = await axios.get(sup_url)
        let $ = cheerio.load(html.data)

        let text = ''
        let nanoArr = ''

        //check our odds length
        let ourDb = await supatips_Model.find({ siku })

        //fetch supatips table
        let tday_table = $(`#exTab2 .tab-content ${tablehusika} .widget-table-fixtures table tbody`)

        //compare length
        if (ourDb.length < tday_table.length) {
            await supatips_Model.deleteMany({ siku })
            tday_table.each(async (i, el) => {
                let time_data = $('td:nth-child(1)', el).text()
                let time_arr = time_data.split(':')
                let hrs = Number(time_arr[0])
                let min = time_arr[1]
                let actual_time = hrs + 2
                if (actual_time >= 24) {
                    actual_time = `23`
                    min = '59'
                }
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

                //add to database
                await supatips_Model.create({
                    matokeo, time, siku, league, match, tip, nano
                })
            })

            await bot.telegram.sendMessage(imp.shemdoe, `New matches found and mkeka created successfully\n\n` + text + `Arrs: ${nanoArr}`, {
                parse_mode: 'HTML'
            })
        } else {
            await bot.telegram.sendMessage(imp.shemdoe, `Automatic fetcher run and nothing found\n\n Our Length: ${ourDb.length}\nHer Length: ${tday_table.length}`)
        }
    } catch (err) {
        await bot.telegram.sendMessage(imp.shemdoe, 'Not getting odds... ' + err.message)
    }
}

const checkMatokeo = async (bot, imp, tablehusika, siku) => {
    try {
        let sup_url = `https://www.supatips.com/`

        let html = await axios.get(sup_url)
        let $ = cheerio.load(html.data)

        //fetch supatips today table
        let tday_table = $(`#exTab2 .tab-content ${tablehusika} .widget-table-fixtures table tbody`)

        tday_table.each(async (i, el) => {
            let time_data = $('td:nth-child(1)', el).text()
            let time_arr = time_data.split(':')
            let hrs = Number(time_arr[0])
            let min = time_arr[1]
            let actual_time = hrs + 2
            if (actual_time >= 24) {
                actual_time = `23`
                min = '59'
            }
            let time = `${actual_time}:${min}`
            let nano = nanoid(4)

            let league = $('td:nth-child(2)', el).text()
            let match = $('td:nth-child(3)', el).text()
            match = match.replace(/ vs /g, ' - ')

            let tip = $('td:nth-child(4)', el).text()
            let matokeo = $('td:nth-child(5)', el).text()

            //check matokeo, if updated, update
            if (matokeo.length > 2) {
                let mtch = await supatips_Model.findOne({ match, siku })
                if (mtch.matokeo == '-:-') {
                    await mtch.updateOne({ $set: { matokeo } })
                    await bot.telegram.sendMessage(imp.shemdoe, `Results for ${mtch.match} updated to ${matokeo}`)
                }
            }
        })
    } catch (err) {
        await bot.telegram.sendMessage(imp.shemdoe, 'Not getting odds... ' + err.message)
    }
}

module.exports = {
    checkOdds,
    checkMatokeo
}