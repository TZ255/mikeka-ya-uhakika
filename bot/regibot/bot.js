


const reginaBot = async () => {
    try {
        const { Telegraf } = require('telegraf')
        const bot = new Telegraf(process.env.REGI_TOKEN)
            .catch((err) => console.log(err.message))

        const nyumbuModel = require('./database/chats')
        const tempChat = require('./database/temp-req')
        const my_channels_db = require('./database/my_channels')
        const mkekadb = require('./database/mkeka')
        const tg_slips = require('./database/tg_slips')
        const vidb = require('./database/db')
        const mkekaMega = require('./database/mkeka-mega')
        const graphDB = require('./database/graph-tips')
        const waombajiModel = require('./database/waombaji')
        const supatips_Model = require('./database/supatips')


        const call_supatips_function = require('./fns/supatips')
        const call_fametips_function = require('./fns/fametips')
        const call_famescheduled_fn = require('./fns/fame-scheduled')
        const call_betslip_function = require('./fns/betslip')
        const call_oncallbackquery_function = require('./fns/oncallbackquery')
        const call_sendMikeka_functions = require('./fns/mkeka-1-2-3')
        const call_scheduled_checker_fn = require('./fns/scheduled-odds')
        const call_venas15_fn = require('./fns/venas15')
        const call_venas25_fn = require('./fns/venas25')

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
        }

        const mkArrs = ['mkeka', 'mkeka1', 'mkeka2', 'mkeka3', 'mikeka', 'mkeka wa leo', 'mikeka ya leo', 'mkeka namba 1', 'mkeka namba 2', 'mkeka namba 3', 'mkeka #1', 'mkeka #2', 'mkeka #3', 'mkeka no #1', 'mkeka no #2', 'mkeka no #3', 'za leo', 'naomba mkeka', 'naomba mikeka', 'naomba mkeka wa leo', 'nitumie mkeka', 'ntumie mkeka', 'nitumie mikeka ya leo', 'odds', 'odds za leo', 'odds ya leo', 'mkeka waleo', 'mkeka namba moja', 'mkeka namba mbili', 'mkeka namba tatu', 'nataka mkeka', 'nataka mikeka', 'mkeka wa uhakika', 'odds za uhakika', 'mkeka?', 'mkeka wa leo?', '/mkeka 1', '/mkeka 2', '/mkeka 3']

        const gsb_ug = `https://track.africabetpartners.com/visit/?bta=35468&nci=5559`

        async function create(bot, ctx) {
            let starter = await nyumbuModel.findOne({ chatid: ctx.chat.id })
            if (!starter) {
                await nyumbuModel.create({
                    chatid: ctx.chat.id,
                    username: ctx.chat.first_name,
                    refferer: "Regina",
                    blocked: false
                })
                console.log('New user added to DB (Regina)')
            }
        }

        //delaying
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

        let defaultReplyMkp = {
            keyboard: [
                [
                    { text: "🔥 MKEKA 1" },
                    { text: "💰 MKEKA 2" },
                    { text: "🤑 MKEKA 3" },
                ]
            ],
            is_persistent: true,
            resize_keyboard: true
        }

        //bot.telegram.deleteWebhook({ drop_pending_updates: true }).catch(e => console.log(e.message))

        bot.catch((err, ctx) => {
            console.log(err.message, err)
        }).catch(e => console.log(e.message))

        bot.start(async ctx => {
            try {
                if (ctx.payload) {
                    let pload = ctx.payload
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

                    let stt = await nyumbuModel.findOne({ chatid: ctx.chat.id })
                    if (!stt) {
                        await nyumbuModel.create({
                            chatid: ctx.chat.id,
                            username: ctx.chat.first_name,
                            refferer: "Regina"
                        })
                        await bot.telegram.sendMessage(imp.logsBin, '(Regi) New user found me - Added to DB')
                    }
                }

            } catch (err) {
                console.log(err.message, err)
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

        bot.command('graph', async ctx => {
            try {
                let graphs = await graphDB.find()
                let txt = `https://font5.net/mkekawaleo/tanzania\n\n`

                for (let graph of graphs) {
                    txt = txt + `📅 ${graph.siku}\nStats: ${graph.loaded.toLocaleString("en-US")}\nLink: ${graph.link}\n\n`
                }
                await ctx.reply(txt, { disable_web_page_preview: true })
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
            let bads = ['deactivated', 'blocked', 'initiate']
            if (myId == imp.shemdoe || myId == imp.halot) {
                try {
                    let all_users = await nyumbuModel.find({ refferer: "Regina", blocked: false })

                    all_users.forEach((u, index) => {
                        setTimeout(() => {
                            if (index == all_users.length - 1) {
                                ctx.reply('Nimemaliza conversation')
                            }
                            bot.telegram.copyMessage(u.chatid, imp.mikekaDB, msg_id, { reply_markup: defaultReplyMkp })
                                .then(() => console.log('✅ convo sent to ' + u.chatid))
                                .catch((er) => {
                                    if (bads.some((b) => er.message.toLowerCase().includes(b))) {
                                        nyumbuModel.findOneAndDelete({ refferer: 'Regina', chatid: u.chatid })
                                            .then(d => console.log(`🚮 Deleted (${index + 1})`))
                                            .catch(e => console.log(e.message))
                                    } else { console.log(`🤷‍♂️ ${er.message}`) }
                                })
                        }, index * 40)
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

        bot.command('wakesho', async ctx => {
            try {
                let d = new Date()
                d.setDate(d.getDate() + 1)
                let nairobi = d.toLocaleDateString('en-GB', { timeZone: 'Africa/Nairobi' })
                let keka = await mkekaMega.find({ date: nairobi })
                let txt = `<b><u>🔥 Mkeka wa Kesho [ ${nairobi} ]</u></b>\n\n\n`
                let odds = 1
                if (keka) {
                    for (let m of keka) {
                        txt = txt + `<i>🕔 ${m.date},  ${m.time}</i>\n⚽️ ${m.match}\n<b>✅ ${m.bet.replace(/team/g, '').replace(/1 - /g, '1-').replace(/2 - /g, '2-')}</b> <i>@${m.odds}</i> \n\n\n`
                        odds = (odds * m.odds).toFixed(2)
                    }

                    let gsb = 'https://track.africabetpartners.com/visit/?bta=35468&nci=5439'

                    let finaText = txt + `<b>🔥 Total Odds: ${odds}</b>\n\nOption hizi zinapatikana Gal Sport Betting pekee, kama bado huna account,\n\n<b>👤 Jisajili Hapa</b>\n<a href="${gsb}">https://m.gsb.co.tz/register\nhttps://m.gsb.co.tz/register</a>\n\n<u>Msaada </u>\nmsaada wa kuzielewa hizi option bonyeza <b>/maelezo</b>`

                    await ctx.reply(finaText, { parse_mode: 'HTML', disable_web_page_preview: true })
                }
            } catch (err) {
                await bot.telegram.sendMessage(imp.shemdoe, err.message)
                    .catch((e) => console.log(e.message))
                console.log(err.message)
            }

        })

        bot.command('maelezo', async ctx => {
            await bot.telegram.copyMessage(ctx.chat.id, imp.pzone, 7567)
                .catch((err) => console.log(err.message))
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

        bot.command('sll', async ctx => {
            await nyumbuModel.updateMany({}, { $set: { refferer: "Regina" } })
            ctx.reply('Updated')
        })

        bot.command('copy', async ctx => {
            try {
                if (ctx.message.reply_to_message) {
                    let userid = ctx.message.reply_to_message.text
                    userid = Number(userid.split('id = ')[1].split('&mid')[0].trim())

                    let pid = ctx.message.text
                    pid = Number(pid.split(' ')[1])

                    await bot.telegram.copyMessage(userid, imp.pzone, pid)
                    await ctx.reply(`msg with id ${pid} was copied successfully to user with id ${userid}`)
                }
            } catch (err) {
                console.log(err)
                await ctx.reply(err.message).catch(e => console.log(e.message))
            }
        })

        bot.command('post_to_channels', async ctx => {
            let txt = ctx.message.text
            let ch_link = 'https://t.me/+804l_wD7yYgzM2Q0'
            let pload_link = `https://t.me/regina_tzbot?start=ngono_bongo`
            let keyb = [
                [{ text: "❌❌ VIDEO ZA KUTOMBANA HAPA ❤️", url: pload_link },],
                [{ text: "🔥 Unganishwa Na Malaya Mikoa Yote 🔞", url: pload_link },],
                [{ text: "🍑🍑 Magroup Ya Ngono na Madada Poa 🔞", url: pload_link },],
                [{ text: "💋 XXX ZA BONGO ❌❌❌", url: pload_link },],
                [{ text: "🔥🔥 Connection Za Chuo na Mastaa 🔞", url: pload_link }]
            ]

            let mid = Number(txt.split('post_to_channels=')[1])

            let channels = await my_channels_db.find()

            for (ch of channels) {
                await bot.telegram.copyMessage(ch.ch_id, imp.pzone, mid, {
                    disable_notification: true,
                    reply_markup: {
                        inline_keyboard: keyb
                    }
                })
            }
        })

        bot.command('kujisajili_bw', async ctx => {
            try {
                await bot.telegram.copyMessage(ctx.chat.id, imp.matangazoDB, 99)
            } catch (err) {
                console.log(err.message)
            }
        })

        bot.command('app_bw', async ctx => {
            try {
                await bot.telegram.copyMessage(ctx.chat.id, imp.matangazoDB, 97)
            } catch (err) {
                console.log(err.message)
            }
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
                let nyumbusH = await nyumbuModel.countDocuments({ refferer: "Helen" })
                let nyumbusR = await nyumbuModel.countDocuments({ refferer: "Regina" })
                let jumla = nyumbusH + nyumbusR
                await ctx.reply(`Mpaka sasa kwenye Database yetu tuna nyumbu <b>${nyumbusH.toLocaleString('en-us')}</b> wa Helen na nyumbu <b>${nyumbusR.toLocaleString('en-us')}</b> wa Regina.\n\nJumla kuu ni <b>${jumla.toLocaleString('en-us')}</b>. \n\nWote unique, kama tayari mmoja wetu kamuongeza mimi simuongezi.`, { parse_mode: 'HTML' })
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

        bot.command('block', async ctx => {
            try {
                if (ctx.chat.id == imp.shemdoe) {
                    let chatid = Number(ctx.message.text.split('block=')[1])
                    await nyumbuModel.findOneAndUpdate({ chatid }, { $set: { blocked: true } })
                    await ctx.reply('User blocked successfully')
                }
            } catch (err) {
                await ctx.reply(err.message)
            }
        })

        bot.action('betbuilder', async ctx => {
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
                console.log(err.message, err)
            }

        })

        bot.on('channel_post', async ctx => {
            let txt = ctx.channelPost.text
            let txtid = ctx.channelPost.message_id

            try {
                if (ctx.channelPost.text) {
                    if (txt.toLowerCase().includes('add me')) {
                        let ch_id = ctx.channelPost.sender_chat.id
                        let ch_title = ctx.channelPost.sender_chat.title

                        let check_ch = await my_channels_db.findOne({ ch_id })
                        if (!check_ch) {
                            await my_channels_db.create({ ch_id, ch_title })
                            let uj = await ctx.reply('channel added to db')
                            await bot.telegram.deleteMessage(ch_id, txtid)
                            setTimeout(() => {
                                bot.telegram.deleteMessage(ch_id, uj.message_id)
                                    .catch((err) => console.log(err))
                            }, 1000)
                        } else {
                            let already = await ctx.reply('Channel Already existed')
                            setTimeout(() => {
                                bot.telegram.deleteMessage(ch_id, already.message_id)
                                    .catch((err) => console.log(err))
                            }, 1000)
                        }
                    }
                    else if (txt.toLowerCase().includes('wrap gsb')) {
                        let waombaji = await waombajiModel.findOne({ pid: 'shemdoe' })
                        await ctx.reply(`Hizi ni stats zilizopita:\n\n- Mkeka 1 = ${waombaji.mk1}\n- Mkeka 2 = ${waombaji.mk2}\n- Mkeka 3 = ${waombaji.mk3}\n\nPost mkeka mpya ku reset`)
                        await delay(1000)
                        await bot.telegram.copyMessage(ctx.chat.id, imp.mikekaDB, 2652)
                        await delay(500)
                        await ctx.deleteMessage(txtid)
                    }
                    else if (txt.toLowerCase().includes('wrap betway')) {
                        let waombaji = await waombajiModel.findOne({ pid: 'shemdoe' })
                        await ctx.reply(`Hizi ni stats zilizopita:\n\n- Mkeka 1 = ${waombaji.mk1}\n- Mkeka 2 = ${waombaji.mk2}\n- Mkeka 3 = ${waombaji.mk3}\n\nPost mkeka mpya ku reset`)
                        await delay(1000)
                        await bot.telegram.copyMessage(ctx.chat.id, imp.mikekaDB, 2608)
                        await delay(500)
                        await ctx.deleteMessage(txtid)
                    }
                    else if (txt.toLowerCase().includes('wrap betwinner')) {
                        await bot.telegram.copyMessage(ctx.chat.id, imp.mikekaDB, 2582)
                        await delay(500)
                        await ctx.deleteMessage(txtid)
                    }
                    else if (txt.toLowerCase().includes('wrap meridian')) {
                        await bot.telegram.copyMessage(ctx.chat.id, imp.mikekaDB, 55)
                        await delay(500)
                        await ctx.deleteMessage(txtid)
                    }
                    else if (txt.toLowerCase().includes('wrap pm')) {
                        let waombaji = await waombajiModel.findOne({ pid: 'shemdoe' })
                        await ctx.reply(`Hizi ni stats zilizopita:\n\n- Mkeka 1 = ${waombaji.mk1}\n- Mkeka 2 = ${waombaji.mk2}\n- Mkeka 3 = ${waombaji.mk3}\n\nPost mkeka mpya ku reset`)
                        await delay(1000)
                        await bot.telegram.copyMessage(ctx.chat.id, imp.mikekaDB, 1770)
                        await delay(500)
                        await ctx.deleteMessage(txtid)
                    }
                    else if (txt.toLowerCase().includes('delete mkeka') && ctx.channelPost.reply_to_message) {
                        let siku = new Date().toLocaleDateString('en-gb', { timeZone: 'Africa/Nairobi' })
                        let mid = ctx.channelPost.reply_to_message.message_id
                        await tg_slips.findOneAndDelete({ mid, siku })
                        let mm = await ctx.reply('Mkeka Deleted')
                        await delay(2000)
                        await ctx.deleteMessage(mm.message_id)
                    }
                }

                // for regina only
                if (ctx.channelPost.reply_to_message && ctx.channelPost.chat.id == imp.mikekaDB) {
                    let rp_id = ctx.channelPost.reply_to_message.message_id
                    let rp_msg = ctx.channelPost.reply_to_message.text

                    if (txt.includes(' - ') && !txt.toLowerCase().includes('graph')) {
                        let data = txt.split(' - ')

                        //create mkeka
                        let brand = data[0].toLowerCase()
                        let siku = data[1] + '/2024'

                        //check if already there
                        let check1 = await tg_slips.findOne({ brand, siku })
                        //if there update, if not create
                        if (check1) {
                            await check1.updateOne({ $set: { mid: rp_id } })
                        } else {
                            await tg_slips.create({ brand, siku, mid: rp_id, posted: false })
                        }

                        //reset waombaji db
                        await waombajiModel.findOneAndUpdate({ pid: 'shemdoe' }, { $set: { mk1: 0, mk2: 0, mk3: 0 } })

                        let info = await ctx.reply(`Mkeka for ${siku} posted & waombaji reseted`, { reply_to_message_id: rp_id })
                        setTimeout(() => {
                            ctx.deleteMessage(info.message_id).catch(e => {
                                console.log(e.message, e)
                                ctx.reply(e.message).catch(ee => console.log(ee))
                            })
                        }, 3000)
                    }
                    else if (txt.toLowerCase() == 'delete') {
                        await tg_slips.findOneAndDelete({ mid: rp_id })
                        await ctx.reply('This post deleted from DB', { reply_to_message_id: rp_id })
                    }
                    else if (txt.toLowerCase().includes('graph')) {
                        let link = ctx.channelPost.reply_to_message.text
                        let siku = txt.split('ph - ')[1]
                        await graphDB.create({
                            link,
                            siku: siku + '/2023'
                        })
                        let info = await ctx.reply('Graph posted', { reply_to_message_id: rp_id })
                        await delay(2000)
                        await ctx.deleteMessage(info.message_id)
                    }
                }

            } catch (err) {
                console.log(err)
                if (!err.message) {
                    await bot.telegram.sendMessage(imp.shemdoe, err.description)
                } else {
                    await bot.telegram.sendMessage(imp.shemdoe, err.message)
                }
            }
        })

        bot.command('send', async ctx => {
            try {
                let all = await supatips_Model.updateMany({siku: "09/05/2024"}, {$set: {matokeo: "-:-"}})
                console.log('done')
            } catch (error) {
                console.log(error.message)
            }
        })

        bot.command(['wakubwa', 'sodoma', 'sex', 'wadogo'], async ctx => {
            try {
                await bot.telegram.copyMessage(ctx.chat.id, imp.pzone, 8094)
            } catch (err) {
                console.log(err.message)
            }
        })

        bot.command('pending', async ctx => {
            try {
                let baki = await tempChat.countDocuments()
                await ctx.reply('Tuna requests ' + baki)
            } catch (err) {
                console.log(err.message)
            }
        })

        bot.command('approving', async ctx => {
            let man = ctx.chat.id
            try {
                if (man == imp.halot || man == imp.shemdoe) {
                    let all = await tempChat.countDocuments()
                    let toBeApproved = await tempChat.find().limit(all - 10)
                    for (let u of toBeApproved) {
                        await bot.telegram.approveChatJoinRequest(u.cha_id, u.chatid)
                            .catch(async (e) => { await u.deleteOne() })
                        console.log(u.chatid + ' approved')
                        await u.deleteOne()
                        await delay(40)
                    }
                }
            } catch (err) {
                console.log(err.message)
            }
        })

        call_supatips_function(bot)
        call_fametips_function(bot)
        call_betslip_function(bot, imp)
        call_oncallbackquery_function(bot, delay)

        bot.on('message', async ctx => {
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
                            await nyumbuModel.findOneAndUpdate({ chatid: userid }, { blocked: true })
                            await ctx.reply(userid + ' blocked for mass massaging')
                        }

                        else if (my_msg == 'unblock 666') {
                            await nyumbuModel.findOneAndUpdate({ chatid: userid }, { blocked: false })
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
                    } else if (txt == '🔥 MKEKA 1' || txt == '🔥 MKEKA #1') {
                        await call_sendMikeka_functions.sendMkeka1(ctx, delay, bot, imp)
                    } else if (txt == '💰 MKEKA 2' || txt == '💰 MKEKA #2') {
                        await call_sendMikeka_functions.sendMkeka2(ctx, delay, bot, imp)
                    } else if (txt == '🤑 MKEKA 3' || txt == '🤑 MKEKA #3') {
                        await call_sendMikeka_functions.sendMkeka3(ctx, delay, bot, imp)
                    } else if (txt == '💯 BetWinner App (200% Bonus)' || txt.toLowerCase() == 'betwinner') {
                        await bot.telegram.copyMessage(userid, imp.matangazoDB, 102)
                    } else if (txt == '👑 SUPATIPS') {
                        await call_sendMikeka_functions.supatips(ctx, bot, delay, imp)
                    } else if (txt == '💡 MSAADA') {
                        await bot.telegram.copyMessage(ctx.chat.id, imp.mikekaDB, 481)
                    } else if (txt == '🔥 MIKEKA YA UHAKIKA LEO 💰') {
                        await bot.telegram.copyMessage(ctx.chat.id, imp.mikekaDB, 592)
                    } else if (txt == '🪙 Crypto User (Get Free 5 USDT) 🪙') {
                        await ctx.sendChatAction('typing')
                        setTimeout(() => {
                            bot.telegram.copyMessage(userid, imp.matangazoDB, 84, {
                                reply_markup: {
                                    inline_keyboard: [[{ text: "➕ RECEIVE YOUR 5 USDT", url: 'https://bc.game/i-vhy4ij2x-n/' }]]
                                }
                            }).catch(e => console.log(e.message))
                        }, 1500)
                    }
                    //forward to me if sio mkeka
                    else {
                        if (ctx.chat.type == 'private') {
                            await bot.telegram.sendMessage(imp.halot, `<b>${txt}</b> \n\nfrom = <code>${username}</code>\nid = <code>${userid}</code>&mid=${mid}`, { parse_mode: 'HTML', disable_notification: true })
                        }
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

        setInterval(() => {
            let now = new Date().toLocaleTimeString('en-GB', { timeZone: 'Africa/Nairobi' })
            let timeStrings = now.split(':')
            let time2check = `${timeStrings[0]}:${timeStrings[1]}`
            console.log(time2check)
            let trhLeo = new Date().toLocaleDateString('en-GB', { timeZone: 'Africa/Nairobi' })

            //kesho
            let k = new Date()
            k.setDate(k.getDate() + 1)
            let trhKesho = k.toLocaleDateString('en-GB', { timeZone: 'Africa/Nairobi' })

            //jana
            let j = new Date()
            j.setDate(j.getDate() - 1)
            let trhJana = j.toLocaleDateString('en-GB', { timeZone: 'Africa/Nairobi' })

            switch (time2check) {
                case '03:10':
                case '03:30':
                case '04:10':
                case '06:00':
                case '08:00':
                case '09:00':
                case '10:00':
                case '11:00':
                case '12:00':
                case '13:00':
                    call_scheduled_checker_fn.checkOdds(bot, imp, 'div#nav-profile', trhLeo)
                    break;

                case '19:30':
                case '20:30':
                case '21:45':
                case '22:30':
                case '23:45':
                    call_scheduled_checker_fn.checkOdds(bot, imp, 'div#nav-contact', trhKesho)
                    break;

                //fametips
                case '06:07':
                case '08:07':
                case '09:07':
                case '10:07':
                case '12:07':
                case '15:07':
                    call_famescheduled_fn.famecheckMatokeo(bot, imp, '#pills-home', trhJana)
                    break;

                case '03:07': case '04:07': case '05:07': case '06:17': case '09:17':
                    call_famescheduled_fn.famecheckOdds(bot, imp, '#pills-profile', trhLeo)
                    break;

                case '16:07':
                case '18:07':
                case '19:07':
                case '20:07':
                case '21:07':
                case '22:07':
                case '23:07':
                case '23:57':
                    call_famescheduled_fn.famecheckOdds(bot, imp, '#pills-contact', trhKesho)
                    break;

                //venas 1.5 & 2.5 odds
                case '00:12': case '01:12': case '02:12': case '03:12': case '06:02': case '07:02': case '08:02': case '04:46':
                    call_venas15_fn.checkOdds(bot, imp)
                    call_venas25_fn.checkOdds(bot, imp)
                    break;

                //venas 1.5 & 2.5 odds
                case '15:12': case '16:12': case '17:12': case '18:12': case '19:02': case '20:02': case '21:02': case '22:02': case '23:12':
                    call_venas15_fn.checkTomorrowOdds(bot, imp)
                    call_venas25_fn.checkTomorrowOdds(bot, imp)
                    break;

                //venas 1.5 & 2.5 matokeo
                case '03:13': case '05:13': case '07:13': case '08:13': case '09:13': case '11:03':
                    call_venas15_fn.checkMatokeoJana(bot, imp)
                    call_venas25_fn.checkMatokeoJana(bot, imp)
                    break;
            }
        }, 59 * 1000)

        bot.launch().catch(e=> {
            if (e.message.includes('409: Conflict: terminated by other getUpdates')) {
                bot.stop('new update')
            }
        })
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    rbot: reginaBot
}