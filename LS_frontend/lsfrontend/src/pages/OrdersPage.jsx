import React, { useEffect, useState } from 'react';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);

    // Fonction pour récupérer les commandes
    const fetchOrders = async () => {
        try {
            const response = await fetch('https://las-strauss.onrender.com/api/orders');
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des commandes');
            }
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            setError(error.message);
            console.error(error);
        }
    };

    // Charger les commandes au montage du composant
    useEffect(() => {
        fetchOrders();
    }, []);

    // Mettre à jour le statut d'une commande
    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch(`https://las-strauss.onrender.com/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour du statut de la commande');
            }

            // Actualiser la liste des commandes après mise à jour
            fetchOrders();
        } catch (error) {
            setError(error.message);
            console.error(error);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ color: '#D32F2F', textAlign: 'center' }}>Gestion des Commandes</h1>

            {error && (
                <p style={{ color: 'red', textAlign: 'center' }}>
                    Erreur : {error}
                </p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {orders.map((order) => (
                    <div
                        key={order.id}
                        style={{
                            border: '1px solid #ddd',
                            borderRadius: '10px',
                            padding: '15px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            color: '#eee'
                        }}
                    >
                        <h2>Commande #{order.id}</h2>
                        <p>
                            <strong>Client :</strong> {order.customer_name}
                        </p>
                        <p>
                            <strong>Option de Livraison :</strong> {order.delivery_option}
                        </p>
                        <p>
                            <strong>Produits :</strong>
                            <ul>
                                {order.products.map((product, index) => (
                                    <li key={index}>
                                        {product.name} - {product.quantity} x {product.price} €
                                    </li>
                                ))}
                            </ul>
                        </p>
                        <p>
                            <strong>Total :</strong> {order.total_price} €
                        </p>
                        <p>
                            <strong>Statut :</strong> {order.status || 'Non défini'}
                        </p>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <button
                                onClick={() => updateOrderStatus(order.id, 'En cours')}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#2196F3',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                            >
                                Marquer comme En cours
                            </button>
                            <button
                                onClick={() => updateOrderStatus(order.id, 'Terminé')}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                            >
                                Marquer comme Terminé
                            </button>
                        </div>
                        <p>
                            <strong>Facture :</strong>{' '}
                            {order.invoice_url ? (
                                <a href={`https://las-strauss.onrender.com${order.invoice_url}`} target="_blank" rel="noopener noreferrer">
                                    Télécharger
                                </a>
                            ) : (
                                'Pas encore disponible'
                            )}
                        </p>

                    </div>
                ))}

                {orders.length === 0 && (
                    <p style={{ textAlign: 'center', color: '#555' }}>
                        Aucune commande disponible pour le moment.
                    </p>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;
