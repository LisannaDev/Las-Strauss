import React, { useState, useEffect } from 'react';

function AdminDashboard() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetch('/api/orders')
            .then((response) => response.json())
            .then((data) => setOrders(data))
            .catch((error) => console.error('Erreur lors du chargement des commandes', error));
    }, []);

    return (
        <div className="min-h-screen bg-dark text-white p-6">
            <h1 className="text-3xl font-bold mb-4">Tableau de Bord Admin</h1>
            <ul>
                {orders.map((order) => (
                    <li key={order.id} className="bg-gray-800 p-4 rounded mb-4">
                        <h2 className="text-xl font-bold">{order.customer_name}</h2>
                        <p>Email : {order.customer_email}</p>
                        <p>Option : {order.delivery_option}</p>
                        <p>Total : {order.total_price} €</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AdminDashboard;
