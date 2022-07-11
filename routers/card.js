const {Router} = require('express');
const router = Router();
const Card = require('../models/card')
const Course = require('../models/course')

router.post('/add', async (req, res)=>{
    const course = await Course.getCourseById(req.body.id);
    const card = await Card.add(course);
    res.redirect('/card')
})

router.post('/counter-plus', async (req, res)=>{
    const course = await Course.getCourseById(req.body.id);
    const card = await Card.add(course);
    res.status(200).json(card)
})

router.post('/delete', async (req, res)=>{
    await Card.deleteCardItem(req.body.id);
    res.redirect('/card')
})

router.delete('/remove/:id', async (req, res) =>{
    const card = await Card.remove(req.params.id);
    res.status(200).json(card)
})

router.get('/', async (req, res) => {
    const card = await Card.fetch();
    res.render('card', {
        title: 'Корзина',
        isCard: true,
        courses: card.courses,
        price: card.price
    })
})



module.exports = router