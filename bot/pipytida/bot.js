

const PipyBot = async () => {

    const { Telegraf } = require('telegraf')
    const bot = new Telegraf(process.env.PIPY_TOKEN)
        .catch((err) => console.log(err.message))

    const pipyUsers = require('./database/chats')
    const tg_slips = require('./database/tg_slips')
    const vidb = require('./database/db')
    const mkekaMega = require('./database/mkeka-mega')
    const call_sendMikeka_functions = require('./fns/mkeka-1-2-3')

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
        mkekaLeo: -1001733907813
    }

    const mkArrs = ['mkeka', 'mkeka1', 'mkeka2', 'mkeka3', 'mikeka', 'mkeka wa leo', 'mikeka ya leo', 'mkeka namba 1', 'mkeka namba 2', 'mkeka namba 3', 'mkeka #1', 'mkeka #2', 'mkeka #3', 'mkeka no #1', 'mkeka no #2', 'mkeka no #3', 'za leo', 'naomba mkeka', 'naomba mikeka', 'naomba mkeka wa leo', 'nitumie mkeka', 'ntumie mkeka', 'nitumie mikeka ya leo', 'odds', 'odds za leo', 'odds ya leo', 'mkeka waleo', 'mkeka namba moja', 'mkeka namba mbili', 'mkeka namba tatu', 'nataka mkeka', 'nataka mikeka', 'mkeka wa uhakika', 'odds za uhakika', 'mkeka?', 'mkeka wa leo?', '/mkeka 1', '/mkeka 2', '/mkeka 3']

    async function create(bot, ctx) {
        let starter = await pipyUsers.findOne({ chatid: ctx.chat.id })
        if (!starter) {
            await pipyUsers.create({
                chatid: ctx.chat.id,
                username: ctx.chat.first_name,
                promo: 'unknown',
                refferer: "Pipy"
            })
            console.log('New user added to DB (Pipy)')
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

    bot.start(async ctx => {
        try {
            if (ctx.startPayload) {
                let pload = ctx.startPayload
                let rahatupu = `https://t.me/+PWiPWm0vB5Y4ZDhk`
                let urafiki = `https://t.me/+EOEvgGu3B49lYmY0`
                let utamuFolder = `https://t.me/addlist/88O_60izot4xNmE0`
                if (pload == 'ngono_bongo') {
                    console.log('Ngono Payload Started')
                    await bot.telegram.copyMessage(ctx.chat.id, imp.pzone, 8859, {
                        reply_markup: defaultReplyMkp
                    })
                }
                //add to database
                await create(bot, ctx)

            } else {
                await bot.telegram.copyMessage(ctx.chat.id, imp.pzone, 7653, {
                    reply_markup: defaultReplyMkp
                })

                let stt = await pipyUsers.findOne({ chatid: ctx.chat.id })
                if (!stt) {
                    await pipyUsers.create({
                        chatid: ctx.chat.id,
                        username: ctx.chat.first_name,
                        refferer: "Pipy"
                    })
                    await bot.telegram.sendMessage(imp.logsBin, '(Pipy) New user found me - Added to DB')
                }
            }

        } catch (err) {
            console.log(err.message)
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
            await bot.telegram.copyMessage(ctx.chat.id, imp.pzone, 7653)
            await create(bot, ctx)
        } catch (err) {
            console.log(err.message)
        }

    })

    bot.command('supatips', async ctx => {
        try {
            await call_sendMikeka_functions.supatips(ctx, bot, delay, imp)
        } catch (error) {
            console.log(err.message)
        }
    })

    bot.command('convo', async ctx => {
        let myId = ctx.chat.id
        let txt = ctx.message.text
        let msg_id = Number(txt.split('/convo-')[1].trim())
        let bads = ['deactivated', 'blocked']
        if (myId == imp.shemdoe || myId == imp.halot) {
            try {
                let all_users = await pipyUsers.find({ refferer: "Pipy" })

                all_users.forEach((u, index) => {
                    if (u.blocked != true) {
                        setTimeout(() => {
                            if (index == all_users.length - 1) {
                                ctx.reply('Nimemaliza conversation')
                            }
                            bot.telegram.copyMessage(u.chatid, imp.mikekaDB, msg_id, { reply_markup: defaultReplyMkp })
                                .then(() => console.log('✅ convo sent to ' + u.chatid))
                                .catch((err) => {
                                    if (bads.some((b) => err.message.toLowerCase().includes(b))) {
                                        pipyUsers.findOneAndDelete({ chatid: u.chatid })
                                            .then(() => { console.log(`🚮 Deleted (${index + 1})`) })
                                    } else{console.log(`🤷‍♂️ ${err.message}`)}
                                })
                        }, index * 40)
                    }
                })
            } catch (err) {
                console.log(err.message)
            }
        }

    })

    bot.command(['mkeka', 'mkeka1'], async ctx => {
        try {
            await call_sendMikeka_functions.sendMkeka1(ctx, delay, bot, imp)
        } catch (err) {
            console.log(err)
            await bot.telegram.sendMessage(imp.shemdoe, err.message)
                .catch(e => console.log(e.message))
        }
    })

    bot.command('mkeka2', async ctx => {
        try {
            await call_sendMikeka_functions.sendMkeka2(ctx, delay, bot, imp)
        } catch (err) {
            console.log(err)
            await bot.telegram.sendMessage(imp.shemdoe, err.message)
                .catch(e => console.log(e.message))
        }
    })

    bot.command('mkeka3', async ctx => {
        try {
            await call_sendMikeka_functions.sendMkeka3(ctx, delay, bot, imp)
        } catch (err) {
            await bot.telegram.sendMessage(imp.shemdoe, err.message)
                .catch((e) => console.log(e.message))
            console.log(err.message)
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
            .catch((err) => console.log(err.message))
    })

    bot.command('kujisajili', async ctx => {
        try {
            await bot.telegram.copyMessage(ctx.chat.id, imp.pzone, 7595)
        } catch (err) {
            console.log(err.message)
        }
    })

    bot.command('kudeposit', async ctx => {
        try {
            await bot.telegram.copyMessage(ctx.chat.id, imp.pzone, 7596)
        } catch (err) {
            console.log(err.message)
        }
    })

    bot.command('stats', async ctx => {
        try {
            let nyumbusP = await pipyUsers.countDocuments({ refferer: "Pipy" })
            let jumla = nyumbusP
            let unknown = await pipyUsers.countDocuments({ promo: "unknown" })
            unknown = unknown.toLocaleString('en-us')
            premier = premier.toLocaleString('en-us')
            let premier = await pipyUsers.countDocuments({ promo: "premier" })
            await ctx.reply(`Mpaka sasa kwenye Database yetu tuna nyumbu <b>${nyumbusP.toLocaleString('en-us')}</b> wa Pipy.\n\nJumla kuu ni <b>${jumla.toLocaleString('en-us')}</b>. \n\nWote unique, kama tayari mmoja wetu kamuongeza mimi simuongezi.\n\nPia upande wa promo tuko na:\n1. Uncategoriized: ${unknown}\n2. Premier: ${premier}`, { parse_mode: 'HTML' })
        } catch (err) {
            console.log(err.message)
        }
    })

    bot.command(['jisajili_m', 'deposit_m'], async ctx => {
        try {
            await bot.telegram.copyMessage(ctx.chat.id, imp.pzone, 7652)
        } catch (err) {
            console.log(err.message)
        }
    })

    bot.command('betbuilder', async ctx => {
        try {
            await bot.telegram.copyMessage(ctx.chat.id, imp.pzone, 7655)
        } catch (err) {
            console.log(err.message)
        }
    })

    bot.action(['jisajili_m', 'deposit_m'], async ctx => {
        try {
            await bot.telegram.copyMessage(ctx.chat.id, imp.pzone, 7652)
        } catch (err) {
            console.log(err.message)
        }
    })

    bot.action('accept_pload', async ctx => {
        try {
            let pload_link = `https://t.me/+PWiPWm0vB5Y4ZDhk`
            let org_msg_id = ctx.callbackQuery.message.message_id
            await ctx.deleteMessage(org_msg_id)
            await ctx.reply(`Hongera 👏 Ombi lako la kujiunga na channel yetu limekubaliwa\n\n🔞 <b>Ingia Sasa\n${pload_link}\n${pload_link}</b>`, { parse_mode: 'HTML' })
        } catch (err) {
            console.log(err.message)
        }

    })

    bot.command(['wakubwa', 'sodoma', 'sex', 'wadogo'], async ctx => {
        try {
            await bot.telegram.copyMessage(ctx.chat.id, imp.pzone, 8094)
        } catch (err) {
            console.log(err.message)
        }
    })

    bot.on('text', async ctx => {
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

                }

                else if (ctx.message.reply_to_message.photo) {
                    let my_msg = ctx.message.text
                    let umsg = ctx.message.reply_to_message.caption
                    let ids = umsg.split('id = ')[1].trim()
                    let userid = Number(ids.split('&mid=')[0])
                    let mid = Number(ids.split('&mid=')[1])


                    await bot.telegram.sendMessage(userid, my_msg, { reply_to_message_id: mid })
                }
            }


            else {
                //create user if not on database
                await create(bot, ctx)

                let userid = ctx.chat.id
                let txt = ctx.message.text
                let username = ctx.chat.first_name
                let mid = ctx.message.message_id

                //check if ni mkeka
                if (mkArrs.includes(txt.toLowerCase())) {
                    await ctx.sendChatAction('typing')
                    await delay(1000)
                    await bot.telegram.copyMessage(userid, imp.pzone, 7664)
                } else if (txt == 'MKEKA 1') {
                    await call_sendMikeka_functions.sendMkeka1(ctx, delay, bot, imp)
                } else if (txt == 'MKEKA 2') {
                    await call_sendMikeka_functions.sendMkeka2(ctx, delay, bot, imp)
                } else if (txt == 'MKEKA 3') {
                    await call_sendMikeka_functions.sendMkeka3(ctx, delay, bot, imp)
                } else if (txt == '👑 SUPATIPS') {
                    await call_sendMikeka_functions.supatips(ctx, bot, delay, imp)
                } else if (txt == '💡 MSAADA') {
                    await bot.telegram.copyMessage(ctx.chat.id, imp.mikekaDB, 481)
                } else if (txt == '🔥 MIKEKA YA UHAKIKA LEO 💰') {
                    await bot.telegram.copyMessage(ctx.chat.id, imp.mikekaDB, 592)
                }
                //forward to me if sio mkeka
                else {
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
            let chatid = ctx.chat.id
            let cap = ctx.message.caption

            if (ctx.message.reply_to_message && chatid == imp.halot) {
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
                    caption: cap + `\n\nfrom = <code>${username}</code>\nid = <code>${chatid}</code>&mid=${mid}`,
                    parse_mode: 'HTML'
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

    bot.launch().then(async () => {
        await bot.telegram.sendMessage(imp.shemdoe, 'Bot Restarted')
    })
        .catch(async e => {
            console.log(e.message + ` \n${e}`)
            await bot.telegram.sendMessage(imp.shemdoe, e.message)
        })
}

module.exports = {
    PipyBot
}