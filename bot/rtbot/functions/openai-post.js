const OpenAI = require('openai');
const axios = require('axios').default
const rtStarterModel = require('../database/chats');
const miamalaModel = require('../database/miamala');

const examples = {
    ex5: `Umepokea Tsh1,000.00, 747900466 Jol gombania. Salio jipya ni Tsh26,684.00. Muamala No. MI240406.1141.Q03294\n\nThe answer I need here is: {"ok": true, "name": "JOL GOMBANIA", "phone": "+255747900466", "trans_id": "MI240406.1141.Q03294", "amount": 1000}`,
    ex4: `Umepokea Tsh1,500.00, SHEMDOE SELE, 255756545654. Salio jipya ni Tsh26,684.00. Muamala No. MI240407.1141.Q03294\n\nThe answer I need here is: {"ok": true, "name": "SHEMDOE SELE", "phone": "+255756545654", "trans_id": "MI240407.1141.Q03294", "amount": 1500}`,
    ex3: `Umepokea Tsh1,500.00, NAOMY MAJII, 0756545654. Salio jipya ni Tsh26,684.00. Muamala No {referenceNum}. ID: MI240407.1141.Q03294\n\nThe answer I need here is: {"ok": true, "name": "NAOMY MAJII", "phone": "+255756545654", "trans_id": "MI240407.1141.Q03294", "amount": 1500}`,
    ex2: `BD56CR24PX8 Confirmed. On 5/4/24 at 6:06 PM Tsh5,000.00 Tsh. has been received from 255718624061 - WARDA KITEMO.Your balance is Tsh50,000.00 Tsh.\n\nThe answer I need here is: {"ok": true, "name": "WARDA KITEMO", "phone": "+255718624061", "trans_id": "BD56CR24PX8", "amount": 5000}`,
    ex1: `BEK0D83QOS8 Confirmed. Tsh1,000.00 received from 255757360593 - JEREMIAH JAMES ALBERT on 20/5/24 at 4:53 PM.New Pochi PAULO KIMARIO-RT WAKUBWA SHOWS - MOVIES balance is Tsh3,000.00.\n\nThe answer I need here is: {"ok": true, "name": "JEREMIAH JAMES ALBERT", "phone": "+255757360593", "trans_id": "BEK0D83QOS8", "amount": 1000}`,
    false1: `BFS6DODFC2W confirmed. You have received a payment of Tsh1,000.00 from 922750 - TIPS-AIRTELMONEY on 28/6/24 at 11:38 PM. New M-Pesa balance is Tsh2,027.00\n\nThe answer I need here is: {"ok": false}`,
    false2: `BFS2DOBYUIW Confirmed. On 28/6/24 at 9:14 PMTsh2,000.00 received from b4ssoum3tg9syfzcv9l0n9ycsyyzzon9. New Merchant balance is Tsh10,000.00.\n\nThe answer I need here is: {"ok": false}`,
};

const extractMiamalaInfo = async (bot, ctx, imp) => {
    const miamala = ['From: M-PESA']
    const junkies = ['TIPS-AIRTELMONEY', 'has received', 'Transfered', 'sent to', 'from Changisha account']
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
            let command = `"${muamala}"\n\nPlease extract the name, phone number, amount and transaction id from this message. If the phone number is missing the country code, please add the Tanzania country code (+255). I need response in JSON format only and I don't want an explanation. If you succeed in extracting all information, add a property "ok: true". If some information is missing, add a property "ok: false". \n\nUse the following examples to see the final answer I need:\n\nExample 1: ${examples.ex1}\n\nExample 2: ${examples.ex2}\n\nExample 3: ${examples.ex3}\n\nExample 4: ${examples.ex4}\n\nExample 5: ${examples.ex5}\n\nThe following examples always return "ok: false" as they don't have phone numbers or names. Example 1: "${examples.false1}"\nExample 2: "${examples.false2}"`;

            const openai = new OpenAI({
                apiKey: process.env.openAIKey,
            });

            async function main() {
                const chatCompletion = await openai.chat.completions.create({
                    messages: [{ role: 'user', content: command }],
                    model: 'gpt-3.5-turbo',
                });

                let data = JSON.parse(chatCompletion.choices[0].message.content);

                if (data.ok) {
                    let validate = await miamalaModel.findOne({ txid: data.trans_id })
                    if (!validate) {
                        let upd = await miamalaModel.create({
                            name: data.name, phone: data.phone, txid: data.trans_id, amt: data.amount
                        })

                        await ctx.reply(
                            `<code>${upd.txid}</code> of amt <code>${upd.amt}</code> saved to db`,
                            { parse_mode: 'HTML', disable_notification: 'true', reply_parameters: { message_id: msgid } }
                        );
                    }
                } else {
                    await ctx.reply('Failed to save... Some information is not found', {
                        reply_parameters: { message_id: msgid },
                    });
                }
            }

            main();
        }
    } catch (error) {
        await ctx.reply(error.message);
        console.error(error.message, error);
    }
};

const addingBusinessPoints = async (ctx, chatid, points, imp, delay, txid) => {
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

        let txt2 = `<b>Hongera 🎉 \nMalipo yako yamethibitishwa. Umepokea Points ${pts} na sasa una jumla ya Points ${upuser.points} kwenye account yako ya RT Malipo.</b>\n\nTumia points zako vizuri. Kumbuka Kila video utakayo download itakugharimu Points 250.\n\n\n<u><b>RT Premium Links:</b></u>\n\n<b>• Android (Wakubwa 🔞)\n${android}\n\n• iPhone (Wakubwa 🔞)\n${iphone}\n\n• MOVIES:\n${muvika}</b>\n\n\n<b>Enjoy, ❤.</b>`

        let txt3 = `<b>Points ${points} zimeondolewa kwenye account yako na Admin. Umebakiwa na points ${upuser.points}.</b>`

        let txt4 = `🎉🎉🎉 Hongera 🎉🎉🎉\nMalipo yako yamethibitishwa. <b>Points ${pts}</b> zimeongezwa kwenye account yako na sasa una jumla ya points <b>${upuser.points}</b>.\n\n\nThis is an automated message confirming your transaction with id <code>${txid}</code>`

        let rtAPI = `https://api.telegram.org/bot${process.env.RT_TOKEN}/sendMessage`
        let plAPI = `https://api.telegram.org/bot${process.env.PL_TOKEN}/sendMessage`
        let mvAPI = `https://api.telegram.org/bot${process.env.MUVIKA_TOKEN}/sendMessage`

        //delay for 3 seconds
        await delay(3000)
        await ctx.reply(txt4, { parse_mode: 'HTML' })
        let data = { chat_id: chatid, text: txt2, parse_mode: 'HTML' }
        if (points < 0) {
            data.text = txt3
        }
        axios.post(rtAPI, data).catch(e => console.log(e.message))
        axios.post(plAPI, data).catch(e => console.log(e.message))
        axios.post(mvAPI, data).catch(e => console.log(e.message))
    } catch (error) {
        console.log(error.message, error)
    }
}

module.exports = { extractMiamalaInfo, addingBusinessPoints };