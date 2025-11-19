import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import type { Product } from '../../types'

export function ProductDetails() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return
      
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/products/${id}`)
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Product not found')
          }
          throw new Error('Failed to fetch product')
        }
        
        const data: Product = await response.json()
        setProduct(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const formatPrice = (price: number) => `₹${(price / 100).toFixed(2)}`

  return (
    <article aria-labelledby="product-heading" style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <Link 
        to="/"
        style={{
          display: 'inline-block',
          marginBottom: 24,
          padding: '8px 16px',
          background: 'white',
          color: '#2563eb',
          textDecoration: 'none',
          border: '1px solid #ddd',
          borderRadius: 4,
          fontSize: 14
        }}
      >
        ← Back to Products
      </Link>

      {loading && (
        <div role="status" aria-live="polite" style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 18, color: '#666' }}>Loading product...</div>
        </div>
      )}

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

      {!loading && !error && product && (
        <div style={{
          border: '1px solid #ddd',
          borderRadius: 8,
          padding: 32,
          background: '#fff'
        }}>
          <h1 id="product-heading" style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 16 }}>
            {product.name}
          </h1>
          
          <div style={{ fontSize: 28, fontWeight: 'bold', color: '#2563eb', marginBottom: 16 }}>
            {formatPrice(product.price)}
          </div>
          
          <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
            <div style={{ 
              padding: '6px 12px',
              borderRadius: 4,
              fontSize: 14,
              fontWeight: 500,
              background: '#e0e7ff',
              color: '#3730a3'
            }}>
              {product.category}
            </div>
            
            <div style={{ 
              padding: '6px 12px',
              borderRadius: 4,
              fontSize: 14,
              fontWeight: 500,
              background: product.inStock ? '#dcfce7' : '#fee2e2',
              color: product.inStock ? '#166534' : '#991b1b'
            }}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </div>
          </div>
          
          {product.description && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>
                Description
              </h2>
              <p style={{ fontSize: 16, color: '#666', lineHeight: 1.6 }}>
                {product.description}
              </p>
            </div>
          )}
          
          <button
            disabled={!product.inStock}
            aria-label={product.inStock ? 'Add to cart' : 'Product out of stock'}
            style={{
              marginTop: 32,
              width: '100%',
              padding: '12px 24px',
              background: product.inStock ? '#2563eb' : '#9ca3af',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              fontSize: 16,
              fontWeight: 600,
              cursor: product.inStock ? 'pointer' : 'not-allowed'
            }}
          >
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      )}
    </article>
  )
}
