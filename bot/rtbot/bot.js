const { Bot, webhookCallback } = require('grammy')
const { autoRetry } = require("@grammyjs/auto-retry")
const axios = require('axios').default
const OpenAI = require('openai')
const mongoose = require('mongoose')
const PilauWebUserModel = require('./database/pilauweb')
const rtStarterModel = require('./database/chats')
const nyumbuModel = require('./database/nyumbus')
const miamalaModel = require('./database/miamala');
const malayaModel = require('./database/malaya')
const videosDB = require('./database/db')
const aliExDB = require('./database/aliexpress')
const extractInfoOpenAi = require('./functions/openai-chatid')
const { extractMiamalaInfo, addingBusinessPoints, WirePusher, WirePusherClear } = require('./functions/openai-post')
const call_function = require('./functions/fn')
const { muamalaQuery } = require('./functions/querymiamala')

const rtfunction = async (app) => {
    try {
        let tksn = [
            { NAME: 'rtbot', TOKEN: process.env.RT_TOKEN },
            { NAME: 'plbot', TOKEN: process.env.PL_TOKEN },
            { NAME: 'mvbot', TOKEN: process.env.MUVIKA_TOKEN }
        ]

        //importants
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
            rtmalipo: 5849160770,
            xzone: -1001740624527,
            ohmyDB: -1001586042518,
            xbongo: -1001263624837,
            mikekaDB: -1001696592315,
            logsBin: -1001845473074,
            mylove: -1001748858805,
            malayaDB: -1001783364680,
            rtgrp: -1001899312985,
            rtcopyDB: -1002634850653,
            aliDB: -1001801595269,
            aliProducts: -1001971329607,
            _pack1: -1001943515650,
            lipaPtsCh: -1002104835299,
            newRT: -1002228998665
        }

        for (let t of tksn) {
            const bot = new Bot(t.TOKEN)

            //use auto-retry plugin
            bot.api.config.use(autoRetry());

            let hookPath = `/telebot/${process.env.USER}/${t.NAME}`
            await bot.api.setWebhook(`https://${process.env.DOMAIN}${hookPath}`, {
                drop_pending_updates: true
            })
                .then(() => {
                    console.log(`webhook for ${t.NAME} is set`)
                    bot.api.sendMessage(imp.shemdoe, `${hookPath} set as webhook`)
                })
                .catch(e => console.log(e.message))
            app.use(`${hookPath}`, webhookCallback(bot, 'express', { timeoutMilliseconds: 30000 }))

            const miamala = ['nimelipia', 'tayari', 'nimelipa', 'tayali', 'malipo', 'umetuma kikamilifu', 'umetuma tsh', 'you have paid', 'utambulisho wa muamala', 'confirmed. tsh', 'imethibitishwa', 'umechangia', 'transaction id', 'rt limited', '13015916', 'nmelpa', 'nmetma', 'nimeshalipa', 'nishanunua', 'nshanunua', 'nmelipa']

            const zingine = ['video', 'niunge', 'video zingine', 'zingine', 'nyingine', 'zngine', 'nyngine', 'nitumie video', 'link', 'wakubwa']

            const lipaTexts = ['umepokea', 'has been received', 'confirmed', 'received from', 'imethibitishwa']

            const admins = [imp.halot, imp.shemdoe, imp.rtmalipo]

            //delaying
            const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

            const rateLimitter = []
            setInterval(() => {
                rateLimitter.length = 0

                //deleting messages
                let d = new Date()
                let time = d.getHours()
                let mins = d.getMinutes()
                if (time == 20 && mins == 59) {
                    call_function.deteleMessages(delay)
                }
            }, 20000)

            bot.catch((err) => {
                const ctx = err.ctx;
                console.error(`(RT): ${err.message}`, err);
            });

            bot.command('start', async ctx => {
                try {
                    //add to database if not
                    await call_function.createUser(ctx, delay)

                    if (ctx.match && !rateLimitter.includes(ctx.chat.id)) {
                        rateLimitter.push(ctx.chat.id)
                        let pload = ctx.match
                        if (pload.includes('&size')) { pload = pload.split('&size')[0] }
                        let userid = ctx.chat.id
                        if (pload.includes('RTBOT-') || pload.includes('MOVIE-FILE')) {
                            let android = `https://t.me/+lcBycrCJ_9o0ZGI0`
                            let iphone = `https://t.me/+dGYRm-FoKJI3MWM8`
                            let gen = `https://telegra.ph/Channels-za-RT-Premium-08-20-2`
                            let nano = ''
                            if (pload.includes('RTBOT-')) { nano = pload.split('RTBOT-')[1] }
                            if (pload.includes('MOVIE-FILE')) { nano = pload.split('MOVIE-FILE')[1] }

                            let vid = await videosDB.findOne({ nano })

                            let user = await rtStarterModel.findOne({ chatid: userid })
                            if (user.points > 249) {
                                if (pload.includes('iphone-')) {
                                    await call_function.sendPaidVideo(ctx, delay, bot, imp, vid, userid, iphone)
                                } else if (pload.includes('android-')) {
                                    await call_function.sendPaidVideo(ctx, delay, bot, imp, vid, userid, android)
                                } else if (pload.includes('MOVIE-FILE')) {
                                    await call_function.sendPaidVideo(ctx, delay, bot, imp, vid, userid, 'movie')
                                } else {
                                    await call_function.sendPaidVideo(ctx, delay, bot, imp, vid, userid, gen)
                                }
                            } else {
                                await call_function.payingInfo(bot, ctx, delay, imp, userid, 16)
                            }
                        }
                        if (pload.toLowerCase() == 'verified_list') {
                            await bot.api.copyMessage(ctx.chat.id, imp.pzone, 7755, {
                                reply_markup: {
                                    inline_keyboard: [
                                        [
                                            { text: 'Omba kuongezwa kwenye List Hii', url: 'http://t.me/blackberry255' }
                                        ]
                                    ]
                                }
                            })
                        } else if (pload.toLowerCase() == 'iphone') {
                            await bot.api.copyMessage(ctx.chat.id, imp.rtcopyDB, 12)
                        } else if (pload.toLowerCase() == 'ongeza_points') {
                            await call_function.payingInfo(bot, ctx, delay, imp, userid, 2)
                        }
                    }
                    else if (ctx.match && rateLimitter.includes(ctx.chat.id)) {
                        await ctx.api.deleteMessage(ctx.chat.id, ctx.message.message_id)
                    }
                    else {
                        let user = ctx.chat.first_name
                        await ctx.reply(`Habari, ${user},\n\nKupata Full Videos na Movies rudi katika channel yetu yenye trailers na ubonyeze botton ya <b>Download Full Video</b>. \n\nKama wewe ni mgeni hapa, tuma neno <b>"Niunge"</b> kupata links za magroup yetu ya Videos.`, { parse_mode: 'HTML' })
                    }

                } catch (err) {
                    console.log(err.message, err)
                }
            })

            bot.command('paid', async ctx => {
                let authorized = [imp.shemdoe, imp.halot, imp.rtmalipo]
                try {
                    if (authorized.includes(ctx.chat.id)) {
                        let splitter = ctx.message.text.split('=')
                        let chatid = Number(splitter[1])
                        let points = Number(splitter[2])
                        await call_function.addingPoints(ctx, chatid, points, imp)
                    } else { await ctx.reply('You are not authorized to do this') }

                } catch (err) {
                    await ctx.reply(err.message)
                }
            })

            bot.command('rev', async ctx => {
                try {
                    let rt = await rtStarterModel.findOne({ chatid: imp.rtmalipo })
                    let paids = await rtStarterModel.countDocuments({ paid: true })
                    await ctx.reply(`<b>Jumla ya Mapato. \nTokea tumeanza May 1, 2023</b>\n\n▷ Tumeingiza jumla ya Tsh. ${rt.revenue.toLocaleString('en-US')}/= tukiwa na jumla ya wateja ${paids.toLocaleString('en-US')}`, { parse_mode: 'HTML' })
                } catch (err) {
                    console.log(err, err.message)
                    await ctx.reply(err.message)
                }
            })

            const convoFn = async (ctx) => {
                if ([imp.halot, imp.shemdoe, imp.rtmalipo].includes(ctx.chat.id) && ctx.match) {
                    let msg_id = Number(ctx.match.trim())
                    let bads = ['deactivated', 'blocked', 'initiate', 'chat not found']
                    try {
                        let botname = ctx.me.username
                        let all_users = await rtStarterModel.find({ refferer: botname, paid: true })
                        await ctx.reply(`Starting broadcasting for ${all_users.length} users`)
                        for (let [i, u] of all_users.entries()) {
                            await bot.api.copyMessage(u.chatid, imp.rtcopyDB, msg_id)
                                .catch((err) => {
                                    if (bads.some((b) => err?.message.toLowerCase().includes(b))) {
                                        u.deleteOne()
                                        console.log(`${i + 1}. ${botname} - ${u?.chatid} deleted`)
                                    } else { console.log(`🤷‍♂️ ${err.message}`) }
                                })
                        }
                    } catch (err) {
                        console.log(err?.message)
                    }
                }
            }

            bot.command('paid_convo', async ctx => {
                convoFn(ctx)
            })

            bot.command('bless', async (ctx) => {
                try {
                    if (ctx.chat.id === imp.rtmalipo) {
                        const botname = ctx.me.username;
                        await ctx.reply('Starting');
                        const usersToUpdate = await rtStarterModel.find({ points: { $lt: 250 }, refferer: botname });

                        usersToUpdate.forEach((u, i) => {
                            setTimeout(() => {
                                const np = 500 - u.points
                                u.updateOne({ $set: { points: u.points + np } }).catch(e => console.log(e.message))
                                bot.api.copyMessage(u.chatid, imp.rtcopyDB, 13).then(() => {
                                    console.log('✅ done kwa ' + u.chatid);
                                }).catch(e => console.log(e.message))
                            }, 40 * i);
                        });
                    }
                } catch (err) {
                    console.log(err.message, err);
                }
            });

            bot.command('remind', async ctx => {
                try {
                    if (ctx.chat.id = imp.rtmalipo) {
                        await ctx.reply('Starting')
                        let botname = ctx.me.username
                        let all = await rtStarterModel.find({ points: { $gte: 500 }, paid: false, refferer: botname })

                        all.forEach((u, i) => {
                            setTimeout(() => {
                                bot.api.copyMessage(u.chatid, imp.rtcopyDB, 65)
                                    .then(() => console.log('✅ done kwa ' + u.chatid))
                                    .catch(e => console.log('❌ ' + e.message))
                            }, 40 * i)
                        })
                    }
                } catch (err) {
                    console.log(err.message, err)
                }
            })

            bot.command('info', async ctx => {
                try {
                    let chatid = Number(ctx.message.text.split('/info=')[1])
                    let user = await rtStarterModel.findOne({ chatid })
                    await ctx.reply(`User with id ${chatid} referred by ${user.refferer} has ${user.points} Points\n\nMovies: ${user.movie}\nSeries: ${user.shows}`)
                } catch (err) {
                    await ctx.reply(err.message)
                }
            })

            bot.command('admin', async ctx => {
                try {
                    if (ctx.chat.id == imp.halot || ctx.chat.id == imp.shemdoe) {
                        await ctx.reply(`/stats - stats\n/verification - post to xbongo vmessage`)
                    }

                } catch (err) {
                    console.log(err.message)
                }
            })

            bot.command('stats', async ctx => {
                try {
                    let idadi = await rtStarterModel.countDocuments()
                    await ctx.reply(idadi.toLocaleString('en-US') + ' members')
                } catch (err) {
                    await ctx.reply(err.message)
                }
            })

            bot.command('salio', async ctx => {
                try {
                    let chatid = ctx.chat.id
                    let inf = await rtStarterModel.findOne({ chatid })
                    if (inf) {
                        let txt = `Habari ${ctx.chat.first_name}, \n\nUna points *${inf.points}* kwenye account yako ya RT Malipo`
                        await ctx.reply(txt, {
                            parse_mode: 'Markdown',
                            reply_markup: {
                                inline_keyboard: [[{ text: '➕ Ongeza Points', callback_data: 'ongeza_points' }]]
                            }
                        })
                    } else { await ctx.reply('Samahani! Taarifa zako hazipo kwenye kanzu data yetu.') }
                } catch (err) {
                    await ctx.reply(err.message)
                }
            })

            bot.command(['ongeza_pts', 'ongeza_points'], async ctx => {
                try {
                    await call_function.payingInfo(bot, ctx, delay, imp, ctx.chat.id, 26)
                } catch (err) {
                    console.log(err.message)
                }
            })

            bot.command('msaada', async ctx => {
                try {
                    await bot.api.copyMessage(ctx.chat.id, imp.rtcopyDB, 9)
                } catch (err) {
                    console.log(err.message)
                }
            })

            bot.command('list', async ctx => {
                try {
                    await bot.api.copyMessage(ctx.chat.id, imp.pzone, 7755, {
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    { text: 'Omba Kuongezwa kwenye List Hii', url: 'http://t.me/blackberry255' }
                                ]
                            ]
                        }
                    })
                } catch (err) {
                    console.log(err.message)
                }
            })

            bot.command('pilauweb', async ctx => {
                try {
                    let myid = ctx.chat.id
                    if (ctx.match && ctx.match.includes('create') && [imp.shemdoe, imp.rtmalipo].includes(myid)) {
                        let userid = Number(ctx.match.split('create ')[1].trim())
                        let tg_user = await rtStarterModel.findOne({ chatid: userid })
                        if (!tg_user) {
                            return await ctx.reply(`Invalid chatid: ${userid}`)
                        }
                        let username = `${userid}`
                        let password = '1234'
                        let pilauUser = await PilauWebUserModel.findOne({ username })
                        if (pilauUser && pilauUser.status == 'registered') {
                            return await ctx.reply(`User tayari kasajiliwa pilauzone na status ya "registered"`)
                        } else if (pilauUser && pilauUser.status == 'pending') {
                            return await ctx.reply(`User tayari yupo pilauzone na status ya "pending" mpe link pilauhub.com/register akamilishe usajili`)
                        }

                        //create user
                        await PilauWebUserModel.create({
                            username, password, points: tg_user.points
                        })

                        //send message to tg user
                        let text = `Hongera! Account yako ya PilauZone imetengenezwa. Tumia username na password zifuatazo kukamilisha usajili:\n\n👉 Username: <b>${userid}</b>\n👉 Password: <b>1234</b>\n\nCopy username yako hapo chini kisha fungua link hii kukamilisha usajili www.pilauzone.com/register`
                        await ctx.reply('✅ Done. Account created successfully')
                        return await ctx.api.sendMessage(userid, text, {
                            parse_mode: 'HTML',
                            reply_markup: {
                                inline_keyboard: [
                                    [
                                        { text: 'Copy username', copy_text: { text: userid } }
                                    ]
                                ]
                            }
                        })
                    }
                } catch (error) {
                    await ctx.reply(error.message)
                    console.log(error.message, error)
                }
            })

            bot.on('channel_post', async ctx => {
                try {
                    let chan_id = ctx.channelPost.chat.id
                    let postId = ctx.channelPost.message_id

                    if (chan_id == imp.aliDB && ctx.channelPost.video) {
                        let caps = ctx.channelPost.caption
                        if (caps.toLowerCase().includes('https://')) {
                            let affLink = caps.split('https://')[1]
                            affLink = `https://${affLink}`

                            let rn = Math.floor(Math.random() * 10) + 1

                            await aliExDB.create({ msgid: postId, affLink })
                            await bot.api.copyMessage(imp.aliProducts, chan_id, postId, {
                                reply_markup: {
                                    inline_keyboard: [
                                        [
                                            { text: `🎁 BUY NOW ▷ ${rn * 5}% OFF`, url: affLink }
                                        ]
                                    ]
                                }
                            })
                        }
                    } else if (chan_id == imp.lipaPtsCh) {
                        if (ctx.channelPost.reply_to_message) {
                            //extract transactions info with chatGpt
                            await extractInfoOpenAi.extractInfoOpenAi(bot, ctx, imp, lipaTexts)
                        } else {
                            //save transaction info
                            await extractMiamalaInfo(bot, ctx, imp)
                        }
                    }
                } catch (err) {
                    console.log(err.message, err)
                    await ctx.reply(err.message)
                }
            })

            bot.on('callback_query:data', async ctx => {
                try {
                    let cdata = ctx.callbackQuery.data
                    let cmsgid = ctx.callbackQuery.message.message_id
                    let chatid = ctx.callbackQuery.from.id

                    if (cdata == 'salio') {
                        let user = await rtStarterModel.findOne({ chatid })
                        let txt = `Una Points ${user.points} kwenye account yako ya RT Malipo.`
                        await ctx.answerCallbackQuery({ text: txt, cache_time: 10, show_alert: true })
                    } else if (['rudi_nyuma', 'ongeza_points'].includes(cdata)) {
                        await ctx.api.deleteMessage(chatid, cmsgid)
                        await call_function.payingInfo(bot, ctx, delay, imp, chatid, 2)
                    } else if (cdata == 'vid_ongeza_pts') {
                        await call_function.payingInfo(bot, ctx, delay, imp, chatid, 2)
                    } else if (cdata == 'voda') {
                        await call_function.mtandaoCallBack(bot, ctx, chatid, imp, 3, cmsgid)
                    } else if (cdata == 'tigo') {
                        await call_function.mtandaoCallBack(bot, ctx, chatid, imp, 4, cmsgid) //189
                    } else if (cdata == 'airtel') {
                        await call_function.mtandaoCallBack(bot, ctx, chatid, imp, 5, cmsgid) //121
                    } else if (cdata == 'halotel') {
                        await call_function.mtandaoCallBack(bot, ctx, chatid, imp, 6, cmsgid)
                    } else if (cdata == 'safaricom') {
                        await call_function.rudiNyumaReply(bot, ctx, chatid, imp, 7, cmsgid)
                    } else if (cdata == 'uganda') {
                        await call_function.rudiNyumaReply(bot, ctx, chatid, imp, 8, cmsgid)
                    } else if (cdata == 'other_networks') {
                        await call_function.rudiNyumaReply(bot, ctx, chatid, imp, 9, cmsgid)
                    }
                    else if (cdata == 'help-msaada') {
                        await call_function.rudiNyumaReply(bot, ctx, chatid, imp, 9, cmsgid)
                    } else if (cdata == 'nimelipia') {
                        await call_function.rudiNyumaReply(bot, ctx, chatid, imp, 10, cmsgid)
                    } else if (cdata == 'video-zingine') {
                        await bot.api.copyMessage(ctx.chat.id, imp.rtcopyDB, 11)
                    }
                } catch (err) {
                    console.log(err.message, err)
                }
            })

            bot.on('message:text', async ctx => {
                try {
                    if (ctx.message.reply_to_message && admins.includes(ctx.chat.id)) {
                        if (ctx.message.reply_to_message.text) {
                            let my_msg = ctx.message.text
                            let myid = ctx.chat.id
                            let my_msg_id = ctx.message.message_id
                            let umsg = ctx.message.reply_to_message.text
                            let ids = umsg.split('id = ')[1].trim()
                            let userid = Number(ids.split('&mid=')[0])
                            let mid = Number(ids.split('&mid=')[1])

                            //check if adding points
                            if (my_msg.toLocaleLowerCase().includes('paid ')) {
                                let pts = Number(my_msg.toLocaleLowerCase().split('paid ')[1])
                                await call_function.addingPoints(ctx, userid, pts, imp)
                            } else if (my_msg.toLocaleLowerCase().includes(' p ')) {
                                let pts = Number(my_msg.toLocaleLowerCase().split(' p ')[1])
                                await call_function.addingPoints(ctx, userid, pts, imp)
                            } else {
                                await bot.api.copyMessage(userid, myid, my_msg_id, { reply_to_message_id: mid })
                            }
                        }

                        else if (ctx.message.reply_to_message.photo) {
                            let my_msg = ctx.message.text
                            let umsg = ctx.message.reply_to_message.caption
                            let ids = umsg.split('id = ')[1].trim()
                            let userid = Number(ids.split('&mid=')[0])
                            let mid = Number(ids.split('&mid=')[1])

                            //check if adding points
                            if (my_msg.toLocaleLowerCase().includes('paid ')) {
                                let pts = Number(my_msg.toLocaleLowerCase().split('paid ')[1])
                                await call_function.addingPoints(ctx, userid, pts, imp)
                            } else {
                                await bot.api.sendMessage(userid, my_msg, { reply_to_message_id: mid })
                            }
                        }
                    }


                    else {
                        if (admins.includes(ctx.chat.id) && (ctx.message.text.toLowerCase().includes('paid') || ctx.message.text.toLowerCase().includes(' p '))) {
                            let admin_txt = ctx.message.text
                            let client_data = admin_txt.split(' ')
                            let client_id = Number(client_data[0])
                            let points = Number(client_data[2])
                            await call_function.addingPoints(ctx, client_id, points, imp)
                        }
                        //create user if not on database
                        await call_function.createUser(ctx, delay)

                        let userid = ctx.chat.id
                        let txt = ctx.message?.text
                        let username = ctx.chat.first_name
                        let surname = ''
                        if (ctx.chat.last_name) {
                            surname = ctx.chat.last_name
                            username = username + ' ' + surname
                        }
                        let mid = ctx.message.message_id

                        for (let m of miamala) {
                            if (txt.toLowerCase().includes(m) && ctx.chat.type == 'private') {
                                await bot.api.sendMessage(imp.rtmalipo, `<b>${txt}</b> \n\nfrom = <a href="tg://user?id=${userid}">${username}</a>\nid = <code>${userid}</code>&mid=${mid}`, { parse_mode: 'HTML' })

                                await bot.api.copyMessage(userid, imp.rtcopyDB, 10, {
                                    reply_markup: {
                                        inline_keyboard: [
                                            [
                                                { text: `✉ Wasiliana na Admin Wetu Hapa`, url: 'https://t.me/pilauzone_admin' }
                                            ]
                                        ]
                                    }
                                })
                                break
                            }
                        }

                        //check if user send 'niunge, link, zingine'
                        for (let t of zingine) {
                            if (txt.toLocaleLowerCase().includes(t) && ctx.chat.type == 'private') {
                                if (!rateLimitter.includes(ctx.chat.id)) {
                                    let muvika = `https://t.me/+9CChSlwpGWk2YmI0`
                                    let android = `https://t.me/+RFRJJNq0ERM1YTBk`
                                    let iphone = `https://t.me/+dGYRm-FoKJI3MWM8`
                                    rateLimitter.push(ctx.chat.id)
                                    //check if his member
                                    let status = await ctx.api.getChatMember(imp.newRT, ctx.chat.id)
                                    switch (status.status) {
                                        case 'member': case 'administrator': case 'creator':
                                            let mslink = `https://t.me/c/2228998665/99999`
                                            await ctx.reply(`<b><u>RT Premium Links</u>\n\n🔞 18+ Tu\n${mslink}\n\n🎬 Movies\n${muvika}</b>`, { parse_mode: 'HTML' })
                                            break;
                                        case 'kicked': case 'left':
                                            await ctx.reply(`<b><u>RT Premium Links</u>\n\n🔞 18+ Tu (Android)\n${android}\n\n🔞 18+ Tu (iPhone)\n${iphone}\n\n🎬 Movies\n${muvika}</b>`, { parse_mode: 'HTML' })
                                            break;
                                        default:
                                            await ctx.reply('Your account is restricted')
                                            break;
                                    }
                                    break;
                                }
                            }
                        }

                        switch (txt) {
                            case '💰 Points Zangu':
                                let user = await rtStarterModel.findOne({ chatid: userid })
                                await ctx.reply(`Umebakiwa na Points ${user.points}.`)
                                break;

                            case '➕ Ongeza Points': case '/ONGEZA_POINTS':
                                await call_function.payingInfo(bot, ctx, delay, imp, userid, 2)
                                break;

                            case '⛑ Help / Msaada ⛑':
                                await bot.api.copyMessage(userid, imp.rtcopyDB, 9)
                                break;

                            default:
                                await bot.api.sendMessage(imp.halot, `<b>${txt}</b> \n\nfrom = <code>${username}</code>\nid = <code>${userid}</code>&mid=${mid}`, { parse_mode: 'HTML', disable_notification: true })
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

            bot.on('message:photo', async ctx => {
                try {
                    let mid = ctx.message.message_id
                    let username = ctx.chat?.first_name
                    let surname = ''
                    if (ctx.chat?.last_name) {
                        surname = ctx.chat.last_name
                        username = username + ' ' + surname
                    }
                    let chatid = ctx.chat.id
                    let cap = ctx.message.caption

                    if (ctx.message.reply_to_message && admins.includes(ctx.chat.id)) {
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
                        if (ctx.chat.type == 'private') {
                            await bot.api.copyMessage(imp.halot, chatid, mid, {
                                caption: cap + `\n\nfrom = <a href="tg://user?id=${chatid}">${username}</a>\nid = <code>${chatid}</code>&mid=${mid}`,
                                parse_mode: 'HTML'
                            })
                            await bot.api.copyMessage(imp.rtmalipo, chatid, mid, {
                                caption: cap + `\n\nfrom = <a href="tg://user?id=${chatid}">${username}</a>\nid = <code>${chatid}</code>&mid=${mid}`,
                                parse_mode: 'HTML'
                            })
                            await delay(1000)
                            await bot.api.copyMessage(chatid, imp.rtcopyDB, 10, {
                                reply_markup: {
                                    inline_keyboard: [
                                        [
                                            { text: `✉ Wasiliana na Admin Wetu Hapa`, url: 'https://t.me/pilauzone_admin' }
                                        ]
                                    ]
                                }
                            })
                        }
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

            //business
            bot.on('business_message', async ctx => {
                try {
                    let malipoAdmins = [imp.rtmalipo]
                    let rtbot_id = ctx.me.id
                    let message = ctx.businessMessage?.text
                    let userid = ctx.businessMessage.from.id
                    let fname = ctx.businessMessage.from.first_name
                    let biz_conn = await ctx.getBusinessConnection()
                    let biz_id = biz_conn.id
                    //angalia msg sio yangu mwenyewe && robot ni rt && bizid ni kwenye chat yangu
                    if (!malipoAdmins.includes(ctx.businessMessage.from.id) && rtbot_id == 6286589854 && biz_conn.user.id == imp.rtmalipo) {
                        //notify me for new message if
                        WirePusher(message, Math.round(userid / 100), fname)
                        //check if user is on db and has name and phone
                        let user = await rtStarterModel.findOne({ chatid: userid })
                        if (user && user?.fullName) {
                            //check miamala ya user
                            let query = muamalaQuery(user.fullName)
                            let tx = await miamalaModel.find(query)
                            if (tx.length > 0) {
                                let emoji = '⚡⚡⚡'
                                let points = 0
                                let txid = ''
                                for (let t of tx) {
                                    points = points + t.amt
                                    await t.deleteOne()
                                    txid = t.txid
                                }
                                //add points
                                await addingBusinessPoints(bot, ctx, userid, points, imp, delay, txid, emoji)
                                //mark biz msg as read
                                await ctx.readBusinessMessage().catch(e => console.log(e?.message))
                                //clear wirepusher msg
                                WirePusherClear(Math.round(userid / 100))
                            }
                        }
                    } else if (malipoAdmins.includes(ctx.businessMessage.from.id)) {
                        //kama ujumbe wangu unaanza na + or - na ukiconvert ni number
                        let uid = ctx.businessMessage.chat.id
                        if (message.startsWith('+') && Number(message)) {
                            let points = Number(message)
                            let my_msg_id = ctx.businessMessage.message_id
                            let emoji = '✅'

                            //delete miamala yote kwenye db
                            let mteja = await rtStarterModel.findOne({ chatid: uid })
                            if (mteja && mteja?.fullName) {
                                await miamalaModel.deleteMany({ name: mteja.fullName })
                            }

                            //add business points
                            await addingBusinessPoints(bot, ctx, uid, points, imp, delay, uid, emoji)
                            //delete the +message
                            await ctx.deleteBusinessMessages([my_msg_id])
                        }
                        switch (message.toLowerCase()) {
                            case 'link':
                                let expire = ctx.businessMessage.date + (3600 * 12) //4hrs
                                let limit = 1,
                                    linkName = `for biz ${expire}`
                                let link = await call_function.createChannelLink(bot, imp.newRT, expire, limit, linkName, imp.rtmalipo)
                                await ctx.reply(link, { link_preview_options: { is_disabled: true } })
                                break;
                        }

                        //clear wirepusher
                        WirePusherClear(Math.round(uid / 100))
                    }
                } catch (error) {
                    console.log(error.message, error)
                }
            })

            //polling
            if (process.env.environment == 'local') {
                // await bot.api.deleteWebhook({drop_pending_updates: true})
                // bot.start().catch(e => {
                //     bot.api.sendMessage(741815228, e.message).catch(e => console.log(e.message))
                // })
            }
        }
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    rtBot: rtfunction
}