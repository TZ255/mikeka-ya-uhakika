const verifiedList = require('../database/verified')
const toDeleteModel = require('../database/MsgtoDelete')
const pipyUsers = require('../database/chats')
const { uaminifuMessage, remindMtoaHuduma } = require('./partials/smallFns')

const zingatiaMsg = `<b>❌❌ ZINGATIA ❌❌ ZINGATIA\n\nUsitume hela kwa yeyote atakaekufuata inbox kukuambia ni admin, dalali au mtoa huduma wa group hili.</b> \n\nNjia pekee ya kuwasiliana na dalali au mtoa huduma wa group hili ni kwa kubonyeza jina lake kwenye list ya watoa huduma waaminifu au ujumbe chini ya tangazo lake unaosema yeye ni mwaminifu.\n\n<b>Mteja! Narudia tena... \nUKITAPELIWA NI UFALA WAKO BRO.\n\nYOYOTE ATAKAE KUFUATA INBOX NI TAPELI, USIMSIKILIZE... PIGA BLOCK </b> kisha report kwenye group aondolewe.`

const rmarkup = {
    inline_keyboard: [
        [
            { text: 'List ya Watoa Huduma', url: 'https://t.me/PipyTidaBot?start=watoa_huduma' }
        ]
    ]
}

const promotePrivillages = {
    is_anonymous: false,
    can_manage_chat: false,
    can_delete_messages: false,
    can_manage_video_chats: false,
    can_restrict_members: false,
    can_promote_members: false,
    can_change_info: false,
    can_invite_users: true,
    can_pin_messages: false,
    can_manage_topics: false
}

const promoteBanPrivillages = {
    is_anonymous: false,
    can_manage_chat: false,
    can_delete_messages: false,
    can_manage_video_chats: false,
    can_restrict_members: true,
    can_promote_members: false,
    can_change_info: false,
    can_invite_users: true,
    can_pin_messages: false,
    can_manage_topics: false
}

const demotePrivillages = {
    is_anonymous: false,
    can_manage_chat: false,
    can_delete_messages: false,
    can_manage_video_chats: false,
    can_restrict_members: false,
    can_promote_members: false,
    can_change_info: false,
    can_invite_users: false,
    can_post_stories: false,
    can_edit_stories: false,
    can_delete_stories: false,
    can_pin_messages: false,
    can_manage_topics: false
}

const verifyFn = async (bot, ctx, imp) => {
    try {
        let txt = ctx.message.text
        let userid = ctx.message.reply_to_message.from.id
        let fname = ctx.message.reply_to_message.from.first_name
        let username = ctx.message.reply_to_message.from.username ? ctx.message.reply_to_message.from.username : 'unknown'
        if (ctx.message.reply_to_message.from.last_name) {
            fname = fname + ` ${ctx.message.reply_to_message.from.last_name}`
        }

        let check = await verifiedList.findOne({ chatid: userid })
        if (!check) {
            let ver_user = await verifiedList.create({
                chatid: userid, fname, username, paid: true
            })
            let mention = `<a href="tg://user?id=${userid}">${ver_user.fname}</a>`
            let msg = await ctx.reply(`Mtoa huduma ${mention} ameongezwa kwenye list ya watoa huduma waliothibitishwa kwenye group hili.`, { parse_mode: 'HTML' })
            await toDeleteModel.create({ msgid: msg.message_id, chatid: ctx.chat.id })
        } else {
            let ver_user = await verifiedList.findOneAndUpdate({ chatid: userid }, { $set: { paid: true } }, { new: true })
            let mention = `<a href="tg://user?id=${userid}">${ver_user.fname}</a>`
            let msg = await ctx.reply(`Mtoa huduma ${mention} ameongezwa kwenye list ya watoa huduma waliothibitishwa kwenye group hili.`, { parse_mode: 'HTML' })
            await toDeleteModel.create({ msgid: msg.message_id, chatid: ctx.chat.id })
        }
    } catch (error) {
        await ctx.reply(error.message)
        console.log(error.message)
    }
}

