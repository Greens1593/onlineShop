const {Router} = require('express');
const {validationResult} = require('express-validator');
const Course = require('../models/course');
const auth = require('../middleware/auth.js');
const {courseValidators} = require('../utils/validators.js');

const router = Router()

function isOwner (course, req) {
    return course.userId.toString() === req.user._id.toString()
    }

router.get('/', async (req, res) =>{
   try{
    const courses = await Course.find()
    .populate('userId', 'email name') // получение по id данных пользователя
    .select('price title img') // Доступ к елементам курса, не обезательно
    res.render('courses', {
        title: 'Курсы',
        isCourses: true,
        userId: req.user ? req.user._id.toString() : null,
        courses
    })} catch (e) {
        console.log(e)
    }
})

router.get('/:id', async (req, res)=>{
    try{
        const course = await Course.findById(req.params.id);
        res.render('course', {
        layout: 'detailOfCourse',
        title: `Курс ${course.title}`,
        course
    })
    } catch (e){
        console.log(e)
    }
})

router.post('/edit', auth, courseValidators, async (req, res) =>{   
    const errors = validationResult(req)
    const {id} = req.body
        if(!errors.isEmpty()){
            req.flash('editError', errors.array()[0].msg)
            return res.status(422).redirect(`/courses/${id}/edit?allow=true`)
        }

    try{ 
        delete req.body.id
        const course = await Course.findById(id)
        if(!isOwner(course, req)){
            return res.redirect('/courses')
        }
        await Course.findByIdAndUpdate(id, req.body)
        res.redirect('/courses')
    }catch(e){
        console.log(e)
    }
})

router.post('/delet', auth, async (req, res) =>{
    try {await Course.deleteOne({
        _id: req.body.id,
        userId: req.user._id,
    })}
    catch(e){console.log(e)};

    res.redirect('/courses')
})

router.get('/:id/edit', auth, async (req, res)=>{
    if (!req.query.allow){
        return res.redirect('/')
    }

    try {
        const course = await Course.findById(req.params.id)

        if(!isOwner(course, req)){
            return res.redirect('/courses')
        }

        res.render('course-edit',{
            title: `Редактировать курс ${course.title}`,
            editError: req.flash('editError'),
            course
        })
    } catch (e) {
        console.log(e)
    }
})



module.exports = router