const keys = require('../keys');

module.exports = function (email) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Restore password',
        html: `
        <h1>You you have forgot password</h1>
          <p>Do not pay attention if that no your case</p>
          <p>else click on link</p>
          <hr/>
          <a href="${email}">Shop shmonces</a>
        `
    }
};