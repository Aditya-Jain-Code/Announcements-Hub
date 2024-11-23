import mongoose from "mongoose";

// Function to establish a connection to the MongoDB database using Mongoose
export function mongooseConnect() {
    // Check if Mongoose is already connected
    if (mongoose.connection.readyState === 1) {
        // If Mongoose is already connected, return the existing connection as a Promise
        return mongoose.connection.asPromise();
    } else {
        // If not connected, retrieve the MongoDB URI from environment variables
        const uri = process.env.MONGODB_URI;

        // Establish a new connection to the MongoDB database and return the Promise
        return mongoose.connect(uri);
    }
}
