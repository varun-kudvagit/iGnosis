import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ProductList } from '../ProductList'

describe('ProductList', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <ProductList />
      </BrowserRouter>
    )
  })

  it('renders the products heading', () => {
    expect(screen.getByRole('heading', { name: /products/i })).toBeInTheDocument()
  })

  it('shows loading state initially', () => {
    expect(screen.getByText(/loading products/i)).toBeInTheDocument()
  })

  it('renders products after loading', async () => {
    await waitFor(() => {
      expect(screen.queryByText(/loading products/i)).not.toBeInTheDocument()
    })
    
    expect(screen.getByTestId('products-list')).toBeInTheDocument()
  })

  it('has search input', () => {
    expect(screen.getByLabelText(/search products/i)).toBeInTheDocument()
  })

  it('has category filter', () => {
    expect(screen.getByLabelText(/filter by category/i)).toBeInTheDocument()
  })

  it('has sort controls', () => {
    expect(screen.getByLabelText(/sort products by/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/sort order/i)).toBeInTheDocument()
  })
})
