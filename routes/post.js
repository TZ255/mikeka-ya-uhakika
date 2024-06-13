const router = require('express').Router()
const axios = require('axios').default

const dayoUsers = require('../model/dayo-users')

const imp = {
    replyDb: -1001608248942,
    pzone: -1001352114412,
    rpzone: -1001549769969,
    prem_channel: -1001470139866,
    local_domain: 't.me/rss_shemdoe_bot?start=',
    prod_domain: 't.me/ohmychannelV2bot?start=',
    shemdoe: 741815228,
    halot: 1473393723,
    sh1xbet: 5755271222,
    xzone: -1001740624527,
    ohmyDB: -1001586042518,
    xbongo: -1001263624837,
    mikekaDB: -1001696592315,
    logsBin: -1001845473074,
    mylove: -1001748858805,
    mkekaLeo: -1001733907813,
    matangazoDB: -1001570087172,
    r_chatting: -1001722693791,
    dstore: -1001245181784,
    linksChannel: -1002042952349,
    sio_shida: -1002110306030
}

router.post('/dayonce/:admin/:msgid', async (req, res) => {
    try {
        //end connection
        res.status(200).send({ success: true });

        //perform convos
        let defaultReplyMkp = {
            keyboard: [
                [
                    { text: "MKEKA 1" },
                    { text: "MKEKA 2" },
                    { text: "MKEKA 3" },
                ]
            ],
            is_persistent: true,
            resize_keyboard: true
        }

        let msgid = Number(req.params.msgid)
        let admin = Number(req.params.admin)
        let bads = ['blocked', 'deactivated']
        let delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
        let API = `https://api.telegram.org/bot${process.env.DAYO_TOKEN}/copyMessage`
        if ([imp.shemdoe, imp.halot].includes(admin)) {
            let all_users = await dayoUsers.find().limit(1000)

            for (let [index, u] of all_users.entries()) {
                let data = {
                    chat_id: Number(u.chatid),
                    from_chat_id: Number(imp.mikekaDB),
                    message_id: msgid,
                    reply_markup: defaultReplyMkp
                }
                await axios.post(API, data)
                    .then(() => { console.log(`✅ convo sent to ${u.username}`) })
                    .catch(async err => {
                        console.log(err.message)
                        if (err.response && err.response.data && err.response.data.description) {
                            let description = err.response.data.description
                            description = description.toLowerCase()
                            if (bads.some((bad) => description.includes(bad))) {
                                await u.deleteOne()
                                console.log(`🚮 ${u.username} deleted`)
                            } else { console.log(`🤷‍♂️ ${description}`) }
                        }
                    })
                await delay(35)
            }
            await axios.post(API, { chat_id: imp.shemdoe, from_chat_id: imp.mikekaDB, message_id: 8 })
        }
    } catch (error) {
        console.log(`(Dayo Web Convo): ${error.message}`)
    }
})

module.exports = router