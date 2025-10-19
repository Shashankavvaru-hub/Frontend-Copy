import React, { useState, useEffect } from 'react';
import { Table, Button, Alert } from 'react-bootstrap';
import api from '../api/axiosConfig';
import LoadingSpinner from '../components/LoadingSpinner';
import { showSuccessToast, showErrorToast } from '../utils/notifications';

const AdminPayoutsPage = () => {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPendingPayouts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/payouts/pending');
      setPayouts(response.data);
    } catch (err) {
      setError('Failed to load pending payouts.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingPayouts();
  }, []);

  const handlePayout = async (bookingId) => {
    if (window.confirm(`Are you sure you want to process the payout for booking #${bookingId}? This action cannot be undone.`)) {
      try {
        await api.post(`/admin/payouts/${bookingId}`);
        showSuccessToast('Payout initiated successfully!');
        fetchPendingPayouts(); // Refresh the list to remove the completed payout
      } catch (err) {
        showErrorToast(err.response?.data || 'Payout failed. Please check the artist bank details.');
        console.error(err);
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <h2>Pending Artist Payouts</h2>
      <p>This list shows all completed bookings that are awaiting payment to the artist.</p>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Artist Name</th>
            <th>Customer Name</th>
            <th>Event Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {payouts.length > 0 ? (
            payouts.map(booking => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.artist.artistName}</td>
                <td>{booking.user.fullName}</td>
                <td>{new Date(booking.eventDate).toLocaleDateString()}</td>
                <td>
                  <Button variant="success" size="sm" onClick={() => handlePayout(booking.id)}>
                    Pay Artist
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">There are no pending payouts at this time.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminPayoutsPage;