const users = {};

function activateLifetime(user) {
  users[user] = {
    type: "LIFETIME",
    expires: null
  };
}

function activateMonthly(user) {
  const now = Date.now();

  users[user] = {
    type: "MONTHLY",
    expires: now + (30 * 24 * 60 * 60 * 1000)
  };
}

function activate3Hours(user) {
  const now = Date.now();

  users[user] = {
    type: "3HOURS",
    expires: now + (3 * 60 * 60 * 1000)
  };
}

function hasAccess(user) {
  const subscription = users[user];

  if (!subscription) return false;

  if (subscription.type === "LIFETIME") {
    return true;
  }

  return Date.now() < subscription.expires;
}

module.exports = {
  activateLifetime,
  activateMonthly,
  activate3Hours,
  hasAccess
};