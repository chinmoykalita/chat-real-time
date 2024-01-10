import mongoose from "mongoose";

const Schema = mongoose.Schema;

const roomSchema = new Schema({
    roomName: { type: String },
    private: { type: Boolean },
    password: { type: String }

});

const Room = mongoose.model('Room', roomSchema);

export default Room;