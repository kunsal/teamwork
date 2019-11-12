const FeedModel = require('../../models/feed.model');
const response = require('../../helpers/response');
const { serverError } = require('../../helpers/helper');
const Feed = new FeedModel();

const fetch = async (req, res) => {
  try {
    const posts = await Feed.all();
    const data = [];
    for (post of posts.rows) {
      const feedObject = {
        id: post.id,
        createdOn: post.createdat,
        title: post.title,
        authorId: post.author
      };
      if (post.feedtype === 'gif') {
        feedObject.url = post.content;
      } else {
        feedObject.article = post.content;
      }
      data.push(feedObject)
    }
    res.send(response.success(data));
  } catch (e) {
    serverError(res, e);
  }
  
};

module.exports = {
  fetch
};
