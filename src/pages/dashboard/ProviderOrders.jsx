import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ref, onValue, update } from 'firebase/database';
import { database } from '../../firebase/config';

const ProviderOrders = () => {
  const { currentUser, userRole } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser || userRole !== 'meal_provider') return;
    const ordersRef = ref(database, 'orders');
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val() || {};
      // Show only orders for this provider
      const providerOrders = Object.entries(data)
        .filter(([_, order]) => order.providerId === currentUser.uid)
        .map(([id, order]) => ({ id, ...order }))
        .sort((a, b) => b.timestamp - a.timestamp);
      setOrders(providerOrders);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [currentUser, userRole]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const orderRef = ref(database, `orders/${orderId}`);
      await update(orderRef, { status: newStatus });
    } catch (error) {
      alert('Failed to update status.');
    }
  };

  if (!currentUser || userRole !== 'meal_provider') {
    return <div className="p-8 text-center">Only meal providers can view this page.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Orders for Your Menu</h2>
      {loading ? (
        <div>Loading orders...</div>
      ) : orders.length === 0 ? (
        <div>No orders found.</div>
      ) : (
        <ul className="space-y-4">
          {orders.map(order => (
            <li key={order.id} className="border rounded-lg p-4 bg-white shadow flex justify-between items-center">
              <div>
                <div className="font-semibold">{order.itemName}</div>
                <div className="text-sm">Customer: {order.userId}</div>
                <div className="text-sm">Quantity: {order.quantity}</div>
                <div className="text-sm">Price: ₹{order.price}</div>
                <div className="text-xs text-gray-400">{new Date(order.timestamp).toLocaleString()}</div>
              </div>
              <div>
                <select
                  value={order.status}
                  onChange={e => handleStatusChange(order.id, e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="pending">Pending</option>
                  <option value="shipping">Shipping</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProviderOrders;
