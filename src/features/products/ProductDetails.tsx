import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
  description: string;
}

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(/products/${id});
      const data = await response.json();
      setProduct(data);
      setLoading(false);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!product) {
    return <p>Product not found</p>;
  }

  return (
    <article aria-labelledby="product-heading">
      <h1 id="product-heading">{product.name}</h1>
      <p>Price: {product.price}</p>
      <p>Category: {product.category}</p>
      <p>In stock: {product.inStock ? 'Yes' : 'No'}</p>
      <p>{product.description}</p>
      <Link to="/">Back to products</Link>
    </article>
  );
};

export default ProductDetails;