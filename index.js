const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const _handlebars = require('handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const session = require('express-session')

const homeRouters = require('./routers/home.js');
const cardRouters = require('./routers/card.js');
const coursesRouters = require('./routers/courses.js');
const addRouters = require('./routers/add.js');
const ordersRouters = require('./routers/orders.js');
const authRouters = require('./routers/auth.js');
const varMiddleware = require('./middleware/variables.js')

const User = require('./models/user.js')

const app = express();

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(_handlebars)
})

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(async (req, res, next) => {
    try {
        const user = await User.findById('62d2a0c213898d05b366621f')
        req.user = user
    }
    catch(e){
        console.log(e)
    }
    next()
})

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'some secret value',
    resave: false,
    saveUninitialized: false,
}))
app.use(varMiddleware)

app.use('/', homeRouters);
app.use('/courses', coursesRouters);
app.use('/add', addRouters);
app.use('/card', cardRouters);
app.use('/orders', ordersRouters);
app.use('/auth', authRouters);


const pasword = 'y98QNb2JGHoFKyjq'


const PORT = process.env.PORT || 3000

async function start () {
   try {
        const dbUrl = 'mongodb+srv://greens1593:y98QNb2JGHoFKyjq@cluster0.cqytwgl.mongodb.net/onlineShop'
        await mongoose.connect(dbUrl, {
            useNewUrlParser: true
            })
        const candidate = await User.findOne()
        if(!candidate){
            const user = new User({
                email: 'green@example.com',
                name: 'Mikle',
                cart: {items: []}
            })
        await user.save()
        }
        app.listen(PORT, () => 
        console.log(`Server is runing on PORT ${PORT}`))
    }
    catch(e){
        console.log(e)
    }
}

start()