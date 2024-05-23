const verifiedList = require('../database/verified')
const toDeleteModel = require('../database/MsgtoDelete')
const pipyUsers = require('../database/chats')

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
const reusableRestriction = async (ctx, caption, charsNum, delay) => {
    try {
        let d = new Date().toLocaleTimeString('en-GB', {timeZone: 'Africa/Nairobi', timeStyle: 'short'})
        let masaa = Number(d.split(':')[0])
        let userid = ctx.message.from.id
        let msgid = ctx.message.message_id
        let list = await verifiedList.findOne({ chatid: userid })
        if ((list && list.paid && list.role == 'dada') && caption.length > charsNum) {
            let unix = ctx.message.date
            let until_date = unix + 1800
            //wait 10 minutes if its midnight
            if(masaa < 7) {
                until_date = unix + 600 //10 minutes
            }
            let muda = new Date(until_date * 1000).toLocaleTimeString('en-GB', {timeZone: 'Africa/Nairobi', timeStyle: 'short'})
            let tag = `<a href="tg://user?id=${userid}">${list.fname}</a>`
            let loc = list.loc ? ` Anapatikana <b>${list.loc}</b>.` : ''
            await list.updateOne({ $set: { again: until_date } })
            await ctx.sendChatAction('typing')
            await delay(1000)
            let notf = await ctx.reply(`<b>${tag}</b> utaruhusiwa kupost tangazo tena saa <b>${muda}</b>\n\n<b>${tag}</b> ni miongoni mwa watoa huduma waaminifu ndani ya group hili.${loc} \nBonyeza button hapa chini kuwasiliana nae.`, {
                parse_mode: "HTML",
                reply_parameters: { message_id: msgid },
                reply_markup: {
                    inline_keyboard: [
                        [{ text: `📩 Zama Inbox 📩`, url: `tg://user?id=${userid}` }]
                    ]
                }
            })
            await toDeleteModel.create({ chatid: ctx.chat.id, msgid: notf.message_id })
        }
    } catch (error) { console.log(error.message, error) }
}

//mute tangazo for 5 minutes
const muteVideosPhotos = async (bot, ctx, imp, delay) => {
    try {
        let caption = ctx.message.caption ? ctx.message.caption : 'null'
        await reusableRestriction(ctx, caption, 50, delay)
    } catch (error) {
        console.log(error.message, error)
    }
}

