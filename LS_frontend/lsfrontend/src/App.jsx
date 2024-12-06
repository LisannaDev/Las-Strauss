import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Admin from "./pages/Admin";
import Catalogue from "./pages/Catalogue";
import Accueil from "./pages/Accueil";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import logo from './assets/Logo.png';


function App() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [password, setPassword] = useState('');
 

    const [products, setProducts] = useState([]); // Liste des produits
    const [orders, setOrders] = useState([]); // Liste des commandes
    const [cart, setCart] = useState(() => {
        // Charger le panier depuis localStorage au montage
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Sauvegarder le panier dans localStorage à chaque modification
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    // Fonction pour gérer la connexion administrateur
    const handleLogin = async () => {
        try {
            const response = await fetch('https://las-strauss.onrender.com/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });
    
            if (response.ok) {
                setIsAdmin(true);
            } else {
                alert('Mot de passe incorrect.');
            }
        } catch (error) {
            console.error('Erreur réseau lors de la connexion admin :', error);
            alert('Erreur de connexion au serveur.');
        }
    };
    

    // Ajouter une commande
    const handleAddOrder = async (order) => {
        console.log("Données de commande envoyées :", order);
        try {
            const response = await fetch("https://las-strauss.onrender.com/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(order),
            });
    
            if (response.ok) {
                const savedOrder = await response.json();
                console.log("Commande enregistrée avec succès :", savedOrder);
                setOrders((prevOrders) => [...prevOrders, savedOrder]);
                setCart([]);
                alert("Commande enregistrée avec succès !");
            } else {
                const errorData = await response.json();
                console.error("Erreur lors de l'enregistrement de la commande :", errorData.error);
                alert("Erreur lors de l'enregistrement de la commande.");
            }
        } catch (error) {
            console.error("Erreur réseau :", error);
            alert("Erreur lors de la connexion au serveur.");
        }
    };
    
    

    // Ajouter un produit au panier
    const addToCart = (product, quantity) => {
        setCart((prevCart) => {
            const existingProductIndex = prevCart.findIndex((item) => item.id === product.id);
    
            if (existingProductIndex !== -1) {
                // Si le produit est déjà dans le panier, augmenter la quantité
                const updatedCart = [...prevCart];
                updatedCart[existingProductIndex].quantity += quantity;
                return updatedCart;
            }
    
            // Sinon, ajouter le produit au panier
            return [...prevCart, { ...product, quantity }];
        });
    };
    

    // Modifier la quantité dans le panier
    const updateCartQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            const updatedCart = cart.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            );
            setCart(updatedCart);
        }
    };

    // Supprimer un produit du panier
    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };

    return (
        <Router>
            {/* Barre de navigation */}
            <nav
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 20px',
                    backgroundColor: '#444',
                    color: 'white',
                }}
            >
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    
                    <Link to="/" ><img
                            src={logo} alt="Logo" className="logo"
                            style={{
                                width: '40%',
                                objectFit: 'cover',
                            }}
                        /></Link>
                    <Link to="/catalogue" style={{ color: 'white', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold' }}>Catalogue</Link>
                    {isAdmin && <Link to="/admin" style={{ color: 'white', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold' }}>Admin</Link>}
                </div>
                {!isAdmin && <Link to="/cart" style={{ position: 'relative', color: 'white', textDecoration: 'none' }}>
                    <span
                    style={{
                        fontSize: '44px', // Augmenter la taille de l'icône
                        display: 'inline-block', // Assurez un rendu correct
                        marginRight: '5px', // Ajouter un espace si nécessaire
                    }}>
                        🛒
                   </span>
                    
                    <span
                        style={{
                            position: 'absolute',
                            top: '-5px',
                            right: '-10px',
                            backgroundColor: '#FFF',
                            color: '#D32F2F',
                            borderRadius: '50%',
                            padding: '5px 10px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                        }}
                    >
                        {cart.reduce((acc, item) => acc + item.quantity, 0)}
                    </span>
                </Link>}
            </nav>

            {/* Routes */}
            <Routes>

                <Route
                    path="/"
                    element={<Accueil products={products} />}
                />
                <Route
                    path="/catalogue"
                    element={<Catalogue products={products} addToCart={addToCart} />}
                />
                <Route
                    path="/cart"
                    element={
                        <CartPage
                            cart={cart}
                            updateCartQuantity={updateCartQuantity}
                            removeFromCart={removeFromCart}
                            onOrderSubmit={handleAddOrder}
                        />
                    }
                />
                <Route
                    path="/admin"
                    element={
                        isAdmin ? (
                            <Admin products={products} setProducts={setProducts} orders={orders} />
                        ) : (
                            <div style={{ textAlign: 'center', padding: '200px' }}>
                                <h1 style={{ color: '#D32F2F', textAlign: 'center' }}>Accès Administrateur</h1>
                                <input
                                    type="password"
                                    placeholder="Mot de passe Admin"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{
                                        padding: '10px',
                                        border: '1px solid #ddd',
                                        borderRadius: '5px',
                                        marginRight: '10px',
                                    }}
                                />
                                <button
                                    onClick={handleLogin}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: '#D32F2F',
                                        color: 'white',
                                        border: 'none',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Connexion
                                </button>
                            </div>
                        )
                    }
                />
                <Route
                    path="/orders"
                    element={
                        isAdmin ? (
                            <OrdersPage />
                        ) : (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                <h2>Accès non autorisé</h2>
                                <p>Veuillez vous connecter en tant qu'administrateur pour accéder à cette page.</p>
                                <Link to="/admin" style={{ color: '#D32F2F' }}>Retour à la connexion admin</Link>
                            </div>
                        )
                    }
                />

            </Routes>
        </Router>
    );
}

export default App;