const UnverifyFn = async (bot, ctx, imp) => {
    try {
        let txt = ctx.message.text
        let userid = ctx.message.reply_to_message.from.id
        let fname = ctx.message.reply_to_message.from.first_name
        let username = ctx.message.reply_to_message.from.username ? ctx.message.reply_to_message.from.username : 'unknown'
        if (ctx.message.reply_to_message.from.last_name) {
            fname = fname + ` ${ctx.message.reply_to_message.from.last_name}`
        }

        let mention = `<a href="tg://user?id=${userid}">${fname}</a>`
        await ctx.reply(`Mtoa huduma ${mention} ameondolewa kwenye list ya watoa huduma waliothibitishwa kwenye group hili. Kuwa makini unapofanya nae kazi.\n\n<b>${mention}</b> ili kuendelea kufanya kazi kwenye group hili wasiliana na admin <b>@Blackberry255</b> ili kuthibitishwa.`, { parse_mode: 'HTML' })
    } catch (error) {
        await ctx.reply(error.message)
        console.log(error.message)
    }
}

//reusable restriction
const reusableRestriction = async (bot, ctx, caption, charsNum, delay) => {
    try {
        let wajinga = ['+255 750 707 357']
        let d = new Date().toLocaleTimeString('en-GB', { timeZone: 'Africa/Nairobi', timeStyle: 'short' })
        let masaa = Number(d.split(':')[0])
        let userid = ctx.message.from.id
        let msgid = ctx.message.message_id
        let list = await verifiedList.findOne({ chatid: userid })
        if ((list && list.paid && list.role == 'dada') && (caption.length > charsNum || wajinga.some(w => caption.includes(w)))) {
            let unix = ctx.message.date
            let until_date = unix + 420 //7 mins
            let muda = new Date(until_date * 1000).toLocaleTimeString('en-GB', { timeZone: 'Africa/Nairobi', timeStyle: 'short' })
            let tag = `<a href="tg://user?id=${userid}">${list.fname}</a>`
            let loc = list.loc ? ` <b>(${list.loc})</b>.` : ''
            await list.updateOne({ $set: { again: until_date } })
            await ctx.replyWithChatAction('typing')
            await delay(1000)
            //angalia kama mtoa huduma amebakiza masaa 12 hela yake kuisha
            //kwenye db taarifa ziko kwa +3 bongo
            if (list.unix) {
                let now = Date.now() / 1000  //convert to seconds
                let dbEnd = list.unix
                let diff = dbEnd - now
                let tenHrs = 10 * 60 * 60
                //check difference if its <12 hours
                if (diff > 60 && diff < tenHrs) {
                    //kumbusha kulipia
                    await remindMtoaHuduma(ctx, tag, msgid)
                } else if (diff > tenHrs) {
                    //send uaminifu message
                    let notf = await uaminifuMessage(ctx, tag, muda, loc, userid, msgid)
                    //delete message later
                    await toDeleteModel.create({ chatid: ctx.chat.id, msgid: notf.message_id })
                }
                if (now >= dbEnd) {
                    //demote user
                    await ctx.api.promoteChatMember(ctx.chat.id, userid, demotePrivillages)
                        .catch(e => console.log(e.message))
                    await list.updateOne({ $set: { paid: false } })
                    await bot.api.sendMessage(1101685785, `${list.fname} demoted`) //blackberry
                }
            }
        }
    } catch (error) { console.log(error.message, error) }
}

//mute tangazo for 5 minutes
const muteVideosPhotos = async (bot, ctx, imp, delay) => {
    try {
        let caption = ctx.message.caption ? ctx.message.caption : 'null'
        await reusableRestriction(bot, ctx, caption, 50, delay)
    } catch (error) {
        console.log(error.message, error)
    }
}

