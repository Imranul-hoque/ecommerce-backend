const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt');
const crypto = require('crypto');

var userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    isBlocked : {
        type : Boolean,
        default : false
    },
    role : {
        type : String,
        default : 'user'
    },
    card : {
        type : Array,
        default : []
    },
    address : [{ type : mongoose.Schema.Types.ObjectId,  ref : 'Address' }],
    wishlist : [{ type : mongoose.Schema.Types.ObjectId, ref : 'Product' }],
    refreshToken : {
        type : String
    },
    passwordChangedAt : Date,
    passwordResetToken : String,
    passwordResetExpires : Date



}, { timestamps : true });


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
})

userSchema.methods.isPasswordMatch = async function(enterPassword) {
    return bcrypt.compare(enterPassword, this.password)
}

userSchema.methods.createPasswordResetToken = async function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 30 * 60 * 1000;
    return resetToken; 
}

module.exports = mongoose.model('User', userSchema);