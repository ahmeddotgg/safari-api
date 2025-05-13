import { readFile } from 'fs/promises';
import mongoose from 'mongoose';
import Tour from '../models/tour-model'

const tours = JSON.parse(await readFile('./seed/data.json', 'utf8'));

async function seedDB() {
    try {
        console.log('Connecting to:', process.env.DATABASE_URL);
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('MongoDB connected');

        await Tour.deleteMany();
        console.log('Old data deleted');

        await Tour.insertMany(tours);
        console.log('New data inserted');
    } catch (err) {
        console.error('Seeding error:', err);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

seedDB();
