const OpenAI = require('openai');
const { z } = require('zod')
const { zodTextFormat } = require('openai/helpers/zod');
const rtStarterModel = require('../database/chats');
const miamalaModel = require('../database/miamala');

//response format:
const { muamalaQuery } = require('./querymiamala');

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


const extractInfoOpenAi = async (bot, ctx, imp, lipaTexts) => {
    try {
        let txt = ctx.channelPost.reply_to_message.text;
        let userTrans = ctx.channelPost.reply_to_message.message_id;
        let chatid = Number(ctx.channelPost.text);
        let msgid = ctx.channelPost.message_id;

        for (let t of lipaTexts) {
            if (txt.toLowerCase().includes(t)) {
                let muamala = txt.split('Message:')[1].trim();
                let command = `"${muamala}"\n\nExtract information according to the response format provided`;

                const openai = new OpenAI({
                    apiKey: process.env.openAIKey,
                });

                const response = await openai.responses.parse({
                    model: "gpt-4.1-mini",
                    input: command,
                    text: {
                        format: zodTextFormat(miamalaSchema, "parsedTransaction"),
                    },
                });

                const data = response.output_parsed;

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
                break;
            }
        }
    } catch (error) {
        await ctx.reply(error.message);
        console.error(error.message, error);
    }
};

module.exports = { extractInfoOpenAi };