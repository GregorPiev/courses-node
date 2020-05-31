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
userSchema.method.addToCart =async function (course) {
    console.log('%caddToCart:' + course, 'color: green');
    const clonedItems = [...this.cart.items];
    const idx = clonedItems.findIndex(c => {
        return c.courseId.toString() === course._id.toString();
    });
    if (idx >= 0) {       
        clonedItems[idx].count = clonedItems[idx].count + 1;
    } else {        
        clonedItems.push({
            courseId: course._id,
            count: 1
        });
    }

    this.cart = { items: clonedItems };
    return this.save();
};

module.exports = model('User', userSchema);