//mute tangazo for 10 minutes
const muteLongTextsAndVideos = async (bot, ctx, imp, delay) => {
    try {
        let length = 0
        let caption = 'no cap'
        if (ctx.message.text) {
            caption = ctx.message.text
            length = 300
        } else if (ctx.message.caption) {
            caption = ctx.message.caption
            length = 100
        }
        let userid = ctx.message.from.id
        let msgid = ctx.message.message_id
        let fname = ctx.message.from.first_name
        let name = ctx.message.from.last_name ? `${fname} ${ctx.message.from.last_name}` : fname
        let ment = `<a href="tg://user?id=${userid}">${name}</a>`
        if (caption.length >= length) {
            let unix = ctx.message.date
            let verified = await verifiedList.findOne({ chatid: userid })
            if (verified?.again && verified.again > unix) {
                //add 60 seconds to net 30 minutes
                let muda = new Date(verified.again * 1000).toLocaleTimeString('en-GB', { timeZone: 'Africa/Nairobi', timeStyle: 'short' })
                let subiri = await ctx.reply(`<b>${ment}</b> ulisubirishwa kupost tangazo kwa muda, utaruhusiwa kupost tena saa <b>${muda}</b>`, {
                    reply_parameters: {
                        message_id: msgid, allow_sending_without_reply: true
                    }, parse_mode: 'HTML'
                })
                setTimeout(() => {
                    ctx.api.deleteMessage(ctx.chat.id, msgid).catch(e => console.log(e.message, e))
                    ctx.api.deleteMessage(ctx.chat.id, subiri.message_id).catch(e => console.log(e.message, e))
                }, 7000)
            } else {
                //call to check if is verified member, allow and mute
                await reusableRestriction(bot, ctx, caption, length, delay)
            }
        }
    } catch (error) {
        console.log(error.message, error)
    }
}

const checkSenderFn = async (bot, ctx, imp) => {
    try {
        let msg_id = ctx.message.message_id
        let sender = ctx.message.from.id
        let username = ctx.message.from.username ? ctx.message.from.username : 'unknown'
        let unixNow = ctx.message.date
        let fname = ctx.message.from.first_name
        let name = ctx.message.from.last_name ? `${fname} ${ctx.message.from.last_name}` : fname
        let caption = ctx.message.caption ? ctx.message.caption : 'no cap'

        let data = await verifiedList.findOne({ chatid: sender })
        //let status = await ctx.getChatMember(sender)
        if ((!data || data.paid == false) && caption.length > 100) {
            await ctx.restrictChatMember(sender, {
                until_date: unixNow + 21600
            })
            let watoa = await verifiedList.find({ paid: true }).sort('createdAt')
            let txt = `<b><u>List ya watoa huduma waliothibitishwa</u></b>\n\n`
            for (let [i, w] of watoa.entries()) {
                let ment = `<a href="tg://user?id=${w.chatid}">${w.fname}</a>`
                let username = w.username == 'unknown' ? ment : `@${w.username}`
                txt = txt + `<b>${i + 1}. ${username} - (${w.fname})</b>\n\n`
            }
            let mambo = await ctx.reply(`Mambo <b>${name}</b> Nimekupumzisha kwa masaa 6.\n\nHuruhusiwi kutuma tangazo la picha wala video kwenye group hili. Huduma hii ipo kwa watoa huduma waliothibitishwa tu.\n\nKama wewe ni mdada (mtoa huduma) tafadhali wasiliana na admin <b>@Blackberry255</b> kuthibitishwa. Ukimfuata admin inbox hakikisha wewe ni mtoa huduma vinginevyo atakublock na mimi nitakuondoa kwenye group (hatupendi usumbufu 😏)\n\n\n${txt}`, { parse_mode: 'HTML', reply_to_message_id: msg_id })
            await toDeleteModel.create({ chatid: ctx.chat.id, msgid: mambo.message_id })
            setTimeout(() => {
                ctx.api.deleteMessage(ctx.chat.id, msg_id).catch(e => console.log(e.message))
            }, 30000)
        } else if (data && data.paid == true) {
            //check if data are correct
            if (data.fname != name || data.username != username) {
                let _info = `Taarifa za Mtoa huduma ${data.fname} zimeboreshwa, amebadili jina kuwa ${name} na username kuwa ${username}.`
                await data.updateOne({ $set: { fname: name, username } })
                await bot.api.sendMessage(imp.blackberry, _info)
            }
        }
    } catch (error) {
        console.log(error.message, error)
    }
}

