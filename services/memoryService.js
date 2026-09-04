const memory = new Map();

const addMemory = (phone, message) => {
  if (!memory.has(phone)) memory.set(phone, []);

  memory.get(phone).push({
    message,
    time: Date.now()
  });

  // keep only last 20 messages
  if (memory.get(phone).length > 20) {
    memory.get(phone).shift();
  }
};

const getMemory = (phone) => {
  return memory.get(phone) || [];
};

module.exports = { addMemory, getMemory };