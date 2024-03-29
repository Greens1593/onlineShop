const {Router} = require('express')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')
const crypto = require('crypto')
const {validationResult} = require('express-validator')

const keys = require('../keys')
const User = require('../models/user.js')
const regEmail = require('../emails/registration.js')
const resetEmail = require('../emails/reset.js')
const user = require('../models/user.js')
const {registerValidators, authValidators} = require('../utils/validators.js')
const router = Router()

const transporter = nodemailer.createTransport(sendgrid({
    auth: {api_key: keys.SEND_GRID_API_KEY}
}))

router.get('/login', async (req, res) =>{
    res.render('auth/login', {
        title: 'Авторизация',
        isLogin: true,
        loginError: req.flash('loginError'),
        registerError: req.flash('registerError')
    })
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login#login')
    })
})

router.post('/login', authValidators, async (req, res) => {
    
    const errors = validationResult(req)
        if(!errors.isEmpty()){
            req.flash('loginError', errors.array()[0].msg)
            return res.status(422).redirect('/auth/login#login')
        }

    try{
        const {email} = req.body;
        const candidate = await User.findOne({email});
        req.session.user = candidate;
        req.session.isAuthenticated = true;
        req.session.save(err => {
            if (err) {
                throw err
            }
        res.redirect('/')
    })} catch(e){
        console.log(e)
    }
})

router.post('/register', registerValidators, async (req, res) => {
    try{
        const {email, password, name} = req.body;
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            req.flash('registerError', errors.array()[0].msg)
            return res.status(422).redirect('/auth/login#register')
        }
            const hashPassword = await bcrypt.hash(password, 10)
            const user = new User({
                email, name, password: hashPassword, cart: {items: []}
            })
            await user.save()
            res.redirect('/auth/login#login')
            await transporter.sendMail(regEmail(email))
    }
    catch (e){
        console.log(e)
    }
})

router.get('/reset', async (req,res) => {
    res.render('auth/reset', {
        title: 'Забыли пароль?',
        error: req.flash('error')
    })
})

router.post('/reset', (req, res) => {
    try {
        crypto.randomBytes(32, async (err, buffer) => {
            if (err){
                req.flash('error', 'Что-то пошло не так, повторите попытку позже')
                return res.redirect('/auth/reset')
            }
        
            const token = buffer.toString('hex')
            const candidate = await User.findOne({email: req.body.email})
        
           if(candidate){
                candidate.resetToken = token,
                candidate.resetTokenExp = Date.now() + 60*60*1000.
                await candidate.save()
                await transporter.sendMail(resetEmail(candidate.email, token))
                res.redirect('/auth/login')
            } else {
                req.flash('error', 'Такого email нет')
                res.redirect('/auth/reset')
            }

        })
    } catch (e) {
        console.log(e)
    }
})

router.get('/password/:token', async (req,res) => {
    if(!req.params.token){
        return res.redirect('/auth/login')
    }
    try {
        const user = await User.findOne({
            resetToken: req.params.token,
            resetTokenExp: {$gt: Date.now()}
    })
    if(!user){
        console.log('user')
        return res.redirect('/auth/login')
    } else {
        res.render('auth/password', {
            title: 'Востановление пароля',
            error: req.flash('error'),
            userId: user._id.toString(),
            token: req.params.token
        })
    }} catch (e) {
        console.log(e)
    }
})

router.post('/password', async (req, res) => {
    try{
        const user = await User.findOne({
             _id: req.body.userId,
             resetToken: req.body.token,
             resetTokenExp: {$gt: Date.now()}
        })
        if(user){
            user.password = await bcrypt.hash(req.body.password, 10)
            user.resetToken = undefined
            user.resetTokenExp = undefined
            await user.save()
            res.redirect('/auth/login')
        }else{
            req.flash('loginError', 'Время жизни токена истекло'),
            res.redirect('/auth/login')
        }
    } catch (e){
        console.log(e)
    }

})

module.exports = router