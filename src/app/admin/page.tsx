"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import AdminEvents from "@/components/AdminEvents";
import { GOOGLE_WRITE_REVIEW_URL } from "@/lib/hotel";
import { 
  Lock, 
  Unlock, 
  Mail, 
  Phone, 
  FileText, 
  Clock, 
  Trash2, 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  BarChart3, 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  BedDouble, 
  DollarSign, 
  List,
  MessageSquare,
  Star,
  ThumbsUp,
  Reply,
  Send,
  Settings as SettingsIcon,
} from "lucide-react";

interface Booking {
  _id: string;
  name: string;
  email: string;
  phone: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  status: string;
  message?: string;
  createdAt: string;
}

const ROOM_PRICES: Record<string, number> = {
  "Super-Deluxe Room": 1500,
  "Standard Ac Room": 1200,
  "Non-Ac Deluxe": 999,
};

interface Review {
  _id: string;
  name: string;
  rating: number;
  text: string;
  ownerResponse?: string;
  isApproved: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // View States
  const [activeTab, setActiveTab] = useState<"bookings" | "reviews" | "events" | "settings">("bookings");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const [pendingEvents, setPendingEvents] = useState(0);

  // Review States
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [respondingToId, setRespondingToId] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");
  const [submittingResponse, setSubmittingResponse] = useState(false);

