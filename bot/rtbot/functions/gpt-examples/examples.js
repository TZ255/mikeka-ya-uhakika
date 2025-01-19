const examples = {
    ex6: `CAD0G9NVNK8 imethibitishwa. Umepokea Tshs 1,000.00 kutoka CRDB Bank, Akaunti ****3600 - ZAKARIA LUKASI MSAGAMUSI tarehe 13/01/2025 saa 11:12:05.\n\nThe answer I need here is: {"ok": true, "name": "ZAKARIA LUKASI MSAGAMUSI", "phone": "+255100", "trans_id": "CAD0G9NVNK8", "amount": 1000}`,
    ex5: `Umepokea Tsh1,000.00, 747900466 Jol gombania. Salio jipya ni Tsh26,684.00. Muamala No. MI240406.1141.Q03294\n\nThe answer I need here is: {"ok": true, "name": "JOL GOMBANIA", "phone": "+255747900466", "trans_id": "MI240406.1141.Q03294", "amount": 1000}`,
    ex4: `Umepokea Tsh1,500.00, SHEMDOE SELE, 255756545654. Salio jipya ni Tsh26,684.00. Muamala No. MI240407.1141.Q03294\n\nThe answer I need here is: {"ok": true, "name": "SHEMDOE SELE", "phone": "+255756545654", "trans_id": "MI240407.1141.Q03294", "amount": 1500}`,
    ex3: `Umepokea Tsh1,500.00, NAOMY MAJII, 0756545654. Salio jipya ni Tsh26,684.00. Muamala No {referenceNum}. ID: MI240407.1141.Q03294\n\nThe answer I need here is: {"ok": true, "name": "NAOMY MAJII", "phone": "+255756545654", "trans_id": "MI240407.1141.Q03294", "amount": 1500}`,
    ex2: `BD56CR24PX8 Confirmed. On 5/4/24 at 6:06 PM Tsh5,000.00 Tsh. has been received from 255718624061 - WARDA KITEMO.Your balance is Tsh50,000.00 Tsh.\n\nThe answer I need here is: {"ok": true, "name": "WARDA KITEMO", "phone": "+255718624061", "trans_id": "BD56CR24PX8", "amount": 5000}`,
    ex1: `BEK0D83QOS8 Confirmed. Tsh1,000.00 received from 255757360593 - JEREMIAH JAMES ALBERT on 20/5/24 at 4:53 PM.New Pochi PAULO KIMARIO-RT WAKUBWA SHOWS - MOVIES balance is Tsh3,000.00.\n\nThe answer I need here is: {"ok": true, "name": "JEREMIAH JAMES ALBERT", "phone": "+255757360593", "trans_id": "BEK0D83QOS8", "amount": 1000}`,
    false1: `BFS6DODFC2W confirmed. You have received a payment of Tsh1,000.00 from 922750 - TIPS-AIRTELMONEY on 28/6/24 at 11:38 PM. New M-Pesa balance is Tsh2,027.00`,
    false2: `BFS2DOBYUIW Confirmed. On 28/6/24 at 9:14 PMTsh2,000.00 received from b4ssoum3tg9syfzcv9l0n9ycsyyzzon9. New Merchant balance is Tsh10,000.00.`,
};

const mySructuredOutput = {
    name: 'extractTransaction',
    description: 'Extract transaction details (name, phone, amount, transaction ID) from a message',
    parameters: {
        type: 'object',
        properties: {
            ok: {
                type: 'boolean',
                description: 'True if at least name, trans_id and amount are found, false otherwise',
            },
            name: {
                type: 'string',
                description: "Sender's name. Always transform to capital letter",
            },
            phone: {
                type: 'string',
                description: 'Phone number. If missing write +255100 as phone number',
            },
            trans_id: {
                type: 'string',
                description: 'Transaction ID/reference number',
            },
            amount: {
                type: 'number',
                description: 'Transaction amount in numeric form. Excluding the decimal part',
            },
        },
        required: ['ok', 'name', 'amount', 'trans_id', 'phone'],
        additionalProperties: false
    },
    strict: true
}

module.exports = {
    examples, mySructuredOutput
}