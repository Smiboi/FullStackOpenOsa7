import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  test('renders title and author but not url and likes', () => {
    const blog = {
      title: 'Jukka Kukkulan sukka',
      author: 'Jukka Kukkula',
      url: 'www.jukka.fi',
      likes: 5
    }

    render(<Blog blog={blog} />)

    const elementTitleAuthor = screen.getByText('Jukka Kukkulan sukka by Jukka Kukkula')
    expect(elementTitleAuthor).toBeDefined()

    const elementUrl = screen.queryByText('www.jukka.fi')
    expect(elementUrl).toBeNull()

    const elementLikes = screen.queryByText('likes: 5')
    expect(elementLikes).toBeNull()
  })

  test('renders url, likes and user when view-button is clicked', async () => {
    const blog = {
      title: 'Jukka Kukkulan sukka',
      author: 'Jukka Kukkula',
      url: 'www.jukka.fi',
      likes: 5,
      user: {
        username: 'repe',
        name: 'Repe Sorsa',
        id: 'testid'
      }
    }

    const mockHandler = jest.fn()

    render(<Blog blog={blog} addLike={mockHandler} />)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const elementUrl = screen.getByText('www.jukka.fi')
    expect(elementUrl).toBeDefined()

    const elementLikes = screen.getByText('likes: 5')
    expect(elementLikes).toBeDefined()

    const elementUser = screen.getByText('Repe Sorsa')
    expect(elementUser).toBeDefined()
  })

  test('clicking the like-button twice calls event handler twice', async () => {
    const blog = {
      title: 'Jukka Kukkulan sukka',
      author: 'Jukka Kukkula',
      url: 'www.jukka.fi',
      likes: 5,
      user: {
        username: 'repe',
        name: 'Repe Sorsa',
        id: 'testid'
      }
    }

    const mockHandler = jest.fn()

    render(<Blog blog={blog} addLike={mockHandler} />)

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