const adminReplyToMessageFn = async (bot, ctx, imp) => {
    try {
        let my_msg = ctx.message.text
        let myid = ctx.chat.id
        let my_msg_id = ctx.message.message_id
        let umsg = ctx.message.reply_to_message.text
        let ids = umsg.split('id = ')[1].trim()
        let userid = Number(ids.split('&mid=')[0])
        let mid = Number(ids.split('&mid=')[1])

        if (my_msg == 'block 666') {
            await pipyUsers.findOneAndUpdate({ chatid: userid }, { blocked: true })
            await ctx.reply(userid + ' blocked for mass massaging')
        }

        else if (my_msg == 'unblock 666') {
            await pipyUsers.findOneAndUpdate({ chatid: userid }, { blocked: false })
            await ctx.reply(userid + ' unblocked for mass massaging')
        }

        else {
            await bot.api.copyMessage(userid, myid, my_msg_id, { reply_to_message_id: mid })
        }
    } catch (error) {
        await ctx.reply(error.message)
    }
}


const adminReplyTextToPhotoFn = async (bot, ctx, imp) => {
    try {
        let my_msg = ctx.message.text
        let umsg = ctx.message.reply_to_message.caption
        let ids = umsg.split('id = ')[1].trim()
        let userid = Number(ids.split('&mid=')[0])
        let mid = Number(ids.split('&mid=')[1])

        await bot.api.sendMessage(userid, my_msg, { reply_to_message_id: mid })
    } catch (error) {
        await ctx.reply(error.message)
    }
}

//pin utapeli
const utapeliMsg = async (bot, imp) => {
    try {
        let Groups = [imp.r_chatting]
        for (let G of Groups) {
            let attention = await bot.api.sendMessage(G, zingatiaMsg, {
                parse_mode: 'HTML',
                reply_markup: rmarkup
            })
            await bot.api.unpinAllChatMessages(G)
                .catch(e => console.log(e.message))
            await bot.api.pinChatMessage(G, attention.message_id, {
                disable_notification: true
            })
        }
    } catch (error) {
        console.log(`utapeliMsg(): ${error.message}`)
    }
}


//call verifiedlist
const watoaHuduma = async (bot, imp, grpId) => {
    try {
        let watoa = await verifiedList.find({ paid: true }).sort('createdAt')
        let txt = `<b><u>List ya watoa huduma waliothibitishwa kufanya kazi kwenye group hili</u></b>\n\nMteja, hakikisha unafanya kazi na waliotajwa kwenye list hii tu, nje na hapo ukitapeliwa hatutakuwa na msaada na wewe.\n\n`
        for (let [i, w] of watoa.entries()) {
            let loc = w.loc ? w.loc : '---'
            let phone = w.phone ? `<a href="tel:${w.phone}">${w.phone}</a>` : '07********'
            let ment = `<a href="tg://user?id=${w.chatid}">${w.fname}</a>`
            let username = w.username == 'unknown' ? ment : `@${w.username}`
            txt = txt + `<b>👧 ${username} - (${w.fname})</b>\n📞 <b>${phone}</b>\n${loc}\n\n\n`
        }

        let msg = await bot.api.sendMessage(grpId, `${txt}\n\n⚠ Kama wewe ni mtoa huduma au dalali na unataka kufanya kazi kwenye group hili, wasiliana na admin hapa <b>@Blackberry255</b>`, { parse_mode: 'HTML' })
        await toDeleteModel.create({ msgid: msg.message_id, chatid: msg.chat.id })
    } catch (error) {
        console.log(error.message, error)
    }
}

//call verifiedlist
const watoaHudumaPrivateChat = async (bot, ctx, imp) => {
    try {
        let watoa = await verifiedList.find({ paid: true }).sort('createdAt')
        let txt = `<b><u>List ya watoa huduma waliothibitishwa kufanya kazi kwenye group letu</u></b>\n\nMteja, hakikisha unafanya kazi na waliotajwa kwenye list hii tu, nje na hapo ukitapeliwa hatuna na msaada na wewe.\n\n`
        for (let [i, w] of watoa.entries()) {
            let loc = w.loc ? w.loc : '---'
            let phone = w.phone ? `<a href="tel:${w.phone}">${w.phone}</a>` : '07********'
            let ment = `<a href="tg://user?id=${w.chatid}">${w.fname}</a>`
            let username = w.username == 'unknown' ? ment : `@${w.username}`
            txt = txt + `<b>👧 ${username} - (${w.fname})</b>\n📞 <b>${phone}</b>\n${loc}\n\n\n`
        }

        let msg = await ctx.reply(`${txt}\n\n⚠ Kama wewe ni mtoa huduma au dalali na unataka kufanya kazi kwenye group hili, wasiliana na admin hapa <b>@Blackberry255</b>`, { parse_mode: 'HTML' })
        await toDeleteModel.create({ msgid: msg.message_id, chatid: ctx.chat.id })
    } catch (error) {
        console.log(error.message, error)
    }
}


