const OpenAI = require('openai');
const { z } = require('zod')
const { zodTextFormat } = require('openai/helpers/zod');

const axios = require('axios')
const rtStarterModel = require('../database/chats');
const miamalaModel = require('../database/miamala');
const { checkPaidIfMemberPilauZone } = require('./fn');

//response format:
const { examples } = require('./gpt-examples/examples')

//miamala schema
const miamalaSchema = z.object({
    ok: z.boolean().describe('True if at least name, trans_id and amount are found, false otherwise'),
    name: z.string()
        .transform(val => val.toUpperCase())
        .describe("Sender's name. Always transform to capital letter"),
    phone: z.string()
        .default('+255100')
        .describe('Phone number with the country code including the + sign. If missing write +255100 as phone number'),
    trans_id: z.string().describe('Transaction ID/reference number'),
    amount: z.number()
        .int()
        .describe('Transaction amount in numeric form. Excluding the decimal parts'),
});

const extractMiamalaInfo = async (bot, ctx, imp) => {
    const miamala = ['From: M-PESA', 'From: MIXX BY YAS']
    const junkies = ['TIPS-', 'has received', 'Transfered', 'sent to', 'from Changisha account']
    try {
        let txt = ctx.channelPost.text ? ctx.channelPost.text : 'no text'
        let msgid = ctx.channelPost.message_id;

        //filtering the text
        //check if any term of miamala exist
        let includesMiamala = miamala.some(term => txt.includes(term));
        //check if all term of junkies doestnt exist
        let excludesJunkies = junkies.every(term => !txt.includes(term));

        if (includesMiamala && excludesJunkies) {
            let muamala = txt.split('Message:')[1];
            let command = `"${muamala}"\n\nExtract information according to the response_format provided. Refer to the following examples for the valid response:\n\nExample 1: ${examples.ex1}\n\nExample 2: ${examples.ex2}\n\nExample 3: ${examples.ex3}\n\nExample 4: ${examples.ex4}\n\nExample 5: ${examples.ex5}\n\nExample 6: ${examples.ex6}\n\nFor the following examples always return "ok: false" as they contains companies names or they have no sender names. Example 1: "${examples.false1}"\nExample 2: "${examples.false2}"`;

            const openai = new OpenAI({
                apiKey: process.env.openAIKey,
            });

            const response = await openai.responses.parse({
                model: "gpt-5-mini",
                input: command,
                text: {
                    format: zodTextFormat(miamalaSchema, "parsedTransaction"),
                },
            });

            const parsedTransaction = response.output_parsed;

            if (!parsedTransaction.ok) {
                return await ctx.reply('Some information is not found', {
                    reply_parameters: { message_id: userTrans },
                });
            }

            let validate = await miamalaModel.findOne({ txid: parsedTransaction.trans_id })
            if (!validate) {
                let upd = await miamalaModel.create({
                    name: parsedTransaction.name, phone: parsedTransaction.phone, txid: parsedTransaction.trans_id, amt: parsedTransaction.amount
                })

                await ctx.reply(
                    `<code>${upd.txid}</code> of amt <code>${upd.amt}</code> saved to db`,
                    { parse_mode: 'HTML', disable_notification: 'true', reply_parameters: { message_id: msgid } }
                );
            }
        }
    } catch (error) {
        await ctx.reply(error.message);
        console.error(error.message, error);
    }
};

