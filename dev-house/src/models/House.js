import { Schema, model } from 'mongoose';

export default model('House', new Schema({

    thumbnail: String,
    description: String,
    price: Number,
    location: String,
    status: Boolean,

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

}));