// Usage examples for LLM
const examples = {
  ex6: {
    input: `CAD0G9NVNK8 imethibitishwa. Umepokea Tshs 1,000.00 kutoka CRDB Bank, Akaunti ****3600 - ZAKARIA LUKASI MSAGAMUSI tarehe 13/01/2025 saa 11:12:05.`,
    expected: {
      ok: true,
      name: "ZAKARIA LUKASI MSAGAMUSI",
      phone: "+255100",
      trans_id: "CAD0G9NVNK8",
      amount: 1000
    }
  },
  ex5: {
    input: `Umepokea Tsh1,000.00, 747900466 Jol gombania. Salio jipya ni Tsh26,684.00. Muamala No. MI240406.1141.Q03294`,
    expected: {
      ok: true,
      name: "JOL GOMBANIA",
      phone: "+255747900466",
      trans_id: "MI240406.1141.Q03294",
      amount: 1000
    }
  },
  ex4: {
    input: `Umepokea Tsh1,500.00, Shemdoe Sele, 255756545654. Salio jipya ni Tsh26,684.00. Muamala No. MI240407.1141.Q03294`,
    expected: {
      ok: true,
      name: "SHEMDOE SELE",
      phone: "+255756545654",
      trans_id: "MI240407.1141.Q03294",
      amount: 1500
    }
  },
  ex3: {
    input: `Umepokea malipo TSh 12,500 kutoka kwa Vodacom; 255795820858 - MICHAEL PONSIAN Kumbukumbu No.: 25450569480221. 17/12/25 18:08. Salio lako jipya ni TSh 534,350. Asante kwa kutumia Lipa Kwa Simu.LKS`,
    expected: {
      ok: true,
      name: "MICHAEL PONSIAN",
      phone: "+255795820858",
      trans_id: "25450569480221",
      amount: 12500
    }
  },
  ex2: {
    input: `BD56CR24PX8 Confirmed. On 5/4/24 at 6:06 PM Tsh5,000.00 Tsh. has been received from 255718624061 - WARDA KITEMO.Your balance is Tsh50,000.00 Tsh.`,
    expected: {
      ok: true,
      name: "WARDA KITEMO",
      phone: "+255718624061",
      trans_id: "BD56CR24PX8",
      amount: 5000
    }
  },
  ex1: {
    input: `BEK0D83QOS8 Confirmed. Tsh1,000.00 received from 255757360593 - JEREMIAH JAMES ALBERT on 20/5/24 at 4:53 PM.New Pochi PAULO KIMARIO-RT WAKUBWA SHOWS - MOVIES balance is Tsh3,000.00.`,
    expected: {
      ok: true,
      name: "JEREMIAH JAMES ALBERT",
      phone: "+255757360593",
      trans_id: "BEK0D83QOS8",
      amount: 1000
    }
  },
  false1: {
    input: `BFS6DODFC2W confirmed. You have received a payment of Tsh1,000.00 from 922750 - TIPS-AIRTELMONEY on 28/6/24 at 11:38 PM. New M-Pesa balance is Tsh2,027.00`,
    expected: {
      ok: false,
      name: "TIPS-AIRTELMONEY",
      phone: "+255100",
      trans_id: "BFS6DODFC2W",
      amount: 1000
    }
  },
  false2: {
    input: `BFS2DOBYUIW Confirmed. On 28/6/24 at 9:14 PMTsh2,000.00 received from b4ssoum3tg9syfzcv9l0n9ycsyyzzon9. New Merchant balance is Tsh10,000.00.`,
    expected: {
      ok: false,
      name: "UNKNOWN",
      phone: "+255100",
      trans_id: "BFS2DOBYUIW",
      amount: 2000
    }
  }
};

module.exports = {
    examples
}