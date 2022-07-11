const path = require('path');
const fs = require('fs');
const Course = require('./course');

const pathToCard = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'card.json'
    ) 

class Card {
    static async add(course){
        const card = await Card.fetch()
        const index = card.courses.findIndex(c => c.id === course.id)
        const isCourseInCard = card.courses[index]

        if (isCourseInCard){
            isCourseInCard.count ++
            card.courses[index] = isCourseInCard
        } else {
            course.count = 1;
            card.courses.push(course)
        }
        card.price += +course.price
        
        return new Promise ((resolve, reject) => {
            fs.writeFile(pathToCard, JSON.stringify(card), err =>{
                if(err){
                    reject(err)
                } else {
                    resolve(card)
                }
            })
        })
    }


    static async fetch() {
        return new Promise ((resolve, reject) => {
            fs.readFile(pathToCard, 'utf-8', (err, content) => {
                if(err){
                    reject(err)
                } else {
                    resolve(JSON.parse(content))
                }
            })
        })
    }

    static async changeCard(card){
        return new Promise ((res, rej) => {
            fs.writeFile(pathToCard, JSON.stringify(card),
            err => {
                if(err){
                    rej(err)
                } else {
                    res(card)
                }
            })
    })
    }

    static async remove(courseId){
        const card = await Card.fetch()
        const index = card.courses.findIndex(c => c.id === courseId)
        const course = card.courses[index];
        if(course.count === 1){
            card.courses = card.courses.filter(c => c.id !== courseId)
            } else {
            card.courses[index].count --
        }
        card.price -= course.price
        return Card.changeCard(card)
    }

    static async deleteCardItem(courseId){
        const card = await Card.fetch()
        const index = card.courses.findIndex(c => c.id === courseId)
        const count = card.courses[index].count;
        const deletedCourse = card.courses.splice(index, 1)
        card.price -= Number(deletedCourse[0].price) * count;
        return await Card.changeCard(card)
}
}

module.exports = Card