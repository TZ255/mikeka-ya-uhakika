const OpenAI = require('openai')
const rtStarterModel = require('../database/chats')

const examples = {
    ex1: `Umepokea Tsh1,000.00, 747900466 Jol gombania. Salio jipya ni Tsh26,684.00. Muamala No. MI240406.1141.Q03294\n\nThe answer i need here is: {"ok": true, "name": "JOL GOMBANIA", "phone": "+255747900466", "trans_id": "MI240406.1141.Q03294", "amount": 1000}`,
    ex2: `Umepokea Tsh1,500.00, SHEMDOE SELE, 255756545654. Salio jipya ni Tsh26,684.00. Muamala No. MI240407.1141.Q03294\n\nThe answer i need here is: {"ok": true, "name": "SHEMDOE SELE", "phone": "+255756545654", "trans_id": "MI240407.1141.Q03294", "amount": 1500}`,
    ex3: `Umepokea Tsh1,500.00, NAOMY MAJII, 0756545654. Salio jipya ni Tsh26,684.00. Muamala No {referenceNum}. ID: MI240407.1141.Q03294\n\nThe answer i need here is: {"ok": true, "name": "NAOMY MAJII", "phone": "+255756545654", "trans_id": "MI240407.1141.Q03294", "amount": 1500}`,
    ex4: `BD56CR24PX8 Confirmed. On 5/4/24 at 6:06 PM Tsh5,000.00 Tsh. has been received from 255718624061 - WARDA KITEMO.Your balance is Tsh50,000.00 Tsh.\n\nThe answer i need here is: {"ok": true, "name": "WARDA KITEMO", "phone": "+255718624061", "trans_id": "BD56CR24PX8", "amount": 5000}`
}

const extractInfoOpenAi = async (bot, ctx, imp, lipaTexts) => {
    try {
        let txt = ctx.channelPost.reply_to_message.text
        let userTrans = ctx.channelPost.reply_to_message.message_id
        let chatid = Number(ctx.channelPost.text)
        let msgid = ctx.channelPost.message_id
        for (let t of lipaTexts) {
            if (txt.toLowerCase().includes(t)) {
                let muamala = txt.split('Message:')[1]
                let command = `"${muamala}"\n\nPlease extract the name, phone number, amount and transaction id from this message. If the phone number is missing the country code, please add the Tanzania country code (+255). I need response in json format only and I dont want explanation, in this json if you succeed extract all information please add a property "ok: true" if some of the information is missing add a property "ok: false" \n\nUse the following example to see the final answer that I need\n\nExample 1: ${examples.ex1}\n\nExample 2: ${examples.ex2}\n\nExample 3: ${examples.ex3}\n\nExample 4: ${examples.ex4}`

                const openai = new OpenAI({
                    apiKey: process.env.openAIKey,
                })

                async function main() {
                    const chatCompletion = await openai.chat.completions.create({
                        messages: [{ role: 'user', content: command }],
                        model: 'gpt-3.5-turbo',
                    });

                    let data = JSON.parse(chatCompletion.choices[0].message.content)
                    if (data.ok == true) {
                        let upd = await rtStarterModel.findOneAndUpdate({chatid}, {$set: {fullName: data.name, phone: data.phone}}, {new: true})
                        await ctx.reply(`User updated with the following information:\n\nFullname: ${upd.fullName}\nChatid: <code>${upd.chatid}</code>\nPhone: ${upd.phone}`, {
                            parse_mode: 'HTML', reply_parameters: {message_id: userTrans}
                        })
                        await ctx.deleteMessage(msgid)
                    } else {
                        await ctx.reply('Some information is not found', {
                            reply_parameters: {message_id: userTrans}
                        })
                        await ctx.deleteMessage(msgid)
                    }
                }
                main()
            }
            break;
        }
    } catch (error) {
        await ctx.reply(error.message)
        console.log(error.message, error)
    }
}

module.exports = {extractInfoOpenAi}