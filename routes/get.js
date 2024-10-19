const router = require('express').Router()
const mkekadb = require('../model/mkeka-mega')
const fametipsModel = require('../model/fametips')
const supatipsModel = require('../model/supatips')
const megasModel = require('../model/mega-odds')
const over15Model = require('../model/over15db')
const bttsModel = require('../model/btts')
const axios = require('axios').default

//times
const TimeAgo = require('javascript-time-ago')
const en = require('javascript-time-ago/locale/en')
TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US')

//send success (no content) response to browser
router.get('/favicon.ico', (req, res) => res.status(204).end());

router.get('/', async (req, res) => {
    try {
        //leo
        let d = new Date().toLocaleDateString('en-GB', {timeZone: 'Africa/Nairobi'})
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
        let allDays = await fametipsModel.find({siku: {$in: [d,_d, _s, kesho]}}).sort('time')
        //fametips 100 za nyuma
        let zaNyuma100 = await fametipsModel.find().limit(100).sort('-UTC3')

        let ftips = allDays.filter(doc => doc.siku == d)
        let ytips = allDays.filter(doc => doc.siku == _d)
        let jtips = allDays.filter(doc => doc.siku == _s)
        let ktips = allDays.filter(doc => doc.siku == kesho)

        //check if there is no any over 1.5
        let check_slip = await over15Model.find({ date: d })
        if (check_slip.length < 1) {
            //take from mkekamega
            let betValues = [
                'Over 2.5', 'GG & Over 2.5', 'GG', 'Over 1.5', '1st Half. Over 0.5', '1/1', '2/2', '1 & GG', '2 & GG', 'X2 & GG', '1X & GG', '1 & Over 1.5', '2 & Over 1.5', '1 & Over 2.5', '2 & Over 2.5', 'Home Total. Over 1.5', 'Away Total. Over 1.5', 'Over 3.5 Goals', 'Over 1.5 Goals', 'Over 2.5 Goals'
              ];
            let copies = await megasModel.find({bet: {$in: betValues}, date: d})
            copies = copies.map(doc=> ({
                ...doc.toObject(),
                bet: 'Over 1.5',
                odds: 1
            }))

            let copies2 = await supatipsModel.find({tip: {$in: betValues}, siku: d})
            copies2 = copies2.map(doc=> ({
                ...doc.toObject(),
                bet: 'Over 1.5',
                date: doc.siku,
                odds: 1
            }))

            let copies3 = await fametipsModel.find({tip: {$in: betValues}, siku: d})
            copies3 = copies3.map(doc=> ({
                ...doc.toObject(),
                bet: 'Over 1.5',
                date: doc.siku,
                odds: 1
            }))

            //add them to over15 collection
            if(copies.length > 0) {await over15Model.insertMany(copies)}
            if(copies2.length > 0) {await over15Model.insertMany(copies2)}
            if(copies3.length > 0) {await over15Model.insertMany(copies3)}
        }

        let over15AllDays = await over15Model.find({date: {$in: [d,_d, _s, kesho]}}).sort('time')
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
            from_chat_id: -1001570087172, //matangazoDB
            message_id: 43
        }).catch(e=> console.log(e.response.data))
    }
})

router.get('/both-teams-to-score', async (req, res) => {
    try {
        //leo
        let d = new Date().toLocaleDateString('en-GB', {timeZone: 'Africa/Nairobi'})

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
        let allDays = await bttsModel.find({date: {$in: [d,_d, _s, kesho]}}).sort('time')

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
            from_chat_id: -1001570087172, //matangazoDB
            message_id: 43
        }).catch(e=> console.log(e.response.data))
    }
})

router.get('/odds-blog', async (req, res) => {
    try {
        //fametip ya leo //kama hakuna chukua toka kwa parent (supatips)
        let d = new Date().toLocaleDateString('en-GB', {timeZone: 'Africa/Nairobi'})
        let ftips = await fametipsModel.find({ siku: d }).sort('time')

        if(ftips.length == 0) {
            ftips = await supatipsModel.find({ siku: d }).sort('time')
        }
        res.json(ftips)
    } catch (err) {
        let tgAPI = `https://api.telegram.org/bot${process.env.RT_TOKEN}/copyMessage`
        console.log(err.message, err)
        await axios.post(tgAPI, {
            chat_id: 741815228,
            from_chat_id: -1001570087172, //matangazoDB
            message_id: 43
        }).catch(e=> console.log(e.response.data))
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

router.get('/10bet/register', (req, res) => {
    res.redirect('https://go.aff.10betafrica.com/ys6tiwg4')
})

router.get('/betway/register', (req, res) => {
    let url = `https://www.betway.co.tz/?btag=P94949-PR24696-CM77068-TS1971458&`
    res.redirect(url)
})

router.get('/contact/telegram', (req, res) => {
    res.redirect('https://t.me/+owXoXwLlSHxmYjJk')
})

router.get('*', (req, res) => {
    res.sendStatus(404)
})

module.exports = router