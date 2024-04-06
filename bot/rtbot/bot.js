

const rtfunction = async () => {

    try {
        let tksn = [process.env.RT_TOKEN, process.env.PL_TOKEN, process.env.MUVIKA_TOKEN]
        for (let t of tksn) {
            const { Telegraf } = require('telegraf')
            const mongoose = require('mongoose')
            const rtStarterModel = require('./database/chats')
            const malayaModel = require('./database/malaya')
            const videosDB = require('./database/db')
            const aliExDB = require('./database/aliexpress')
            const axios = require('axios').default
            const OpenAI = require('openai')
            const extractInfoOpenAi = require('./functions/openai')

            //Middlewares
            const call_function = require('./functions/fn')


            const bot = new Telegraf(t)
                .catch((err) => console.log(err.message))

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
                matangazoDB: -1001570087172,
                aliDB: -1001801595269,
                aliProducts: -1001971329607,
                _pack1: -1001943515650,
                lipaPtsCh: -1002104835299
            }

            const miamala = ['nimelipia', 'tayari', 'nimelipa', 'tayali', 'malipo', 'umetuma kikamilifu', 'umetuma tsh', 'you have paid', 'utambulisho wa muamala', 'confirmed. tsh', 'imethibitishwa', 'umechangia', 'transaction id', 'rt limited', '13015916', 'nmelpa', 'nmetma', 'nimeshalipa', 'nishanunua', 'nshanunua', 'nmelipa']

            const zingine = ['video', 'niunge', 'video zingine', 'zingine', 'nyingine', 'zngine', 'nyngine', 'nitumie video', 'link', 'wakubwa']

            const lipaTexts = ['umepokea', 'has been received']

            const admins = [imp.halot, imp.shemdoe, imp.rtmalipo]

            const rateLimitter = []
            setInterval(() => { rateLimitter.length = 0 }, 20000)

            //delaying
            const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

            bot.telegram.deleteWebhook({ drop_pending_updates: true }).catch(e => console.log(e.message))

            bot.catch((err, ctx) => {
                console.log(err.message)
            })

            bot.start(async ctx => {
                try {
                    //add to database if not
                    await call_function.createUser(ctx, delay)

                    if (ctx.payload && !rateLimitter.includes(ctx.chat.id)) {
                        rateLimitter.push(ctx.chat.id)
                        let pload = ctx.payload
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
                            await bot.telegram.copyMessage(ctx.chat.id, imp.pzone, 7755, {
                                reply_markup: {
                                    inline_keyboard: [
                                        [
                                            { text: 'Omba kuongezwa kwenye List Hii', url: 'http://t.me/blackberry255' }
                                        ]
                                    ]
                                }
                            })
                        } else if (pload.toLowerCase() == 'iphone') {
                            await bot.telegram.copyMessage(ctx.chat.id, imp.matangazoDB, 33)
                        } else if (pload.toLowerCase() == 'ongeza_points') {
                            await call_function.payingInfo(bot, ctx, delay, imp, userid, 26)
                        } else if (pload.toLowerCase() == 'get-wakubwa-pack1') {
                            await ctx.sendChatAction('typing')
                            setTimeout(() => {
                                bot.telegram.copyMessage(ctx.chat.id, imp.matangazoDB, 36)
                                    .catch(e => console.log(e.message, e))
                            }, 1000)

                        }
                    }
                    else if (ctx.payload && rateLimitter.includes(ctx.chat.id)) {
                        await ctx.deleteMessage(ctx.message.message_id)
                    }
                    else {
                        let user = ctx.chat.first_name
                        await ctx.reply(`Habari, ${user},\n\nKupata Full Videos na Movies rudi katika channel yetu yenye trailers na ubonyeze botton ya <b>Download Full Video</b>. \n\nKama wewe ni mgeni hapa, tuma neno <b>"Niunge"</b> kupata links za magroup yetu ya Videos.`, { parse_mode: 'HTML' })
                    }

                } catch (err) {
                    console.log(err.message)
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

            bot.command('convo', async ctx => {
                let myId = ctx.chat.id
                let txt = ctx.message.text
                let msg_id = Number(txt.split('/convo-')[1].trim())
                if (myId == imp.shemdoe || myId == imp.halot) {
                    try {
                        await ctx.reply('starting')
                        let botname = ctx.botInfo.username
                        let all_users = await rtStarterModel.find({ refferer: botname })

                        all_users.forEach((u, index) => {
                            if (u.blocked != true) {
                                setTimeout(() => {
                                    if (index == all_users.length - 1) {
                                        ctx.reply('Nimemaliza conversation')
                                    }
                                    bot.telegram.copyMessage(u.chatid, imp.matangazoDB, msg_id)
                                        .then(() => console.log('✅ sent to ' + u.chatid))
                                        .catch((err) => {
                                            if (err.message.includes('blocked') || err.message.includes('initiate')) {
                                                rtStarterModel.findOneAndDelete({ chatid: u.chatid })
                                                    .then(() => { console.log(u.chatid + ' is deleted') })
                                            }
                                        })
                                }, index * 40)
                            }
                        })
                    } catch (err) {
                        console.log(err.message)
                    }
                } else { await ctx.reply('You are not authorized') }
            })

            bot.command('bless', async (ctx) => {
                try {
                    if (ctx.chat.id === imp.rtmalipo) {
                        const botname = ctx.botInfo.username;
                        await ctx.reply('Starting');
                        const usersToUpdate = await rtStarterModel.find({ points: { $lt: 250 }, refferer: botname });

                        usersToUpdate.forEach((u, i) => {
                            setTimeout(() => {
                                const np = 500 - u.points
                                u.updateOne({ $set: { points: u.points + np } }).catch(e => console.log(e.message))
                                bot.telegram.copyMessage(u.chatid, imp.matangazoDB, 42).then(() => {
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
                        let botname = ctx.botInfo.username
                        let all = await rtStarterModel.find({ points: { $gte: 500 }, paid: false, refferer: botname })

                        all.forEach((u, i) => {
                            setTimeout(() => {
                                bot.telegram.copyMessage(u.chatid, imp.matangazoDB, 65)
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
                    await bot.telegram.copyMessage(ctx.chat.id, imp.matangazoDB, 25)
                } catch (err) {
                    console.log(err.message)
                }
            })

            bot.command('list', async ctx => {
                try {
                    await bot.telegram.copyMessage(ctx.chat.id, imp.pzone, 7755, {
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

            bot.command('update', async ctx => {
                try {
                    if (ctx.chat.id == imp.rtmalipo) {
                        await rtStarterModel.updateMany({}, { $unset: { movie: 1, shows: 1 } })
                        await ctx.reply('All Data Removed')
                        await rtStarterModel.updateMany({}, { $set: { movie: 0, shows: 0 } })
                        await ctx.reply('All Data Readded')
                    }
                } catch (error) {
                    await ctx.reply(error.message)
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
                            await bot.telegram.copyMessage(imp.aliProducts, chan_id, postId, {
                                reply_markup: {
                                    inline_keyboard: [
                                        [
                                            { text: `🎁 BUY NOW ▷ ${rn * 5}% OFF`, url: affLink }
                                        ]
                                    ]
                                }
                            })
                        }
                    } else if (chan_id == imp.lipaPtsCh && ctx.channelPost.reply_to_message) {
                        //extract transactions info with chatGpt
                        await extractInfoOpenAi.extractInfoOpenAi(bot, ctx, imp, lipaTexts)
                    }
                } catch (err) {
                    console.log(err.message, err)
                    await ctx.reply(err.message)
                }
            })

            bot.on('callback_query', async ctx => {
                try {
                    let cdata = ctx.callbackQuery.data
                    let cmsgid = ctx.callbackQuery.message.message_id
                    let chatid = ctx.callbackQuery.from.id

                    if (cdata == 'salio') {
                        let user = await rtStarterModel.findOne({ chatid })
                        let txt = `Una Points ${user.points} kwenye account yako ya RT Malipo.`
                        await ctx.answerCbQuery(txt, { cache_time: 10, show_alert: true })
                    } else if (['rudi_nyuma', 'ongeza_points'].includes(cdata)) {
                        await ctx.deleteMessage(cmsgid)
                        await call_function.payingInfo(bot, ctx, delay, imp, chatid, 26)
                    } else if (cdata == 'vid_ongeza_pts') {
                        await call_function.payingInfo(bot, ctx, delay, imp, chatid, 26)
                    } else if (cdata == 'voda') {
                        await call_function.mtandaoCallBack(bot, ctx, chatid, imp, 17, cmsgid)
                    } else if (cdata == 'tigo') {
                        await call_function.mtandaoCallBack(bot, ctx, chatid, imp, 18, cmsgid)
                    } else if (cdata == 'airtel') {
                        await call_function.mtandaoCallBack(bot, ctx, chatid, imp, 19, cmsgid)
                    } else if (cdata == 'halotel') {
                        await call_function.mtandaoCallBack(bot, ctx, chatid, imp, 20, cmsgid)
                    } else if (cdata == 'safaricom') {
                        await call_function.rudiNyumaReply(bot, ctx, chatid, imp, 22, cmsgid)
                    } else if (cdata == 'uganda') {
                        await call_function.rudiNyumaReply(bot, ctx, chatid, imp, 112, cmsgid)
                    } else if (cdata == 'other_networks') {
                        await call_function.rudiNyumaReply(bot, ctx, chatid, imp, 23, cmsgid)
                    }
                    else if (cdata == 'help-msaada') {
                        await call_function.rudiNyumaReply(bot, ctx, chatid, imp, 12, cmsgid)
                    } else if (cdata == 'nimelipia') {
                        await call_function.rudiNyumaReply(bot, ctx, chatid, imp, 30, cmsgid)
                    } else if (cdata == 'video-zingine') {
                        await bot.telegram.copyMessage(ctx.chat.id, imp.matangazoDB, 37)
                    }
                } catch (err) {
                    console.log(err.message)
                }
            })

            bot.on('text', async ctx => {
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
                                await bot.telegram.copyMessage(userid, myid, my_msg_id, { reply_to_message_id: mid })
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
                                await bot.telegram.sendMessage(userid, my_msg, { reply_to_message_id: mid })
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
                        let txt = ctx.message.text
                        let username = ctx.chat.first_name
                        let surname = ''
                        if (ctx.chat.last_name) {
                            surname = ctx.chat.last_name
                            username = username + ' ' + surname
                        }
                        let mid = ctx.message.message_id

                        for (let m of miamala) {
                            if (txt.toLowerCase().includes(m)) {
                                await bot.telegram.sendMessage(imp.rtmalipo, `<b>${txt}</b> \n\nfrom = <a href="tg://user?id=${userid}">${username}</a>\nid = <code>${userid}</code>&mid=${mid}`, { parse_mode: 'HTML' })

                                await bot.telegram.copyMessage(userid, imp.matangazoDB, 63, {
                                    reply_markup: {
                                        inline_keyboard: [
                                            [
                                                { text: `✉ Wasiliana na Admin Wetu Hapa`, url: 'https://t.me/rt_malipo' }
                                            ]
                                        ]
                                    }
                                })
                                break
                            }
                        }

                        for (let t of zingine) {
                            if (txt.toLocaleLowerCase().includes(t)) {
                                await bot.telegram.copyMessage(ctx.chat.id, imp.matangazoDB, 96)
                                break;
                            }
                        }

                        switch (txt) {
                            case '💰 Points Zangu':
                                let user = await rtStarterModel.findOne({ chatid: userid })
                                await ctx.reply(`Umebakiwa na Points ${user.points}.`)
                                break;

                            case '➕ Ongeza Points': case '/ONGEZA_POINTS':
                                await call_function.payingInfo(bot, ctx, delay, imp, userid, 26)
                                break;

                            case '⛑ Help / Msaada ⛑':
                                await bot.telegram.copyMessage(userid, imp.matangazoDB, 25)
                                break;

                            default:
                                await bot.telegram.sendMessage(imp.halot, `<b>${txt}</b> \n\nfrom = <code>${username}</code>\nid = <code>${userid}</code>&mid=${mid}`, { parse_mode: 'HTML', disable_notification: true })
                        }
                    }

                } catch (err) {
                    if (!err.message) {
                        await bot.telegram.sendMessage(imp.shemdoe, err.description)
                    } else {
                        await bot.telegram.sendMessage(imp.shemdoe, err.message)
                    }
                }
            })

            bot.on('photo', async ctx => {
                try {
                    let mid = ctx.message.message_id
                    let username = ctx.chat.first_name
                    let surname = ''
                    if (ctx.chat.last_name) {
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


                            await bot.telegram.copyMessage(userid, chatid, mid, {
                                reply_to_message_id: rmid
                            })
                        }

                        else if (ctx.message.reply_to_message.photo) {
                            let umsg = ctx.message.reply_to_message.caption
                            let ids = umsg.split('id = ')[1].trim()
                            let userid = Number(ids.split('&mid=')[0])
                            let rmid = Number(ids.split('&mid=')[1])


                            await bot.telegram.copyMessage(userid, chatid, mid, {
                                reply_to_message_id: rmid
                            })
                        }
                    }


                    else {
                        await bot.telegram.copyMessage(imp.halot, chatid, mid, {
                            caption: cap + `\n\nfrom = <a href="tg://user?id=${chatid}">${username}</a>\nid = <code>${chatid}</code>&mid=${mid}`,
                            parse_mode: 'HTML'
                        })
                        await bot.telegram.copyMessage(imp.rtmalipo, chatid, mid, {
                            caption: cap + `\n\nfrom = <a href="tg://user?id=${chatid}">${username}</a>\nid = <code>${chatid}</code>&mid=${mid}`,
                            parse_mode: 'HTML'
                        })
                        await delay(1000)
                        await bot.telegram.copyMessage(chatid, imp.matangazoDB, 63, {
                            reply_markup: {
                                inline_keyboard: [
                                    [
                                        { text: `✉ Wasiliana na Admin Wetu Hapa`, url: 'https://t.me/rt_malipo' }
                                    ]
                                ]
                            }
                        })
                    }
                } catch (err) {
                    if (!err.message) {
                        await bot.telegram.sendMessage(imp.shemdoe, err.description)
                        console.log(err)
                    } else {
                        await bot.telegram.sendMessage(imp.shemdoe, err.message)
                        console.log(err)
                    }
                }
            })

            bot.on('chat_join_request', async ctx => {
                let chatid = ctx.chatJoinRequest.from.id
                let username = ctx.chatJoinRequest.from.first_name
                let channel_id = ctx.chatJoinRequest.chat.id
                let cha_title = ctx.chatJoinRequest.chat.title
                let handle = 'unknown'

                const notOperate = [imp.xbongo, imp.rtgrp]

                try {
                    //check @handle
                    if (ctx.chatJoinRequest.from.username) {
                        handle = ctx.chatJoinRequest.from.username
                    }
                    //dont process xbongo
                    if (!notOperate.includes(channel_id)) {
                        let user = await rtStarterModel.findOne({ chatid })
                        if (!user) {
                            await rtStarterModel.create({ chatid, username, handle, refferer: 'rtbot', free: 5, paid: false, startDate: null, endDate: null })
                        }
                        await bot.telegram.approveChatJoinRequest(channel_id, chatid)
                        await bot.telegram.sendMessage(chatid, `Hongera! 🎉 Ombi lako la kujiunga na <b>${cha_title}</b> limekubaliwa.\n\nIngia sasa\nhttps://t.me/+8sYOwE1SqoFkOGY0\nhttps://t.me/+8sYOwE1SqoFkOGY0`, {
                            parse_mode: 'HTML',
                            disable_web_page_preview: true
                        })
                    }

                } catch (err) {
                    errMessage(err, chatid)
                }
            })


            bot.launch()
                .then(() => {
                    console.log('Bot is running')
                    bot.telegram.sendMessage(imp.shemdoe, 'Bot restarted')
                        .catch((err) => console.log(err.message))
                })
                .catch((err) => {
                    console.log('Bot is not running')
                    bot.telegram.sendMessage(imp.shemdoe, err.message)
                        .catch(e => console.log(e.message))
                })

            process.once('SIGINT', () => bot.stop('SIGINT'))
            process.once('SIGTERM', () => bot.stop('SIGTERM'))
        }
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    rtBot: rtfunction
}