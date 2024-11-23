import { mongooseConnect } from "@/lib/mongoose";
import { News } from "@/models/news";
import cron from 'node-cron';

// Main API handler function to manage different HTTP methods (GET, POST, PUT, DELETE)
export default async function handle(req, res) {
    // Connect to the MongoDB database
    await mongooseConnect();

    // Destructure the HTTP method from the request
    const { method } = req;

    // Handle POST request (Create a new news document)
    if (method === 'POST') {
        // Extract news data from the request body
        const { title, slug, description, newscategory, tags, status } = req.body;

        // Create a new document in the 'news' collection
        const newsDoc = await News.create({
            title, slug, description, newscategory, tags, status,
            // Only set publishedAt if the status is 'publish'
            ...(status === 'publish' && { publishedAt: new Date() })
        });

        // Return the newly created document as a JSON response
        res.json(newsDoc);
    }

    // Handle GET request (Fetch news data)
    if (method === 'GET') {
        // If an ID is provided in the query, fetch a single news document by ID
        if (req.query?.id) {
            res.json(await News.findById(req.query.id));
        } else {
            // If no ID is provided, fetch all news documents and reverse their order (to get the most recent first)
            res.json((await News.find()).reverse());
        }
    }

    // Handle PUT request (Update an existing news document)
    if (method === 'PUT') {
        // Extract data and the ID from the request body for the news document to update
        const { _id, title, slug, description, newscategory, tags, status } = req.body;

        // Update the document matching the provided ID with the new data
        await News.updateOne({ _id }, {
            title, slug, description, newscategory, tags, status,
            // If status changes to 'publish', set the publishedAt field
            ...(status === 'publish' && { publishedAt: new Date() })
        });

        // Return a confirmation response
        res.json(true);
    }

    // Handle DELETE request (Delete a news document by ID)
    if (method === 'DELETE') {
        // If an ID is provided in the query, delete the corresponding document
        if (req.query?.id) {
            await News.deleteOne({ _id: req.query?.id });
            res.json(true); // Return a confirmation response after deletion
        }
    }
}

// Set up the cron job to automatically delete old published announcements
cron.schedule('0 0 * * *', async () => {
    try {
        // Find and delete news documents that are more than 7 days old and have 'publish' status
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        // Delete announcements that were published more than 7 days ago
        const result = await News.deleteMany({
            status: 'publish',
            publishedAt: { $lt: sevenDaysAgo }
        });

        console.log(`${result.deletedCount} old published announcements deleted`);
    } catch (error) {
        console.error('Error deleting old announcements:', error);
    }
});
