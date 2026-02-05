const { Bot, InlineKeyboard, webhookCallback } = require('grammy')
const { autoRetry } = require("@grammyjs/auto-retry");
require('dotenv').config()
const nyumbuModel = require('./database/chats')
const ugandanDb = require('./database/chats')
const kenyanDb = require('./database/kenyanDb')
const my_channels_db = require('./database/my_channels')
const kenyan_channels_db = require('./database/kenyanChannels')
const mkekadb = require('./database/mkeka')
const vidb = require('./database/db')
const mkekaMega = require('./database/mkeka-mega')
const mongoose = require('mongoose')

//functions
const { makeKEConvo, makeUGConvo } = require('./functions/convo')
const statsFn = require('./functions/stats')
const startFn = require('./functions/start')
const mkekaFn = require('./functions/mkeka')
const postToChannelsFn = require('./functions/post_to_channels')

const imp = {
    replyDb: -1001608248942,
    pzone: -1001352114412,
    prem_channel: -1001470139866,
    local_domain: 't.me/rss_shemdoe_bot?start=',
    prod_domain: 't.me/ohmychannelV2bot?start=',
    shemdoe: 741815228,
    halot: 1473393723,
    sh1xbet: 5755271222,
    xzone: -1001740624527,
    ohmyDB: -1001586042518,
    xbongo: -1001263624837,
    mylove: -1001748858805,
    mikekaDB: -1001696592315,
    matangazoDB: -1001570087172
}

const gsb_ug = `https://track.africabetpartners.com/visit/?bta=35468&nci=5559`
const btwy_ke = `https://www.betway.co.ke/?btag=P94949-PR23061-CM60798-TS1971458&`
const btwy_tz = `https://www.betway.co.tz/?btag=P94949-PR26073-CM84774-TS1971458&`

//delaying
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))


