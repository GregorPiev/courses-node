const keys = require('../keys');

module.exports = function (email) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Account is created',
        html: `
          <h1>Wellcome to our shop</h1>
          <p>You have created account by success with email: ${email}</p>
          <hr/>
          <a href="${keys.BASE_URL}">Shop</a>
        `
    }
};