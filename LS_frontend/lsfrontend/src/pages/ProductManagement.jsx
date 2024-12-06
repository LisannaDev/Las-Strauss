import React, { useState, useEffect } from 'react';

const ProductManagement = () => {
    const [products, setProducts] = useState([]); // Liste des produits
    const [isAddModalOpen, setIsAddModalOpen] = useState(false); // État pour la pop-up d'ajout
    const [editingProduct, setEditingProduct] = useState(null); // Produit en cours de modification
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
        image: null,
    });

    // Catégories prédéfinies
    const categories = ['Sucré', 'Salé', 'Boissons', 'Vêtement (Tête)', 'Vêtements (Hauts)', 'Vêtements (Bas)', 'Vêtements (Pieds)', 'Armes', 'Matériel', 'Documents', 'Conteneurs', 'Déchets', 'Editions limitées'];

    // Fonction pour récupérer les produits
    const fetchProducts = async () => {
        try {
            const response = await fetch('https://las-strauss.onrender.com/api/products');
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            } else {
                console.error('Erreur lors de la récupération des produits');
            }
        } catch (error) {
            console.error('Erreur réseau lors de la récupération des produits :', error);
        }
    };

    // Charger les produits au montage
    useEffect(() => {
        fetchProducts();
    }, []);

    // Ajouter un produit
    const addProduct = async () => {
        if (!newProduct.name || !newProduct.price || !newProduct.description || !newProduct.image || !newProduct.category) {
            alert('Veuillez remplir tous les champs pour ajouter un produit.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', newProduct.name);
            formData.append('price', newProduct.price);
            formData.append('description', newProduct.description);
            formData.append('category', newProduct.category);
            formData.append('image', newProduct.image);

            const response = await fetch('https://las-strauss.onrender.com/api/products', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                alert('Produit ajouté avec succès.');
                fetchProducts(); // Rafraîchir la liste des produits
                setIsAddModalOpen(false); // Fermer la pop-up
                setNewProduct({ name: '', price: '', description: '', category: '', image: null }); // Réinitialiser le formulaire
            } else {
                console.error('Erreur lors de l\'ajout du produit');
                alert('Erreur lors de l\'ajout du produit.');
            }
        } catch (error) {
            console.error('Erreur réseau lors de l\'ajout du produit :', error);
            alert('Erreur de connexion au serveur.');
        }
    };

    // Supprimer un produit
    const deleteProduct = async (id) => {
        if (window.confirm('Voulez-vous vraiment supprimer ce produit ?')) {
            try {
                const response = await fetch(`https://las-strauss.onrender.com/api/products/${id}`, { method: 'DELETE' });
                if (response.ok) {
                    fetchProducts(); // Rafraîchir la liste des produits
                    alert('Produit supprimé avec succès.');
                } else {
                    console.error('Erreur lors de la suppression du produit');
                }
            } catch (error) {
                console.error('Erreur réseau lors de la suppression du produit :', error);
            }
        }
    };

    // Préparer les données pour la modification
    const startEditing = (product) => {
        setEditingProduct(product);
        setNewProduct({
            name: product.name,
            price: product.price,
            description: product.description,
            category: product.category,
            image: null,
        });
        setIsAddModalOpen(true); // Ouvrir le formulaire avec les données du produit
    };

    // Sauvegarder les modifications
    const saveProduct = async () => {
        if (!newProduct.name || !newProduct.price || !newProduct.description || !newProduct.category) {
            alert('Veuillez remplir tous les champs pour modifier le produit.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', newProduct.name);
            formData.append('price', newProduct.price);
            formData.append('description', newProduct.description);
            formData.append('category', newProduct.category);
            if (newProduct.image) {
                formData.append('image', newProduct.image); // Ajouter une nouvelle image si modifiée
            }

            const response = await fetch(`https://las-strauss.onrender.com/api/products/${editingProduct.id}`, {
                method: 'PATCH',
                body: formData,
            });

            if (response.ok) {
                alert('Produit modifié avec succès.');
                setEditingProduct(null); // Réinitialiser le produit en édition
                setIsAddModalOpen(false); // Fermer la pop-up
                fetchProducts(); // Rafraîchir la liste des produits
            } else {
                console.error('Erreur lors de la modification du produit');
                alert('Erreur lors de la modification du produit.');
            }
        } catch (error) {
            console.error('Erreur réseau lors de la modification du produit :', error);
            alert('Erreur de connexion au serveur.');
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ color: '#D32F2F', textAlign: 'center' }}>Gestion des Produits</h1>

            <button
                onClick={() => {
                    setIsAddModalOpen(true);
                    setEditingProduct(null); // Réinitialiser l'édition
                    setNewProduct({ name: '', price: '', description: '', category: '', image: null });
                }}
                style={{
                    padding: '10px 20px',
                    marginBottom: '20px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '5px',
                }}
            >
                Ajouter un produit
            </button>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                {products.map((product) => (
                    <div
                        key={product.id}
                        style={{
                            width: '300px',
                            border: '1px solid #ddd',
                            borderRadius: '10px',
                            padding: '10px',
                            boxShadow: '3px 3px 3px 3px rgba(3, 3, 3, 1)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <img
                            src={`https://las-strauss.onrender.com/${product.image_url}`}
                            alt={product.name}
                            style={{
                                width: '60%',
                                height: '200px',
                                objectFit: 'cover',
                                borderRadius: '10px',
                            }}
                        />
                        <h2 style={{ color: '#000'}}>{product.name}</h2>
                        <p style={{ color: '#000', fontSize: '18px', height: '100px'}}>{product.description}</p>
                        <p style={{fontWeight: 'bold',
                                fontSize: '22px',
                                color: '#fff',
                                marginBottom: '10px',
                                textShadow : '2px 1px 1px #000',}}>
                            <strong>{product.price} ₡</strong></p>
                        <p style={{ color: '#eee'}}><em>{product.category}</em></p>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <button
                                onClick={() => startEditing(product)}
                                style={{
                                    padding: '5px 10px',
                                    backgroundColor: '#2196F3',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                            >
                                Modifier
                            </button>
                            <button
                                onClick={() => deleteProduct(product.id)}
                                style={{
                                    padding: '5px 10px',
                                    backgroundColor: '#f44336',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {isAddModalOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                    }}
                >
                    <div
                        style={{
                            width: '400px',
                            backgroundColor: '#818181',
                            borderRadius: '10px',
                            padding: '20px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0)',
                        }}
                    >
                        <h2>{editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}</h2>
                        <input
                            type="text"
                            placeholder="Nom"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                            style={{ width: '95%', marginBottom: '10px', padding: '10px' }}
                        />
                        <textarea
                            placeholder="Description"
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                            style={{ width: '95%', marginBottom: '10px', padding: '10px' }}
                        />
                        <input
                            type="number"
                            placeholder="Prix"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                            style={{ width: '95%', marginBottom: '10px', padding: '10px' }}
                        />
                        <select
                            value={newProduct.category}
                            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                            style={{ width: '100%', marginBottom: '10px', padding: '10px' }}
                        >
                            <option value="">Choisir une catégorie</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                        <input
                            type="file"
                            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })}
                            style={{ width: '95%', marginBottom: '10px', padding: '10px' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button
                                onClick={editingProduct ? saveProduct : addProduct}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    cursor: 'pointer',
                                }}
                            >
                                {editingProduct ? 'Enregistrer' : 'Ajouter'}
                            </button>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#f44336',
                                    color: 'white',
                                    border: 'none',
                                    cursor: 'pointer',
                                }}
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;
