import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png';

const Accueil = () => {
    const [latestProducts, setLatestProducts] = useState([]);

    // Fonction pour récupérer les trois derniers produits
    const fetchLatestProducts = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/latest`); // API pour récupérer les 3 derniers produits
            if (response.ok) {
                const data = await response.json();
                setLatestProducts(data);
            } else {
                console.error('Erreur lors de la récupération des produits récents');
            }
        } catch (error) {
            console.error('Erreur réseau lors de la récupération des produits récents :', error);
        }
    };

    // Charger les trois derniers produits au montage du composant
    useEffect(() => {
        fetchLatestProducts();
    }, []);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ color: '#D32F2F', textAlign: 'center' }}>B i e n v e n u e <br/><br/> c h e z </h1>
            <img src={logo} alt="Logo" className="logo" style={{ margin: 'auto', display: 'flex', padding: '50px' }}/>
            <h2 style={{ textAlign: 'center', color: '#555', marginBottom: '20px' }}>
                Découvrez nos dernières nouveautés !
            </h2>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
                {latestProducts.map((product) => (
                    <div
                        key={product.id}
                        style={{
                            width: '300px',
                            border: '5px solid #D32F2F',
                            borderRadius: '10px',
                            padding: '10px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            backgroundColor: '#c3c2c2',
                        }}
                    >
                        <img
                            src={`${import.meta.env.VITE_API_URL}${product.image_url}`}
                            alt={product.name}
                            style={{
                                width: '60%', // S'étend sur toute la largeur de la carte
                                height: '200px',
                                objectFit: 'cover',
                                borderRadius: '10px',
                            }}
                        />
                        <h2 style={{ margin: '10px 0', fontSize: '20px', textAlign: 'center', color: '#333' }}>
                            {product.name}
                        </h2>
                        
                    </div>
                ))}
            </div>

            {latestProducts.length === 0 && (
                <p style={{ color: '#555', textAlign: 'center', marginTop: '20px' }}>
                    Aucun produit disponible pour le moment.
                </p>
            )}
        </div>
    );
};

export default Accueil;
