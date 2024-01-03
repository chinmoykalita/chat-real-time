import mongoose, { mongo } from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    password: String
});

const User = mongoose.model('User', UserSchema);

export default User