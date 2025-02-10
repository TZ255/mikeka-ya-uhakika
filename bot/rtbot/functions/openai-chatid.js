const OpenAI = require('openai');
const rtStarterModel = require('../database/chats');
const miamalaModel = require('../database/miamala');

//response format:
const {examples, mySructuredOutput} = require('./gpt-examples/examples');
const { muamalaQuery } = require('./querymiamala');


const extractInfoOpenAi = async (bot, ctx, imp, lipaTexts) => {
    try {
        let txt = ctx.channelPost.reply_to_message.text;
        let userTrans = ctx.channelPost.reply_to_message.message_id;
        let chatid = Number(ctx.channelPost.text);
        let msgid = ctx.channelPost.message_id;

        for (let t of lipaTexts) {
            if (txt.toLowerCase().includes(t)) {
                let muamala = txt.split('Message:')[1];
                let command = `"${muamala}"\n\nExtract information according to the response_format provided. Refer to the following examples for the valid response:\n\nExample 1: ${examples.ex1}\n\nExample 2: ${examples.ex2}\n\nExample 3: ${examples.ex3}\n\nExample 4: ${examples.ex4}\n\nExample 5: ${examples.ex5}\n\nExample 6: ${examples.ex6}\n\nFor the following examples always return "ok: false" as they contains companies names or they have no sender names. Example 1: "${examples.false1}"\nExample 2: "${examples.false2}"`;

                const openai = new OpenAI({
                    apiKey: process.env.openAIKey,
                });

                async function main() {
                    const chatCompletion = await openai.chat.completions.create({
                        model: 'gpt-4o-mini',
                        messages: [{ role: 'system', content: command }],
                        response_format: mySructuredOutput
                    });

                    let data = JSON.parse(chatCompletion.choices[0].message.content);
                    console.log(data)

                    if (!data.ok) {
                        return await ctx.reply('Some information is not found', {
                            reply_parameters: { message_id: userTrans },
                        });
                    }

                    //delete all pending miamala with the same name from miamala db
                    let query = muamalaQuery(data.name)
                    await miamalaModel.deleteMany(query)
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
                    setTimeout(() => {
                        ctx.api.deleteMessage(ctx.chat.id, u_updated.message_id)
                    }, 60000)
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