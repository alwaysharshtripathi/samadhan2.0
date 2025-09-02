function ProductCard({ product }) {
  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg p-5 hover:scale-105 transform transition duration-300">
      <img 
        src={product.image} 
        alt={product.name} 
        className="w-full h-40 object-cover rounded-lg mb-4"
      />
      <h2 className="text-lg font-semibold">{product.name}</h2>
      <p className="text-gray-400 text-sm mb-2">{product.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-xl font-bold text-green-400">₹{product.price}</span>
        <button className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600">
          Buy Now
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
