const {Router} = require('express')
const auth = require('../middleware/auth.js')
const router = Router()

const Course = require('../models/course')

router.get('/', auth, (req, res) =>{
    res.render('add', {
        title: 'Добавить курс',
        isAdd: true
    })
})

router.post('/', auth, async (req, res) =>{
    const data = req.body;
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