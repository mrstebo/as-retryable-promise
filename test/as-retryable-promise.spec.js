const { expect } = require("chai");
const asRetryablePromise = require("../src/as-retryable-promise");

describe("asRetryablePromise", () => {
  it("doesn't retry if the function is successful", async () => {
    const fn = () => Promise.resolve("success");
    const result = await asRetryablePromise(fn, {
      maxRetries: 5,
      timeout: 50,
    });
    expect(result).to.eql("success");
  });

  it("retries until it is successful", async () => {
    let retryCount = 0;
    const fn = () => new Promise((resolve, reject) => {
      return retryCount++ < 4 ? reject("error") : resolve("success");
    });
    const result = await asRetryablePromise(fn, {
      maxRetries: 5,
      timeout: 50,
    });
    expect(result).to.eql("success");
  });

  it("throws if still no success after retries", async () => {
    try {
      const fn = () => Promise.reject("error");
      await asRetryablePromise(fn, {
        maxRetries: 5,
        timeout: 50,
      });
      expect(false).to.be.true;
    }
    catch (err) {
      expect(err).to.eql("error");
    }
  });

  it("throws if the retryCondition returns false", async () => {
    try {
      let retryCount = 0;
      const fn = () => new Promise((resolve, reject) => {
        return retryCount++ < 1 ? reject("error") : resolve("success");
      });
      await asRetryablePromise(fn, {
        maxRetries: 5,
        timeout: 50,
        retryCondition: () => false,
      });
      expect(false).to.be.true;
    }
    catch (err) {
      expect(err).to.eql("error");
    }
  });

  it("continues to retry if retryCondition is true", async () => {
    let retryCount = 0;
    const fn = () => new Promise((resolve, reject) => {
      return retryCount++ < 1 ? reject("error") : resolve("success");
    });
    const result = await asRetryablePromise(fn, {
      maxRetries: 5,
      timeout: 50,
      retryCondition: () => true,
    });
    expect(result).to.eql("success");
  });
});
