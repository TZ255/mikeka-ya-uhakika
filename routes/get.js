const router = require('express').Router()
const mkekadb = require('../model/mkeka-mega')
const fametipsModel = require('../model/fametips')
const supatipsModel = require('../model/supatips')
const megasModel = require('../model/mega-odds')
const over15Model = require('../model/over15db')
const bttsModel = require('../model/btts')
const PassionPredict35Model = require('../model/pp35')
const axios = require('axios').default

//times
const TimeAgo = require('javascript-time-ago')
const en = require('javascript-time-ago/locale/en')
const { WeekDayFn } = require('./fns/weekday')
const miamalaModel = require('../bot/rtbot/database/miamala')
TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US')

//send success (no content) response to browser
router.get('/favicon.ico', (req, res) => res.status(204).end());

router.get('/', async (req, res) => {
    try {
        //leo
        let d = new Date().toLocaleDateString('en-GB', { timeZone: 'Africa/Nairobi' })
        //jana
        let _nd = new Date()
        _nd.setDate(_nd.getDate() - 1)
        let _d = _nd.toLocaleDateString('en-GB', { timeZone: 'Africa/Nairobi' })
        //juzi
        let _jd = new Date()
        _jd.setDate(_jd.getDate() - 2)
        let _s = _jd.toLocaleDateString('en-GB', { timeZone: 'Africa/Nairobi' })
        //kesho
        let new_d = new Date()
        new_d.setDate(new_d.getDate() + 1)
        let kesho = new_d.toLocaleDateString('en-GB', { timeZone: 'Africa/Nairobi' })

        //find for all days
        let allDays = await fametipsModel.find({ siku: { $in: [d, _d, _s, kesho] } }).sort('time')
        //fametips 100 za nyuma
        let zaNyuma100 = await fametipsModel.find().limit(100).sort('-UTC3')

        let ftips = allDays.filter(doc => doc.siku == d)
        let ytips = allDays.filter(doc => doc.siku == _d)
        let jtips = allDays.filter(doc => doc.siku == _s)
        let ktips = allDays.filter(doc => doc.siku == kesho)

        //over 1.5
        let over15AllDays = await over15Model.find({ date: { $in: [d, _d, _s, kesho] } }).sort('time')
        let over15Leo = over15AllDays.filter(doc => doc.date == d)
        let over15Kesho = over15AllDays.filter(doc => doc.date == kesho)
        let over15Juzi = over15AllDays.filter(doc => doc.date == _s)
        let over15Jana = over15AllDays.filter(doc => doc.date == _d)

        res.render('1-home/home', { ftips, ytips, ktips, jtips, zaNyuma100, over15Jana, over15Juzi, over15Kesho, over15Leo })
    } catch (err) {
        let tgAPI = `https://api.telegram.org/bot${process.env.RT_TOKEN}/copyMessage`
        console.log(err.message, err)
        await axios.post(tgAPI, {
            chat_id: 741815228,
            from_chat_id: -1002634850653, //rtcopyDB
            message_id: 43
        }).catch(e => console.log(e.response.data))
    }
})

router.get('/both-teams-to-score', async (req, res) => {
    try {
        //leo
        let d = new Date().toLocaleDateString('en-GB', { timeZone: 'Africa/Nairobi' })

        //jana
        let _nd = new Date()
        _nd.setDate(_nd.getDate() - 1)
        let _d = _nd.toLocaleDateString('en-GB', { timeZone: 'Africa/Nairobi' })

        //juzi
        let _jd = new Date()
        _jd.setDate(_jd.getDate() - 2)
        let _s = _jd.toLocaleDateString('en-GB', { timeZone: 'Africa/Nairobi' })

        //kesho
        let new_d = new Date()
        new_d.setDate(new_d.getDate() + 1)
        let kesho = new_d.toLocaleDateString('en-GB', { timeZone: 'Africa/Nairobi' })

        //find for all days
        let allDays = await bttsModel.find({ date: { $in: [d, _d, _s, kesho] } }).sort('time')

        let ftips = allDays.filter(doc => doc.date == d)
        let ytips = allDays.filter(doc => doc.date == _d)
        let jtips = allDays.filter(doc => doc.date == _s)
        let ktips = allDays.filter(doc => doc.date == kesho)

        res.render('5-bts/bts', { ftips, ytips, ktips, jtips })
    } catch (err) {
        let tgAPI = `https://api.telegram.org/bot${process.env.RT_TOKEN}/copyMessage`
        console.log(err.message, err)
        await axios.post(tgAPI, {
            chat_id: 741815228,
            from_chat_id: -1002634850653, //rtcopyDB
            message_id: 43
        }).catch(e => console.log(e.response.data))
    }
})

