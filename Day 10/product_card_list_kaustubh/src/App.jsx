import headphones from "./assets/headphones.jpg";
import smartwatch from "./assets/smartwatch.jpg";
import mouse from "./assets/mouse.jpg";

export default function App() {
  const products = [
    {
      name: "Wireless Headphones",
      description: "Noise-cancelling over-ear headphones",
      price: "₹2999",
      image: headphones,
      badge: "Best Seller",
    },
    {
      name: "Smart Watch",
      description: "Track your health and notifications",
      price: "₹4999",
      image: smartwatch,
      badge: "New",
    },
    {
      name: "Gaming Mouse",
      description: "High precision wireless mouse",
      price: "₹1999",
      image: mouse,
      badge: "Trending",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-6">
      <div className="max-w-6xl w-full">
        {/* Title */}
        <h1 className="text-5xl font-extrabold text-center mb-12 text-white drop-shadow-lg">
          🛒 Our Featured Products
        </h1>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden 
                         hover:shadow-2xl hover:-translate-y-2 transform transition duration-300 border border-gray-100"
            >
              {/* Product Image */}
              <div className="relative bg-gradient-to-tr from-indigo-50 to-pink-50 p-6">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-56 object-contain transition-transform duration-300 hover:scale-110"
                />
                {/* Badge */}
                <span className="absolute top-4 left-4 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                  {product.badge}
                </span>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900">{product.name}</h2>
                <p className="text-gray-500 mt-2">{product.description}</p>
                <div className="flex items-center justify-between mt-6">
                  <span className="text-2xl font-bold text-indigo-600">{product.price}</span>
                  <button className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium shadow hover:shadow-lg hover:scale-105 transition">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
