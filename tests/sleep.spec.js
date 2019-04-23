const { expect } = require("chai");
const sleep = require("../src/sleep");

describe("sleep", () => {
  it ("sleeps for the specified time", async () => {
    const start = Date.now();
    await sleep(1000);
    const end = Date.now() - start;
    expect(end).to.be.at.least(999);
  });

  it("can sleep for short times", async () => {
    const start = Date.now();
    await sleep(100);
    const end = Date.now() - start;
    expect(end).to.be.at.least(99);
  });
});
