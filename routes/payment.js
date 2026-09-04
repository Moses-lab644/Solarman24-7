const users = new Map();

/**
 * Create or get user
 */
const getUser = (phone) => {
  if (!users.has(phone)) {
    users.set(phone, {
      phone,
      plan: "free", // free | monthly | lifetime
      expiresAt: null
    });
  }

  return users.get(phone);
};

/**
 * Update user
 */
const updateUser = (phone, data) => {
  const user = getUser(phone);
  users.set(phone, { ...user, ...data });
};

/**
 * Check if user has active subscription
 */
const hasAccess = (phone) => {
  const user = getUser(phone);

  if (user.plan === "lifetime") return true;

  if (user.plan === "monthly") {
    return user.expiresAt && user.expiresAt > Date.now();
  }

  return false;
};

module.exports = {
  getUser,
  updateUser,
  hasAccess
};