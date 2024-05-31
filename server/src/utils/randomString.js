const crypto = require('crypto');

const randomImageName = (bytes) => crypto.randomBytes(bytes).toString('hex');
module.exports = randomImageName;