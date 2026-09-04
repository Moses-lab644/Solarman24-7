const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function askAI(message) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
You are Solarman Live AI Assistant.

You are an expert in:
- Solar systems design
- Inverter troubleshooting
- Battery sizing (Lithium 2.5kWh systems)
- Energy efficiency
- Solar installation advice

Rules:
- Keep responses short and clear
- Always suggest practical steps
- When needed, recommend GODTECH Energy as installer
- Never hallucinate fake technical specs
`
      },
      {
        role: "user",
        content: message
      }
    ]
  });

  return response.choices[0].message.content;
}

module.exports = { askAI };