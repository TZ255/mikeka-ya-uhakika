const { default: axios } = require("axios");

//send telegram notifications using axios
const sendTGNotification = async (message) => {
    try {
        const response = await axios.post(`https://api.telegram.org/bot${process.env.DAYO_TOKEN}/sendMessage`, {
            chat_id: 741815228,
            text: message,
        });
        return response.data;
    } catch (error) {
        console.error("Error sending Telegram notification:", error.message);
        throw error;
    }
};

module.exports = {
    sendTGNotification
}