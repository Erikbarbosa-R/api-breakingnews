import {
   createService, 
   findAllService,
   countNews,
   topNewsService,
   findByIdService
 } from "../services/news.service.js";


export const create =  async (req, res) => {
   try {

    const {title, text, banner} = req.body;

    if (!title || !text || !banner) {
        res.status(400).send({message: "Submit all fields for registration"

        });
    }

    await createService({
        title,
        text,
        banner,
        user: req.userId,
    });

    res.status(201).json({message: "Created"});
   } catch (err) {
       res.status(500).send({message: err.message})
   }
};

export const findAll = async (req, res) => {
    try {
        let { limit, offset } = req.query;
    
        limit = Number(limit) || 5;
        offset = Number(offset) || 0;
    
        const news = await findAllService(offset, limit);
        const total = await countNews();
        const currentUrl = req.baseUrl;
    
        const next = offset + limit;
        const nextUrl = next < total ? `${currentUrl}?limit=${limit}&offset=${next}` : null;
    
        const previus = offset - limit < 0 ? null : offset - limit;
        const previusUrl = previus != null ? `${currentUrl}?limit=${limit}&offset=${previus}` : null;
    
        if (news.length === 0) {
            return res.status(400).send({ message: "There are no registered news" });
        }
    
        res.send({
            nextUrl,
            previusUrl,
            limit,
            offset,
            total,
            results: news.map((item) => ({
                id: item._id,
                title: item.title,
                text: item.text,
                banner: item.banner,
                likes: item.likes,
                comments: item.Comments,
                name: item.user.name,
                username: item.user.username,
                userAvatar: item.user.avatar,
            }))
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Internal server error" });
    };
};
     
export const topNews = async (req, res) => {
    try {
        const news = await topNewsService();

        if (!news) {
            return res.status(404).send({ message: "There is no registered post" });
        }
        
        res.send({
            news: {
                id: news._id,
                title: news.title,
                text: news.text,
                banner: news.banner,
                likes: news.likes,
                comments: news.Comments,
                name: news.user.name,
                username: news.user.username,
                userAvatar: news.user.avatar
            }
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export const findById = async (req, res) => {
    try {
        const { id } = req.params;

        const news = await findByIdService(id);
        
        return res.send({
            news: {
                id: news._id,
                title: news.title,
                text: news.text,
                banner: news.banner,
                likes: news.likes,
                comments: news.Comments,
                name: news.user.name,
                username: news.user.username,
                userAvatar: news.user.avatar
            }

        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }   

};
