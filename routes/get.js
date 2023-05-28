const router = require('express').Router()
const mkekadb = require('../model/mkeka-mega')
const fametipsModel = require('../model/fametips')
const supatipsModel = require('../model/supatips')
const betslip = require('../model/betslip')
const graphModel = require('../model/graph-tips')

//times
const TimeAgo = require('javascript-time-ago')
const en = require('javascript-time-ago/locale/en')
TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US')

//send success (no content) response to browser
router.get('/favicon.ico', (req, res) => res.status(204).end());

router.get('/', async (req, res) => {
    try {
        //fametip ya leo //kama hakuna chukua toka kwa parent (supatips)
        let d = new Date().toLocaleDateString('en-GB', {timeZone: 'Africa/Nairobi'})
        let ftips = await fametipsModel.find({ siku: d }).sort('time')

        if(ftips.length == 0) {
            ftips = await supatipsModel.find({ siku: d }).sort('time')
        }

        //fametips 100 za nyuma
        let zaNyuma100 = await fametipsModel.find().limit(100).sort('-UTC3')

        //fametip ya jana //kama hakuna chukua toka kwa parent (supatips)
        let _nd = new Date()
        _nd.setDate(_nd.getDate() - 1)
        let _d = _nd.toLocaleDateString('en-GB', { timeZone: 'Africa/Nairobi' })
        let ytips = await fametipsModel.find({ siku: _d }).sort('time')

        if(ytips.length == 0) {
            ytips = await supatipsModel.find({ siku: _d }).sort('time')
        }

        //fametip ya juzi //kama hakuna chukua toka kwa parent (supatips)
        let _jd = new Date()
        _jd.setDate(_jd.getDate() - 2)
        let _s = _jd.toLocaleDateString('en-GB', { timeZone: 'Africa/Nairobi' })
        let jtips = await fametipsModel.find({ siku: _s }).sort('time')

        if(jtips.length == 0) {
            jtips = await supatipsModel.find({ siku: _s }).sort('time')
        }

        //fametip ya kesho
        let new_d = new Date()
        new_d.setDate(new_d.getDate() + 1)
        let kesho = new_d.toLocaleDateString('en-GB', { timeZone: 'Africa/Nairobi' })
        let ktips = await fametipsModel.find({ siku: kesho })

        res.render('1-home/home', { ftips, ytips, ktips, jtips, zaNyuma100 })
    } catch (err) {
        console.log(err)
        console.log(err.message)
    }

})

router.get('/gsb/register', (req, res) => {
    res.redirect('https://track.africabetpartners.com/visit/?bta=35468&nci=5439')
})

router.get('/pmatch/register', (req, res) => {
    res.redirect('https://pmaff.com/?serial=61288670&creative_id=1788&anid=mkekawaleo&pid=mkekawaleo')
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
    res.redirect('https://t.me/cute_helen255')
})

router.all('*', (req, res) => {
    res.sendStatus(404)
})

module.exports = router