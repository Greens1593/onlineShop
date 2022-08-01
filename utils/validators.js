const {body} = require('express-validator')

exports.registerValidators = [
    body('email').isEmail().withMessage('Введите коректный email'),
    body('password', 'Пароль должен состоять не мение чем из 6 символов').isLength({min: 6, max: 56}).isAlphanumeric(),
    body('confirm').custom((value, {req}) => {
        if (value !== req.body.password){
            throw new Error('Значение в поле "Повторите пароль" должно совпадать со значением в поле "Пароль"')
        }
        return true
    }),
    body('name', 'Имя должно состоять не мение чем из трех символов').isLength({min: 3})
]