import React, { useState } from 'react';

function OrderForm() {
    const [form, setForm] = useState({
        customer_name: '',
        customer_email: '',
        delivery_option: 'Click & Collect',
        recaptcha_token: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Vérifier si le reCAPTCHA est valide
        if (!form.recaptcha_token) {
            alert('Veuillez valider le reCAPTCHA.');
            return;
        }

        fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form),
        })
            .then((response) => response.json())
            .then((data) => {
                alert('Commande créée !');
            })
            .catch((error) => console.error('Erreur lors de la commande', error));
    };

    const handleRecaptcha = (token) => {
        setForm({ ...form, recaptcha_token: token });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded mt-6">
            <h2 className="text-xl font-bold mb-4">Passer une commande</h2>
            <div className="mb-4">
                <label className="block text-gray-400">Nom</label>
                <input
                    type="text"
                    className="w-full bg-gray-800 p-2 rounded"
                    value={form.customer_name}
                    onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-400">Email</label>
                <input
                    type="email"
                    className="w-full bg-gray-800 p-2 rounded"
                    value={form.customer_email}
                    onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-400">Option de Livraison</label>
                <select
                    className="w-full bg-gray-800 p-2 rounded"
                    value={form.delivery_option}
                    onChange={(e) => setForm({ ...form, delivery_option: e.target.value })}
                >
                    <option value="Click & Collect">Click & Collect</option>
                    <option value="Livraison">Livraison</option>
                </select>
            </div>
            <div
                className="g-recaptcha"
                data-sitekey="6Lf--4kqAAAAADHWzIKn8d7USp-d0rwBGwAEoYW7"
                data-callback={(token) => handleRecaptcha(token)}
            ></div>
            <button type="submit" className="px-4 py-2 bg-red-600 rounded hover:bg-red-500 mt-4">
                Commander
            </button>
        </form>
    );
}

export default OrderForm;