  // Settings tab: offer banner and room counts.
  const [siteSettings, setSiteSettings] = useState<{
    offer: { enabled: boolean; text: string; textHi: string; link: string };
    inventory: Record<string, number>;
  } | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);

  const fetchSettings = async () => {
    try {
      const res = await adminFetch("/api/admin/settings");
      if (res.ok) setSiteSettings(await res.json());
    } catch {}
  };

  const saveSiteSettings = async () => {
    if (!siteSettings) return;
    setSavingSettings(true);
    try {
      const res = await adminFetch("/api/admin/settings", {
        method: "PUT",
        body: JSON.stringify(siteSettings),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error || "Could not save settings.");
        return;
      }
      setSiteSettings(data.settings);
      toast.success("Settings saved. The website updates within a minute.");
    } catch {
      toast.error("Could not save settings.");
    } finally {
      setSavingSettings(false);
    }
  };

  // Load data if this browser already has a valid admin session (an httpOnly cookie set at login).
  useEffect(() => {
    (async () => {
      try {
        const res = await adminFetch("/api/admin/session");
        const data = await res.json();
        if (data.loggedIn) await loadDashboard();
      } catch {}
    })();
    try { localStorage.removeItem("admin_password"); } catch {} // left over from the old login
  }, []);

  // Log out after 30 minutes without any activity on the page.
  useEffect(() => {
    if (!isAuthenticated) return;
    let timer: ReturnType<typeof setTimeout>;
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        handleLogout();
        setError("Logged out after 30 minutes of inactivity.");
      }, 30 * 60 * 1000);
    };
    const events = ["mousemove", "keydown", "click", "touchstart", "scroll"];
    events.forEach((ev) => window.addEventListener(ev, reset, { passive: true }));
    reset();
    return () => {
      clearTimeout(timer);
      events.forEach((ev) => window.removeEventListener(ev, reset));
    };
  }, [isAuthenticated]);

  // Any 401 from an admin API means the session ended: go back to the login screen.
  const adminFetch = async (url: string, init: RequestInit = {}) => {
    const res = await fetch(url, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init.headers || {}) },
    });
    if (res.status === 401) {
      setIsAuthenticated(false);
      setBookings([]);
      setError("Your session has expired. Please log in again.");
    }
    return res;
  };

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const res = await adminFetch("/api/admin/reviews", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch {}
    finally {
      setReviewsLoading(false);
    }
  };

  const loadDashboard = async () => {
    setIsLoading(true);
    try {
      const response = await adminFetch("/api/admin/bookings", { method: "POST" });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Server connection error. Please verify database setup.");
      }
      const data = await response.json();
      setBookings(data.bookings || []);
      setIsAuthenticated(true);
      setError(null);
      fetchReviews();
      fetchSettings();
      adminFetch("/api/admin/events").then((r) => r.ok ? r.json() : null).then((d) => d && setPendingEvents((d.events || []).filter((e: any) => e.status === "Pending").length)).catch(() => {});
    } catch (err: any) {
      setError(err.message || "Failed to load bookings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Invalid password");
      }
      setPassword("");
      await loadDashboard();
    } catch (err: any) {
      setError(err.message || "Failed to login");
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    fetch("/api/admin/login", { method: "DELETE" }).catch(() => {});
    setPassword("");
    setIsAuthenticated(false);
    setBookings([]);
    setReviews([]);
  };

  const handleDelete = async (id: string, guestName: string) => {
    if (!confirm(`Are you sure you want to delete the booking for "${guestName}"? This cannot be undone.`)) return;

    setDeletingId(id);
    try {
      const response = await adminFetch(`/api/admin/bookings/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.error || 'Failed to delete booking.');
        return;
      }

      setBookings((prev) => prev.filter((b) => b._id !== id));
      if (selectedBooking?._id === id) {
        setSelectedBooking(null);
      }
    } catch (err) {
      alert('An error occurred while deleting.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const response = await adminFetch(`/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.error || 'Failed to update status.');
        return;
      }

      const data = await response.json();
      setBookings((prev) => prev.map((b) => b._id === id ? { ...b, status: newStatus } : b));
      if (data.emailSent && newStatus === 'Checked-out') {
        toast.success('Checked out. The guest has been emailed a Google review request.');
      } else if (data.emailSent) {
        toast.success(`Marked ${newStatus}. The guest has been emailed.`);
      } else if (newStatus === 'Confirmed' || newStatus === 'Cancelled') {
        toast(`Marked ${newStatus}. No email was sent, so please call the guest.`);
      }
      
      // Update selected booking modal if open
      if (selectedBooking?._id === id) {
        setSelectedBooking(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (err) {
      alert('An error occurred while updating status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleApproveReview = async (id: string, currentStatus: boolean) => {
    try {
      const res = await adminFetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: !currentStatus }),
      });
      if (res.ok) {
        setReviews(prev => prev.map(r => r._id === id ? { ...r, isApproved: !currentStatus } : r));
      } else {
        alert("Failed to update review status.");
      }
    } catch {
      alert("An error occurred.");
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this review?")) return;
    try {
      const res = await adminFetch(`/api/admin/reviews/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        setReviews(prev => prev.filter(r => r._id !== id));
      } else {
        alert("Failed to delete review.");
      }
    } catch {
      alert("An error occurred.");
    }
  };

  const handleSubmitResponse = async (id: string) => {
    if (!responseText.trim()) return;
    setSubmittingResponse(true);
    try {
      const res = await adminFetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownerResponse: responseText }),
      });
      if (res.ok) {
        setReviews(prev => prev.map(r => r._id === id ? { ...r, ownerResponse: responseText } : r));
        setRespondingToId(null);
        setResponseText("");
      } else {
        alert("Failed to submit response.");
      }
    } catch {
      alert("An error occurred.");
    } finally {
      setSubmittingResponse(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getNights = (checkIn: string, checkOut: string) => {
    const diffTime = Math.abs(new Date(checkOut).getTime() - new Date(checkIn).getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  };

  const getEstimatedPrice = (booking: Booking) => {
    const pricePerNight = ROOM_PRICES[booking.roomType] || 1200;
    const nights = getNights(booking.checkIn, booking.checkOut);
    return pricePerNight * nights;
  };

  const sendWhatsApp = (booking: Booking) => {
    const rawPhone = booking.phone.replace(/\D/g, '');
    const phone = rawPhone.startsWith('91') ? rawPhone : `91${rawPhone}`;

    // After check-out the WhatsApp button asks for a Google review instead of confirming the booking.
    if (booking.status === 'Checked-out') {
      const review =
        `Namaste ${booking.name} 🙏\n\n` +
        `Thank you for staying at *Krishna Hotel*! We hope you had a comfortable stay.\n\n` +
        `Could you please rate us on Google? It takes 30 seconds and really helps us:\n${GOOGLE_WRITE_REVIEW_URL}\n\n` +
        `— Krishna Hotel Team`;
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(review)}`, '_blank');
      return;
    }

    const message =
      ` Dear ${booking.name},\n\n` +
      `Thank you for choosing *Krishna Hotel*! We're happy to confirm your reservation.\n\n` +
      `📋 *Booking Details*\n` +
      `🏨 Room:      ${booking.roomType}\n` +
      `📅 Check-in:  ${formatDate(booking.checkIn)}\n` +
      `📅 Check-out: ${formatDate(booking.checkOut)}\n` +
      `👥 Guests:    ${booking.guests}\n` +
      (booking.message ? `📝 Requests:  ${booking.message}\n` : '') +
      `\nWe look forward to welcoming you! For any queries, feel free to reply here.\n\n` +
      `— Krishna Hotel Team 🏨`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // Calendar calculations
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    // Pad previous month's trailing days
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }
    // Fill current month days
    for (let d = 1; d <= totalDays; d++) {
      days.push(new Date(year, month, d));
    }
    return days;
  };

  const isStayingOnDate = (dateStr: string, booking: Booking) => {
    if (booking.status === "Cancelled") return false;
    return dateStr >= booking.checkIn && dateStr <= booking.checkOut;
  };

  const formatDateString = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Analytics Metrics
  const activeBookings = bookings.filter(b => b.status !== "Cancelled");
  const pendingCount = bookings.filter(b => b.status === "Pending").length;
  const confirmedCount = bookings.filter(b => b.status === "Confirmed").length;
  const checkedInCount = bookings.filter(b => b.status === "Checked-in").length;
  const checkedOutCount = bookings.filter(b => b.status === "Checked-out").length;
  const cancelledCount = bookings.filter(b => b.status === "Cancelled").length;

  const totalEstimatedRevenue = activeBookings.reduce((sum, b) => sum + getEstimatedPrice(b), 0);

  // Group bookings by Room Type
  const roomStats = bookings.reduce((acc, b) => {
    if (b.status !== "Cancelled") {
      acc[b.roomType] = (acc[b.roomType] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Group bookings by Month
  const monthlyStats = bookings.reduce((acc, b) => {
    if (b.status !== "Cancelled") {
      const date = new Date(b.checkIn);
      const monthYear = date.toLocaleString('en-US', { month: 'short', year: '2-digit' });
      acc[monthYear] = (acc[monthYear] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const statusColors: Record<string, string> = {
    "Pending": "bg-yellow-50 text-yellow-700 border-yellow-200",
    "Confirmed": "bg-green-50 text-green-700 border-green-200",
    "Checked-in": "bg-blue-50 text-blue-700 border-blue-200",
    "Checked-out": "bg-gray-50 text-gray-700 border-gray-200",
    "Cancelled": "bg-red-50 text-red-700 border-red-200",
  };

  const roomColors: Record<string, string> = {
    "Super-Deluxe Room": "bg-blue-100 text-blue-800 border-blue-200",
    "Standard Ac Room": "bg-purple-100 text-purple-800 border-purple-200",
    "Non-Ac Deluxe": "bg-amber-100 text-amber-800 border-amber-200",
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
            <p className="text-white/80 mt-1 text-sm">Enter password to view reservations</p>
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
                className="w-full bg-royal-blue text-white font-bold py-3 rounded-lg shadow-md hover:bg-royal-blue-light transition-all disabled:opacity-70 flex justify-center items-center"
              >
                {isLoading ? "Verifying..." : "Access Dashboard"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const pendingReviewsCount = reviews.filter(r => !r.isApproved).length;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-bold font-heading text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage bookings, moderate reviews, and view real-time statistics.</p>
          </div>
          <div className="flex items-center space-x-3">
            {/* Tab Switcher */}
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("bookings")}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                  activeTab === "bookings" ? "bg-white text-royal-blue shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <span className="flex items-center space-x-1.5">
                  <BedDouble className="h-4 w-4" />
                  <span>Bookings</span>
                </span>
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all relative ${
                  activeTab === "reviews" ? "bg-white text-royal-blue shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <span className="flex items-center space-x-1.5">
                  <Star className="h-4 w-4" />
                  <span>Reviews</span>
                </span>
                {pendingReviewsCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {pendingReviewsCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("events")}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all relative ${
                  activeTab === "events" ? "bg-white text-royal-blue shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <span className="flex items-center space-x-1.5">
                  <CalendarIcon className="h-4 w-4" />
                  <span>Events</span>
                </span>
                {pendingEvents > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {pendingEvents}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                  activeTab === "settings" ? "bg-white text-royal-blue shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <span className="flex items-center space-x-1.5">
                  <SettingsIcon className="h-4 w-4" />
                  <span>Settings</span>
                </span>
              </button>
            </div>
            {activeTab === "bookings" && (
              <button
                onClick={() => setViewMode(viewMode === "list" ? "calendar" : "list")}
                className="inline-flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg font-semibold transition-all text-sm"
              >
                {viewMode === "list" ? (
                  <>
                    <CalendarIcon className="h-4 w-4 text-royal-blue" />
                    <span>Calendar View</span>
                  </>
                ) : (
                  <>
                    <List className="h-4 w-4 text-royal-blue" />
                    <span>List View</span>
                  </>
                )}
              </button>
            )}
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-600 font-semibold px-3 py-2 text-sm transition-colors"
            >
              Log out
            </button>
          </div>
        </div>

        {activeTab === "bookings" && <>
        {/* Quick Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
            <div className="bg-royal-blue/10 p-3 rounded-xl text-royal-blue">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Bookings</p>
              <h3 className="text-2xl font-bold text-gray-900">{bookings.length}</h3>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
            <div className="bg-yellow-100 p-3 rounded-xl text-yellow-600">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Pending Approvals</p>
              <h3 className="text-2xl font-bold text-gray-900">{pendingCount}</h3>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-xl text-green-600">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Confirmed / Checked-in</p>
              <h3 className="text-2xl font-bold text-gray-900">{confirmedCount + checkedInCount}</h3>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
            <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Est. Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900">₹{totalEstimatedRevenue.toLocaleString('en-IN')}</h3>
            </div>
          </div>
        </div>

        {/* Analytics Section (Visible only when Bookings exist) */}
        {bookings.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Room Distribution */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-lg">Room Type Popularity</h3>
                <BedDouble className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {Object.keys(ROOM_PRICES).map(roomName => {
                  const count = roomStats[roomName] || 0;
                  const percent = bookings.length > 0 ? (count / activeBookings.length) * 100 : 0;
                  return (
                    <div key={roomName}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-semibold text-gray-700">{roomName}</span>
                        <span className="text-gray-500 font-medium">{count} bookings</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div 
                          className="bg-royal-blue h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Booking Status Distribution */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-lg">Booking Statuses</h3>
                <BarChart3 className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                {[
                  { name: "Pending", val: pendingCount, color: "bg-yellow-400" },
                  { name: "Confirmed", val: confirmedCount, color: "bg-green-500" },
                  { name: "Checked-in", val: checkedInCount, color: "bg-blue-500" },
                  { name: "Checked-out", val: checkedOutCount, color: "bg-gray-400" },
                  { name: "Cancelled", val: cancelledCount, color: "bg-red-500" },
                ].map(item => {
                  const percent = bookings.length > 0 ? (item.val / bookings.length) * 100 : 0;
                  return (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-600 flex items-center">
                        <span className={`w-2.5 h-2.5 rounded-full ${item.color} mr-2`} />
                        {item.name}
                      </span>
                      <div className="flex items-center space-x-2 w-1/2">
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full ${item.color}`} style={{ width: `${percent}%` }} />
                        </div>
                        <span className="text-gray-500 font-semibold w-6 text-right">{item.val}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Monthly Trends */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-lg">Monthly Booking Volume</h3>
                <CalendarIcon className="h-5 w-5 text-gray-400" />
              </div>
              {Object.keys(monthlyStats).length === 0 ? (
                <div className="h-32 flex items-center justify-center text-sm text-gray-400 italic">No historical data</div>
              ) : (
                <div className="flex items-end justify-between h-32 pt-2 gap-2">
                  {Object.entries(monthlyStats).slice(-6).map(([month, val]) => {
                    const maxVal = Math.max(...Object.values(monthlyStats));
                    const heightPercent = maxVal > 0 ? (val / maxVal) * 80 : 0;
                    return (
                      <div key={month} className="flex flex-col items-center flex-1">
                        <span className="text-xs font-bold text-gray-700 mb-1">{val}</span>
                        <div 
                          className="w-full bg-royal-blue/80 hover:bg-royal-blue rounded-t-sm transition-all duration-300"
                          style={{ height: `${Math.max(8, heightPercent)}px` }}
                        />
                        <span className="text-[10px] text-gray-500 mt-2 font-medium truncate w-full text-center">{month}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* View Mode Content */}
        {viewMode === "list" ? (
          /* Bookings List View */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="py-4 px-6 font-semibold text-sm text-gray-600">Guest Details</th>
                    <th className="py-4 px-6 font-semibold text-sm text-gray-600">Room & Price</th>
                    <th className="py-4 px-6 font-semibold text-sm text-gray-600">Stay Dates</th>
                    <th className="py-4 px-6 font-semibold text-sm text-gray-600">Status</th>
                    <th className="py-4 px-6 font-semibold text-sm text-gray-600">Received On</th>
                    <th className="py-4 px-6 font-semibold text-sm text-gray-600 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-gray-500">
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
                          <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded-full mb-1 border ${roomColors[booking.roomType] || 'bg-gray-100 border-gray-200'}`}>
                            {booking.roomType}
                          </span>
                          <div className="text-sm font-semibold text-gray-900">
                            ₹{getEstimatedPrice(booking).toLocaleString('en-IN')}{" "}
                            <span className="text-xs font-normal text-gray-500">
                              ({getNights(booking.checkIn, booking.checkOut)} nights, {booking.guests} pax)
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center text-sm">
                              <span className="w-8 text-gray-400 font-medium text-xs">IN:</span>
                              <span className="font-medium text-gray-900 bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs">{formatDate(booking.checkIn)}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <span className="w-8 text-gray-400 font-medium text-xs">OUT:</span>
                              <span className="font-medium text-gray-900 bg-red-50 text-red-700 px-2 py-0.5 rounded text-xs">{formatDate(booking.checkOut)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="relative">
                            <select
                              value={booking.status || "Pending"}
                              disabled={updatingId === booking._id}
                              onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                              className={`px-3 py-1.5 rounded-lg border text-xs font-bold focus:outline-none focus:ring-1 focus:ring-royal-blue cursor-pointer appearance-none pr-8 ${
                                statusColors[booking.status || "Pending"]
                              } ${updatingId === booking._id ? 'opacity-50' : ''}`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Checked-in">Checked-in</option>
                              <option value="Checked-out">Checked-out</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                            {updatingId === booking._id ? (
                              <span className="absolute right-2 top-2 h-3.5 w-3.5 border-2 border-royal-blue border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <span className="absolute right-3.5 top-3 pointer-events-none border-solid border-t-current border-t-4 border-r-transparent border-r-4 border-l-transparent border-l-4" />
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-col text-sm">
                            <span className="text-gray-900 font-medium text-xs">{formatDate(booking.createdAt)}</span>
                            <span className="text-gray-400 flex items-center mt-1 text-[11px]">
                              <Clock className="h-3 w-3 mr-1" />
                              {new Date(booking.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => sendWhatsApp(booking)}
                              title={booking.status === 'Checked-out' ? "Ask for a Google review on WhatsApp" : "Send WhatsApp confirmation"}
                              className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.558 4.121 1.532 5.853L.057 23.998l6.302-1.653A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.002-1.368l-.36-.214-3.732.979.995-3.636-.235-.374A9.818 9.818 0 1112 21.818z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(booking._id, booking.name)}
                              disabled={deletingId === booking._id}
                              title="Delete booking"
                              className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 transition-colors disabled:opacity-40"
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
        ) : (
          /* Calendar Grid View */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
            {/* Calendar Header Controls */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 font-heading">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex space-x-1">
                <button 
                  onClick={prevMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => setCurrentDate(new Date())}
                  className="px-3 py-1 hover:bg-gray-100 rounded-lg text-sm text-gray-600 font-bold transition-colors"
                >
                  Today
                </button>
                <button 
                  onClick={nextMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div>
              {/* Day Labels */}
              <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
              </div>

              {/* Day Boxes */}
              <div className="grid grid-cols-7 gap-2">
                {getDaysInMonth(currentDate).map((day, idx) => {
                  if (!day) return <div key={`empty-${idx}`} className="bg-gray-50/50 rounded-xl h-28 border border-dashed border-gray-100" />;

                  const dateStr = formatDateString(day);
                  const activeStays = bookings.filter(b => isStayingOnDate(dateStr, b));

                  return (
                    <div 
                      key={dateStr} 
                      className={`bg-white rounded-xl h-28 border p-2 flex flex-col justify-between overflow-hidden group hover:border-royal-blue/30 transition-all ${
                        dateStr === formatDateString(new Date()) ? 'border-royal-blue border-2 shadow-sm' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className={`text-sm font-bold ${
                          dateStr === formatDateString(new Date()) ? 'text-royal-blue' : 'text-gray-700'
                        }`}>
                          {day.getDate()}
                        </span>
                        {activeStays.length > 0 && (
                          <span className="text-[10px] font-bold bg-royal-blue/10 text-royal-blue px-1.5 py-0.5 rounded-full">
                            {activeStays.length}
                          </span>
                        )}
                      </div>

                      {/* Small list of guest stays */}
                      <div className="flex-1 mt-1 overflow-y-auto space-y-1 scrollbar-none">
                        {activeStays.slice(0, 2).map(stay => {
                          const isCheckIn = stay.checkIn === dateStr;
                          const isCheckOut = stay.checkOut === dateStr;
                          let pillStyle = "bg-gray-100 border-gray-200 text-gray-800";
                          if (stay.roomType === "Super-Deluxe Room") pillStyle = "bg-blue-50 border-blue-200 text-blue-700";
                          if (stay.roomType === "Standard Ac Room") pillStyle = "bg-purple-50 border-purple-200 text-purple-700";
                          if (stay.roomType === "Non-Ac Deluxe") pillStyle = "bg-amber-50 border-amber-200 text-amber-700";

                          return (
                            <button
                              key={stay._id}
                              onClick={() => setSelectedBooking(stay)}
                              className={`w-full text-[10px] text-left truncate px-1 py-0.5 rounded border font-semibold flex items-center justify-between cursor-pointer hover:scale-[1.02] transition-transform ${pillStyle}`}
                            >
                              <span className="truncate">{stay.name}</span>
                              {isCheckIn && <span className="text-[8px] bg-green-500 text-white rounded px-0.5 font-bold">IN</span>}
                              {isCheckOut && <span className="text-[8px] bg-red-500 text-white rounded px-0.5 font-bold">OUT</span>}
                            </button>
                          );
                        })}
                        {activeStays.length > 2 && (
                          <div className="text-[9px] text-gray-400 font-bold text-center">
                            +{activeStays.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        </>}

        {/* ===== SETTINGS TAB ===== */}
        {activeTab === "settings" && (
          <div className="grid gap-6 lg:grid-cols-2">
            {!siteSettings ? (
              <p className="text-gray-500">Loading settings...</p>
            ) : (
              <>
                <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Offer banner</h2>
                    <p className="text-sm text-gray-500">A strip at the top of every page, e.g. a festival discount.</p>
                  </div>
                  <label className="flex items-center gap-3 text-sm font-semibold text-gray-800">
                    <input
                      type="checkbox"
                      checked={siteSettings.offer.enabled}
                      onChange={(e) => setSiteSettings({ ...siteSettings, offer: { ...siteSettings.offer, enabled: e.target.checked } })}
                      className="h-4 w-4"
                    />
                    Show the banner on the website
                  </label>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Offer text (English)</label>
                    <input
                      value={siteSettings.offer.text}
                      maxLength={160}
                      onChange={(e) => setSiteSettings({ ...siteSettings, offer: { ...siteSettings.offer, text: e.target.value } })}
                      placeholder="Diwali offer: 10% off on all rooms. Book now!"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Offer text (Hindi, optional)</label>
                    <input
                      value={siteSettings.offer.textHi}
                      maxLength={160}
                      onChange={(e) => setSiteSettings({ ...siteSettings, offer: { ...siteSettings.offer, textHi: e.target.value } })}
                      placeholder="दिवाली ऑफर: सभी कमरों पर 10% छूट। अभी बुक करें!"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Link when tapped (optional)</label>
                    <input
                      value={siteSettings.offer.link}
                      onChange={(e) => setSiteSettings({ ...siteSettings, offer: { ...siteSettings.offer, link: e.target.value } })}
                      placeholder="/#contact"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    />
                    <p className="text-xs text-gray-400 mt-1">Use /#contact for the booking form, or a full https:// link.</p>
                  </div>
                  {siteSettings.offer.text && (
                    <div className="rounded-lg bg-gold text-royal-blue text-center text-sm font-semibold px-4 py-2">
                      {siteSettings.offer.text}
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Rooms available for booking</h2>
                    <p className="text-sm text-gray-500">
                      How many rooms of each type guests can book online. When all are taken for a date
                      (Pending, Confirmed or Checked-in), the website shows Sold Out. Set 0 to stop online bookings for a type.
                    </p>
                  </div>
                  {Object.entries(siteSettings.inventory).map(([room, count]) => (
                    <div key={room} className="flex items-center justify-between gap-4">
                      <span className="text-sm font-semibold text-gray-800">{room}</span>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={count}
                        onChange={(e) =>
                          setSiteSettings({
                            ...siteSettings,
                            inventory: { ...siteSettings.inventory, [room]: Math.max(0, parseInt(e.target.value || "0", 10)) },
                          })
                        }
                        className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm text-right"
                      />
                    </div>
                  ))}
                </div>

                <div className="lg:col-span-2">
                  <button
                    onClick={saveSiteSettings}
                    disabled={savingSettings}
                    className="bg-royal-blue text-white font-semibold px-6 py-3 rounded-lg disabled:opacity-60"
                  >
                    {savingSettings ? "Saving..." : "Save settings"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ===== EVENTS TAB ===== */}
        {activeTab === "events" && <AdminEvents adminFetch={adminFetch} onPendingCount={setPendingEvents} />}

        {/* ===== REVIEWS TAB ===== */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Guest Reviews
                {pendingReviewsCount > 0 && (
                  <span className="ml-2 bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded-full">
                    {pendingReviewsCount} pending approval
                  </span>
                )}
              </h2>
              <p className="text-sm text-gray-500">{reviews.length} total reviews</p>
            </div>

            {reviewsLoading ? (
              <div className="flex justify-center py-16">
                <span className="h-8 w-8 border-4 border-royal-blue border-t-transparent rounded-full animate-spin" />
              </div>
            ) : reviews.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No reviews submitted yet.</p>
                <p className="text-sm text-gray-400 mt-1">Reviews from guests will appear here once submitted.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className={`bg-white rounded-2xl border shadow-sm p-6 ${
                      review.isApproved ? "border-green-100" : "border-yellow-200 bg-yellow-50/30"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="h-10 w-10 rounded-full bg-royal-blue/10 flex items-center justify-center font-bold text-royal-blue">
                            {review.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{review.name}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </p>
                          </div>
                          <span
                            className={`ml-2 text-xs font-bold px-2 py-0.5 rounded-full border ${
                              review.isApproved
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-yellow-50 text-yellow-700 border-yellow-200"
                            }`}
                          >
                            {review.isApproved ? "✓ Published" : "⏳ Pending"}
                          </span>
                        </div>

                        <div className="flex mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < review.rating ? "text-gold fill-gold" : "text-gray-300"}`}
                            />
                          ))}
                        </div>

                        <p className="text-gray-700 text-sm italic mb-4">"{review.text}"</p>

                        {review.ownerResponse && (
                          <div className="bg-royal-blue/5 p-3 rounded-lg border border-royal-blue/10 text-sm">
                            <p className="text-xs font-bold text-royal-blue mb-1 flex items-center">
                              <Reply className="h-3 w-3 mr-1" /> Your Response
                            </p>
                            <p className="text-gray-700">{review.ownerResponse}</p>
                          </div>
                        )}

                        {respondingToId === review._id && (
                          <div className="mt-3 space-y-2">
                            <textarea
                              rows={3}
                              value={responseText}
                              onChange={(e) => setResponseText(e.target.value)}
                              placeholder="Write your response to this review..."
                              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-royal-blue focus:ring-1 focus:ring-royal-blue outline-none resize-none"
                            />
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleSubmitResponse(review._id)}
                                disabled={submittingResponse || !responseText.trim()}
                                className="inline-flex items-center space-x-1.5 bg-royal-blue text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-royal-blue/90 transition-all disabled:opacity-60"
                              >
                                <Send className="h-3 w-3" />
                                <span>{submittingResponse ? "Sending..." : "Send Response"}</span>
                              </button>
                              <button
                                onClick={() => { setRespondingToId(null); setResponseText(""); }}
                                className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100 border border-gray-200 transition-all"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex sm:flex-col gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleApproveReview(review._id, review.isApproved)}
                          className={`inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold border transition-all ${
                            review.isApproved
                              ? "bg-green-50 text-green-700 border-green-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                              : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                          }`}
                          title={review.isApproved ? "Click to unpublish" : "Click to approve & publish"}
                        >
                          {review.isApproved ? <XCircle className="h-4 w-4" /> : <ThumbsUp className="h-4 w-4" />}
                          <span>{review.isApproved ? "Unpublish" : "Approve"}</span>
                        </button>

                        {respondingToId !== review._id && (
                          <button
                            onClick={() => { setRespondingToId(review._id); setResponseText(review.ownerResponse || ""); }}
                            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-royal-blue/10 text-royal-blue border border-royal-blue/20 hover:bg-royal-blue/20 transition-all"
                          >
                            <Reply className="h-4 w-4" />
                            <span>{review.ownerResponse ? "Edit Reply" : "Reply"}</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Detailed Guest stay modal */}
        {selectedBooking && (
          <div className="fixed inset-0 z-50 bg-gray-900/60 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-royal-blue p-5 text-white flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold font-heading">{selectedBooking.name}</h3>
                  <p className="text-white/80 text-xs mt-1">Requested Reservation Details</p>
                </div>
                <button 
                  onClick={() => setSelectedBooking(null)}
                  className="text-white/80 hover:text-white font-bold text-lg p-1 bg-white/10 hover:bg-white/20 rounded-full h-8 w-8 flex items-center justify-center transition-all"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-5 text-gray-700">
                {/* Contacts grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2.5 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <Phone className="h-4.5 w-4.5 text-royal-blue" />
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold">Phone</p>
                      <a href={`tel:${selectedBooking.phone}`} className="text-sm font-semibold text-gray-950 hover:underline">{selectedBooking.phone}</a>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2.5 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <Mail className="h-4.5 w-4.5 text-royal-blue" />
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold">Email</p>
                      <a href={`mailto:${selectedBooking.email}`} className="text-sm font-semibold text-gray-950 hover:underline truncate block max-w-[150px]">{selectedBooking.email}</a>
                    </div>
                  </div>
                </div>

                {/* Stay dates and price */}
                <div className="border border-gray-100 p-4 rounded-xl space-y-3">
                  <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                    <span className="font-semibold text-gray-500">Room Booked:</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold border ${roomColors[selectedBooking.roomType] || 'bg-gray-100 border-gray-200'}`}>
                      {selectedBooking.roomType}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-400 font-semibold uppercase">Check-in:</span>
                      <p className="font-bold text-gray-900 bg-green-50 text-green-700 px-2 py-1 rounded text-center mt-1 border border-green-200">{formatDate(selectedBooking.checkIn)}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 font-semibold uppercase">Check-out:</span>
                      <p className="font-bold text-gray-900 bg-red-50 text-red-700 px-2 py-1 rounded text-center mt-1 border border-red-200">{formatDate(selectedBooking.checkOut)}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-2">
                    <span className="font-semibold text-gray-500">Est. Price:</span>
                    <span className="font-bold text-royal-blue text-lg">
                      ₹{getEstimatedPrice(selectedBooking).toLocaleString('en-IN')}{" "}
                      <span className="text-xs text-gray-400 font-normal">({getNights(selectedBooking.checkIn, selectedBooking.checkOut)} nights, {selectedBooking.guests} guests)</span>
                    </span>
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase mb-1.5 flex items-center"><MessageSquare className="h-3.5 w-3.5 mr-1" /> Special Requests</h4>
                  {selectedBooking.message ? (
                    <p className="text-sm bg-gray-50 p-3 rounded-lg border border-gray-100 italic">"{selectedBooking.message}"</p>
                  ) : (
                    <p className="text-sm text-gray-400 italic">No special requests.</p>
                  )}
                </div>

                {/* Status selector */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="font-semibold text-sm">Reservation Status:</span>
                  <div className="relative">
                    <select
                      value={selectedBooking.status || "Pending"}
                      disabled={updatingId === selectedBooking._id}
                      onChange={(e) => handleStatusChange(selectedBooking._id, e.target.value)}
                      className={`px-4 py-2 rounded-lg border text-xs font-bold focus:outline-none focus:ring-1 focus:ring-royal-blue cursor-pointer appearance-none pr-10 ${
                        statusColors[selectedBooking.status || "Pending"]
                      } ${updatingId === selectedBooking._id ? 'opacity-50' : ''}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Checked-in">Checked-in</option>
                      <option value="Checked-out">Checked-out</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    {updatingId === selectedBooking._id ? (
                      <span className="absolute right-3 top-2.5 h-3.5 w-3.5 border-2 border-royal-blue border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span className="absolute right-4 top-3.5 pointer-events-none border-solid border-t-current border-t-4 border-r-transparent border-r-4 border-l-transparent border-l-4" />
                    )}
                  </div>
                </div>
              </div>

              {/* Actions footer */}
              <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-100">
                <button
                  onClick={() => handleDelete(selectedBooking._id, selectedBooking.name)}
                  disabled={deletingId === selectedBooking._id}
                  className="text-red-500 hover:text-red-700 text-sm font-semibold flex items-center disabled:opacity-40"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete Booking
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      sendWhatsApp(selectedBooking);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center space-x-1 shadow-sm transition-all"
                  >
                    <span>{selectedBooking.status === 'Checked-out' ? 'Ask for Review' : 'WhatsApp Conf.'}</span>
                  </button>
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 px-4 py-2 rounded-lg font-semibold text-xs transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
