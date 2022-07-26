const keys = require('../keys/index.js')
module.exports = function(email, token){
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Востановление доступа',
        html: `
        <h1>Вы забыли пароль?</h1>
        <p>Если нет то проигнорируйте данное письмо </p>
        <a href="${keys.BASE_URL}auth/password/${token}"><p>Если да - жмите</p></a>
        <hr>
        <a href="${keys.BASE_URL}"> Магазин курсов </a>
        `
    }
}