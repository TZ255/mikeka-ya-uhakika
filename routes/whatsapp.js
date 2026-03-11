const router = require('express').Router()

router.get('/webhook/wasender', async (req, res) => {
    try {
        res.status(200).json({
            status: 'success',
            message: 'WhatsApp route is working'
        })
    } catch (error) {
        console.error(error)
    }
})


module.exports = router