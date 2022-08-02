const {body} = require('express-validator')
const User = require('../models/user.js')
const bcrypt = require('bcryptjs')

exports.registerValidators = [
    body('email')
        .isEmail().withMessage('Введите коректный email')
        .custom(async (value, {req})=>{
        try{
            const candidate = await User.findOne({email: value})
            if(candidate) {
                return Promise.reject('Пользователь с таким email уже существует')
            }
        } catch(e){
            console.log(e)
        }
    })
    .normalizeEmail(),

    body('password', 'Пароль должен состоять не мение чем из 6 символов')
    .isLength({min: 6, max: 56})
    .isAlphanumeric()
    .trim(),
    body('confirm')
    .custom((value, {req}) => {
        if (value !== req.body.password){
            throw new Error('Значение в поле "Повторите пароль" должно совпадать со значением в поле "Пароль"')
        }
        return true
    })
    .trim(),

    body('name', 'Имя должно состоять не мение чем из трех символов')
    .isLength({min: 3})
    .trim()
]

exports.authValidators = [
    body('email')
        .custom(async (value, {req})=>{
        try{
            const candidate = await User.findOne({email: value})
            if(!candidate) {
                return Promise.reject('Такого пользователя не существует')
            }
        } catch(e){
            console.log(e)
        }
    }),

    body('password')
        .custom(async (value, {req})=>{
        try{
            const candidate = await User.findOne({email: req.body.email});
            const password = value;
            const areSame = await bcrypt.compare(password, candidate.password) || null
            if(!areSame) {
                return Promise.reject('Неверный пароль. Проверте язык и регистр ввода')
            }
        } catch(e){
            console.log(e)
        }
    })
    .trim()
]

exports.courseValidators = [
    body('title', 'Минимальная длина названия не должна быть меньше 3 символов').isLength({min: 3}).trim(),
    body('price', 'Введите корректную цену').isNumeric(),
    body('img').isURL().withMessage('Введите корректный utl-адрес изображения')
]