import { Routes, Route, Link } from 'react-router-dom'
import { ProductList } from './features/products/ProductList'
import { ProductDetails } from './features/products/ProductDetails'

export default function App() {
  return (
    <div>
      <header>
        <nav>
          <Link to="/" aria-label="Home">Listings Manager</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetails />} />
        </Routes>
      </main>
    </div>
  )
}
