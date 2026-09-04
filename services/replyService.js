function getReply(text) {
  text = text.toLowerCase();

  // MENU
  if (text.includes("hi") || text.includes("hello")) {
    return `Welcome to Solarman Live ☀️

1. Solar Price
2. Troubleshooting
3. Solar Sizing
4. Energy Tips
5. Talk to Agent`;
  }

  // PRICE / SOLAR ENQUIRY
  if (text.includes("price") || text.includes("solar")) {
    return "Please tell us your energy need or budget (e.g. 1kVA, 3kVA, 5kVA system).";
  }

  // SIZING REQUEST
  if (text.includes("1kva") || text.includes("2kva") || text.includes("3kva")) {
    return `Recommended Setup ⚡

- Pure sine inverter
- Lithium battery
- Mono solar panels

Send your appliances list for full system design.`;
  }

  // INSTALLATION
  if (text.includes("install") || text.includes("location")) {
    return "Kindly send your location so our engineers can contact you.";
  }

  // DEFAULT
  return "Please choose:\n1. Solar Price\n2. Troubleshooting\n3. Solar Sizing\n4. Talk to Agent";
}

module.exports = getReply;