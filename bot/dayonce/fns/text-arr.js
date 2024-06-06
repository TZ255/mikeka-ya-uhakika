const txtArr = async (txt, call_sendMikeka_functions, bot, ctx, imp, userid, username, mid, mkArrs, delay, rp_id) => {
    const mikekaFns = require('./mkeka-1-2-3')
    try {
        switch (txt) {
            case 'MKEKA 1':
                if (ctx.chat.type == 'private') {
                    await call_sendMikeka_functions.sendMkeka1(ctx, delay, bot, imp, rp_id,);
                } else {
                    await mikekaFns.elekezaDM(bot, ctx, imp, delay)
                }
                break;
            case 'MKEKA 2':
                if (ctx.chat.type == 'private') {
                    await call_sendMikeka_functions.sendMkeka2(ctx, delay, bot, imp, rp_id);
                } else {
                    await mikekaFns.elekezaDM(bot, ctx, imp, delay)
                }
                break;
            case 'MKEKA 3':
                if (ctx.chat.type == 'private') {
                    await call_sendMikeka_functions.sendMkeka3(ctx, delay, bot, imp, rp_id);
                } else {
                    await mikekaFns.elekezaDM(bot, ctx, imp, delay)
                }
                break;
            case '💯 BetWinner App (200% Bonus)':
                await bot.telegram.copyMessage(userid, imp.matangazoDB, 102);
                break;
            case '👑 SUPATIPS':
                await call_sendMikeka_functions.supatips(ctx, bot, delay, imp);
                break;
            case '💡 MSAADA':
                await bot.telegram.copyMessage(ctx.chat.id, imp.mikekaDB, 481);
                break;
            case '🔥 MIKEKA YA UHAKIKA LEO 💰':
                await bot.telegram.copyMessage(ctx.chat.id, imp.mikekaDB, 592);
                break;
            case '🪙 Crypto User (Get Free 5 USDT) 🪙':
                await ctx.sendChatAction('typing');
                setTimeout(() => {
                    bot.telegram.copyMessage(userid, imp.matangazoDB, 84, {
                        reply_markup: {
                            inline_keyboard: [[{ text: "➕ RECEIVE YOUR 5 USDT", url: 'https://bc.game/i-vhy4ij2x-n/' }]]
                        }
                    }).catch(e => console.log(e.message));
                }, 1500);
                break;
            default:
                //check if ni mkeka anataka
                if ( txt && mkArrs.some(m => txt.toLowerCase().includes(m))) {
                    await ctx.sendChatAction('typing');
                    await delay(1000);
                    await bot.telegram.copyMessage(userid, imp.pzone, 7664);
                } else {
                    if (ctx.chat.type == 'private')
                        await bot.telegram.sendMessage(imp.halot, `<b>${txt}</b> \n\nfrom = <code>${username}</code>\nid = <code>${userid}</code>&mid=${mid}`, { parse_mode: 'HTML', disable_notification: true });
                }
        }
    } catch (error) {
        console.log(error.message, error)
    }
}

module.exports = {
    switchTxt: txtArr
}