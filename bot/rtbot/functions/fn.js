const rtStarterModel = require('../database/chats')
const binModel = require('../database/rtbin')
const axios = require('axios').default

const createUser = async (ctx, delay) => {
    try {
        let chatid = ctx.chat.id
        let username = ctx.chat.first_name
        let handle = 'unknown'
        let refferer = ctx.botInfo.username

        if (ctx.chat.username) {
            handle = ctx.chat.username
        }

        let user = await rtStarterModel.findOne({ chatid })

        if (!user) {
            await ctx.reply(`Habari! ${username}\n\nHongera umepokea points 1000 bure zitakazokuwezesha kupata videos zetu. \nKila video itakugharimu points 250`)
            await rtStarterModel.create({
                chatid, username, handle, refferer, paid: false, points: 1000
            })
            await delay(2000)
        } else if (user && user.refferer != refferer) {
            await user.updateOne({ $set: { refferer: refferer } })
        }
    } catch (error) {
        console.log(error.message)
    }
}

const sendPaidVideo = async (ctx, delay, bot, imp, vid, userid, OS) => {
    //upload video
    let botname = ctx.botInfo.username
    await ctx.sendChatAction('upload_video')
    let dvid = await bot.telegram.copyMessage(userid, imp.ohmyDB, vid.msgId, {
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
        await ctx.sendChatAction('typing')
        await binModel.create({ chatid: Number(userid), nano: vid.nano })

        let rcvr = await rtStarterModel.findOneAndUpdate({ chatid: userid }, { $inc: { points: -250 } }, { new: true })

        // setTimeout(() => {
        //     ctx.reply(`Umepokea Full Video kwa gharama ya points 250. Umebakiwa na Points ${rcvr.points}.`, {
        //         reply_markup: {
        //             inline_keyboard: [
        //                 [
        //                     { text: "💰 Salio", callback_data: 'salio' },
        //                     { text: "➕ Ongeza Points", callback_data: 'ongeza_points' }
        //                 ]
        //             ]
        //         }
        //     }).catch(e => console.log(e.message))
        // }, 1000);

        let txt = `Umepokea Full Video kwa gharama ya points 250. Umebakiwa na Points ${rcvr.points}.`
        let data = {
            chat_id: ctx.chat.id,
            text: txt,
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "💰 Salio", callback_data: 'salio' },
                        { text: "➕ Ongeza Points", callback_data: 'ongeza_points' }
                    ]
                ]
            }
        }
        let other = `Umepokea video ... Umebakiwa na points <b>${rcvr.points}</b>`
        let rtAPI = `https://api.telegram.org/bot${process.env.RT_TOKEN}/sendMessage`
        let plAPI = `https://api.telegram.org/bot${process.env.PL_TOKEN}/sendMessage`

        setTimeout(() => {
            if (botname == 'rahatupu_tzbot') {
                axios.post(rtAPI, data)
                    .then(() => {
                        data.text = other.replace('...', 'kutoka kwa <b>@rahatupu_tzbot</b>')
                        data.disable_notification = true
                        data.reply_markup.inline_keyboard[0].shift()
                        axios.post(plAPI, data).catch(e => console.log(e.message))
                    }).catch(e => console.log(e.message))
            } else if (botname == 'pilau_bot') {
                axios.post(plAPI, data)
                    .then(() => {
                        data.text = other.replace('...', 'kutoka kwa <b>@pilau_bot.</b>')
                        data.disable_notification = true
                        data.reply_markup.inline_keyboard[0].shift()
                        axios.post(rtAPI, data).catch(e => console.log(e.message))
                    }).catch(e => console.log(e.message))
            }
        }, 1000)
    }
}

const payingInfo = async (bot, ctx, delay, imp, userid, mid) => {
    await ctx.sendChatAction('typing')
    await bot.telegram.copyMessage(userid, imp.matangazoDB, mid, {
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
                    { text: 'Other 🏳️', callback_data: 'other_networks' }
                ],
                [
                    { text: '⛑ Help / Msaada ⛑', callback_data: 'help-msaada' }
                ]
            ]
        }
    })
}

const mtandaoCallBack = async (bot, ctx, chatid, imp, msgid, cbmid) => {
    await ctx.deleteMessage(cbmid)
    await bot.telegram.copyMessage(chatid, imp.matangazoDB, msgid, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '✅ Nimelipia Tayari', callback_data: 'nimelipia' }
                ],
                [
                    { text: '← Rudi nyuma', callback_data: 'rudi_nyuma' }
                ]
            ]
        }
    })
}

const rudiNyumaReply = async (bot, ctx, chatid, imp, msgid, cbmid) => {
    await ctx.deleteMessage(cbmid)
    await bot.telegram.copyMessage(chatid, imp.matangazoDB, msgid, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '← Rudi nyuma', callback_data: 'rudi_nyuma' },
                    { text: '⛑ Admin', url: 'https://t.me/rt_malipo' }
                ]
            ]
        }
    })
}

module.exports = {
    createUser,
    sendPaidVideo,
    payingInfo,
    mtandaoCallBack,
    rudiNyumaReply
}