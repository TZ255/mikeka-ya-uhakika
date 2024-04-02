const verifiedList = require('../database/verified')
const pipyUsers = require('../database/chats')

const verifyFn = async (bot, ctx, imp) => {
    try {
        let txt = ctx.message.text
        let userid = ctx.message.reply_to_message.from.id
        let fname = ctx.message.reply_to_message.from.first_name
        let username = ctx.message.reply_to_message.from.username ? ctx.message.reply_to_message.from.username : 'unknown'
        if(ctx.message.reply_to_message.from.last_name) {
            fname = fname + ` ${ctx.message.reply_to_message.from.last_name}`
        }

        let check = await verifiedList.findOne({ chatid: userid })
        if (!check) {
            let ver_user = await verifiedList.create({
                chatid: userid, fname, username, paid: true
            })
            let mention = `<a href="tg://user?id=${userid}">${ver_user.fname}</a>`
            await ctx.reply(`Mtoa huduma ${mention} ameongezwa kwenye list ya watoa huduma waliothibitishwa kwenye group hili.`, { parse_mode: 'HTML' })
        } else {
            let ver_user = await verifiedList.findOneAndUpdate({ chatid: userid }, { $set: { paid: true } }, { new: true })
            let mention = `<a href="tg://user?id=${userid}">${ver_user.fname}</a>`
            await ctx.reply(`Mtoa huduma ${mention} ameongezwa kwenye list ya watoa huduma waliothibitishwa kwenye group hili.`, { parse_mode: 'HTML' })
        }
    } catch (error) {
        await ctx.reply(error.message)
        console.log(error.message)
    }
}

const unverifyFn = async (bot, ctx, imp, txt) => {
    try {
        let chatid = Number(txt.split(' unverified')[0])
        let unv_user = await verifiedList.findOneAndUpdate({ chatid }, { $set: { paid: false } }, { new: true })
        let mention = `<a href="tg://user?id=${chatid}">${unv_user.fname}</a>`
        await ctx.reply(`Mtoa huduma ${mention} ameondolewa kwenye list ya watoa huduma waliothibitishwa kwenye group hili.`, { parse_mode: 'HTML' })
    } catch (error) {
        await ctx.reply(error.message)
    }
}

const checkSenderFn = async (bot, ctx, imp) => {
    try {
        let msg_id = ctx.message.message_id
        let sender = ctx.message.from.id
        let unixNow = ctx.message.date
        let fname = ctx.message.from.first_name
        let name = ctx.message.from.last_name ? `${fname} ${ctx.message.from.last_name}` : fname

        let data = await verifiedList.findOne({ chatid: sender })
        let status = await ctx.getChatMember(sender)
        if ((!data || data.paid == false) && status.status == 'member') {
            await ctx.restrictChatMember(sender, {
                until_date: unixNow + 180
            })
            let watoa = await verifiedList.find({ paid: true }).sort('createdAt')
            let txt = `<b><u>List ya watoa huduma waliothibitishwa</u></b>\n\n`
            for (let [i, w] of watoa.entries()) {
                let ment = `<a href="tg://user?id=${w.chatid}">${w.fname}</a>`
                let username = w.username == 'unknown' ? ment : `@${w.username}`
                txt = txt + `<b>${i + 1}. ${username} - (${w.fname})</b>\n\n`
            }
            await ctx.reply(`Mambo <b>${name}</b> Nimekupumzisha kwa dk 3\n\nHuruhusiwi kutuma tangazo, picha wala video kwenye group hili. Huduma hii ipo kwa watoa huduma waliothibitishwa tu.\n\nKama wewe ni mdada (mtoa huduma) tafadhali wasiliana na admin <b>@Blackberry255</b> kuthibitishwa. Ukimfuata admin inbox hakikisha wewe ni mtoa huduma vinginevyo atakublock na mimi nitakuondoa kwenye group (hatupendi usumbufu 😏)\n\n\n${txt}`, { parse_mode: 'HTML', reply_to_message_id: msg_id })
            setTimeout(() => {
                ctx.deleteMessage(msg_id).catch(e => console.log(e.message))
                ctx.reply(`Rafiki!\nUkikutana na mtoa huduma asiye mwaminifu ndani ya group hili, tafadhali report kwa <b>Sister G (@mamyy98) au Fetty Love (@fetyy10)</b> na ataondolewa kwenye group.`, {parse_mode: 'HTML'})
            }, 15000)
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

module.exports = {
    verifyFn, unverifyFn, checkSenderFn, adminReplyToMessageFn, adminReplyTextToPhotoFn
}