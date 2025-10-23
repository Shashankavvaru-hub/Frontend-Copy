import React from 'react';
import { Link } from 'react-router-dom'; // Keep Link if needed for future actions
import { Users, AlertTriangle, Check, X } from 'lucide-react';
import { useState,useEffect } from 'react';
// Assuming these exist in your project
import api from '../api/axiosConfig';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState'; // Assuming EmptyState can handle errors

const AdminUserListPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await api.get('/admin/users');
                setUsers(response.data);
                console.log(users);
            } catch (error) {
                setError('Failed to fetch users. You may not have permission or the server is unavailable.');
                console.error("Failed to fetch users:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (loading) return <LoadingSpinner />;
    if (error) return <EmptyState message={error} isError={true} />;

    return (
      <div className="min-h-screen bg-kalaa-cream">
        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Header */}
          <header className="mb-8 md:mb-12">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-kalaa-charcoal flex items-center gap-3">
              <Users className="w-10 h-10" /> User Management
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              View all registered users on the platform.
            </p>
          </header>

          {/* User Table */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {users.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Full Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Mobile
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Role
                      </th>
                      {/* Add Actions column if needed later */}
                      {/* <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> */}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {user.fullName || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {user.mobileNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {user.email || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.role === "ADMIN"
                                ? "bg-red-100 text-red-800"
                                : user.role === "ARTIST"
                                ? "bg-gray-100 text-green-500"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                {user.artist ? (
                                                    <Check className="w-5 h-5 text-green-500 inline-block" />
                                                ) : (
                                                    <X className="w-5 h-5 text-red-500 inline-block" />
                                                )}
                                            </td> */}
                        {/* Add actions cell if needed later */}
                        {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link to={`/admin/users/${user.id}`} className="text-kalaa-indigo hover:underline">View</Link>
                                            </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState message="No users found." />
            )}
          </div>
        </div>
      </div>
    );
};

export default AdminUserListPage;