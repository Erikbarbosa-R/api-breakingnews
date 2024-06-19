import News from "../models/news.js";

export const createService = (body) => News.create(body);

export const findAllService = (offset, limit) => 
 News.find().sort({_id: -1 }).skip(offset).limit(limit).populate("user");

export const countNews = () => 
 News.countDocuments();

export const topNewsService = () => 
 News.findOne({}).sort({_id: -1}).populate("user");

export const findByIdService = (id) => News.findById(id).populate("user");

export const searchByTitleService = (title) => 
 News.find({
   title: { $regex: `${title || "" }`, $options: "i"},
})
.sort({_id: -1})
.populate("user");

export const ByUserService = (id) => News.find({user: id}).sort({_id: -1}).populate("user");

export const updateService = (id, title, text,  banner ) => 
  News.findOneAndUpdate(
    {_id: id},
    {title, text, banner},
    {
      rawResult: true,
    }
  );

export const eraseService = (id) => News.findByIdAndDelete({_id: id});

export const LikeNewsService = (idNews, userId) => {
    return   News.findOneAndUpdate(
      { _id: idNews, "likes.userId": { $nin: [userId] } },
      { $push: { likes: { userId, created: new Date() } } },    
      { new: true }
  );
};

export const DeleteLikeNewsService = (idNews,
 userId) => 
     News.findOneAndUpdate(
     { _id: idNews},
     { $pull: { likes: { userId } } },  
     { new: true }
 );


export const addCommentService = (idNews,  comment,
 userId) => {
const idComment = Math.floor(Date.now() * Math.random
  ()).toString(36);

    return  News.findOneAndUpdate(
    { _id: idNews },
    { 
      $push:{
         comments: { idComment, userId, comment,
         createdAt: new Date() },
        }, 
      },
    { new: true }
  );
};

// export const deleteCommentService = (idNews, idComment) => 
//   News.findOneAndUpdate(
//       { _id: idNews },
//       { $pull: { comments: { _id: idComment } } },
//       { new: true }
//   );
