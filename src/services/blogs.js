import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = authToken => {
  token = 'bearer ' + authToken
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const createBlog = async newBlog => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const putBlog = async updatedBlog => {
  const response = await axios.put(baseUrl + '/' + updatedBlog.id, updatedBlog)
  return response.data
}

const deleteBlog = async blogId => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.delete(baseUrl + '/' + blogId, config)
  return response.data
}

export default { getAll, createBlog, putBlog, deleteBlog, setToken }
