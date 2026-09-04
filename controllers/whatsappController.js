const axios = require("axios");

const { askAI } = require("../services/aiService");
const { calculateSolarSystem } = require("../services/solarCalculator");

// ==========================
// POSTGRES SERVICES
// ==========================
const {
  getSession,
  updateSession,
  resetSession
} = require("../services/sessionService");

const {
  getUser,
  hasAccess,
  activateAccess
} = require("../services/userService");

// ==========================
// VERIFY WEBHOOK
// ==========================
const verifyWebhook = (req, res) => {

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (
    mode === "subscribe" &&
    token === process.env.VERIFY_TOKEN
  ) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
};

// ==========================
// MAIN CONTROLLER
// ==========================
const receiveMessage = async (req, res) => {

  try {

    const value =
      req.body.entry?.[0]?.changes?.[0]?.value;

    // ==========================
    // IGNORE NON MESSAGE EVENTS
    // ==========================
    if (!value || !value.messages) {
      return res.sendStatus(200);
    }

    const message = value.messages[0];

    // ==========================
    // ONLY TEXT
    // ==========================
    if (!message || message.type !== "text") {
      return res.sendStatus(200);
    }

    const from = message.from;
    const text = message.text?.body?.trim() || "";
    const input = text.toLowerCase();

    console.log("Incoming:", input);

    // ==========================
    // DATABASE
    // ==========================
    const session = await getSession(from);

    // auto create user
    await getUser(from);

    const access = await hasAccess(from);

    let reply = "";

    // ==========================
    // MENU
    // ==========================
    if (
      ["hi", "hello", "menu", "start"].includes(input)
    ) {

      await updateSession(from, "MENU");

      reply = `☀️ SOLARMAN LIVE AI

1. Solar Price
2. Troubleshooting (AI)
3. Solar Sizing
4. Energy Tips
5. Talk to Agent

Reply with a number.`;
    }

    // ==========================
    // SOLAR PRICE
    // ==========================
    else if (input === "1") {

      await updateSession(from, "PRICE");

      reply = `💰 SOLAR PACKAGES

🔹 Basic System
₦965,000

🔹 Standard System
₦2,350,000

🔹 Premium System
₦3,550,000

Reply MENU to go back.`;
    }

    // ==========================
    // TROUBLESHOOTING
    // ==========================
    else if (input === "2") {

      if (!access) {

        reply = `🔒 PREMIUM FEATURE

AI troubleshooting is premium.

Plans:
₦1,000 = 3 Hours
₦3,000 = Monthly
₦10,000 = Lifetime

Reply PAY to activate.`;

      } else {

        await updateSession(from, "TROUBLE");

        reply = `🔧 AI TROUBLESHOOTING

Send inverter problem.

Example:
"E01 on Felicity 5kva"`;
      }
    }

    // ==========================
    // SOLAR SIZING
    // ==========================
    else if (input === "3") {

      if (!access) {

        reply = `🔒 PREMIUM FEATURE

Solar sizing is premium.

Reply PAY to activate.`;

      } else {

        await updateSession(from, "SIZING");

        reply = `⚡ SOLAR SIZING MODE

Send appliances.

Example:
TV, fridge, fans, AC`;
      }
    }

    // ==========================
    // ENERGY TIPS
    // ==========================
    else if (input === "4") {

      reply = `⚡ ENERGY SAVING TIPS

• Use LED bulbs
• Avoid standby load
• Use inverter AC
• Reduce heavy appliances
• Charge batteries properly

Reply MENU to continue.`;
    }

    // ==========================
    // AGENT
    // ==========================
    else if (input === "5") {

      reply = `📞 GODTECH ENERGY

Call:
09072334161

WhatsApp:
+2348086562959`;
    }

    // ==========================
    // PAYMENT
    // ==========================
    else if (input === "pay") {

      reply = `💳 PAYMENT OPTIONS

OPAY:
1234567890
GODTECH ENERGY

After payment send:
"I HAVE PAID"`;
    }

    // ==========================
    // PAYMENT CONFIRMATION
    // ==========================
    else if (
      input === "i have paid" ||
      input === "paid"
    ) {

      await activateAccess(from);

      reply = `✅ PAYMENT CONFIRMED

Premium access activated successfully.

You now have access to:

✅ AI Troubleshooting
✅ Solar Sizing
✅ Advanced AI Features

Reply MENU to continue.`;
    }

    // ==========================
    // TROUBLE AI ENGINE
    // ==========================
    else if (session.step === "TROUBLE") {

      const aiReply = await askAI(
        `User inverter issue: ${text}. Provide diagnosis and solution.`
      );

      reply = `🔧 AI DIAGNOSIS

${aiReply}

📞 GODTECH ENERGY:
09072334161`;

      await resetSession(from);
    }

    // ==========================
    // SOLAR CALCULATOR ENGINE
    // ==========================
    else if (session.step === "SIZING") {

      const result =
        calculateSolarSystem(text);

      reply = `⚡ SOLAR DESIGN RESULT

Estimated Load:
${result.load}W

Recommended Inverter:
${result.inverterSizeW}W

Battery Requirement:
${result.batteryNeeded} x 2.5kWh Lithium

Solar Panels:
${result.panelNeeded} x 600W

Recommended Plan:
${result.packagePlan}

Reply MENU to restart.`;

      await resetSession(from);
    }

    // ==========================
    // GENERAL AI MODE
    // ==========================
    else if (input.startsWith("ask ")) {

      const question =
        text.replace(/ask /i, "");

      const aiReply =
        await askAI(question);

      reply = `🧠 SOLARMAN AI

${aiReply}`;
    }

    // ==========================
    // DEFAULT
    // ==========================
    else {

      reply = `☀️ SOLARMAN LIVE

Type MENU to start.`;
    }

    // ==========================
    // SEND WHATSAPP MESSAGE
    // ==========================
    await axios.post(
      `https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: from,
        text: {
          body: reply
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        },
        timeout: 15000
      }
    );

    return res.sendStatus(200);

  } catch (error) {

    console.log(
      "ERROR:",
      error.response?.data || error.message
    );

    return res.sendStatus(200);
  }
};

module.exports = {
  verifyWebhook,
  receiveMessage
};