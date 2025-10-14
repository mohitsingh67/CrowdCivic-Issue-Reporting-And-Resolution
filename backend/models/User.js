const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['citizen', 'staff', 'admin'], default: 'citizen' },
    isApproved: { type: Boolean, default: false },
    department: { type: String, required: function() { return this.role === 'staff'; }, default: '' }
}, {
    timestamps: true
});

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.pre('validate', async function(next) {
    if (this.isNew && (this.role === 'admin' || this.role === 'staff')) {
        const count = await this.constructor.countDocuments({ role: { $in: ['admin', 'staff'] } });
        if (count === 0) {
            this.isApproved = true;
        }
    }
    next();
});

module.exports = mongoose.model('User', UserSchema);
