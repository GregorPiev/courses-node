const uuid = require('uuid/v4');
const fs = require('fs');
const path = require('path');


class Course {
    constructor(title, price, img) {
        this.title = title;
        this.price = price;
        this.img = img;
        this.id = uuid();
    }

    toJSON() {
        return{
            title: this.title,
            price: this.price,
            img: this.img,
            id: this.id 
        };
    }

    static async update(course) {
        console.log('course:', course);

        const courses = await Course.getAll();
        const idx = courses.findIndex(c => c.id === course.id);
        console.log('Idx:', idx);
        courses[idx] = course;
        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'courses.json'),               
                JSON.stringify(courses),
                (err) => {
                    if(err) {
                        reject(err);
                    } else {
                        resolve();
                    }
