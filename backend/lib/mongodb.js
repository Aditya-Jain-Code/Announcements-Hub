import { MongoClient } from "mongodb";

// Check if the MongoDB connection string (URI) is set in environment variables
if (!process.env.MONGODB_URI) {
    throw new Error('Invalid / Missing Environment variable: "MONGODB_URI"');
}

// Store the MongoDB connection URI from the environment variable
const uri = process.env.MONGODB_URI;
const option = {};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable to preserve the MongoClient instance
    // across hot module replacements (HMR), which happen frequently during development
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, option);
        global._mongoClientPromise = client.connect(); // Establish a connection to the database
    }
    clientPromise = global._mongoClientPromise; // Use the same MongoClient instance for subsequent connections
} else {
    // In production mode, create a new MongoClient instance and connect
    client = new MongoClient(uri, option);
    clientPromise.connect(); // Establish the connection without HMR considerations
}

// Export a module-scoped MongoClient promise.
// This allows the MongoClient to be shared across multiple modules and reused efficiently.
export default clientPromise;
