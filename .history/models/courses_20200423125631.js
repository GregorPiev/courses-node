const {Schema, model} = require('mongoose');
const course = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    img: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});
course.method('toClient', function() {
    
});

module.exports = model('Course', course);