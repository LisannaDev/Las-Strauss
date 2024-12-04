import React from 'react';

function ProductCard({ product }) {
    return (
        <div className="bg-gray-800 p-4 rounded">
            <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover rounded" />
            <h2 className="text-xl font-bold mt-2">{product.name}</h2>
            <p className="text-sm text-gray-400">{product.description}</p>
            <p className="text-red-500 font-bold">{product.price} €</p>
        </div>
    );
}

export default ProductCard;
