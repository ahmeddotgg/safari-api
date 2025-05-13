import mongoose from "mongoose";
import { app } from "./app";


const port = process.env.PORT || 3000;
mongoose.connect(process.env.DATABASE_URL as string, {})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('Connection error', err));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
