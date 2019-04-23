const sleep = require("./sleep");

module.exports = (fn, {
  maxRetries,
  timeout,
  retryCondition,
}) => {
  let retriesLeft = maxRetries;

  const retry = () => fn().catch(async (err) => {
    if (retryCondition && !(await retryCondition(err))) throw err;
    if (--retriesLeft === 0) throw err;

    await sleep(timeout);

    return retry();
  });

  return retry();
};
