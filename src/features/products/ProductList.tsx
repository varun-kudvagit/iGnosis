import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import type { Product, ListResponse } from '../../types'

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [limit] = useState(8)
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const categories = ['All', 'Electronics', 'Home', 'Clothing', 'Books']

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        query: searchQuery,
        category: category === 'All' ? '' : category
      })
      
      const response = await fetch(`/products?${params}`)
      if (!response.ok) throw new Error('Failed to fetch products')
      
      const data: ListResponse<Product> = await response.json()
      
      // Apply sorting on client side
      let sorted = [...data.items]
      sorted.sort((a, b) => {
        const aVal = sortBy === 'name' ? a.name.toLowerCase() : a.price
        const bVal = sortBy === 'name' ? b.name.toLowerCase() : b.price
        
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
        return 0
      })
      
      setProducts(sorted)
      setTotal(data.total)
    } catch (err) {
      setError('Failed to load products. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [searchQuery, category, sortBy, sortOrder, page, limit])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const totalPages = Math.ceil(total / limit)
  const formatPrice = (price: number) => `₹${(price / 100).toFixed(2)}`

  return (
    <section aria-labelledby="products-heading" style={{ maxWidth: 1200, margin: '0 auto', padding: 20 }}>
      <h1 id="products-heading" style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>
        Products
      </h1>

      {/* Search and Filter Toolbar */}
      <div style={{ 
        background: '#f5f5f5', 
        padding: 20, 
        borderRadius: 8, 
        marginBottom: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }}>
        {/* Search */}
        <div>
          <label htmlFor="search" style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
            Search Products
          </label>
          <input
            id="search"
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setPage(1)
            }}
            placeholder="Search by name..."
            aria-label="Search products"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: 4,
              fontSize: 14
            }}
          />
        </div>

        {/* Filters and Sort */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label htmlFor="category" style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
              Category
            </label>
            <select
              id="category"
              value={category || 'All'}
              onChange={(e) => {
                setCategory(e.target.value)
                setPage(1)
              }}
              aria-label="Filter by category"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: 4,
                fontSize: 14
              }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: '1 1 200px' }}>
            <label htmlFor="sortBy" style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
              Sort By
            </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'price')}
              aria-label="Sort products by"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: 4,
                fontSize: 14
              }}
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
            </select>
          </div>

          <div style={{ flex: '1 1 200px' }}>
            <label htmlFor="sortOrder" style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
              Order
            </label>
            <select
              id="sortOrder"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              aria-label="Sort order"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: 4,
                fontSize: 14
              }}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div role="status" aria-live="polite" style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 18, color: '#666' }}>Loading products...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div role="alert" style={{ 
          background: '#fee', 
          border: '1px solid #fcc', 
          padding: 16, 
          borderRadius: 4,
          color: '#c00'
        }}>
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && products.length === 0 && (
        <div data-testid="placeholder-empty" style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 18, color: '#666' }}>No products found</div>
          <div style={{ fontSize: 14, color: '#999', marginTop: 8 }}>
            Try adjusting your search or filters
          </div>
        </div>
      )}

      {/* Product Grid */}
      {!loading && !error && products.length > 0 && (
        <>
          <div 
            data-testid="products-list"
            aria-live="polite"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: 20,
              marginBottom: 32
            }}
          >
            {products.map((product) => (
              <article
                key={product.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: 8,
                  padding: 16,
                  background: '#fff',
                  transition: 'box-shadow 0.2s'
                }}
              >
                <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
                  {product.name}
                </h2>
                <div style={{ fontSize: 20, fontWeight: 'bold', color: '#2563eb', marginBottom: 8 }}>
                  {formatPrice(product.price)}
                </div>
                <div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>
                  {product.category}
                </div>
                <div style={{ 
                  display: 'inline-block',
                  padding: '4px 8px',
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: 500,
                  background: product.inStock ? '#dcfce7' : '#fee2e2',
                  color: product.inStock ? '#166534' : '#991b1b',
                  marginBottom: 12
                }}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </div>
                {product.description && (
                  <p style={{ fontSize: 14, color: '#666', marginBottom: 12 }}>
                    {product.description}
                  </p>
                )}
                <Link
                  to={`/products/${product.id}`}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    width: '100%',
                    padding: '8px 16px',
                    background: '#2563eb',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: 4,
                    fontSize: 14,
                    fontWeight: 500
                  }}
                >
                  View Details
                </Link>
              </article>
            ))}
          </div>

          {/* Pagination */}
          <nav aria-label="Pagination" style={{ display: 'flex', justifyContent: 'center', gap: 8, alignItems: 'center' }}>
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              aria-label="Go to previous page"
              style={{
                padding: '8px 16px',
                border: '1px solid #ddd',
                borderRadius: 4,
                background: page === 1 ? '#f5f5f5' : 'white',
                cursor: page === 1 ? 'not-allowed' : 'pointer',
                opacity: page === 1 ? 0.5 : 1
              }}
            >
              Previous
            </button>
            
            <span aria-current="page" style={{ padding: '0 16px', fontSize: 14 }}>
              Page {page} of {totalPages}
            </span>
            
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              aria-label="Go to next page"
              style={{
                padding: '8px 16px',
                border: '1px solid #ddd',
                borderRadius: 4,
                background: page === totalPages ? '#f5f5f5' : 'white',
                cursor: page === totalPages ? 'not-allowed' : 'pointer',
                opacity: page === totalPages ? 0.5 : 1
              }}
            >
              Next
            </button>
          </nav>
          
          <div role="status" aria-live="polite" style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: '#666' }}>
            Showing {((page - 1) * limit) + 1} - {Math.min(page * limit, total)} of {total} products
          </div>
        </>
      )}
    </section>
  )
}
