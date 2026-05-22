const sendParentPush = async ({ tokens }) => {
  const uniqueTokens = [...new Set((tokens || []).filter(Boolean))];
  return {
    attempted: uniqueTokens.length,
    successCount: 0,
    failureCount: 0,
    successfulTokens: [],
    disabled: true,
    reason: 'Demo mode: push notifications are disabled in the public repository.',
  };
};

module.exports = { sendParentPush };
