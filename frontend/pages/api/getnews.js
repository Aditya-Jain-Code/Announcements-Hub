import { mongooseConnect } from "@/lib/mongoose";
import { News } from "@/models/news";

export default async function handle(req, res) {
    const { method } = req;

    await mongooseConnect();

    if (method === 'GET') {
        if (req.query?.id) {
            // fetch a single news by id
            const news = await findById(req.query.id);
            res.json(news);
        } else if (req.query?.newscategory) {
            // fetch news by newscategory
            const category = await News.find({ newscategory: req.query.newscategory });
            res.json(category.reverse());
        } else if (req.query?.tags) {
            // fetch news by tags
            const tag = await News.find({ tags: req.query.tags });
            res.json(tag.reverse());
        } else if (req.query?.slug) {
            // fetch news by slug
            const url = await News.find({ slug: req.query.slug });
            res.json(url.reverse());
        } else {
            // fetch all news
            const news = await News.find();
            res.json(news.reverse());
        }
    } else {
        res.status(405).json({ message: "Method Not Allowed" });
    }
}