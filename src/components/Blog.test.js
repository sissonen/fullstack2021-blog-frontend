import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('Blog rendering', () => {
  let component
  let mockUpdate
  let mockRemove

  beforeEach(() => {
    
    const blog = {
      id: 'testblogid',
      author: 'author test',
      title: 'title test',
      url: 'url test',
      likes: 1,
      user: {
        username: 'testuser',
        name: 'testname',
        id: "testuserid"
      }
    }
    const user = {
      username: 'testuser',
      name: 'testname'
    }

    mockUpdate = jest.fn()
    mockRemove = jest.fn()

    component = render(
      <Blog blog={blog} updateBlog={mockUpdate} removeBlog={mockRemove} user={user} />
    )

  })

  test('only title and author rendered', () => {
    expect(component.container).toHaveTextContent('title test')
    expect(component.container).toHaveTextContent('author test')
    expect(component.container.querySelector('.blogDetails')).toHaveStyle('display: none')
  })

  test('after clicking title show details', () => {
    const titleRow = component.container.querySelector('.blogTitle')
    fireEvent.click(titleRow)
    expect(component.container.querySelector('.blogDetails')).toHaveStyle('display: block')
  })

  test('clicking like', () => {
    const likeButton = component.getByText('+ Like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)
    expect(mockUpdate.mock.calls).toHaveLength(2)
  })

})
