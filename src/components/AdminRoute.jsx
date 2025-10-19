import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const AdminRoute = () => {
    const { user, loading } = useContext(AuthContext);

    // Show a loading spinner while we check the user's role
    if (loading) {
        return <LoadingSpinner />;
    }

    // If loading is finished and the user is an admin, show the admin content.
    // Otherwise, redirect them to the homepage.
    return user && user.role === 'ADMIN' ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;