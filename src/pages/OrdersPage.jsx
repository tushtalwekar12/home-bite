import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase/config';
import { Link } from 'react-router-dom';

const OrdersPage = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    const ordersRef = ref(database, 'orders');
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val() || {};
      // Show only orders for the current user
      const userOrders = Object.entries(data)
        .filter(([_, order]) => order.userId === currentUser.uid)
        .map(([id, order]) => ({ id, ...order }))
        .sort((a, b) => b.timestamp - a.timestamp);
      setOrders(userOrders);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [currentUser]);

  if (!currentUser) {
    return <div className="p-8 text-center">Please <Link to="/login" className="text-amber-600 underline">login</Link> to view your orders.</div>;
  }

  // Group orders by status
  const deliveredOrders = orders.filter(order => order.status === 'delivered');
  const shippingOrders = orders.filter(order => order.status !== 'delivered');

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      {loading ? (
        <div>Loading orders...</div>
      ) : orders.length === 0 ? (
        <div>No orders found.</div>
      ) : (
        <>
          <h3 className="text-lg font-semibold mt-6 mb-2">In Shipping</h3>
          <ul className="space-y-4 mb-6">
            {shippingOrders.length === 0 && <li className="text-gray-500">No orders in shipping.</li>}
            {shippingOrders.map(order => (
              <li key={order.id} className="border rounded-lg p-4 bg-white shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{order.itemName}</div>
                    <div className="text-sm text-gray-500">Provider: {order.providerId}</div>
                    <div className="text-sm">Quantity: {order.quantity}</div>
                    <div className="text-sm">Price: ₹{order.price}</div>
                    <div className="text-sm">Status: <span className="font-medium">{order.status}</span></div>
                    <div className="text-xs text-gray-400">{new Date(order.timestamp).toLocaleString()}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <h3 className="text-lg font-semibold mt-6 mb-2">Delivered</h3>
          <ul className="space-y-4">
            {deliveredOrders.length === 0 && <li className="text-gray-500">No delivered orders.</li>}
            {deliveredOrders.map(order => (
              <li key={order.id} className="border rounded-lg p-4 bg-white shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{order.itemName}</div>
                    <div className="text-sm text-gray-500">Provider: {order.providerId}</div>
                    <div className="text-sm">Quantity: {order.quantity}</div>
                    <div className="text-sm">Price: ₹{order.price}</div>
                    <div className="text-sm">Status: <span className="font-medium">{order.status}</span></div>
                    <div className="text-xs text-gray-400">{new Date(order.timestamp).toLocaleString()}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
      <div className="mt-8 flex gap-4">
        <Link to="/cart" className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-500">Checkout</Link>
        <Link to="/providers" className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">Buy Now</Link>
      </div>
    </div>
  );
};

export default OrdersPage;
