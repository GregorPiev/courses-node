const keys = require('../keys');

module.exports = function (to) {
    return {
        to: to,
        from: keys.EMAIL_FROM,
        subject: '',
        html: ''
    }
};