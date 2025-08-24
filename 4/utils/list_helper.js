const _ = require("lodash")
const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item
      }
    const likes = blogs.map(blogs => blogs.likes)
    return likes.reduce(reducer, 0)
}

const favouriteBlog = (blogs) => {
    const likes = blogs.map(blogs => blogs.likes)
    const index = likes.indexOf(Math.max(...likes))
    const info = blogs[index]

    return {
        author: info.author,
        title: info.title,
        url: info.url,
        likes: info.likes
    }
}

const mostBlogs = (blogs) => {
    const counts = _.countBy(blogs, "author")

    const [author, blogCount] = _.maxBy(
        Object.entries(counts),
        ([, count]) => count
    )
    return {
        author: author,
        blogs: blogCount
    }
}

const mostLikes = (blogs) => {
    const group = _.groupBy(blogs, "author")

    const authorLikes = _.map(group, (authorBlogs, author) => ({
        author,
        likes: _.sumBy(authorBlogs, "likes")
    }))
    return _.maxBy(authorLikes, 'likes')
}
  module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs,
    mostLikes
  }