//BOT LOGIC
const edithaBotHandler = async (app) => {
    const bot = new Bot(process.env.EDITHA_TOKEN)

    //setting webhook
    let hookPath = `/telebot/${process.env.USER}/editha`
    app.use(`${hookPath}`, webhookCallback(bot, 'express', { timeoutMilliseconds: 30000 }))

    if (process.env.environment !== "local") {
        try {
            await bot.api.setWebhook(`https://${process.env.DOMAIN}${hookPath}`, {
                drop_pending_updates: true
            })
            await bot.api.sendMessage(imp.shemdoe, `${hookPath} set as webhook`)
        } catch (error) {
            console.error(error?.message)
            await bot.api.sendMessage(imp.shemdoe, `Failed to set webhook for Editha`)
        }
    }

    //use auto-retry
    bot.api.config.use(autoRetry());

    //start function
    startFn(bot, ugandanDb, kenyanDb, imp, delay, InlineKeyboard)

    //checking stats
    statsFn(bot, ugandanDb, kenyanDb)

    //post to channels UG & KE
    postToChannelsFn(my_channels_db, kenyan_channels_db, bot, imp)

    bot.command('convo_ke', ctx => {
        makeKEConvo(bot, ctx, imp)
    })

    bot.command('convo_ug', ctx => {
        makeUGConvo(bot, ctx, imp)
    })

    bot.command('sll', async ctx => {
        await ugandanDb.updateMany({}, { $set: { blocked: false } })
        ctx.reply('Updated')
    })

    bot.command('copy', async ctx => {
        try {
            if (ctx.message.reply_to_message) {
                let userid = ctx.message.reply_to_message.text
                userid = Number(userid.split('id = ')[1].split('&mid')[0].trim())

                let pid = ctx.message.text
                pid = Number(pid.split(' ')[1])

                await bot.api.copyMessage(userid, imp.pzone, pid)
                await ctx.reply(`msg with id ${pid} was copied successfully to user with id ${userid}`)
            }
        } catch (err) {
            console.log(err)
            await ctx.reply(err.message).catch(e => console.log(e.message))
        }
    })

    bot.command(['slip', 'betslip', 'mkeka'], async ctx => {
        try {
            await mkekaFn.sendMkeka3(ctx, delay, bot, imp)
        } catch (err) {
            console.log(err)
            await ctx.reply(err.message).catch(e => console.log(e.message))
        }
    })

    bot.on('channel_post', async ctx => {
        let txt = ctx.channelPost.text
        let txtid = ctx.channelPost.message_id

        try {
            if (ctx.channelPost.text) {
                if (txt.toLowerCase().includes('add me ug')) {
                    let ch_id = ctx.channelPost.sender_chat.id
                    let ch_title = ctx.channelPost.sender_chat.title

                    let check_ch = await my_channels_db.findOne({ ch_id })
                    if (!check_ch) {
                        await my_channels_db.create({ ch_id, ch_title })
                        let uj = await ctx.reply('channel added to db')
                        await bot.api.deleteMessage(ch_id, txtid)
                        setTimeout(() => {
                            bot.api.deleteMessage(ch_id, uj.message_id)
                                .catch((err) => console.log(err))
                        }, 1000)
                    } else {
                        let already = await ctx.reply('Channel Already existed')
                        setTimeout(() => {
                            bot.api.deleteMessage(ch_id, already.message_id)
                                .catch((err) => console.log(err))
                        }, 1000)
                    }
                }
                else if (txt.toLowerCase().includes('add me ke')) {
                    let ch_id = ctx.channelPost.sender_chat.id
                    let ch_title = ctx.channelPost.sender_chat.title

                    let check_ch = await kenyan_channels_db.findOne({ ch_id })
                    if (!check_ch) {
                        await kenyan_channels_db.create({ ch_id, ch_title })
                        let uj = await ctx.reply('channel added to db')
                        await bot.api.deleteMessage(ch_id, txtid)
                        setTimeout(() => {
                            bot.api.deleteMessage(ch_id, uj.message_id)
                                .catch((err) => console.log(err))
                        }, 1000)
                    } else {
                        let already = await ctx.reply('Channel Already existed')
                        setTimeout(() => {
                            bot.api.deleteMessage(ch_id, already.message_id)
                                .catch((err) => console.log(err))
                        }, 1000)
                    }
                }
            }

            if (ctx.channelPost.reply_to_message && ctx.channelPost.chat.id == imp.pzone) {
                let rp_id = ctx.channelPost.reply_to_message.message_id
                let rp_msg = ctx.channelPost.reply_to_message.text

                if (txt.toLowerCase() == 'post gal') {
                    await mkekadb.create({ mid: rp_id, brand: 'gal' })
                    await ctx.reply('Mkeka uko live Gal Sport')
                } else if (txt.toLowerCase() == 'post 10bet') {
                    await mkekadb.create({ mid: rp_id, brand: '10bet' })
                    await ctx.reply('Mkeka uko live 10bet')
                }
            }

        } catch (err) {
            console.log(err)
            if (!err.message) {
                await bot.api.sendMessage(imp.shemdoe, err.description)
            } else {
                await bot.api.sendMessage(imp.shemdoe, err.message)
            }
        }
    })

    bot.command('p_videos', async ctx => {
        try {
            let url = `https://getafilenow.com/1584699`
            let inline_keyboard = new InlineKeyboard().url('🔞 UNLOCK NOW', url)
            await bot.api.copyMessage(ctx.chat.id, imp.pzone, 17879, {
                reply_markup: inline_keyboard
            })
        } catch (err) {
            console.log(err.message)
        }
    })

    bot.callbackQuery(['money', 'pussy'], async ctx => {
        try {
            await mkekaFn.sendMkeka3(ctx, delay, bot, imp)
            let msgid = ctx.callbackQuery.message?.message_id
            setTimeout(() => {
                ctx.api.deleteMessage(ctx.chat.id, msgid).catch(e => console.log(e.message))
            }, 2000);
        } catch (error) {
            await ctx.reply(error.message)
            console.log(error.message, error)
        }
    })

    bot.on(':text', async ctx => {
        try {
            if (ctx.message.reply_to_message && ctx.chat.id == imp.halot) {
                if (ctx.message.reply_to_message.text) {
                    let my_msg = ctx.message.text
                    let myid = ctx.chat.id
                    let my_msg_id = ctx.message.message_id
                    let umsg = ctx.message.reply_to_message.text
                    let ids = umsg.split('id = ')[1].trim()
                    let userid = Number(ids.split('&mid=')[0])
                    let mid = Number(ids.split('&mid=')[1])

                    if (my_msg == 'block 666') {
                        await ugandanDb.findOneAndUpdate({ chatid: userid }, { blocked: true })
                        await ctx.reply(userid + ' blocked for mass massaging')
                    }

                    else if (my_msg == 'unblock 666') {
                        await ugandanDb.findOneAndUpdate({ chatid: userid }, { blocked: false })
                        await ctx.reply(userid + ' unblocked for mass massaging')
                    }

                    else {
                        await bot.api.copyMessage(userid, myid, my_msg_id, { reply_to_message_id: mid })
                    }

                }

                else if (ctx.message.reply_to_message.photo) {
                    let my_msg = ctx.message.text
                    let umsg = ctx.message.reply_to_message.caption
                    let ids = umsg.split('id = ')[1].trim()
                    let userid = Number(ids.split('&mid=')[0])
                    let mid = Number(ids.split('&mid=')[1])


                    await bot.api.sendMessage(userid, my_msg, { reply_to_message_id: mid })
                }
            }


            else {
                let userid = ctx.chat.id
                let txt = ctx.message.text
                let username = ctx.chat.first_name
                let mid = ctx.message.message_id

                let bets = ['🎯 BET OF THE DAY (🔥)', '💰 BET OF THE DAY (🔥)']
                if (bets.includes(txt)) {
                    await mkekaFn.sendMkeka3(ctx, delay, bot, imp)
                }
                else {
                    let url = `https://getafilenow.com/1584699`
                    let inline_keyboard = new InlineKeyboard().url('🔞 UNLOCK NOW', url)
                    await ctx.api.copyMessage(ctx.chat.id, imp.pzone, 17879, {
                        reply_markup: inline_keyboard
                    })
                }
            }

        } catch (err) {
            if (!err.message) {
                await bot.api.sendMessage(imp.shemdoe, err.description)
            } else {
                await bot.api.sendMessage(imp.shemdoe, err.message)
            }
        }
    })

    bot.on(':photo', async ctx => {
        try {
            let mid = ctx.message.message_id
            let username = ctx.chat.first_name
            let chatid = ctx.chat.id
            let cap = ctx.message.caption

            if (ctx.message.reply_to_message && chatid == imp.halot) {
                if (ctx.message.reply_to_message.text) {
                    let umsg = ctx.message.reply_to_message.text
                    let ids = umsg.split('id = ')[1].trim()
                    let userid = Number(ids.split('&mid=')[0])
                    let rmid = Number(ids.split('&mid=')[1])


                    await bot.api.copyMessage(userid, chatid, mid, {
                        reply_to_message_id: rmid
                    })
                }

                else if (ctx.message.reply_to_message.photo) {
                    let umsg = ctx.message.reply_to_message.caption
                    let ids = umsg.split('id = ')[1].trim()
                    let userid = Number(ids.split('&mid=')[0])
                    let rmid = Number(ids.split('&mid=')[1])


                    await bot.api.copyMessage(userid, chatid, mid, {
                        reply_to_message_id: rmid
                    })
                }
            }


            else {
                await bot.api.copyMessage(imp.halot, chatid, mid, {
                    caption: cap + `\n\nfrom = <code>${username}</code>\nid = <code>${chatid}</code>&mid=${mid}`,
                    parse_mode: 'HTML'
                })
            }
        } catch (err) {
            if (!err.message) {
                await bot.api.sendMessage(imp.shemdoe, err.description)
                console.log(err)
            } else {
                await bot.api.sendMessage(imp.shemdoe, err.message)
                console.log(err)
            }
        }
    })
}

module.exports = edithaBotHandler