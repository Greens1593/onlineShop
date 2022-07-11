const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid')

class Course {
    constructor(title, price, img) {
        this.title = title
        this.price = price
        this.img = img
        this.id = uuidv4()
    }

    createCourseObj () {
        return {
            title: this.title,
            price: this.price,
            img: this.img,
            id: this.id
        }
    }

    async save(){
        const courses = await Course.getAll()
        courses.push(this.createCourseObj())
        return new Promise ((res, rej) => {
            fs.writeFile(
            path.join(__dirname, '..', 'data', 'courses.json'),
            JSON.stringify(courses),
            (err) => {
                if(err){rej(err)}
                else{
                    res()
                }
            }
        )})
    }
    static getAll (){
        return new Promise ((res, rej) => {
            fs.readFile(
            path.join(__dirname, '..', 'data', 'courses.json'), 
            'utf-8',
            (err, content) => {
            if(err){rej(err)}
            else{
                res(JSON.parse(content))
            }
        })})
    }
    static async getCourseById(id) {
        const courses = await this.getAll()
        return courses.find(course => course.id === id)
    }
    
    static async updateCourses(course){
        const courses = await Course.getAll()
        const index = courses.findIndex(c => c.id === course.id)
        courses[index] = course;
        return new Promise ((res, rej) => {
            fs.writeFile(
            path.join(__dirname, '..', 'data', 'courses.json'),
            JSON.stringify(courses),
            (err) => {
                if(err){rej(err)}
                else{
                    res()
                }
            }
        )})
    }

    static async deleteCourse(course){
        const courses = await Course.getAll()
        const index = courses.findIndex(c => c.id === course.id)
        courses.splice(index, 1)
        return new Promise ((res, rej) => {
            fs.writeFile(
            path.join(__dirname, '..', 'data', 'courses.json'),
            JSON.stringify(courses),
            (err) => {
                if(err){rej(err)}
                else{
                    res()
                }
            }
        )})
    }
}

module.exports = Course