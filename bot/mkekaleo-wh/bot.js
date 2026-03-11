const { default: axios } = require("axios");

const WASENDER_API_KEY = process.env.WASENDER_API_KEY
const WASENDER_WEBHOOK_SECRET = process.env.WASENDER_WEBHOOK_SECRET
const BASE_URL = "https://www.wasenderapi.com/api"



const sendWhatsAppTextMessage = async (to, message) => {
    try {
        const response = await axios.post(`${BASE_URL}/send-message`, {
            to: to,
            text: message
        }, {
            headers: {
                'Authorization': `Bearer ${WASENDER_API_KEY}`,
                'Content-Type': 'application/json'
            }
        })
        console.log('WhatsApp Message sent successfully:', response.data)
    } catch (error) {
        console.error('Error sending message:', error.response ? error.response.data : error.message)
    }
}

module.exports = { sendWhatsAppTextMessage}