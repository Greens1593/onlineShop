const {Router} = require('express');
const { deleteCourse } = require('../models/course');
const Course = require('../models/course')
const router = Router()

router.get('/', async (req, res) =>{
    const courses = await Course.getAll();
    res.render('courses', {
        title: 'Курсы',
        isCourses: true,
        courses
    })
})

router.get('/:id', async (req, res)=>{
    const course = await Course.getCourseById(req.params.id);
    res.render('course', {
        layout: 'detailOfCourse',
        title: `Курс ${course.title}`,
        course
    })
})

router.post('/edit', async (req, res) =>{
    const data = req.body
    await Course.updateCourses(data)
    res.redirect('/courses')
})

router.post('/delet', async (req, res) =>{
    const course = await Course.getCourseById(req.body.id)
    await deleteCourse(course)
    res.redirect('/courses')
})

router.get('/:id/edit', async (req, res)=>{
    if (!req.query.allow){
        return res.redirect('/')
    }

    const course = await Course.getCourseById(req.params.id)

    res.render('course-edit',{
        title: `Редактировать курс ${course.title}`,
        course
    })
})



module.exports = router