const addingBusinessPoints = async (bot, ctx, chatid, points, imp, delay, txid, emoji) => {
    try {
        //channel links
        let android = `https://t.me/+RFRJJNq0ERM1YTBk`
        let iphone = `https://t.me/+dGYRm-FoKJI3MWM8`
        let muvika = `https://t.me/+9CChSlwpGWk2YmI0`

        //bonus points
        let pts = points
        if (pts >= 3000 && pts < 4000) {
            pts = pts + 300
        } else if (pts >= 4000 && pts < 5000) {
            pts = pts + 500
        } else if (pts >= 5000 && pts < 10000) {
            pts = pts + 1000
        } else if (pts >= 10000) {
            pts = pts + 2000
        }

        //update user points
        let upuser = await rtStarterModel.findOneAndUpdate({ chatid }, {
            $inc: { points: pts },
            $set: { paid: true }
        }, { new: true })

        await rtStarterModel.findOneAndUpdate({ chatid: imp.rtmalipo }, { $inc: { revenue: points } })

        let txt2 = `<b>Hongera 🎉 \nMalipo yako yamethibitishwa. Umepokea Points ${pts} na sasa una jumla ya Points ${upuser.points} kwenye account yako ya RT Premium.</b>\n\nTumia points zako vyema. Kumbuka Kila video utakayo download itakugharimu Points 250.\n\n\n<b>Enjoy, ❤.</b>`

        let txt3 = `<b>Points ${points} zimeondolewa kwenye account yako na Admin. Umebakiwa na points ${upuser.points}.</b>`

        let txt4 = `${emoji} Malipo yako yamethibitishwa. <b>Points ${pts}</b> zimeongezwa kwenye account yako na sasa una jumla ya points <b>${upuser.points}</b>.\n\n<blockquote>This is an automated message confirming your transaction with id <code>${txid}</code></blockquote>`

        let rtAPI = `https://api.telegram.org/bot${process.env.RT_TOKEN}/sendMessage`
        let plAPI = `https://api.telegram.org/bot${process.env.PL_TOKEN}/sendMessage`
        let mvAPI = `https://api.telegram.org/bot${process.env.MUVIKA_TOKEN}/sendMessage`

        //delay for 1 seconds
        await delay(1000)
        await ctx.reply(txt4, { parse_mode: 'HTML' })
        let data = { chat_id: chatid, text: txt2, parse_mode: 'HTML' }
        if (points < 0) {
            data.text = txt3
        }
        //send to users acording to the bot he using
        switch (upuser.refferer) {
            case 'rahatupu_tzbot':
                axios.post(rtAPI, data).catch(e => console.log(e.message))
                break;
            case 'pilau_bot':
                axios.post(plAPI, data).catch(e => console.log(e.message))
                break;
            case 'muvikabot':
                axios.post(mvAPI, data).catch(e => console.log(e.message))
                break;
        }

        //check if is member to pilauzone. if not send the link
        let tgstamp = ctx.businessMessage.date
        let expire = tgstamp + (60 * 60) //1 hour
        let pilau_link = await checkPaidIfMemberPilauZone(bot, chatid, imp.newRT, expire, imp.rtmalipo)
        let invite_msg = `Pia tunakukumbusha kujiunga na channel yetu mpya. Kwa videos mpya kila siku jiunge na channel yetu hapa chini \n\n<b>RT - PILAU ZONE 😜 \n${pilau_link}\n${pilau_link}</b>`
        //send the message
        if (pilau_link != false) {
            let idata = {
                chat_id: chatid, text: invite_msg, parse_mode: 'HTML',
                link_preview_options: { is_disabled: true }
            }
            switch (upuser?.refferer) {
                case 'rahatupu_tzbot':
                    await axios.post(rtAPI, idata)
                    break;

                case 'pilau_bot':
                    await axios.post(plAPI, idata)
                    break;
            }
        }
    } catch (error) {
        console.log(error.message, error)
    }
}

const WirePusher = async (message, userid, fname) => {
    try {
        let data = {
            id: "dX77mpGBL",
            title: "Reddit",
            message: message ? `${fname} => ${message}` : `${fname} => Sent a media`,
            type: "Points",
            message_id: Number(userid)
        }
        await axios.get(`https://wirepusher.com/send?id=${data.id}&title=${data.title}&message=${data.message}&type=${data.type}&message_id=${data.message_id}`)
    } catch (error) {
        console.log(error?.message, error)
    }
}

const WirePusherClear = async (message_id) => {
    try {
        let data = {
            id: "dX77mpGBL",
            type: "wirepusher_clear_notification",
            message_id: Number(message_id)
        }
        await axios.get(`https://wirepusher.com/send?id=${data.id}&type=${data.type}&message_id=${data.message_id}`)
    } catch (error) {
        console.log(error?.message, error)
    }
}

module.exports = { extractMiamalaInfo, addingBusinessPoints, WirePusher, WirePusherClear };