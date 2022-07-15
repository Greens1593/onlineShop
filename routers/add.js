const {Router} = require('express')
const router = Router()
const Course = require('../models/course')

router.get('/', (req, res) =>{
    res.render('add', {
        title: 'Добавить курс',
        isAdd: true
    })
})

router.post('/', async (req, res) =>{
    const data = req.body;
    const course = new Course({
        title: data.title,
        price: data.price,
        img: data.img
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