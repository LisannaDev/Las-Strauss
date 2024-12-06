import React, { useState, useEffect } from 'react';
import '../styles.css'; // Importez les styles


const Catalogue = ({ addToCart }) => {
    const [products, setProducts] = useState([]); // Liste des produits
    const [quantities, setQuantities] = useState({}); // Quantités par produit
    const [error, setError] = useState(null); // Gestion des erreurs
    const [selectedCategory, setSelectedCategory] = useState(''); // Catégorie sélectionnée

    // Fonction pour récupérer les produits depuis l'API
    const fetchProducts = async () => {
        try {
            const response = await fetch('https://las-strauss.onrender.com/api/products');
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des produits.');
            }
            const data = await response.json();
            

            // Initialisation des quantités par défaut pour chaque produit
            const initialQuantities = data.reduce((acc, product) => {
                acc[product.id] = 1; // Quantité par défaut : 1
                return acc;
            }, {});
            setProducts(data); // Mise à jour de la liste des produits
            setQuantities(initialQuantities);
        } catch (error) {
            console.error('Erreur lors de la récupération des produits :', error);
            setError(error.message);
        }
    };

    // Charger les produits lors du montage du composant
    useEffect(() => {
        fetchProducts();
    }, []);

    // Regrouper les produits par catégorie
    // const groupedProducts = products.reduce((acc, product) => {
    //     acc[product.category] = acc[product.category] || [];
    //     acc[product.category].push(product);
    //     return acc;
    // }, {});

    // Liste des catégories uniques
    const categories = [
        'Toutes les catégories',
        ...new Set(products.map((product) => product.category)),
    ];

    // Produits filtrés par catégorie sélectionnée
    const filteredProducts = selectedCategory && selectedCategory !== 'Toutes les catégories'
        ? products.filter((product) => product.category === selectedCategory)
        : products;

    // Mise à jour de la quantité d'un produit
    const handleQuantityChange = (productId, quantity) => {
        setQuantities((prev) => ({
            ...prev,
            [productId]: Math.max(1, quantity), // Assurer une quantité minimum de 1
        }));
    };

    // Ajouter un produit au panier
    const handleAddToCart = (productId) => {
        const product = products.find((p) => p.id === productId);
        if (!product) {
            alert('Produit non trouvé.');
            return;
        }

        const quantity = quantities[productId] || 1; // Utiliser la quantité actuelle
        addToCart(product, quantity); // Appeler la fonction parent
    };

    return (
        <div className="container">
            <h1 style={{ color: '#D32F2F', textAlign: 'center' }}>Catalogue</h1>

            {error && (
                <p style={{ color: 'red', textAlign: 'center' }}>
                    {error}
                </p>
            )}

            {/* Menu déroulant pour le filtre des catégories */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    style={{
                        padding: '10px',
                        borderRadius: '5px',
                        border: '1px solid #ddd',
                        fontSize: '16px',
                    }}
                >
                    {categories.map((category, index) => (
                        <option key={index} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>

             {/* Afficher les produits filtrés */}
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '20px',
                    justifyContent: 'center',
                }}
            >
                {filteredProducts.map((product) => (
                    <div
                        key={product.id}
                        style={{
                            width: '300px',
                            border: '1px solid #ddd',
                            borderRadius: '10px',
                            padding: '10px',
                            boxShadow: '3px 3px 3px 3px rgba(70, 3, 3, 1)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            backgroundColor: '#757575',
                        }}
                    >
                        <img
                            src={`https://las-strauss.onrender.com${product.image_url}`}
                            alt={product.name}
                            style={{
                                width: '60%',
                                height: '200px',
                                objectFit: 'cover',
                                borderRadius: '10px',
                            }}
                        />
                        <h2 style={{ margin: '10px 0', fontSize: '20px', textAlign: 'center' }}>
                            {product.name}
                        </h2>
                        <p style={{ textAlign: 'center', fontSize: '17px', color: '#353535', height: '100px' }}>
                            {product.description}
                        </p>
                        <p
                            style={{
                                fontWeight: 'bold',
                                fontSize: '22px',
                                color: '#D32F2F',
                                marginBottom: '10px',
                                textShadow : '2px 1px 1px #000',
                            }}
                        >
                            {product.price} ₡
                        </p>
                        <div style={{ marginTop: 'auto', width: '100%' }}>
                            <label>
                                Qté :{' '}
                                <input
                                    type="number"
                                    value={quantities[product.id] || 1} // Quantité par défaut
                                    min={1}
                                    onChange={(e) =>
                                        handleQuantityChange(
                                            product.id,
                                            parseInt(e.target.value, 10) || 1
                                        )
                                    }
                                    style={{
                                        width: '40px',
                                        padding: '5px',
                                        marginLeft: '5px',
                                        border: '1px solid #ddd',
                                        borderRadius: '5px',
                                    }}
                                />
                            </label>
                            <button
                                onClick={() => handleAddToCart(product.id)}
                                style={{
                                    padding: '10px',
                                    marginLeft: '13px',
                                    backgroundColor: '#363636',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '20px',
                                    cursor: 'pointer',
                                    width: '60%'
                                }}
                            >
                                Ajouter au panier
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Afficher un message si aucun produit ne correspond au filtre */}
            {filteredProducts.length === 0 && (
                <p style={{ color: '#555', textAlign: 'center', marginTop: '20px' }}>
                    Aucun produit disponible pour cette catégorie.
                </p>
            )}
        </div>
    );
};

export default Catalogue;
