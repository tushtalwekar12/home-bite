import React, { useState, useEffect } from 'react';
import { ref, get, onValue, update } from 'firebase/database';
import { database } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { FaSpinner, FaUsers, FaMoneyBillWave, FaShoppingBag, FaChartLine } from 'react-icons/fa';
import AddMenuItem from '../components/providers/AddMenuItem';

const ProviderDashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatsAndOrders = async () => {
      try {
        // Fetch stats
        const statsRef = ref(database, `stats/${currentUser.uid}`);
        onValue(statsRef, (snapshot) => {
          const statsData = snapshot.val() || {
            totalOrders: 0,
            totalRevenue: 0,
            monthlyOrders: 0,
            monthlyRevenue: 0,
            pendingOrders: 0,
            completedOrders: 0,
            cancelledOrders: 0
          };
          setStats(statsData);
        });

        // Fetch recent orders
        const ordersRef = ref(database, 'orders');
        onValue(ordersRef, (snapshot) => {
          const ordersData = snapshot.val() || {};
          const providerOrders = Object.entries(ordersData)
            .filter(([_, order]) => order.providerId === currentUser.uid)
            .map(([id, order]) => ({
              id,
              ...order
            }))
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 5); // Get only 5 most recent orders
          setRecentOrders(providerOrders);
        });

        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStatsAndOrders();
  }, [currentUser.uid]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const orderRef = ref(database, `orders/${orderId}`);
      const statsRef = ref(database, `stats/${currentUser.uid}`);

      // Update order status
      await update(orderRef, {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });

      // Update provider stats
      const statsUpdate = {};
      if (newStatus === 'completed') {
        statsUpdate.pendingOrders = (stats?.pendingOrders || 0) - 1;
        statsUpdate.completedOrders = (stats?.completedOrders || 0) + 1;
      } else if (newStatus === 'cancelled') {
        statsUpdate.pendingOrders = (stats?.pendingOrders || 0) - 1;
        statsUpdate.cancelledOrders = (stats?.cancelledOrders || 0) + 1;
      }

      await update(statsRef, statsUpdate);

      // Update local state
      setRecentOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Failed to update order status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-orange-500 text-4xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Provider Dashboard</h1>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Orders</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats?.totalOrders || 0}</h3>
              </div>
              <FaShoppingBag className="text-orange-500 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Revenue</p>
                <h3 className="text-2xl font-bold text-gray-900">₹{stats?.totalRevenue?.toFixed(2) || 0}</h3>
              </div>
              <FaMoneyBillWave className="text-green-500 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending Orders</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats?.pendingOrders || 0}</h3>
              </div>
              <FaChartLine className="text-blue-500 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Completed Orders</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats?.completedOrders || 0}</h3>
              </div>
              <FaUsers className="text-purple-500 text-2xl" />
            </div>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h2>
          {recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.id.slice(0, 8)}...</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.itemName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{order.price.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(order.timestamp).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleStatusUpdate(order.id, 'completed')}
                              className="px-3 py-1 text-xs font-medium text-white bg-green-500 rounded hover:bg-green-600"
                            >
                              Complete
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                              className="px-3 py-1 text-xs font-medium text-white bg-red-500 rounded hover:bg-red-600"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent orders</p>
          )}
        </div>

        {/* Add Menu Item Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Menu Item</h2>
          <AddMenuItem />
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard; 