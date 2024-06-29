const OpenAI = require('openai');
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

const extractInfoOpenAi = async (bot, ctx, imp, lipaTexts) => {
    try {
        let txt = ctx.channelPost.reply_to_message.text;
        let userTrans = ctx.channelPost.reply_to_message.message_id;
        let chatid = Number(ctx.channelPost.text);
        let msgid = ctx.channelPost.message_id;

        for (let t of lipaTexts) {
            if (txt.toLowerCase().includes(t)) {
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
                        //delete all pending miamala with the same name from miamala db
                        await miamalaModel.deleteMany({name: data.name})
                        //update user data
                        let upd = await rtStarterModel.findOneAndUpdate(
                            { chatid },
                            { $set: { fullName: data.name, phone: data.phone } },
                            { new: true }
                        );

                        let u_updated = await ctx.reply(
                            `User updated with the following information:\n\nFullname: ${upd.fullName}\nChatid: <code>${upd.chatid}</code>\nPhone: ${upd.phone}`,
                            { parse_mode: 'HTML', reply_parameters: { message_id: userTrans } }
                        );
                        setTimeout(()=> {
                            ctx.api.deleteMessage(ctx.chat.id, u_updated.message_id)
                        }, 60000)
                    } else {
                        await ctx.reply('Some information is not found', {
                            reply_parameters: { message_id: userTrans },
                        });
                    }
                    await ctx.api.deleteMessage(ctx.chat.id, msgid);
                }

                main();
                break;
            }
        }
    } catch (error) {
        await ctx.reply(error.message);
        console.error(error.message, error);
    }
};

module.exports = { extractInfoOpenAi };