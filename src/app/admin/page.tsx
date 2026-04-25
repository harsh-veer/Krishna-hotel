"use client";

import { useState, useEffect } from "react";
import { Lock, Unlock, Mail, Phone, FileText, Clock, Trash2 } from "lucide-react";

interface Booking {
  _id: string;
  name: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  message?: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error("Invalid password");
      }

      const data = await response.json();
      setBookings(data.bookings);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message || "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleDelete = async (id: string, guestName: string) => {
    if (!confirm(`Are you sure you want to delete the booking for "${guestName}"? This cannot be undone.`)) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.error || 'Failed to delete booking.');
        return;
      }

      // Remove from local state instantly
      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      alert('An error occurred while deleting.');
    } finally {
      setDeletingId(null);
    }
  };

  const sendWhatsApp = (booking: Booking) => {
    // Strip non-digits and ensure international format
    const rawPhone = booking.phone.replace(/\D/g, '');
    const phone = rawPhone.startsWith('91') ? rawPhone : `91${rawPhone}`;

    const message =
      ` Dear ${booking.name},\n\n` +
      `Thank you for choosing *Krishna Hotel*! We're happy to confirm your reservation.\n\n` +
      `📋 *Booking Details*\n` +
      `📅 Check-in:  ${formatDate(booking.checkIn)}\n` +
      `📅 Check-out: ${formatDate(booking.checkOut)}\n` +
      `👥 Guests:    ${booking.guests}\n` +
      (booking.message ? `📝 Requests:  ${booking.message}\n` : '') +
      `\nWe look forward to welcoming you! For any queries, feel free to reply here.\n\n` +
      `— Krishna Hotel Team 🏨`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-royal-blue p-6 text-center">
            <div className="bg-white/20 p-3 rounded-full inline-block mb-4">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white font-heading">Admin Access</h1>
            <p className="text-royal-blue-light mt-1 text-sm">Enter password to view reservations</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-100">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-200 focus:border-royal-blue focus:ring-1 focus:ring-royal-blue outline-none transition-all"
                    placeholder="••••••••"
                  />
                  <Unlock className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-royal-blue text-white font-bold py-3 rounded-lg shadow-md hover:bg-royal-blue/90 transition-all disabled:opacity-70 flex justify-center items-center"
              >
                {isLoading ? "Verifying..." : "Access Dashboard"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-bold font-heading text-gray-900">Reservations Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage and view all incoming booking requests.</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-royal-blue/10 text-royal-blue px-4 py-2 rounded-lg font-medium">
              {bookings.length} Total Bookings
            </div>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="text-gray-500 hover:text-red-500 font-medium transition-colors"
            >
              Log out
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="py-4 px-6 font-semibold text-sm text-gray-600">Guest Details</th>
                  <th className="py-4 px-6 font-semibold text-sm text-gray-600">Dates</th>
                  <th className="py-4 px-6 font-semibold text-sm text-gray-600">Guests</th>
                  <th className="py-4 px-6 font-semibold text-sm text-gray-600">Special Requests</th>
                  <th className="py-4 px-6 font-semibold text-sm text-gray-600">Received On</th>
                  <th className="py-4 px-6 font-semibold text-sm text-gray-600 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-500">
                      No reservations found.
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-gray-900 mb-1">{booking.name}</div>
                        <div className="flex items-center text-sm text-gray-500 mb-1">
                          <Phone className="h-3.5 w-3.5 mr-1.5" />
                          <a href={`tel:${booking.phone}`} className="hover:text-royal-blue">{booking.phone}</a>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="h-3.5 w-3.5 mr-1.5" />
                          <a href={`mailto:${booking.email}`} className="hover:text-royal-blue">{booking.email}</a>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center text-sm">
                            <span className="w-16 text-gray-500 font-medium">In:</span>
                            <span className="font-medium text-gray-900 bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs">{formatDate(booking.checkIn)}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <span className="w-16 text-gray-500 font-medium">Out:</span>
                            <span className="font-medium text-gray-900 bg-red-50 text-red-700 px-2 py-0.5 rounded text-xs">{formatDate(booking.checkOut)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="inline-flex items-center justify-center bg-gray-100 rounded-full h-10 w-10 text-gray-700 font-bold">
                          {booking.guests.replace('+', '')}
                        </div>
                      </td>
                      <td className="py-4 px-6 max-w-xs">
                        {booking.message ? (
                          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 relative">
                            <FileText className="absolute top-2.5 right-2.5 h-4 w-4 text-gray-300" />
                            <p className="pr-5 italic line-clamp-3" title={booking.message}>"{booking.message}"</p>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400 italic">None</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col text-sm">
                          <span className="text-gray-900 font-medium">{formatDate(booking.createdAt)}</span>
                          <span className="text-gray-500 flex items-center mt-1">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            {new Date(booking.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-2">
                          {/* WhatsApp button */}
                          <button
                            onClick={() => sendWhatsApp(booking)}
                            title="Send WhatsApp confirmation"
                            className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.558 4.121 1.532 5.853L.057 23.998l6.302-1.653A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.002-1.368l-.36-.214-3.732.979.995-3.636-.235-.374A9.818 9.818 0 1112 21.818z" />
                            </svg>
                          </button>
                          {/* Delete button */}
                          <button
                            onClick={() => handleDelete(booking._id, booking.name)}
                            disabled={deletingId === booking._id}
                            title="Delete booking"
                            className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            {deletingId === booking._id ? (
                              <span className="h-4 w-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
