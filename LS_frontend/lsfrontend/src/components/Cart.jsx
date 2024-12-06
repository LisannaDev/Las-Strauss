import React from 'react';
import poubelle from '../assets/effacer.png'

const Cart = ({ cart, updateCartQuantity, removeFromCart }) => {
    return (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
            {cart.map((item) => (
                <li
                    key={item.id}
                    style={{
                        borderBottom: '1px solid #ddd',
                        padding: '10px 0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <div>
                        <img
                            src={`https://las-strauss.onrender.com${item.image_url}`}
                            alt={item.name}
                            style={{
                                width: '50PX',
                                objectFit: 'cover',
                                borderRadius: '10px',
                            }}
                        />
                    </div>
                    
                    <div
                    style={{
                        width: '180px',
                    }}>
                        <strong>{item.name}</strong>
                    </div>
                    <div
                    style={{
                        width: '180px',
                    }}>
                        <p>
                            {item.price} € x {item.quantity} ={' '}
                            <strong>{item.price * item.quantity} €</strong>
                        </p>
                    </div>
                    <div
                    style={{
                        width: '50PX',
                    }}>
                        <input
                            type="number"
                            value={item.quantity}
                            min={1}
                            onChange={(e) =>
                                updateCartQuantity(item.id, parseInt(e.target.value, 10))
                            }
                            style={{
                                width: '40px',
                                padding: '5px',
                                marginRight: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '5px',
                            }}
                        />
                    </div>
                    <div
                    style={{
                        width: '25PX',
                    }}>
                        <img
                        onClick={() => removeFromCart(item.id)}
                            src={poubelle} alt="Delete" className="delete"
                            style={{
                                width: '24px',
                                height: '24px',
                                cursor: 'pointer',
                            }}
                        />
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default Cart;
