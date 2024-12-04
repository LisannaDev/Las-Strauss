import React, { useState } from 'react';
import ProductManagement from './ProductManagement';
import OrdersPage from './OrdersPage';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('products'); // Onglet actif

    return (
        <div className="container">
            <h1 style={{ color: '#fff' }}>Tableau de bord</h1>

            {/* Barre de navigation pour les onglets */}
            <div className="tab-navigation">
                <button
                    className={`tab-button ${activeTab === 'products' ? 'active-tab' : ''}`}
                    onClick={() => setActiveTab('products')}
                >
                    Gestion des Produits
                </button>
                <button
                    className={`tab-button ${activeTab === 'orders' ? 'active-tab' : ''}`}
                    onClick={() => setActiveTab('orders')}
                >
                    Gestion des Commandes
                </button>
            </div>

            {/* Contenu de l'onglet actif */}
            <div className="tab-content">
                {activeTab === 'products' && <ProductManagement />}
                {activeTab === 'orders' && <OrdersPage />}
            </div>
        </div>
    );
};

export default Admin;
