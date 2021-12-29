import React, { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import Info from './components/Info'
import Toggleable from './components/Toggleable'
import NewBlogForm from './components/NewBlogForm'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [user, setUser] = useState(null)

  const [info, setInfo] = useState(null)

  const newBlogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const userJSON = window.localStorage.getItem('blogAppUser')
    if (userJSON) {
      const user = JSON.parse(userJSON)
      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('blogAppUser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setInfo({ msg: 'Failed to login!', level: 'error' })
      setTimeout(() => { setInfo(null) }, 3000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    setUser(null)
    blogService.setToken(null)
    window.localStorage.removeItem('blogAppUser')
    setInfo({ msg: 'Logged out succesfully!', level: 'info' })
    setTimeout(() => { setInfo(null) }, 3000)
  }

  const addNewBlog = async (newBlog) => {
    try {
      const addedBlog = await blogService.createBlog(newBlog)
      setBlogs(blogs.concat(addedBlog))
      newBlogFormRef.current.toggleVisibility()
      setInfo({ msg: 'Blog "' + newBlog.title + '" added', level: 'info' })
      setTimeout(() => { setInfo(null) }, 3000)
    } catch (exception) {
      setInfo({ msg: 'Blog creation failed: ' + exception, level: 'error' })
      setTimeout(() => { setInfo(null) }, 3000)
      console.log('Blog creation failed:', exception)
    }
  }

  const updateBlog = async (updatedBlog) => {
    try {
      await blogService.putBlog(updatedBlog)
      setBlogs(blogs.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog))
      setInfo({ msg: 'Blog ' + updatedBlog.title + ' updated succesfully.', level: 'info' })
      setTimeout(() => { setInfo(null) }, 3000)
    } catch (exception) {
      setInfo({ msg: 'Blog update failed: ' + exception, level: 'error' })
      setTimeout(() => { setInfo(null) }, 3000)
    }
  }

  const removeBlog = async (blogId) => {
    try {
      await blogService.deleteBlog(blogId)
      setBlogs(blogs.filter(blog => blog.id !== blogId))
      setInfo({ msg: 'Blog with id ' + blogId + ' removed succesfully.', level: 'info' })
      setTimeout(() => { setInfo(null) }, 3000)
    } catch (exception) {
      setInfo({ msg: 'Blog removal failed: ' + exception, level: 'error' })
      setTimeout(() => { setInfo(null) }, 3000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>Username: <input type="text" value={username} name="Username" onChange={({ target }) => setUsername(target.value)} /></div>
      <div>Password: <input type="password" value={password} name="Password" onChange={({ target }) => setPassword(target.value)} /></div>
      <button type="submit">Login</button>
    </form>
  )

  return (
    <div>
      <h2>blogs</h2>
      <Info info={info} />
      {user === null ?
        loginForm() :
        <div>
          <p>Logged in as {user.name}</p>
          <div>
            <form onSubmit={handleLogout}>
              <button type="submit">Logout</button>
            </form>
          </div>
          <br />
          <Toggleable buttonLabel="Add blog" ref={newBlogFormRef}>
            <NewBlogForm key="1" addNewBlog={addNewBlog} />
          </Toggleable>
          <br />
          {blogs.sort((a, b) => parseInt(b.likes) - parseInt(a.likes)).map(blog =>
            <Blog key={blog.id} blog={blog} updateBlog={updateBlog} removeBlog={removeBlog} user={user} />
          )}
        </div>
      }
    </div>
  )
}

export default App
