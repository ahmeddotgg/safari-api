import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

// GeoJSON schema for startLocation and locations
const geoPointSchema = new Schema({
    type: {
        type: String,
        enum: {
            values: ['Point'],
            message: 'Location type must be Point'
        },
        required: [true, 'Location type is required'],
        default: 'Point'
    },
    coordinates: {
        type: [Number],
        required: [true, 'Coordinates are required']
    },
    description: String,
    address: String
}, { _id: false });

// Location stop sub-schema
const locationSchema = new Schema({
    type: {
        type: String,
        enum: {
            values: ['Point'],
            message: 'Location type must be Point'
        },
        required: [true, 'Location type is required'],
        default: 'Point'
    },
    coordinates: {
        type: [Number],
        required: [true, 'Coordinates are required']
    },
    description: String,
    day: Number
}, { _id: false });

// Main Tour schema
const tourSchema = new Schema({
    name: {
        type: String,
        required: [true, 'A tour name is required'],
        trim: true
    },
    duration: {
        type: Number,
        required: [true, 'A tour duration is required']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'Max group size is required']
    },
    difficulty: {
        type: String,
        required: [true, 'Difficulty is required'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty must be either easy, medium, or difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'Price is required']
    },
    priceDiscount: {
        type: Number
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'Summary is required']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'Cover image is required']
    },
    images: {
        type: [String],
        default: ['default-1.jpg', 'default-2.jpg']
    },
    startDates: {
        type: [Date]
    },
    startLocation: {
        type: geoPointSchema,
        required: [true, 'Start location is required']
    },
    locations: {
        type: [locationSchema]
    },
    guides: [{
        type: Types.ObjectId,
        ref: 'User'
    }],
}, { timestamps: true });

const Tour = model('Tour', tourSchema);
export default Tour;
