import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('clicking the create-button calls event handler with correct info', async () => {
    const user = userEvent.setup()
    const createBlog = jest.fn()

    render(<BlogForm createBlog={createBlog}/>)

    const titleInput = screen.getByPlaceholderText('title of the blog')
    const authorInput = screen.getByPlaceholderText('author of the blog')
    const urlInput = screen.getByPlaceholderText('url of the blog')
    const createButton = screen.getByText('create')

    await user.type(titleInput, 'Otsikko')
    await user.type(authorInput, 'Luoja')
    await user.type(urlInput, 'Urli')
    await user.click(createButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('Otsikko')
    expect(createBlog.mock.calls[0][0].author).toBe('Luoja')
    expect(createBlog.mock.calls[0][0].url).toBe('Urli')
  })
})
