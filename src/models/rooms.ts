import mongoose from "mongoose";

const Schema = mongoose.Schema;

const roomSchema = new Schema({
    roomName: String,
    private: Boolean,
    password: String

});

const Room = mongoose.model('Room', roomSchema);

export default Room;