//mute tangazo for 10 minutes
const muteLongTextsAndVideos = async (bot, ctx, imp, delay) => {
    try {
        let length = 0
        let caption = 'no cap'
        if(ctx.message.text) {
            caption = ctx.message.text
            length = 200
        } else if (ctx.message.caption) {
            caption = ctx.message.caption
            length = 80
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
                let muda = new Date(verified.again * 1000).toLocaleTimeString('en-GB', {timeZone: 'Africa/Nairobi', timeStyle: 'short'})
                let subiri = await ctx.reply(`<b>${ment}</b> ulisubirishwa kupost tangazo kwa muda, utaruhusiwa kupost tena saa <b>${muda}</b>`, {
                    reply_parameters: {
                        message_id: msgid, allow_sending_without_reply: true
                    }, parse_mode: 'HTML'
                })
                setTimeout(() => {
                    ctx.deleteMessage(msgid).catch(e => console.log(e.message, e))
                    ctx.deleteMessage(subiri.message_id).catch(e => console.log(e.message, e))
                }, 7000)
            } else {
                //call to check if is verified member, allow and mute
                await reusableRestriction(ctx, caption, length, delay)
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
                ctx.deleteMessage(msg_id).catch(e => console.log(e.message))
            }, 30000)
        } else if (data && data.paid == true) {
            //check if data are correct
            if (data.fname != name || data.username != username) {
                let _info = `Taarifa za Mtoa huduma ${data.fname} zimeboreshwa, amebadili jina kuwa ${name} na username kuwa ${username}.`
                await data.updateOne({ $set: { fname: name, username } })
                await bot.telegram.sendMessage(imp.blackberry, _info)
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
            txt = txt + `<b>👧 ${username} - (${w.fname})</b>\n📞 <b>${phone}</b>\n${loc}\n\n\n`
        }
        let msg = await bot.telegram.sendMessage(imp.r_chatting, `${txt}\n\n⚠ Kama wewe ni mtoa huduma au dalali na unataka kufanya kazi kwenye group hili, wasiliana na admin hapa <b>@Blackberry255</b>`, { parse_mode: 'HTML' })
        let list = await toDeleteModel.create({ msgid: msg.message_id, chatid: msg.chat.id })
        setTimeout(() => {
            bot.telegram.sendMessage(imp.r_chatting, `<b>Mteja!</b> Ikitokea ukatapeliwa na mtoa huduma wa group hili, haraka sana tafadhali report kwa: \n\n<b>1. Black Berry (@Blackberry255)\n2. Sister G (@mamyy98)\n3. Fetty Love (@fetyy10)</b>\n\nBaada ya kureport wataondolewa kwenye group.\n\n\n<b>❌❌ ZINGATIA ❌❌</b>\n\nUsitume hela kwa yeyote atakaekufuata inbox kukuambia ni admin, dalali au mtoa huduma wa group hili. \n\nNjia pekee ya kuwasiliana na dalali au mtoa huduma wa group hili ni kwa kubonyeza jina lake kwenye list hapo juu au ujumbe chini ya tangazo lake unaosema yeye ni mwaminifu.`, { parse_mode: 'HTML', reply_parameters: { message_id: list.message_id } })
                .then((msg) => { toDeleteModel.create({ msgid: msg.message_id, chatid: msg.chat.id }).catch(e => console.log(e.message)) })
                .catch(e => console.log(e.message, e))
        }, 5000)
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

//modify user
const modFunction = async (bot, ctx, imp, delay) => {
    try {
        let txt = ctx.message.text
        let data = txt.split('=')
        let chatid = Number(data[1])
        let param = data[2]
        let value = data[3]

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
                let date = new Date(value)
                let unix = date.getTime() / 1000
                let updUntil = await verifiedList.findOneAndUpdate({ chatid }, { $set: { until: value, unix } }, { new: true });
                await ctx.reply(`${updUntil.fname} Until is updated to ${unix} (${updUntil.until})`);
                break;
            case 'name':
                let upName = await verifiedList.findOneAndUpdate({ chatid }, { $set: { fname: value, unix } }, { new: true });
                await ctx.reply(`${upName.chatid} name is updated to ${upName.fname}`);
                break;
            case 'paid':
                if (value == 'false') {
                    let paidUpdate = await verifiedList.findOneAndUpdate({ chatid }, { $set: { paid: false } }, { new: true });
                    await bot.telegram.promoteChatMember(imp.r_chatting, chatid, demotePrivillages)
                        .catch(async e => await ctx.reply(e.message))
                    await ctx.reply(`${paidUpdate.fname} is demoted`)
                    await ctx.reply(`${paidUpdate.fname} paid status is updated to ${paidUpdate.paid}`);
                } else if (value == 'true') {
                    let paidUpdate = await verifiedList.findOneAndUpdate({ chatid }, { $set: { paid: true } }, { new: true });
                    await bot.telegram.promoteChatMember(imp.r_chatting, chatid, promotePrivillages)
                        .catch(async e => await ctx.reply(e.message))
                    await bot.telegram.setChatAdministratorCustomTitle(imp.r_chatting, chatid, 'mtoa huduma')
                    await ctx.reply(`${paidUpdate.fname} is promoted`)
                    await ctx.reply(`${paidUpdate.fname} paid status is updated to ${paidUpdate.paid}`);
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
    verifyFn, UnverifyFn, checkSenderFn, adminReplyToMessageFn, adminReplyTextToPhotoFn, watoaHuduma, updateLocation, updatePhone, clearingGroup, muteVideosPhotos, muteLongTextsAndVideos, modFunction, listYangu
}