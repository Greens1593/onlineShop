const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const homeRouters = require('./routers/home.js');
const cardRouters = require('./routers/card.js');
const coursesRouters = require('./routers/courses.js');
const addRouters = require('./routers/add.js');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.urlencoded({extended: true}))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', homeRouters);
app.use('/courses', coursesRouters);
app.use('/add', addRouters);
app.use('/card', cardRouters);


const pasword = 'y98QNb2JGHoFKyjq'


const PORT = process.env.PORT || 3000

async function start () {
   try {
    const dbUrl = 'mongodb+srv://greens1593:y98QNb2JGHoFKyjq@cluster0.cqytwgl.mongodb.net/?retryWrites=true&w=majority'
    await mongoose.connect(dbUrl, {useNewUrlParser: true})
    app.listen(PORT, () => 
    console.log(`Server is runing on PORT ${PORT}`))
}
catch(e){
    console.log(e)
}
}

start()