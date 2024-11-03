const rtStarterModel = require('../database/chats')
const toDeleteMsgs = require('../database/todelete')
const binModel = require('../database/rtbin')
const miamalaModel = require('../database/miamala');
const axios = require('axios').default

const createUser = async (ctx, delay) => {
    try {
        let chatid = ctx.chat.id
        let username = ctx.chat.first_name
        let handle = ctx.chat.username ? ctx.chat.username : 'unknown'
        let refferer = ctx.me.username

        let user = await rtStarterModel.findOne({ chatid })

        if (!user) {
            await ctx.reply(`Habari! ${username}\n\nHongera umepokea points 1000 bure zitakazokuwezesha kupata videos na movies zetu. \nKila video/movie itakugharimu points 250`)
            await rtStarterModel.create({
                chatid, username, handle, refferer, paid: false, points: 1000, movie: 0, shows: 0, bots: [refferer]
            })
            await delay(2000)
        } else if (user && (!user.bots.includes(refferer) || user.refferer != refferer)) {
            //kama array ya bots haina huyu bot ongeza
            if (!user.bots.includes(refferer)) {
                await user.updateOne({ $push: { bots: refferer } })
            }
            //kama huyu bot sio refferer update
            if (user.refferer != refferer) {
                await user.updateOne({ $set: { refferer: refferer } })
            }
        }
    } catch (error) {
        console.log(error.message)
    }
}

const createChannelLink = async (bot, chanid, expire, limit, linkName, errorAdmin) => {
    try {
        let link = await bot.api.createChatInviteLink(chanid, {
            name: linkName,
            expire_date: expire,
            member_limit: limit
        })
        return link.invite_link
    } catch (error) {
        console.log(error.message, error)
        bot.api.sendMessage(errorAdmin, error.message)
            .catch(e => console.log(e))
    }
}

//check if members of pilau zone
const checkPaidIfMemberPilauZone = async (bot, chatid, pilau_id, link_expire, error_admin) => {
    try {
        //check status
        let status = await bot.api.getChatMember(pilau_id, chatid)
        if(status.status == 'left') {
            //create inviteLink
            let link = await createChannelLink(bot, pilau_id, link_expire, 1, `paid ${chatid}`, error_admin)
            return link;
        } else {
            return false
        }
    } catch (error) {
        console.log(error.message)
    }
}

const sendPaidVideo = async (ctx, delay, bot, imp, vid, userid, OS) => {
    //upload video
    let type = OS
    let botname = ctx.me.username
    await ctx.replyWithChatAction('upload_video')
    let dvid = await bot.api.copyMessage(userid, imp.ohmyDB, vid.msgId, {
        protect_content: false,
        reply_markup: {
            keyboard: [
                [
                    { text: "➕ Ongeza Points" },
                    { text: "⛑ Help / Msaada ⛑" }
                ]
            ],
            is_persistent: true,
            resize_keyboard: true
        }
    })

    //check if video sent in past 4hrs
    //if not add to duplicate and deduct 250 points
    let dup_checker = await binModel.findOne({ chatid: Number(userid), nano: vid.nano })
    if (!dup_checker) {
        await ctx.replyWithChatAction('typing')
        await binModel.create({ chatid: Number(userid), nano: vid.nano })

        let rcvr = await rtStarterModel.findOneAndUpdate({ chatid: userid }, { $inc: { points: -250 } }, { new: true })

        let txt = `Umepokea Full Video kwa gharama ya points 250. Umebakiwa na Points ${rcvr.points}.`
        if (type == 'movie') {
            txt = `Umepokea Movie kwa gharama ya points 250. Umebakiwa na Points ${rcvr.points}.`
            await rtStarterModel.findOneAndUpdate({ chatid: userid }, { $inc: { movie: 1 } })
        } else {
            await rtStarterModel.findOneAndUpdate({ chatid: userid }, { $inc: { shows: 1 } })
        }

        setTimeout(() => {
            ctx.reply(txt, {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: "💰 Salio", callback_data: 'salio' },
                            { text: "➕ Ongeza Points", callback_data: 'ongeza_points' }
                        ]
                    ]
                }
            }).catch(e => console.log(e.message, e))
        }, 1000)
    }
}

const payingInfo = async (bot, ctx, delay, imp, userid, mid) => {
    await ctx.replyWithChatAction('typing')
    await bot.api.copyMessage(userid, imp.matangazoDB, mid, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'M-PESA 🇹🇿', callback_data: 'voda' },
                    { text: 'Tigo Pesa 🇹🇿', callback_data: 'tigo' }
                ],
                [
                    { text: 'Airtel 🇹🇿', callback_data: 'airtel' },
                    { text: 'Halotel 🇹🇿', callback_data: 'halotel' }
                ],
                [
                    { text: 'SafariCom 🇰🇪', callback_data: 'safaricom' },
                    { text: 'Uganda 🇺🇬', callback_data: 'uganda' }
                ],
                [
                    { text: '⛑ Get Help (Msaada)', callback_data: 'help-msaada' }
                ]
            ]
        }
    })
}

