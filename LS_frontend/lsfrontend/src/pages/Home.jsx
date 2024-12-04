import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="min-h-screen bg-dark text-white flex flex-col items-center justify-center">
            <h1 className="text-5xl font-bold mb-6">Bienvenue chez Las Strauss</h1>
            <p className="mb-4">Découvrez notre catalogue et commandez en ligne !</p>
            <div>
                <Link to="/catalog" className="px-4 py-2 bg-red-600 rounded hover:bg-red-500 mr-4">
                    Voir le Catalogue
                </Link>
                <Link to="/admin" className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">
                    Admin
                </Link>
            </div>
        </div>
    );
}

export default Home;
