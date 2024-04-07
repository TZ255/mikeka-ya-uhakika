const verifiedList = require('../database/verified')
const toDeleteModel = require('../database/MsgtoDelete')
const pipyUsers = require('../database/chats')

const listPermissions = {
    can_send_messages: true,
    can_send_audios: true,
    can_send_documents: true,
    can_send_photos: false,
    can_send_videos: false,
    can_send_video_notes: true,
    can_send_voice_notes: true,
    can_send_polls: true,
    can_send_other_messages: true,
    can_add_web_page_previews: false,
    can_change_info: false,
    can_invite_users: true,
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

        let check = await verifiedList.findOne({ chatid: userid })
        if (!check) {
            await verifiedList.create({ chatid: userid, fname, username, paid: false })
        } else { await verifiedList.findOneAndUpdate({ chatid: userid }, { $set: { paid: false } }) }

        let mention = `<a href="tg://user?id=${userid}">${fname}</a>`
        await ctx.reply(`Mtoa huduma ${mention} ameondolewa kwenye list ya watoa huduma waliothibitishwa kwenye group hili. Kuwa makini unapofanya nae kazi.\n\n<b>${mention}</b> ili kuendelea kufanya kazi kwenye group hili wasiliana na admin <b>@Blackberry255</b> ili kuthibitishwa.`, { parse_mode: 'HTML' })
    } catch (error) {
        await ctx.reply(error.message)
        console.log(error.message)
    }
}

//mute tangazo for 5 minutes
const muteVideosPhotos = async (bot, ctx, imp) => {
    try {
        let unixNow = ctx.message.date
        let chatid = ctx.chat.id
        let userid = ctx.message.from.id
        let msgid = ctx.message.message_id
        //cant send other things except the one listed below
        let data = await verifiedList.findOne({ userid })
        let caption = ctx.message.caption ? ctx.message.caption : 'no cap'
        if ((data && data.paid == true) && caption.length > 50) {
            await ctx.restrictChatMember(userid, {
                permissions: listPermissions,
                until_date: unixNow + 600
            })
            console.log(`User muted for ${600/60} minutes`)
        }
    } catch (error) {
        console.log(error.message, error)
    }
}

const checkSenderFn = async (bot, ctx, imp) => {
    try {
        let msg_id = ctx.message.message_id
        let sender = ctx.message.from.id
        let unixNow = ctx.message.date
        let fname = ctx.message.from.first_name
        let name = ctx.message.from.last_name ? `${fname} ${ctx.message.from.last_name}` : fname
        let caption = ctx.message.caption ? ctx.message.caption : 'no cap'

        let data = await verifiedList.findOne({ chatid: sender })
        let status = await ctx.getChatMember(sender)
        if ((!data || data.paid == false) && caption.length > 50) {
            await ctx.restrictChatMember(sender, {
                until_date: unixNow + 300
            })
            let watoa = await verifiedList.find({ paid: true }).sort('createdAt')
            let txt = `<b><u>List ya watoa huduma waliothibitishwa</u></b>\n\n`
            for (let [i, w] of watoa.entries()) {
                let ment = `<a href="tg://user?id=${w.chatid}">${w.fname}</a>`
                let username = w.username == 'unknown' ? ment : `@${w.username}`
                txt = txt + `<b>${i + 1}. ${username} - (${w.fname})</b>\n\n`
            }
            await ctx.reply(`Mambo <b>${name}</b> Nimekupumzisha kwa dakika 5.\n\nHuruhusiwi kutuma tangazo la picha wala video kwenye group hili. Huduma hii ipo kwa watoa huduma waliothibitishwa tu.\n\nKama wewe ni mdada (mtoa huduma) tafadhali wasiliana na admin <b>@Blackberry255</b> kuthibitishwa. Ukimfuata admin inbox hakikisha wewe ni mtoa huduma vinginevyo atakublock na mimi nitakuondoa kwenye group (hatupendi usumbufu 😏)\n\n\n${txt}`, { parse_mode: 'HTML', reply_to_message_id: msg_id })
            setTimeout(() => {
                ctx.deleteMessage(msg_id).catch(e => console.log(e.message))
            }, 30000)
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
            await bot.telegram.copyMessage(userid, myid, my_msg_id, { reply_to_message_id: mid })
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

        await bot.telegram.sendMessage(userid, my_msg, { reply_to_message_id: mid })
    } catch (error) {
        await ctx.reply(error.message)
    }
}


//call verifiedlist
const watoaHuduma = async (bot, imp) => {
    try {
        let watoa = await verifiedList.find({ paid: true }).sort('createdAt')
        let txt = `<b><u>List ya watoa huduma waliothibitishwa kufanya kazi kwenye group hili</u></b>\n\nMteja, hakikisha unafanya kazi na waliotajwa kwenye list hii tu, nje na hapo ukitapeliwa hatutakuwa na msaada na wewe.\n\n`
        for (let [i, w] of watoa.entries()) {
            let loc = w.loc ? w.loc : '---'
            let phone = w.phone ? `<a href="tel:${w.phone}">${w.phone}</a>` : '07********'
            let ment = `<a href="tg://user?id=${w.chatid}">${w.fname}</a>`
            let username = w.username == 'unknown' ? ment : `@${w.username}`
            txt = txt + `<b>👧 ${username} - (${w.fname})</b>\n📞 <b>Phone: ${phone}</b>\n📍 <b>Location: </b><i>${loc}</i>\n\n\n`
        }
        let msg = await bot.telegram.sendMessage(imp.r_chatting, `${txt}\n\n⚠ Kama wewe ni mtoa huduma au dalali na unataka kufanya kazi kwenye group hili, wasiliana na admin hapa <b>@Blackberry255</b> ili kuthibitishwa.\n\n<b>⚠ Tafadhali</b> Usiwasiliane na Admin kama wewe sio mtoa huduma, atakublock na nitakutoa kwenye group (hatupendi usumbufu) 😏.`, { parse_mode: 'HTML' })
        await toDeleteModel.create({ msgid: msg.message_id, chatid: msg.chat.id })
        setTimeout(() => {
            bot.telegram.sendMessage(imp.r_chatting, `<b>Mteja!</b> Ukikutana na mtoa huduma asiye mwaminifu ndani ya group hili, tafadhali report kwa: \n\n<b>1. Sister G (@mamyy98)</b>\nau\n<b>2. Fetty Love (@fetyy10)</b>\n\nBaada ya kureport wataondolewa kwenye group. Tusaidiane jamani kukomesha matapeli humu ndani 😁`, { parse_mode: 'HTML' })
                .then((msg) => { toDeleteModel.create({ msgid: msg.message_id, chatid: msg.chat.id }).catch(e => console.log(e.message)) })
                .catch(e => console.log(e.message, e))
        }, 15000)
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


//clearing the group
const clearingGroup = async (bot, imp, delay) => {
    try {
        let all = await toDeleteModel.find()

        for (let m of all) {
            await bot.telegram.deleteMessage(m.chatid, m.msgid).catch(e => console.log(e.message))
            await m.deleteOne().catch(e => console.log(e.message))
            await delay(20) //delete 50 msgs per sec
        }
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    verifyFn, UnverifyFn, checkSenderFn, adminReplyToMessageFn, adminReplyTextToPhotoFn, watoaHuduma, updateLocation, updatePhone, clearingGroup, muteVideosPhotos
}