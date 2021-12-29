import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import NewBlogForm from './NewBlogForm'

describe('NewBlogForm', () => {
  let component
  let mockAdd

  beforeEach(() => {
    
    mockAdd = jest.fn()

    component = render(
      <NewBlogForm addNewBlog={mockAdd} />
    )

  })

  test('submit test', () => {
    const form = component.container.querySelector('form')

    fireEvent.change(form.querySelector('input[name=Title]'), {
      target: { value: 'testtitle' }
    })
    fireEvent.change(form.querySelector('input[name=Author]'), {
      target: { value: 'testauthor' }
    })
    fireEvent.change(form.querySelector('input[name=URL]'), {
      target: { value: 'testurl' }
    })
    fireEvent.change(form.querySelector('input[name=Likes]'), {
      target: { value: '1' }
    })
    
    fireEvent.submit(form)
    expect(mockAdd.mock.calls[0][0].title).toBe('testtitle')
    expect(mockAdd.mock.calls[0][0].author).toBe('testauthor')
    expect(mockAdd.mock.calls[0][0].url).toBe('testurl')
    expect(mockAdd.mock.calls[0][0].likes).toBe('1')
  })

})