const addingPoints = async (ctx, chatid, points, imp) => {
    try {
        let android = `https://t.me/+RFRJJNq0ERM1YTBk`
        let iphone = `https://t.me/+dGYRm-FoKJI3MWM8`
        let muvika = `https://t.me/+9CChSlwpGWk2YmI0`

        //add user points
        let upuser = await rtStarterModel.findOneAndUpdate({ chatid }, {
            $inc: { points: points },
            $set: { paid: true }
        }, { new: true })

        //update revenues
        let rev = await rtStarterModel.findOneAndUpdate({ chatid: imp.rtmalipo }, { $inc: { revenue: points } }, { new: true })

        //text to reply to me
        let txt1 = `Points za ${upuser.username} zimeongezwa to <b>${upuser.points} pts.</b>\n\n<u>User Data</u>\n• Points: ${upuser.points}\n• Id: <code>${upuser.chatid}</code>\n• Movies: ${upuser.movie}\n• TV Series: ${upuser.shows}\n• Fullname: ${upuser?.fullName}\n• Phone: ${upuser?.phone}\n• Ref: ${upuser?.refferer}\n\n<tg-spoiler>Mapato added to ${rev.revenue.toLocaleString('en-US')}</tg-spoiler>`

        //text to send to user
        let txt2 = `<b>Hongera 🎉 \nMalipo yako yamethibitishwa. Umepokea Points ${points} na sasa una jumla ya Points ${upuser.points} kwenye account yako ya RT Malipo.</b>\n\nTumia points zako vizuri. Kumbuka Kila video utakayo download itakugharimu Points 250.\n\n\n<b>Enjoy, ❤.</b>`

        //text to send if we deduct points
        let txt3 = `<b>Points ${points} zimeondolewa kwenye account yako na Admin. Umebakiwa na points ${upuser.points}.</b>`

        //api to send message to user
        let rtAPI = `https://api.telegram.org/bot${process.env.RT_TOKEN}/sendMessage`
        let plAPI = `https://api.telegram.org/bot${process.env.PL_TOKEN}/sendMessage`
        let mvAPI = `https://api.telegram.org/bot${process.env.MUVIKA_TOKEN}/sendMessage`


        //reply user info after adding points
        await ctx.reply(txt1, { parse_mode: 'HTML' })

        //data to send to user with API
        let data = { chat_id: chatid, text: txt2, parse_mode: 'HTML' }

        //check if points is negative, update data to deduction message
        if (points < 0) {
            data.text = txt3
        }

        //send to users acording to the bot he using
        switch (upuser.refferer) {
            case 'rahatupu_tzbot':
                axios.post(rtAPI, data).catch(e => console.log(e.message))
                break;
            case 'pilau_bot':
                axios.post(plAPI, data).catch(e => console.log(e.message))
                break;
            case 'muvikabot':
                axios.post(mvAPI, data).catch(e => console.log(e.message))
                break;
        }

        //clear miamala if user name is on it
        if (upuser?.fullName) {
            await miamalaModel.deleteMany({name: upuser.fullName})
        }
    } catch (error) {
        await ctx.reply(error.message)
    }
}

const mtandaoCallBack = async (bot, ctx, chatid, imp, msgid, cbmid) => {
    let info = await bot.api.copyMessage(chatid, imp.matangazoDB, msgid, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '✅ Tayari nimefanya malipo', callback_data: 'nimelipia' }
                ],
                [
                    { text: '← Anza upya', callback_data: 'rudi_nyuma' }
                ]
            ]
        }
    })
    let botname = ctx.me.username
    await toDeleteMsgs.create({ userid: chatid, bot: botname, msgid: info.message_id })
    await ctx.api.deleteMessage(chatid, cbmid)
}

const rudiNyumaReply = async (bot, ctx, chatid, imp, msgid, cbmid) => {
    await bot.api.copyMessage(chatid, imp.matangazoDB, msgid, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '← Nyuma/Back', callback_data: 'rudi_nyuma' },
                    { text: '⛑ Admin', url: 'https://t.me/pilauzone_admin' }
                ]
            ]
        }
    })
    await ctx.api.deleteMessage(chatid, cbmid)
}

const deteleMessages = async (delay) => {
    try {
        let all = await toDeleteMsgs.find()
        let rtAPI = `https://api.telegram.org/bot${process.env.RT_TOKEN}/deleteMessage`
        let plAPI = `https://api.telegram.org/bot${process.env.PL_TOKEN}/deleteMessage`
        let mvAPI = `https://api.telegram.org/bot${process.env.MUVIKA_TOKEN}/deleteMessage`

        for (let el of all) {
            let { userid, msgid, bot } = el
            let data = { chat_id: userid, message_id: msgid }

            if (bot == 'muvikabot') {
                await axios.post(mvAPI, data).catch(e => console.log(`${bot} delete failed: ${e.message}`))
                await el.deleteOne()
                await delay(11) //delete 91 message per seconds
            } else if (bot == 'pilau_bot') {
                await axios.post(plAPI, data).catch(e => console.log(`${bot} delete failed: ${e.message}`))
                await el.deleteOne()
                await delay(11) //delete 91 message per seconds
            } else if (bot == 'rahatupu_tzbot') {
                await axios.post(rtAPI, data).catch(e => console.log(`${bot} delete failed: ${e.message}`))
                await el.deleteOne()
                await delay(11) //delete 91 message per seconds
            }
        }
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    createUser,
    sendPaidVideo,
    payingInfo,
    mtandaoCallBack,
    rudiNyumaReply,
    addingPoints,
    deteleMessages,
    createChannelLink,
    checkPaidIfMemberPilauZone
}