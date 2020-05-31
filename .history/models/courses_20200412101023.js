const uuid = require('uuid/v4');

class Course {
    constructor(title, price, img) {
        this.title = title;
        this.price = price;
        this.img = img;  
        this.id = null;
    }

    save() {

    }
}

module.exports = Course;