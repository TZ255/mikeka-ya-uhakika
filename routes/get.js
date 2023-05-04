const router = require('express').Router()
const mkekadb = require('../model/mkeka-mega')
const supatips = require('../model/supatips')
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
        //supatip ya leo
        let stips = await supatips.find({ siku: d })

        //supatip ya jana
        let _nd = new Date()
        _nd.setDate(_nd.getDate() - 1)
        let _d = _nd.toLocaleDateString('en-GB', { timeZone: 'Africa/Nairobi' })
        let ytips = await supatips.find({ siku: _d })

        //supatip ya juzi
        let _jd = new Date()
        _jd.setDate(_jd.getDate() - 2)
        let _s = _jd.toLocaleDateString('en-GB', { timeZone: 'Africa/Nairobi' })
        let jtips = await supatips.find({ siku: _s })

        //supatip ya kesho
        let new_d = new Date()
        new_d.setDate(new_d.getDate() + 1)
        let kesho = new_d.toLocaleDateString('en-GB', { timeZone: 'Africa/Nairobi' })
        let ktips = await supatips.find({ siku: kesho })

        res.render('1-home/home', { stips, ytips, ktips, jtips })
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