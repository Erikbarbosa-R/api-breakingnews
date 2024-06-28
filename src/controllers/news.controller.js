import {
   createService, 
   findAllService,
   countNews,
   topNewsService,
   findByIdService,
   searchByTitleService,
   ByUserService,
   updateService,
   LikeNewsService,
   DeleteLikeNewsService,
   addCommentService
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
    
        // if (news.length === 0) {
        //     return res.status(400).send({ message: "There are no registered news" });
        // }
        // post.shift();

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
                comments: item.comments,
                name: item.user.name,
                username: item.user.username,
                userAvatar: item.user.avatar,
            })),
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
                comments: news.comments,
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
                comments: news.comments,
                name: news.user.name,
                username: news.user.username,
                userAvatar: news.user.avatar
            },

        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }   

};

export const searchByTitle = async (req, res) => {
    try {
        const { title } = req.query;
        const news = await searchByTitleService(title);

        if (news.length === 0) {
            return res
            .status(400)
            .send({ message: "There are no news with this title" });
        }

        return res.send({
         results: news.map((item) => ({
                id: item._id,
                title: item.title,
                text: item.text,
                banner: item.banner,
                likes: item.likes,
                comments: item.comments,
                name: item.user.name,
                username: item.user.username,
                userAvatar: item.user.avatar
            }) )
        });

    } catch (err) {
        res.status(500).send({ message: err.message });
    }   
};

export const ByUser = async (req, res) => {
    try {
        const  id  = req.userId;
        const news = await ByUserService(id);

        return res.send({
            news: news.map((item) => ({
                id: item._id,
                title: item.title,
                text: item.text,
                banner: item.banner,
                likes: item.likes,
                comments: item.comments,
                name: item.user.name,
                username: item.user.username,
                userAvatar: item.user.avatar
            })),
        });
    } catch (err) {
        res.status(500).send({ message: err.message });    
    }
};

export const update = async (req, res) => { 
    try {
        const {  title, text, banner } = req.body;
        const { id } = req.params;

        if (!title && !text && !banner) {
           return res.status(400).send({ 
            message: "Submit at  least one field to update the post", 
           });
        }

        const news = await  findByIdService(id); 
         console.log(typeof news.user._id, typeof req.userId);

        if ( news.user._id.toString() !==  req.userId) {
            return res.status(403).send({ message: "You didn't update this post",               
             });
        }

        await updateService(id, title, text, banner);   

        return res.send({ message: "Post successfully updated!" });    
    } catch (err) {
        res.status(500).send({ message: err.message });
    }   
};

export const erase = async (req, res) => { 
    try {
        const { id } = req.params;

        const news = await findByIdService(id);

        if (news.user._id.toString() !==  req.userId) {
            return res.status(403).send({ message: "You didn't delete  this News",               
             });
        }
        await eraseService(id);

        return res.send({ message: "News successfully deleted!" });
    } catch (err) {
        res.status(500).send({ message: err.message });

    }
};

export const likeNews = async (req, res) => {
    try { 
        const { id } = req.params;
        const userId = req.userId;
    
         const newsLiked =  await  LikeNewsService(id, userId);
      
        if (!newsLiked) { 
            await DeleteLikeNewsService(id, userId);
            return res.status(200).send({ message: "Like succesfully removed"});
        };

         res.send ({ message : "like done successfully" });
    } catch (err) {
    
        res.status(500).send({ message: err.message });
    }
};

export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).send({ message: "Write a message to comment" });
    }

    await addCommentService(id, comment, userId);

    res.send({ message: "Comment added successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// export const deleteComment = async (req, res) => { 
//     try {
//         const { idNews, idComment } = req.params;
//         const  userId  = req.userId;
        
//         const commentDeleted = await deleteCommentService(idNews, idComment, userId);

//           const commentFinder = commentDeleted.comments.find(comment => comment.idComment === idComment);

            // if (!commentFinder) {
            //     return res.status(404).send({ message: "Comment not found" });
            // }

            // if(commentDeleted.comments.userId !== userId) {
            //     return res.status(400).send({ message: "You don't have permission to delete this comment" });
            // } 
//         res.send({ message: "Comentário removido com sucesso" });
//     } catch (err) {
//         res.status(500).send({ message: err.message });
//     }
// };