router.get('/under-over-15-first-half', async (req, res) => {
    try {
        //leo
        let nd = new Date()
        let d = nd.toLocaleDateString('en-GB', { timeZone: 'Africa/Nairobi' })
        let d_juma = nd.toLocaleString('en-GB', { timeZone: 'Africa/Nairobi', weekday: 'long' })
        //jana
        let _nd = new Date()
        _nd.setDate(_nd.getDate() - 1)
        let _d = _nd.toLocaleDateString('en-GB', { timeZone: 'Africa/Nairobi' })
        let _d_juma = _nd.toLocaleString('en-GB', { timeZone: 'Africa/Nairobi', weekday: 'long' })
        //juzi
        let _jd = new Date()
        _jd.setDate(_jd.getDate() - 2)
        let _s = _jd.toLocaleDateString('en-GB', { timeZone: 'Africa/Nairobi' })
        let _s_juma = _jd.toLocaleString('en-GB', { timeZone: 'Africa/Nairobi', weekday: 'long' })
        //kesho
        let new_d = new Date()
        new_d.setDate(new_d.getDate() + 1)
        let kesho = new_d.toLocaleDateString('en-GB', { timeZone: 'Africa/Nairobi' })
        let k_juma = new_d.toLocaleString('en-GB', { timeZone: 'Africa/Nairobi', weekday: 'long' })

        //mikeka ya kuchukua
        let arr = ['Over 3.5', 'GG & Over 2.5', '2 & GG', '1 & GG', '2 & Over 2.5', '1 & Over 2.5', '12 & GG', 'Under 2.5', 'Under 3.5', 'Under 1.5']

        let [Pp35Tips, MegasOdds] = await Promise.all([
            PassionPredict35Model.find({
                siku: { $in: [d, _d, _s, kesho] },
                tip: { $in: arr }
            }),
            megasModel.find({
                date: { $in: [d, _d, _s, kesho] },
                bet: { $in: arr }
            }),
        ]);

        //combine arrays, replace the tips and sort with time
        let AllCombined = [...Pp35Tips, ...MegasOdds]
        AllCombined.map(doc => {
            let target = doc.tip || doc.bet
            let under15 = ['Under 2.5', 'Under 3.5', 'Under 1.5']
            let over15 = ['Over 3.5', 'GG & Over 2.5', '2 & GG', '1 & GG', '2 & Over 2.5', '1 & Over 2.5', '12 & GG']

            if (under15.includes(target)) {
                if (doc.tip) doc.tip = 'Under 1.5';
                if (doc.bet) doc.bet = 'Under 1.5';
            } else if (over15.includes(target)) {
                if (doc.tip) doc.tip = 'Over 1.5';
                if (doc.bet) doc.bet = 'Over 1.5';
            }
            return doc;
        })
        AllCombined.sort((a, b) => a.time.localeCompare(b.time))


        //tarehes
        let trh = { leo: d, kesho, jana: _d, juzi: _s }
        let jumasiku = { juzi: WeekDayFn(_s_juma), jana: WeekDayFn(_d_juma), leo: WeekDayFn(d_juma), kesho: WeekDayFn(k_juma) }

        //filter
        let stips = AllCombined.filter(doc => (doc.date === d || doc.siku === d))
        let ytips = AllCombined.filter(doc => (doc.date === _d || doc.siku === _d))
        let ktips = AllCombined.filter(doc => (doc.date === kesho || doc.siku === kesho))
        let jtips = AllCombined.filter(doc => (doc.date === _s || doc.siku === _s))

        res.render('6-ht15/index', { stips, ytips, ktips, jtips, trh, jumasiku })
    } catch (err) {
        console.error(err)
        let tgAPI = `https://api.telegram.org/bot${process.env.LAURA_TOKEN}/copyMessage`
        await axios.post(tgAPI, {
            chat_id: 741815228,
            from_chat_id: -1002634850653, //rtcopyDB
            message_id: 126
        }).catch(e => console.log(e.message, e))
    }
})

router.get('/odds-blog', async (req, res) => {
    try {
        //fametip ya leo //kama hakuna chukua toka kwa parent (supatips)
        let d = new Date().toLocaleDateString('en-GB', { timeZone: 'Africa/Nairobi' })
        let ftips = await fametipsModel.find({ siku: d }).sort('time')

        if (ftips.length == 0) {
            ftips = await supatipsModel.find({ siku: d }).sort('time')
        }
        res.json(ftips)
    } catch (err) {
        let tgAPI = `https://api.telegram.org/bot${process.env.RT_TOKEN}/copyMessage`
        console.log(err.message, err)
        await axios.post(tgAPI, {
            chat_id: 741815228,
            from_chat_id: -1002634850653, //rtcopyDB
            message_id: 43
        }).catch(e => console.log(e.response.data))
    }
})

router.get('/gsb/register', (req, res) => {
    let bway = `https://www.betway.co.tz/?btag=P94949-PR24696-CM77068-TS1971458&`
    let gsb = `https://track.africabetpartners.com/visit/?bta=35468&nci=5657`
    res.redirect(gsb)
})

router.get('/pmatch/register', (req, res) => {
    res.redirect('https://grwptraq.com/?serial=61288670&creative_id=1788&anid=web&pid=web')
})

router.get('/pmatch2/register', (req, res) => {
    //ya-uhakika deal
    res.redirect('https://pmaff.com/?serial=61292164&creative_id=1788')
})

router.get('/888bet/register', (req, res) => {
    res.redirect(`https://media.888africa.com/C.ashx?btag=a_416b_307c_&affid=356&siteid=416&adid=307&c=`)
})

router.get('/leonbet/register', (req, res) => {
    res.redirect(`https://c1li7tt5ck.com/?serial=44835&creative_id=1078&anid=`)
})

router.get('/betway/register', (req, res) => {
    let url = `https://www.betway.co.tz/?btag=P94949-PR24696-CM77068-TS1971458&`
    res.redirect(url)
})

router.get('/contact/telegram', (req, res) => {
    res.redirect('https://t.me/+owXoXwLlSHxmYjJk')
})

router.get('/API/testing', async (req, res)=> {
    //await miamalaModel.syncIndexes()
    res.end()
})

router.get('*', (req, res) => {
    res.sendStatus(404)
})

module.exports = router