//update location
const updateLocation = async (bot, ctx) => {
    try {
        let txt = ctx.message.text
        let chatid = ctx.message.reply_to_message.from.id
        let loc = txt.split('loc=')[1].trim()
        let user = await verifiedList.findOneAndUpdate({ chatid }, { $set: { loc } }, { new: true })
        await ctx.reply(`Mtoa Huduma ${user.fname} location yake imeongezwa kuwa ${loc}`)
    } catch (error) {
        await ctx.reply(error.message)
    }
}

//update Phone
const updatePhone = async (bot, ctx) => {
    try {
        let txt = ctx.message.text
        let chatid = ctx.message.reply_to_message.from.id
        let phone = txt.toLowerCase().split('phone=')[1].trim()
        let user = await verifiedList.findOneAndUpdate({ chatid }, { $set: { phone } }, { new: true })
        await ctx.reply(`Mtoa Huduma ${user.fname} namba yake ya simu imewekwa kuwa ${phone}`)
    } catch (error) {
        await ctx.reply(error.message)
    }
}

//update title
const updateAdminTitle = async (bot, ctx, imp) => {
    let Groups = [imp.r_chatting, imp.sio_shida]
    try {
        let txt = ctx.message.text
        let chatid = ctx.message.reply_to_message.from.id
        let title = txt.split('itle=')[1].trim()
        let user = await verifiedList.findOneAndUpdate({ chatid }, { $set: { title } }, { new: true })

        for (let G of Groups) {
            await bot.api.promoteChatMember(G, chatid, promotePrivillages)
                .then(async () => {
                    await bot.api.setChatAdministratorCustomTitle(G, chatid, title)
                    await ctx.reply(`${user.fname} Admin Title changed to ${title}`)
                }).catch(async e => await ctx.reply(e.message))
        }
    } catch (error) {
        await ctx.reply(error.message)
    }
}


//clearing the group
const clearingGroup = async (bot, imp, delay) => {
    try {
        let all = await toDeleteModel.find()

        for (let m of all) {
            await bot.api.deleteMessage(m.chatid, m.msgid).catch(e => console.log(e.message))
            await m.deleteOne().catch(e => console.log(e.message))
            await delay(20) //delete 50 msgs per sec
        }
    } catch (error) {
        console.log(error.message)
    }
}

