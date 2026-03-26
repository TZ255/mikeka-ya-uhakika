const router = require('express').Router()

const WEBHOOK_SECRET = process.env.WASENDER_WEBHOOK_SECRET

router.get('/webhook/wasender', async (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'WhatsApp route is working'
    })
})

router.post('/webhook/wasender', async (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'WhatsApp route is working'
    })

    const { event, data } = req.body;
    if (!event || !data) return console.error('Invalid webhook payload: missing event or data');

    const signature = req.headers['x-webhook-signature']
    if (!signature || signature !== WEBHOOK_SECRET) return console.error('Invalid webhook signature');

    if (event === "messages.received") {

        const { key: { fromMe, remoteJid, senderPn, cleanedSenderPn } = {}, message: {conversation, imageMessage} = {} } = data.messages;

        if (fromMe) return;

        if (remoteJid?.includes('@newsletter')) {
            console.log('Received newsletter message, ignoring.');
            return;
        }

        if (senderPn && cleanedSenderPn) {
            // Handle incoming private message
            console.log('Received private message from:', cleanedSenderPn);
            return;
        }

    }

    try {
        //
    } catch (error) {
        console.error(error)
    }
})

router.post('/whatsapp/poll', async (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'WhatsApp route is working'
    })

    const { poll, SECRET } = req.body;
    if (!poll || !SECRET || SECRET !== process.env.PASS) return console.error('Invalid request');

    const signature = req.headers['x-webhook-signature']
    if (!signature || signature !== WEBHOOK_SECRET) return console.error('Invalid webhook signature');

    if (event === "messages.received") {

        const { key: { fromMe, remoteJid, senderPn, cleanedSenderPn } = {}, message: {conversation, imageMessage} = {} } = data.messages;

        if (fromMe) return;

        if (remoteJid?.includes('@newsletter')) {
            console.log('Received newsletter message, ignoring.');
            return;
        }

        if (senderPn && cleanedSenderPn) {
            // Handle incoming private message
            console.log('Received private message from:', cleanedSenderPn);
            return;
        }

    }

    try {
        //
    } catch (error) {
        console.error(error)
    }
})


module.exports = router