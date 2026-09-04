function calculateSolarSystem(appliancesText) {
  const text = appliancesText.toLowerCase();

  // -----------------------------
  // SIMPLE LOAD ESTIMATION (MVP RULE-BASED)
  // -----------------------------
  let load = 0;

  if (text.includes("tv")) load += 120;
  if (text.includes("fan")) load += 75 * 2;
  if (text.includes("light")) load += 10 * 6;
  if (text.includes("fridge")) load += 200;
  if (text.includes("laptop")) load += 65;
  if (text.includes("decoder")) load += 30;
  if (text.includes("washing")) load += 500;
  if (text.includes("iron")) load += 1000;
  if (text.includes("pump")) load += 750;

  // fallback if user gives numbers like "1kva"
  if (text.includes("1kva")) load = 800;
  if (text.includes("2kva")) load = 1600;
  if (text.includes("3kva")) load = 2400;
  if (text.includes("5kva")) load = 4000;

  // -----------------------------
  // INVERTER SIZE
  // -----------------------------
  const inverterSizeW = Math.ceil(load * 1.3);

  // -----------------------------
  // BATTERY CALC (2.5kWh lithium)
  // -----------------------------
  const batteryUnit = 2500; // 2.5kWh in Wh
  const dailyEnergy = load * 5; // assume 5 hours usage
  const batteryNeeded = Math.ceil(dailyEnergy / batteryUnit);

  // -----------------------------
  // PANEL CALC (600W panels)
  // -----------------------------
  const panelWatt = 600;
  const panelNeeded = Math.ceil(load / panelWatt);

  // -----------------------------
  // PACKAGE SUGGESTION (YOUR PRICING)
  // -----------------------------
  let packagePlan = "";

  if (load <= 1000) {
    packagePlan = "Basic Package - ₦965,000";
  } else if (load <= 3000) {
    packagePlan = "Standard Package - ₦2,350,000";
  } else {
    packagePlan = "Premium Package - ₦3,550,000";
  }

  return {
    load,
    inverterSizeW,
    batteryNeeded,
    panelNeeded,
    packagePlan
  };
}

module.exports = {
  calculateSolarSystem
};