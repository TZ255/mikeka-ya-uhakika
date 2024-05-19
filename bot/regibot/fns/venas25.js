//midds
const cheerio = require('cheerio')
const axios = require('axios').default
const { nanoid } = require('nanoid')

const venas25Model = require('../database/venas25')


const checkOdds = async (bot, imp) => {
    try {
        //today date in yyyy-mm-dd +3
        let tdate = new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Nairobi' })
        //today date in dd/mm/yy +3
        let siku = new Date().toLocaleDateString('en-GB', { timeZone: 'Africa/Nairobi' })

        let sup_url = `https://venasbet.com/over_2_5_goals?dt=${tdate}`
        let html = await axios.get(sup_url)
        let $ = cheerio.load(html.data)

        //check our odds length
        let ourDb = await venas25Model.find({ siku })

        //fetch venas25 table
        let tday_table = $(`#home table tbody tr`)

        //compare length
        if (tday_table && ourDb.length < tday_table.length) {
            await venas25Model.deleteMany({ siku })
            tday_table.each(async (i, el) => {
                let time_data = $('td:nth-child(1)', el).text().trim()
                let time_arr = time_data.split(':')
                let hrs = Number(time_arr[0])
                let min = time_arr[1]
                let actual_time = hrs + 2
                if (actual_time >= 24) {
                    actual_time = `23`
                    min = '59'
                }
                String(actual_time).padStart(2, '0')
                let time = `${actual_time}:${min}`
                let nano = nanoid(4)

                let league = $('td:nth-child(2)', el).text().trim()
                let match = $('td:nth-child(3)', el).text().trim()
                match = match.replace(/\n/g, '').replace(' VS', ' - ')
                let tip = $('td:nth-child(4)', el).text().trim()

                //check if we have match the add to database
                if (match.length > 5) {
                    await venas25Model.create({
                        time, siku, league, match, tip, nano
                    })
                }
            })
            await bot.telegram.sendMessage(imp.shemdoe, `Venas25 found and created`)
        } else {
            await bot.telegram.sendMessage(imp.shemdoe, `Venas25 - nothing found\n\n Our Length: ${ourDb.length}\nHer Length: ${tday_table.length}`)
        }
    } catch (err) {
        console.error(err)
        await bot.telegram.sendMessage(imp.shemdoe, 'Not getting odds... ' + err.message)
    }
}

const checkTomorrowOdds = async (bot, imp) => {
    try {
        let tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1)

        //tomorrow date in yyyy-mm-dd +3
        let tdate = tomorrow.toLocaleDateString('en-CA', { timeZone: 'Africa/Nairobi' })
        //tomorrow date in dd/mm/yy +3
        let siku = tomorrow.toLocaleDateString('en-GB', { timeZone: 'Africa/Nairobi' })

        let sup_url = `https://venasbet.com/over_2_5_goals?dt=${tdate}`

        let html = await axios.get(sup_url)
        let $ = cheerio.load(html.data)

        //check our odds length
        let ourDb = await venas25Model.find({ siku })

        //fetch venas25 table
        let tday_table = $(`#home table tbody tr`)

        //compare length
        if (tday_table && ourDb.length < tday_table.length) {
            await venas25Model.deleteMany({ siku })
            tday_table.each(async (i, el) => {
                let time_data = $('td:nth-child(1)', el).text().trim()
                let time_arr = time_data.split(':')
                let hrs = Number(time_arr[0])
                let min = time_arr[1]
                let actual_time = String(hrs + 2).padStart(2, '0')
                if (actual_time >= 24) {
                    actual_time = `23`
                    min = '59'
                }
                let time = `${actual_time}:${min}`
                let nano = nanoid(4)

                let league = $('td:nth-child(2)', el).text().trim()
                let match = $('td:nth-child(3)', el).text().trim()
                match = match.replace(/\n/g, '').replace(' VS', ' - ')
                let tip = $('td:nth-child(4)', el).text().trim()

                //check if we have match the add to database
                if (match.length > 5) {
                    await venas25Model.create({
                        time, siku, league, match, tip, nano
                    })
                }
            })
            await bot.telegram.sendMessage(imp.shemdoe, `Venas25 tomorrow found and created`)
        } else {
            await bot.telegram.sendMessage(imp.shemdoe, `Venas25 - nothing found\n\n Our Length: ${ourDb.length}\nHer Length: ${tday_table.length}`)
        }
    } catch (err) {
        console.error(err)
        await bot.telegram.sendMessage(imp.shemdoe, 'Not getting odds... ' + err.message)
    }
}

const checkMatokeoJana = async (bot, imp) => {
    try {
        let today = new Date();
        today.setDate(today.getDate() - 1);

        //today date in yyyy-mm-dd +3
        let ydate = today.toLocaleDateString('en-CA', { timeZone: 'Africa/Nairobi' })
        //today date in dd/mm/yy +3
        let siku = today.toLocaleDateString('en-GB', { timeZone: 'Africa/Nairobi' })

        let sup_url = `https://venasbet.com/over_2_5_goals?dt=${ydate}`

        let html = await axios.get(sup_url)
        let $ = cheerio.load(html.data)

        //fetch venas25 table
        let yday_table = $(`#home table tbody tr`)

        //compare length
        if (yday_table && yday_table.length > 1) {
            yday_table.each(async (i, el) => {
                let match = $('td:nth-child(2)', el).text().trim()
                match = match.replace(/\n/g, '').replace(' VS', ' - ')
                let matokeo = $('td:nth-child(4)', el).text().trim()
                //update table
                let data = await venas25Model.findOne({ match, siku })
                if (data && (data.matokeo == '-:-' || data.matokeo == ':') && matokeo != ':') {
                    await data.updateOne({ $set: { matokeo } })
                }
            })
        } else {
            await bot.telegram.sendMessage(imp.shemdoe, `Venas25 - no yesterday results`)
        }
    } catch (err) {
        console.error(err)
        await bot.telegram.sendMessage(imp.shemdoe, 'Not getting odds... ' + err.message)
    }
}



module.exports = {
    checkOdds, checkTomorrowOdds, checkMatokeoJana
}