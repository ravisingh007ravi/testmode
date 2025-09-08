const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { ValidName, ValidEmail, ValidPassword } = require('../Validation/AllValidation');

const userSchema = new mongoose.Schema({
    profileImg: {
            secure_url: { type: String, required: false, trim: true },
            public_id: { type: String, required: false, trim: true }
    },
    name: {
        type: String, required: [true, 'Name is required'],
        validate: [ValidName, 'Name is not valid'], trim: true
    },
    email: {
        type: String, unique: true, trim: true, lowercase: true,
        required: [true, 'Email is required'],
        validate: [ValidEmail, 'Email is not valid']
    },
    password: {
        type: String, required: true, trim: true,
        required: [true, 'Password is required'],
        validate: [ValidPassword, 'Password is not valid']
    },
    role: { type: String, enum: ['user', 'admin'], required: true, trim: true },
    Varification: {
        email:{
            newEmail:{type:String,trim:true},
            userOtp: { type: String, default: 0 },
            expireTime: { type: String, default: 0 },
        },
        user: {
            userOtp: { type: String, default: 0 },
            isDeleted: { type: Boolean, default: false },
            isVerify: { type: Boolean, default: false },
            isOtpVerified: { type: String, default: 0 },
        },
        Admin: {
            adminOtp: { type: String, default: 0 },
            isAccountActive: { type: Boolean, default: true },
            isOtpVerified: { type: String, default: 0 },
        }
    },
}, { timestamps: true });

userSchema.pre('save', async function (next) {

    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    }
    catch (err) {
        next(err);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);