import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlog, removeBlog, user }) => {

  const [showDetails, setShowDetails] = useState(false)
  const [likesState, setLikesState] = useState(blog.likes)

  const toggleShowDetails = () => {
    setShowDetails(!showDetails)
  }

  const addLike = (event) => {
    event.preventDefault()
    updateBlog({
      id: event.target.id.value,
      title: event.target.title.value,
      author: event.target.author.value,
      url: event.target.url.value,
      user: event.target.user.value,
      likes: parseInt(event.target.likes.value) + 1
    })
    setLikesState(likesState + 1)
  }

  const deleteBlog = (event) => {
    event.preventDefault()
    if (window.confirm('Are you sure you want to remove blog ' + event.target.name.value + '?')) {
      removeBlog(event.target.id.value)
    }
  }

  const blogStyle = {
    border: '1px solid black',
    padding: '10px 20px',
    marginBottom: '15px',
  }
  const titleStyle = {
    cursor: 'pointer',
    padding: '5px',
  }
  const detailsStyle = {
    display: showDetails ? 'block' : 'none',
    paddingTop: '10px',
    borderTop: '1px solid lightgray',
    marginTop: '10px',
  }

  const deleteForm = () => {
    if (blog.user.username === user.username) {
      return (
        <form onSubmit={deleteBlog}>
          <input type="hidden" name="id" value={blog.id} />
          <button type="submit">Remove blog</button>
        </form>
      )
    }
  }

  return (
    <div style={blogStyle}>
      <div onClick={toggleShowDetails} style={titleStyle}>
        <span style={{ fontWeight: 'bold' }}>{blog.title}</span> by <span style={{ fontWeight: 'bold' }}>{blog.author}</span>
      </div>
      <div style={detailsStyle}>
        <div>URL: {blog.url}</div>
        <div>Likes: {likesState}
          <form onSubmit={addLike}>
            <input type="hidden" name="id" value={blog.id} />
            <input type="hidden" name="title" value={blog.title} />
            <input type="hidden" name="author" value={blog.author} />
            <input type="hidden" name="url" value={blog.url} />
            <input type="hidden" name="user" value={blog.user.id} />
            <input type="hidden" name="likes" value={blog.likes} />
            <button type="submit">+ Like</button>
          </form>
        </div>
        <div>Added by: {blog.user.name}</div>
        {deleteForm()}
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlog: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
  user: PropTypes.object,
}

export default Blog
