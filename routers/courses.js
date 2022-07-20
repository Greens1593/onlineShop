const {Router} = require('express');
const Course = require('../models/course')
const auth = require('../middleware/auth.js')
const router = Router()

router.get('/', async (req, res) =>{
    const courses = await Course.find()
    .populate('userId', 'email name') // получение по id данных пользователя
    .select('price title img') // Доступ к елементам курса, не обезательно

    res.render('courses', {
        title: 'Курсы',
        isCourses: true,
        courses
    })
})

router.get('/:id', async (req, res)=>{
    const course = await Course.findById(req.params.id);
    res.render('course', {
        layout: 'detailOfCourse',
        title: `Курс ${course.title}`,
        course
    })
})

router.post('/edit', auth, async (req, res) =>{
    const {id} = req.body
    delete req.body.id
    await Course.findByIdAndUpdate(id, req.body)
    res.redirect('/courses')
})

router.post('/delet', auth, async (req, res) =>{
    try {await Course.deleteOne({_id: req.body.id})}
    catch(e){console.log(e)};

    res.redirect('/courses')
})

router.get('/:id/edit', auth, async (req, res)=>{
    if (!req.query.allow){
        return res.redirect('/')
    }

    const course = await Course.findById(req.params.id)

    res.render('course-edit',{
        title: `Редактировать курс ${course.title}`,
        course
    })
})



module.exports = router