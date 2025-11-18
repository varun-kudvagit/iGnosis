import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [page, limit, query, category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(/products?page=${page}&limit=${limit}&query=${query}&category=${category});
      const data = await response.json();
      setProducts(data.items);
      setLoading(false);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(event.target.value);
  };

  const handleSort = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const sortBy = event.target.value;
    const sortedProducts = [...products].sort((a, b) => {
      if (sortBy === 'price') {
        return a.price - b.price;
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
    setProducts(sortedProducts);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <section aria-labelledby="products-heading">
      <h1 id="products-heading">Products</h1>
      <div>
        <input type="search" value={query} onChange={handleSearch} placeholder="Search products..." />
        <select value={category} onChange={handleFilter}>
          <option value="">All categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Home">Home</option>
          <option value="Clothing">Clothing</option>
          <option value="Books">Books</option>
        </select>
        <select onChange={handleSort}>
          <option value="">Sort by</option>
          <option value="price">Price</option>
          <option value="name">Name</option>
        </select>
      </div>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <Link to={/products/${product.id}}>
              <h2>{product.name}</h2>
              <p>Price: {product.price}</p>
              <p>Category: {product.category}</p>
              <p>In stock: {product.inStock ? 'Yes' : 'No'}</p>
            </Link>
          </li>
        ))}
      </ul>
      <div>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <button onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </section>
  );
};

export default ProductList;