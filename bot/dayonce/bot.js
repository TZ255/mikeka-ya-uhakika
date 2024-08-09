

const DayoBot = async (app) => {
    try {
        const { Bot, webhookCallback } = require('grammy')
        const { autoRetry } = require("@grammyjs/auto-retry")
        const bot = new Bot(process.env.DAYO_TOKEN)
        const dayoUsers = require('./database/chats')
        const tg_slips = require('./database/tg_slips')
        const vidb = require('./database/db')
        const mkekaMega = require('./database/mkeka-mega')
        const channelListModel = require('./database/linklist')
        const switchUserText = require('./fns/text-arr')
        const call_sendMikeka_functions = require('./fns/mkeka-1-2-3')
        const { postingFn } = require('./fns/deleteJoinMsgs')

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
            xzone: -1001740624527,
            ohmyDB: -1001586042518,
            xbongo: -1001263624837,
            mikekaDB: -1001696592315,
            logsBin: -1001845473074,
            mylove: -1001748858805,
            mkekaLeo: -1001733907813,
            matangazoDB: -1001570087172,
            r_chatting: -1001722693791,
            dstore: -1001245181784,
            linksChannel: -1002042952349,
            sio_shida: -1002110306030
        }

        //use auto-retry
        bot.api.config.use(autoRetry());

        const chatGroups = [imp.r_chatting, imp.sio_shida]

        const mkArrs = ['mkeka', 'mkeka1', 'mkeka2', 'mkeka3', 'mikeka', 'mkeka wa leo', 'mikeka ya leo', 'mkeka namba 1', 'mkeka namba 2', 'mkeka namba 3', 'mkeka #1', 'mkeka #2', 'mkeka #3', 'mkeka no #1', 'mkeka no #2', 'mkeka no #3', 'za leo', 'naomba mkeka', 'naomba mikeka', 'naomba mkeka wa leo', 'nitumie mkeka', 'ntumie mkeka', 'nitumie mikeka ya leo', 'odds', 'odds za leo', 'odds ya leo', 'mkeka waleo', 'mkeka namba moja', 'mkeka namba mbili', 'mkeka namba tatu', 'nataka mkeka', 'nataka mikeka', 'mkeka wa uhakika', 'odds za uhakika', 'mkeka?', 'mkeka wa leo?', '/mkeka 1', '/mkeka 2', '/mkeka 3']

        async function create(bot, ctx) {
            let starter = await dayoUsers.findOne({ chatid: ctx.chat.id })
            if (!starter) {
                await dayoUsers.create({
                    chatid: ctx.chat.id,
                    username: ctx.chat.first_name,
                    promo: 'unknown',
                    refferer: "Dayo"
                })
                console.log('New user added to DB (Dayo)')
            }
        }

        //delaying
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

        let defaultReplyMkp = {
            keyboard: [
                [
                    { text: "MKEKA 1" },
                    { text: "MKEKA 2" },
                    { text: "MKEKA 3" },
                ]
            ],
            is_persistent: true,
            resize_keyboard: true
        }

        bot.catch((err) => {
            const ctx = err.ctx;
            console.error(`(Dayo): ${err.message}`, err);
        });

        //set webhook
        let hookPath = `/telebot/${process.env.USER}/dayonce`
        await bot.api.setWebhook(`https://${process.env.DOMAIN}${hookPath}`, {
            drop_pending_updates: true
        })
            .then(() => {
                console.log(`webhook for Dayonce is set`)
                bot.api.sendMessage(imp.shemdoe, `${hookPath} set as webhook`)
                    .catch(e => console.log(e.message))
            })
            .catch(e => console.log(e.message))
        app.use(`${hookPath}`, webhookCallback(bot, 'express'))

        bot.command('start', async ctx => {
            try {
                if (ctx.match.length > 2) {
                    let pload = ctx.match
                    if (pload == 'ngono_bongo') {
                        console.log('Ngono Payload Started')
                        await bot.api.copyMessage(ctx.chat.id, imp.pzone, 8859, {
                            reply_markup: defaultReplyMkp
                        })
                    }
                    //add to database
                    await create(bot, ctx)

                } else {
                    await bot.api.copyMessage(ctx.chat.id, imp.pzone, 7653, {
                        reply_markup: defaultReplyMkp
                    })

                    let stt = await dayoUsers.findOne({ chatid: ctx.chat.id })
                    if (!stt) {
                        await dayoUsers.create({
                            chatid: ctx.chat.id,
                            username: ctx.chat.first_name,
                            refferer: "Dayo"
                        })
                        await bot.api.sendMessage(imp.logsBin, '(Dayo) New user found me - Added to DB')
                    }
                }

            } catch (err) {
                console.log("(Dayo) " + err.message)
            }
        })

        bot.command('admin', async ctx => {
            try {
                let txt = `<u>Admin Commands</u>\n\n/stats - stats\n/convo-id - copy from mikekaDB\n/supaleo - fetch supatips (today)\n/supajana - fetch supatips (yesterday)\n/supakesho - fetch supatips (tomorrow)\n/graph - graph stats`
                if (ctx.chat.id == imp.shemdoe) { ctx.reply(txt, { parse_mode: 'HTML' }) }
            } catch (err) {
                await ctx.reply(err.message)
            }
        })

        bot.command(['help', 'stop'], async ctx => {
            try {
                await bot.api.copyMessage(ctx.chat.id, imp.pzone, 7653)
                await create(bot, ctx)
            } catch (err) {
                console.log("(Dayo) " + err.message)
            }

        })

        bot.command('supatips', async ctx => {
            try {
                await call_sendMikeka_functions.supatips(ctx, bot, delay, imp)
            } catch (error) {
                console.log("(Dayo) " + err.message)
            }
        })

        const convoFn = async (ctx) => {
            if ([imp.halot, imp.shemdoe].includes(ctx.chat.id) && ctx.match) {
                let msg_id = Number(ctx.match.trim())
                //cht not found - not using bot for longtime or Group/User to copy from not found
                //bot is not a member of the channel chat - channel not found
                let bads = ['deactivated', 'blocked', 'initiate', 'chat not found']
                try {
                    let all_users = await dayoUsers.find({ refferer: "Dayo" })
                    await ctx.reply(`Starting broadcasting for ${all_users.length} users`)
                    for (let [i, u] of all_users.entries()) {
                        bot.api.copyMessage(u.chatid, imp.mikekaDB, msg_id, { reply_markup: defaultReplyMkp })
                            .catch((err) => {
                                if (bads.some((b) => err?.message.toLowerCase().includes(b))) {
                                    u.deleteOne()
                                    console.log(`${i + 1}. Dayo - ${u?.chatid} deleted`)
                                } else { console.log(`🤷‍♂️ ${err.message}`) }
                            })
                    }
                } catch (err) {
                    console.log(err?.message)
                }
            }
        }

        bot.command('convo', async ctx => {
            convoFn(ctx)
        })

        bot.command(['mkeka', 'mkeka1'], async ctx => {
            try {
                if (ctx.chat.type == 'private') {
                    let rpid = ctx.message.message_id
                    await call_sendMikeka_functions.sendMkeka1(ctx, delay, bot, imp, rpid)
                }
            } catch (err) {
                console.log(err)
                await bot.api.sendMessage(imp.shemdoe, err.message)
                    .catch(e => console.log(e.message))
            }
        })

        bot.command('mkeka2', async ctx => {
            try {
                if (ctx.chat.type == 'private') {
                    let rpid = ctx.message.message_id
                    await call_sendMikeka_functions.sendMkeka2(ctx, delay, bot, imp, rpid)
                }
            } catch (err) {
                console.log(err)
                await bot.api.sendMessage(imp.shemdoe, err.message)
                    .catch(e => console.log(e.message))
            }
        })

        bot.command('mkeka3', async ctx => {
            try {
                if (ctx.chat.type == 'private') {
                    let rpid = ctx.message.message_id
                    await call_sendMikeka_functions.sendMkeka3(ctx, delay, bot, imp, rpid)
                }
            } catch (err) {
                await bot.api.sendMessage(imp.shemdoe, err.message)
                    .catch((e) => console.log(e.message))
                console.log(err.message, err)
            }
        })

        bot.command('site', async ctx => {
            await ctx.reply(`Hello!, ukiona kimya tembelea site yangu ya mikeka \nhttps://mkekawaleo.com`, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Fungua Hapa', url: 'http://mkekawaleo.com' }]
                    ]
                }
            })
                .catch((err) => console.log('(Dayo)' + err.message))
        })

        bot.command('kujisajili', async ctx => {
            try {
                await bot.api.copyMessage(ctx.chat.id, imp.pzone, 7595)
            } catch (err) {
                console.log("(Dayo) " + err.message)
            }
        })

        bot.command('kujisajili_bw', async ctx => {
            try {
                await bot.api.copyMessage(ctx.chat.id, imp.matangazoDB, 99)
            } catch (err) {
                console.log("(Dayo) " + err.message)
            }
        })

        bot.command('app_bw', async ctx => {
            try {
                await bot.api.copyMessage(ctx.chat.id, imp.matangazoDB, 97)
            } catch (err) {
                console.log("(Dayo) " + err.message)
            }
        })

        bot.command('kudeposit', async ctx => {
            try {
                await bot.api.copyMessage(ctx.chat.id, imp.pzone, 7596)
            } catch (err) {
                console.log("(Dayo) " + err.message)
            }
        })

        bot.command('stats', async ctx => {
            try {
                let nyumbusP = await dayoUsers.countDocuments({ refferer: "Dayo" })
                let jumla = nyumbusP
                let unknown = await dayoUsers.countDocuments({ promo: "unknown" })
                unknown = unknown.toLocaleString('en-us')
                let premier = await dayoUsers.countDocuments({ promo: "premier" })
                premier = premier.toLocaleString('en-us')
                await ctx.reply(`Mpaka sasa kwenye Database yetu tuna nyumbu <b>${nyumbusP.toLocaleString('en-us')}</b> wa Dayonce.\n\nJumla kuu ni <b>${jumla.toLocaleString('en-us')}</b>. \n\n\nPia upande wa promo tuko na:\n1. Uncategoriized: ${unknown}\n2. Premier: ${premier}`, { parse_mode: 'HTML' })
            } catch (err) {
                console.log("(Dayo) " + err.message)
            }
        })

        bot.command(['jisajili_m', 'deposit_m'], async ctx => {
            try {
                await bot.api.copyMessage(ctx.chat.id, imp.pzone, 7652)
            } catch (err) {
                console.log("(Dayo) " + err.message)
            }
        })

        bot.command('betbuilder', async ctx => {
            try {
                await bot.api.copyMessage(ctx.chat.id, imp.pzone, 7655)
            } catch (err) {
                console.log("(Dayo) " + err.message)
            }
        })

        bot.command('block', async ctx => {
            try {
                if (ctx.chat.id == imp.shemdoe) {
                    let chatid = Number(ctx.message.text.split('block=')[1])
                    await dayoUsers.findOneAndUpdate({ chatid }, { $set: { blocked: true } })
                    await ctx.reply('User blocked successfully')
                }
            } catch (err) {
                await ctx.reply(err.message)
            }
        })

        bot.command('mimi', async ctx => {
            try {
                let txt = "Angalia hapa mikeka ya leo"
                let mk = `https://dramastore.net/download/episode/664b0ba83991908776d1303a/1101685785`
                await ctx.reply(txt, {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { 'text': 'Mkeka wa Leo', web_app: { url: mk } }
                            ]
                        ]
                    }
                })
            } catch (error) {
                console.error(error)
            }
        })

        bot.command('setbtn', async ctx => {
            try {
                await bot.api.sendMessage(imp.r_chatting, 'Chatting Rahatupu\n\nGroup bora bongo kwa huduma za kikubwa', {
                    reply_markup: defaultReplyMkp
                })
            } catch (error) {
                console.log(error.message)
            }
        })

        bot.command(['wakubwa', 'sodoma', 'sex', 'wadogo'], async ctx => {
            try {
                await bot.api.copyMessage(ctx.chat.id, imp.pzone, 8094)
            } catch (err) {
                console.log("(Dayo) " + err.message)
            }
        })

        bot.on('callback_query:data', async ctx => {
            try {
                let data = ctx.callbackQuery.data

                switch (data) {
                    case 'accept_pload':
                        let pload_link = `https://t.me/+PWiPWm0vB5Y4ZDhk`
                        let org_msg_id = ctx.callbackQuery.message.message_id
                        await ctx.api.deleteMessage(ctx.chat.id, org_msg_id)
                        await ctx.reply(`Hongera 👏 Ombi lako la kujiunga na channel yetu limekubaliwa\n\n🔞 <b>Ingia Sasa\n${pload_link}\n${pload_link}</b>`, { parse_mode: 'HTML' })
                        break;

                    case 'jisajili_m': case 'deposit_m':
                        await bot.api.copyMessage(ctx.chat.id, imp.pzone, 7652)
                        break;
                }
            } catch (error) {
                console.log('(Dayo): ' + error.message)
            }
        })

        bot.on('channel_post', async ctx => {
            try {
                let tangazo = ctx.channelPost.chat.id
                console.log(ctx.chat.id)

                if (tangazo == imp.matangazoDB && ctx.channelPost.reply_to_message) {
                    let tangazo_id = ctx.channelPost.reply_to_message.message_id
                    let reply = ctx.channelPost.text
                    let reply_id = ctx.channelPost.message_id
                    if (reply.includes('-100')) {
                        let [title, chid] = reply.split(' >> ')
                        await channelListModel.create({
                            chid: Number(chid), msgid: tangazo_id, title
                        })
                        let done_msg = await ctx.reply('Channel Added Successfully')
                        await delay(3000)
                        await ctx.api.deleteMessage(tangazo, done_msg.message_id)
                        await ctx.api.deleteMessage(tangazo, reply_id)
                    }
                }
            } catch (error) {
                console.error(error)
                await ctx.reply(error.message)
            }
        })

        bot.on('message:text', async ctx => {
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
                            await dayoUsers.findOneAndUpdate({ chatid: userid }, { blocked: true })
                            await ctx.reply(userid + ' blocked for mass massaging')
                        }

                        else if (my_msg == 'unblock 666') {
                            await dayoUsers.findOneAndUpdate({ chatid: userid }, { blocked: false })
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

                if (ctx.chat.type == 'private') {
                    //only process text messages on private. leave groups to PipyTida
                    //create user if not on database
                    await create(bot, ctx)

                    let userid = ctx.chat.id
                    let txt = ctx.message.text
                    let username = ctx.chat.first_name
                    let mid = ctx.message.message_id

                    //switch kybd, mkeka arrays, forwarding
                    await switchUserText.switchTxt(txt, call_sendMikeka_functions, bot, ctx, imp, userid, username, mid, mkArrs, delay, mid)
                }

            } catch (err) {
                console.log(err.message, err)
            }
        })

        bot.on(('message:photo'), async ctx => {
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

                else if (ctx.chat.type == 'private' && chatid != imp.halot) {
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

        setInterval(() => {
            let [hrs, mins] = new Date().toLocaleTimeString('en-GB', { timeZone: 'Africa/Nairobi', timeStyle: 'short', hour12: false }).split(':')
            console.log(hrs + ':' + mins)

            //post saa mbili asbh hadi saa nane usiku
            if (Number(hrs) > 7 || Number(hrs) < 3) {
                if (Number(mins) == 19) {
                    postingFn(bot, imp).catch(e => console.log(e.message))
                    bot.api.sendMessage(imp.shemdoe, `1h passed, link posted at ${hrs}:${mins}`, { disable_notification: true })
                        .catch(e => console.log(e.message))
                }
            }

        }, 60000)
    } catch (error) {
        console.log("(Dayo) " + error.message, error)
    }
}

module.exports = {
    DayoBot
}