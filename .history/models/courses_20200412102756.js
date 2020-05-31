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

    async save() {
      const courses = await Course.getAll();
    }

    static getAll() {
        return new Promise((resolve, reject) => {
            fs.readFile(
                path.join(__dirname, '..', 'data', 'courses.json'),
                'utf-8',
                (err, content) => {
                    if(err) {
                        reject(err);
                    } else {
                        resolve(JSON.parse(content));
                    } 
                }
            );
        });
        
    }
}

module.exports = Course;