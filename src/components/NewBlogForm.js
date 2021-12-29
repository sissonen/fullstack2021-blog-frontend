import React, { useState } from 'react'

const NewBlogForm = ({ addNewBlog }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [likes, setLikes] = useState('')

  const handleCreateBlog = (event) => {
    event.preventDefault()
    addNewBlog({
      title: title,
      author: author,
      url: url,
      likes: likes
    })

    setTitle('')
    setAuthor('')
    setUrl('')
    setLikes('')
  }

  return (
    <div>
      <h2>Create a new entry</h2>
      <form onSubmit={handleCreateBlog}>
        <div>Title: <input type="text" value={title} name="Title" onChange={({ target }) => setTitle(target.value)} /></div>
        <div>Author: <input type="text" value={author} name="Author" onChange={({ target }) => setAuthor(target.value)} /></div>
        <div>URL: <input type="text" value={url} name="URL" onChange={({ target }) => setUrl(target.value)} /></div>
        <div>Likes: <input type="text" value={likes} name="Likes" onChange={({ target }) => setLikes(target.value)} /></div>
        <button id="submit-new-blog" type="submit">Create</button>
      </form>
    </div>
  )
}

export default NewBlogForm
