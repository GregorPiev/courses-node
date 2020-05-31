const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    cart: {
        count: {
            type: Number,
            required: true,
            default: 1
        },
        courseId: {
            type: Schema.Types.ObjectId,
            required: false,
            ref: 'Course'
        }
    }
});

module.exports = model('User', userSchema);