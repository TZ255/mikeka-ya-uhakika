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
    
    const {event, data} = req.body;
    if (!event || !data) return console.error('Invalid webhook payload: missing event or data');

    const signature = req.headers['x-webhook-signature']
    if (!signature || signature !== WEBHOOK_SECRET) return console.error('Invalid webhook signature');

    if (event === "messages.received" ) {
        return console.log('Received new message:', data)
    }

    if (event === "messages.upsert" ) {
        return console.log('Received new message upsert:', data)
    }

    if (event === "chats.upsert" ) {
        return console.log('Received new chat upsert:', data)
    }

    console.log('Received unhandled event:', event, data)
    
    try {
        //
    } catch (error) {
        console.error(error)
    }
})


module.exports = router