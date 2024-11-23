const { Schema, models, model } = require("mongoose");

const NewsSchema = new Schema({
    title: { type: String },
    slug: { type: String, required: true },
    description: { type: String },
    newscategory: { type: String }, // Markdown content
    tags: { type: String },
    status: { type: String },
},
    {
        timestamps: true // Automatically adds 'createdAt' and 'updatedAt'
    }
);

export const News = models.News || model('News', NewsSchema, 'NewsDatabase');
