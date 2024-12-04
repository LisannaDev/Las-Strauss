import React, { useState, useEffect } from 'react';
import Cart from '../components/Cart'; // Le composant Cart affiche le panier
import ReCAPTCHA from 'react-google-recaptcha';

const CartPage = ({ cart, updateCartQuantity, removeFromCart, onOrderSubmit }) => {
    const [customer_name, setName] = useState('');
    const [deliveryOption, setDeliveryOption] = useState('click-and-collect');
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0); // État pour le total de la commande

    // Calculer le total de la commande
    useEffect(() => {
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotalPrice(total);
    }, [cart]);

    const handleOrderSubmit = () => {
        if (!customer_name) {
            alert('Veuillez entrer votre nom.');
            return;
        }
        if (!recaptchaToken) {
            alert('Veuillez passer le test reCAPTCHA.');
            return;
        }
        if (cart.length === 0) {
            alert('Votre panier est vide.');
            return;
        }

        const order = {
            customer_name,
            deliveryOption,
            cart,
            recaptchaToken, // Inclure le token reCAPTCHA
        };

        onOrderSubmit(order);
        alert('Commande passée avec succès !');
    };

    return (
        <div style={{ width: '50%', fontFamily: 'Arial, sans-serif', marginLeft: 'auto', marginRight: 'auto', color: '#fff' }}>
            <h1 style={{ color: '#D32F2F', textAlign: 'center', paddingTop: '80px' }}>Votre Panier</h1>

            {cart.length > 0 ? (
                <Cart
                    cart={cart}
                    updateCartQuantity={updateCartQuantity}
                    removeFromCart={removeFromCart}
                />
            ) : (
                <p style={{ textAlign: 'center', color: '#555' }}>
                    Votre panier est vide.
                </p>
            )}

            {cart.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <h2 style={{ color: '#FFF' }}>Validez votre panier</h2>
                    <input
                        type="text"
                        placeholder="Votre nom à Dreadcast"
                        value={customer_name}
                        onChange={(e) => setName(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px',
                            marginBottom: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                        }}
                    />
                    <select
                        value={deliveryOption}
                        onChange={(e) => setDeliveryOption(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px',
                            marginBottom: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                        }}
                    >
                        <option value="click-and-collect">Click & Collect</option>
                        <option value="delivery">Livraison</option>
                    </select>
                    <p style={{ fontSize: '30px', color: '#fff', marginTop: '10px' }}>
                        <strong>Total : {totalPrice.toFixed(2)} ₡</strong>
                    </p>
                    <ReCAPTCHA
                        sitekey="6Lf--4kqAAAAADHWzIKn8d7USp-d0rwBGwAEoYW7"
                        onChange={(token) => setRecaptchaToken(token)} // Récupérer le token reCAPTCHA
                        onExpired={() => setRecaptchaToken(null)} // Réinitialiser si expiré
                    />

                    <button
                        onClick={handleOrderSubmit}
                        style={{
                            marginTop: '10px',
                            padding: '10px 20px',
                            backgroundColor: '#D32F2F',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        Passer la commande
                    </button>
                </div>
            )}
        </div>
    );
};

export default CartPage;
