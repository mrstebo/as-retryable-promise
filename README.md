[![Build Status](https://travis-ci.org/mrstebo/as-retryable-promise.svg?branch=master)](https://travis-ci.org/mrstebo/as-retryable-promise)
[![npm version](https://badge.fury.io/js/as-retryable-promise.svg)](https://badge.fury.io/js/as-retryable-promise)
[![Coverage Status](https://coveralls.io/repos/github/mrstebo/as-retryable-promise/badge.svg?branch=master)](https://coveralls.io/github/mrstebo/as-retryable-promise?branch=master)

# as-retryable-promise

Wraps a promise so that it can be retried

## Usage

```js
const asRetryablePromise = require("as-retryable-promise");
const fs = require("fs");
const fn = () => new Promise((resolve ,reject) => {
  fs.readFile("./my-file.txt", (err, data) => {
    if (err) return reject(err);
    return resolve(data);
  });
});

// Will retry if the file is locked
const options = {
  maxRetries: 5,
  timeout: 1000,
  retryCondition: error => error.code === "EACCES",
};
const retryable = asRetryablePromise(fn, options);

retryable
  .then(data => console.log(data))
  .catch(err => console.error(err)); // Will return the error from the last attempt
```
