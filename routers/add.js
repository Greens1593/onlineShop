const {Router} = require('express')
const {validationResult} = require('express-validator')
const auth = require('../middleware/auth.js')
const {courseValidators} = require('../utils/validators.js')
const router = Router()

const Course = require('../models/course')

router.get('/', auth, (req, res) =>{
    res.render('add', {
        title: 'Добавить курс',
        isAdd: true
    })
})

router.post('/', auth, courseValidators, async (req, res) =>{
    const data = req.body;

    const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(422).render('add', {
                title: 'Добавить курс',
                isAdd: true,
                error: errors.array()[0].msg,
                data: {
                    title: data.title,
                    price: data.price,
                    img: data.img,
                }
            })
        }

    const course = new Course({
        title: data.title,
        price: data.price,
        img: data.img,
        userId: req.user._id
    })

    try {
        await course.save()
        res.redirect('/courses')
    }
    catch(e){
        console.log(e)
    }
})

module.exports = router