import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log('Failed to login.')
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
      {user === null ?
        loginForm() :
        <div>
          <p>Logged in as {user.name}</p>
          {blogs.map(blog => 
            <Blog key={blog.id} blog={blog} />
          )}
        </div>
      }
    </div>
  )
}

export default App
