import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ProductDetails } from '../ProductDetails'

describe('ProductDetails', () => {
  it('shows loading state initially', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProductDetails />} />
        </Routes>
      </BrowserRouter>
    )
    
    expect(screen.getByText(/loading product/i)).toBeInTheDocument()
  })

  it('has back to products link', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProductDetails />} />
        </Routes>
      </BrowserRouter>
    )
    
    expect(screen.getByText(/back to products/i)).toBeInTheDocument()
  })
})
