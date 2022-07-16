const {Schema, model} = require('mongoose');

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
        items: [
            {
                count: {
                    type: Number,
                    required: true,
                    default: 1
                },
                courseId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Course',
                    required: true
                }
            }
        ]
    }
    
})

userSchema.methods.addToCart = function(course){
    console.log(course)
    const clonedItems = [...this.cart.items]
    const index = clonedItems.findIndex(c =>{
        return c.courseId.toString() === course._id.toString()
    })

    if(index >= 0) {
        clonedItems[index].count += 1 
    } else {
        clonedItems.push({
            courseId: course._id,
            count: 1
        })
    }

    const newCart = {items: clonedItems}
    this.cart = newCart
    return this.save()
}

module.exports = model('User', userSchema)