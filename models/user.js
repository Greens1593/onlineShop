const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: String,
    password: {
        type: String,
        required: true,
    },
    resetToken: String,
    resetTokenExp: Date,
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
    },
    avatarUrl: String,
})

userSchema.methods.addToCart = function(course){
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

userSchema.methods.removeFromCart = function(id){
    let items = [...this.cart.items]
    const index = items.findIndex(c => c.courseId.toString() === id.toString())
    if(items[index].count === 1){
        items = items.filter(c => c.courseId.toString() !== id.toString())
    } else {
        items[index].count--
    }
    this.cart = {items}
    return this.save()
}

userSchema.methods.removeCartItem = function(id){
    let items = [...this.cart.items]
    items = items.filter(c => c.courseId.toString() !== id.toString())
    this.cart = {items}
    return this.save()
}

userSchema.methods.clearCart = function(){
    this.cart = {items: []}
    return this.save()
}

module.exports = model('User', userSchema)