const { Schema, models, model } = require("mongoose");

const NewsSchema = new Schema({
    title: { type: String },
    slug: { type: String, required: true },
    description: { type: String },
    newscategory: { type: String },
    tags: { type: String },
    status: { type: String }, // Either 'draft' or 'publish'
    publishedAt: { type: Date }, // Track when the announcement is published
},
    {
        timestamps: true // Automatically adds 'createdAt' and 'updatedAt'
    });

export const News = models.News || model('News', NewsSchema, 'NewsDatabase');
