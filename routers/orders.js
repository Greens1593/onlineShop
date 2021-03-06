const {Router} = require('express');
const Order = require('../models/order.js');
const auth = require('../middleware/auth.js')
const router = Router();

router.get('/', auth, async (req, res) => {
    try{
        const orders =  await Order.find({'user.userId': req.user._id})
            .populate('user.userId')
        res.render('orders', {
            isOrders: true,
            title: 'Заказы',
            orders: orders.map(o => {
                return {
                    ...o._doc,
                    price: o.courses.reduce((total, c)=>{
                        return total += c.count * c.course.price
                    },0)
                }
            })
        })
    }catch(e){
        console.log(e)
    }
})

router.post('/', auth, async (req, res) => {
    try{
    const user = await req.user
        .populate('cart.items.courseId')
    const courses = user.cart.items.map(i => ({
        count: i.count,
        course: {...i.courseId._doc}
    }))

    const order = new Order({
        user: {
            name: req.user.name,
            userId: req.user,
        },
        courses: courses,
    })

    await order.save()
    await user.clearCart()
    } catch(e){
        console.log(e)
    }
    
    res.redirect('/orders')
})

module.exports = router;