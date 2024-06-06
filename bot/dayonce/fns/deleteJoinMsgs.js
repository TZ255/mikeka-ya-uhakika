const linkListModel = require('../database/linklist')

//groups
const grps = {
    rhtp: -1001263624837,
    rt_prem: -1001946174983,
    r_chatting: -1001722693791,
    sio_shida: -1002110306030,
    muvika: -1002067713854,
    jf: -100123,
    dstore: -1001245181784,
    mkeka: -100100,
    rtiPhone: -1001880391908
}

//create link fn
const createLink = async (bot, imp, chid, name, expire) => {
    try {
        let creating = await bot.telegram.createChatInviteLink(chid, {
            name: name,
            expire_date: expire,
            creates_join_request: true
        })
        return creating.invite_link
    } catch (err) {
        console.log(err.message, err)
        await bot.telegram.sendMessage(imp.shemdoe, `Creating Link ${err.message}`)
    }
}

//post link
const postLink = async (bot, imp, msgid, linkName, chlink) => {
    try {
        await bot.telegram.copyMessage(imp.linksChannel, imp.matangazoDB, msgid, {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: `💙 JOIN NOW 💙`, url: chlink }
                    ]
                ]
            }
        })
    } catch (err) {
        console.log(err.message, err)
        await bot.telegram.sendMessage(imp.shemdoe, `Copying Link ${err.message}`)
    }
}

//post link
const postIphoneLink = async (bot, imp, msgid, linkName, droidLink, iosLink) => {
    try {
        await bot.telegram.copyMessage(imp.linksChannel, imp.matangazoDB, msgid, {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: `➜ Android`, url: droidLink },
                        { text: `➜ iOS`, url: iosLink }
                    ]
                ]
            }
        })
    } catch (err) {
        console.log(err.message, err)
        await bot.telegram.sendMessage(imp.shemdoe, `Copying Link ${err.message}`)
    }
}

const postingFn = async (bot, imp) => {
    try {
        //find the lowest posted link
        let channel = await linkListModel.find().sort({ times: 1 }).limit(1)
        for (let ch of channel) {
            //increase times
            let chid = ch.chid
            let upd = await linkListModel.findOneAndUpdate({ chid }, { $inc: { times: 1 } }, { new: true })
            let nowSecs = Math.floor(Date.now() / 1000)
            let expireUnix = nowSecs + (24 * 60 * 60) //total seconds for a day

            switch (chid) {
                case grps.rhtp:
                    //create new invite link and post
                    let link1 = await createLink(bot, imp, chid, `link no. ${upd.times}`, expireUnix)
                    await postLink(bot, imp, 129, ch.title, link1)
                    break;

                case grps.rt_prem:
                    //create new invite link and post
                    let link2 = await createLink(bot, imp, chid, `link no. ${upd.times}`, expireUnix)
                    let link2ios = await createLink(bot, imp, grps.rtiPhone, `link no. ${upd.times}`, expireUnix)
                    await postIphoneLink(bot, imp, 130, `link no. ${upd.times}`, link2, link2ios)
                    break;

                case grps.r_chatting:
                    //create new invite link and post
                    let link3 = await createLink(bot, imp, chid, `link no. ${upd.times}`, expireUnix)
                    await postLink(bot, imp, 131, ch.title, link3)
                    break;

                case grps.sio_shida:
                    //create new invite link and post
                    let link4 = await createLink(bot, imp, chid, `link no. ${upd.times}`, expireUnix)
                    await postLink(bot, imp, 132, ch.title, link4)
                    break;

                case grps.muvika:
                    //create new invite link and post
                    let link5 = await createLink(bot, imp, chid, `link no. ${upd.times}`, expireUnix)
                    await postLink(bot, imp, 133, ch.title, link5)
                    break;

                case grps.jf:
                    //post link to channel
                    let jfLink = `https://t.me/jamiiforums`
                    await postLink(bot, imp, 134, ch.title, jfLink)
                    break;

                case grps.mkeka:
                    //post link to channel
                    let mkekaLink = `https://t.me/mkeka_wa_leo`
                    await postLink(bot, imp, 136, ch.title, mkekaLink)
                    break;

                case grps.dstore:
                    //create new invite link and post
                    let link6 = await createLink(bot, imp, chid, `link no. ${upd.times}`, expireUnix)
                    await postLink(bot, imp, 135, ch.title, link6)
                    break;

                case grps.rtiPhone:
                    //create new invite link and post
                    let link7 = await createLink(bot, imp, chid, `link no. ${upd.times}`, expireUnix)
                    await postLink(bot, imp, 156, ch.title, link7)
                    break;
            }
        }
    } catch (error) {
        console.log(error.message, error)
        await bot.telegram.sendMessage(imp.shemdoe, `Posting Link:: ${error.message}`)
    }
}

module.exports = {
    postingFn
}