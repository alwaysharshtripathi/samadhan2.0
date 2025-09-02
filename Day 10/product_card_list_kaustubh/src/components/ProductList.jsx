import ProductCard from "./ProductCard";

const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    description: "Noise-cancelling over-ear headphones",
    price: 2999,
    image: "https://via.placeholder.com/200"
  },
  {
    id: 2,
    name: "Smart Watch",
    description: "Track your health and notifications",
    price: 4999,
    image: "https://via.placeholder.com/200"
  },
  {
    id: 3,
    name: "Gaming Mouse",
    description: "High precision wireless mouse",
    price: 1999,
    image: "https://via.placeholder.com/200"
  }
];

function ProductList() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductList;