//modify user
const modFunction = async (bot, ctx, imp, delay) => {
    try {
        let txt = ctx.message.text
        let data = txt.split('=')
        let chatid = Number(data[1])
        let param = data[2]
        let value = data[3]
        let Groups = [imp.r_chatting, imp.sio_shida]

        switch (param) {
            case 'loc':
                let updLoc = await verifiedList.findOneAndUpdate({ chatid }, { $set: { loc: value } }, { new: true });
                await ctx.reply(`${updLoc.fname} location is updated to ${updLoc.loc}`);
                break;
            case 'phone':
                let updPhone = await verifiedList.findOneAndUpdate({ chatid }, { $set: { phone: value } }, { new: true });
                await ctx.reply(`${updPhone.fname} Phone number is updated to ${updPhone.phone}`);
                break;
            case 'id':
                let updID = await verifiedList.findOneAndUpdate({ chatid }, { $set: { chatid: Number(value) } }, { new: true });
                await ctx.reply(`${updID.fname} ID is updated to to ${updID.chatid}`);
                break;
            case 'until':
                let dvalue = value.replace(/,/g, '') //remove comma
                let date = new Date(dvalue + " 23:59:00 GMT+0300")
                let unix = date.getTime() / 1000
                let updUntil = await verifiedList.findOneAndUpdate({ chatid }, { $set: { until: value, unix } }, { new: true });
                await ctx.reply(`${updUntil.fname} Until is updated to ${unix} (${updUntil.until})`);
                break;
            case 'name':
                let upName = await verifiedList.findOneAndUpdate({ chatid }, { $set: { fname: value } }, { new: true });
                await ctx.reply(`${upName.chatid} name is updated to ${upName.fname}`);
                break;
            case 'title':
                let upTitle = await verifiedList.findOneAndUpdate({ chatid }, { $set: { title: value } }, { new: true });
                await ctx.reply(`${upTitle.chatid} name is updated to ${upTitle.fname}`);
                break;
            case 'username':
                let upUsename = await verifiedList.findOneAndUpdate({ chatid }, { $set: { username: value } }, { new: true });
                await ctx.reply(`${upUsename.chatid} name is updated to ${upUsename.username}`);
                break;
            case 'paid':
                if (value == 'false') {
                    let paidUpdate = await verifiedList.findOneAndUpdate({ chatid }, { $set: { paid: false } }, { new: true });
                    await ctx.reply(`${paidUpdate.fname} paid status is updated to ${paidUpdate.paid}`)
                    for (let G of Groups) {
                        await bot.api.promoteChatMember(G, chatid, demotePrivillages)
                            .catch(async e => await ctx.reply(e.message))
                        await ctx.reply(`${paidUpdate.fname} is demoted on ${G}`)
                    }
                } else if (value == 'true') {
                    let paidUpdate = await verifiedList.findOneAndUpdate({ chatid }, { $set: { paid: true } }, { new: true });
                    let title = paidUpdate.title ? paidUpdate.title : 'mtoa huduma'
                    await ctx.reply(`${paidUpdate.fname} paid status is updated to ${paidUpdate.paid}`);
                    for (let G of Groups) {
                        await bot.api.promoteChatMember(G, chatid, promotePrivillages)
                            .then(async () => {
                                await bot.api.setChatAdministratorCustomTitle(G, chatid, title)
                                await ctx.reply(`${paidUpdate.fname} is promoted on ${G}`)
                            }).catch(async e => await ctx.reply(e.message))
                    }
                }
                break;
            default:
                await ctx.reply('Nimeshindwa kutambua param yako')
        }
    } catch (error) {
        await ctx.reply(error.message)
    }
}

//list yangu ya watoa huduma
const listYangu = async (ctx) => {
    try {
        let watoa = await verifiedList.find({ paid: true }).sort('-unix')
        let txt = `<b><u>List ya watoa huduma waliothibitishwa kufanya kazi kwenye group hili</u></b>\n\nMteja, hakikisha unafanya kazi na waliotajwa kwenye list hii tu, nje na hapo ukitapeliwa hatutakuwa na msaada na wewe.\n\n`
        for (let [i, w] of watoa.entries()) {
            let until = w.until ? `<b>🚮 Expire: </b>${w.until}` : `<b>🚮 Expire:</b> not set`
            let loc = w.loc ? w.loc : '---'
            let id = `<code>${w.chatid}</code>`
            let phone = w.phone ? `<a href="tel:${w.phone}">${w.phone}</a>` : '07********'
            let ment = `<a href="tg://user?id=${w.chatid}">${w.fname}</a>`
            let username = w.username == 'unknown' ? ment : `@${w.username}`
            txt = txt + `<b>👧 ${username} - (${w.fname})</b>\n🔍 Chatid: ${id}\n⚠ <b>Paid:</b> ${w.paid}\n${until}\n\n\n`
        }
        await ctx.reply(txt, { parse_mode: 'HTML' })
    } catch (error) {
        await ctx.reply(error.message)
    }
}

module.exports = {
    verifyFn, UnverifyFn, checkSenderFn, adminReplyToMessageFn, adminReplyTextToPhotoFn, watoaHuduma, updateLocation, updatePhone, clearingGroup, muteVideosPhotos, muteLongTextsAndVideos, modFunction, listYangu, utapeliMsg, watoaHudumaPrivateChat, updateAdminTitle
}