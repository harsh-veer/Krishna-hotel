"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Trash2, Phone, MessageCircle, AlertTriangle } from "lucide-react";
import { EVENT_STATUSES, eventSlotName, eventTypeName } from "@/lib/events";

interface EventItem {
  _id: string;
  name: string;
  phone: string;
  email: string;
  eventType: string;
  eventDate: string;
  slot: string;
  guests: number;
  message?: string;
  status: string;
  createdAt: string;
}

const STATUS_STYLE: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Confirmed: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
  Completed: "bg-gray-200 text-gray-700",
};

export default function AdminEvents({
  adminFetch,
  onPendingCount,
}: {
  adminFetch: (url: string, init?: RequestInit) => Promise<Response>;
  onPendingCount?: (n: number) => void;
}) {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("All");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    try {
      const res = await adminFetch("/api/admin/events");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setEvents(data.events || []);
      onPendingCount?.((data.events || []).filter((e: EventItem) => e.status === "Pending").length);
    } catch {
      toast.error("Could not load event requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setStatus = async (ev: EventItem, status: string) => {
    if (status === ev.status) return;
    if ((status === "Confirmed" || status === "Cancelled") && !confirm(`Mark as ${status}? The guest will get an email.`)) return;
    setBusyId(ev._id);
    try {
      const res = await adminFetch(`/api/admin/events/${ev._id}`, { method: "PATCH", body: JSON.stringify({ status }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Update failed");
      toast.success(
        status === "Confirmed" || status === "Cancelled"
          ? data.emailSent ? `${status}. Email sent to the guest.` : `${status}. The email could not be sent.`
          : `Marked ${status}.`
      );
      await load();
    } catch (e: any) {
      toast.error(e.message || "Update failed");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (ev: EventItem) => {
    if (!confirm(`Delete the request from ${ev.name}? This cannot be undone.`)) return;
    setBusyId(ev._id);
    try {
      const res = await adminFetch(`/api/admin/events/${ev._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Deleted.");
      await load();
    } catch {
      toast.error("Could not delete.");
    } finally {
      setBusyId(null);
    }
  };

  // A date + slot that already has a confirmed event (full day clashes with any slot).
  const clash = (ev: EventItem) =>
    ev.status !== "Cancelled" && ev.status !== "Completed" &&
    events.some(
      (o) =>
        o._id !== ev._id &&
        o.status === "Confirmed" &&
        o.eventDate === ev.eventDate &&
        (o.slot === ev.slot || o.slot === "fullday" || ev.slot === "fullday")
    );

  const shown = events.filter((e) => filter === "All" || e.status === filter);
  const fmtDate = (d: string) =>
    new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-gray-900">Event &amp; Hall Requests</h2>
        <div className="flex flex-wrap gap-2">
          {["All", ...EVENT_STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${filter === s ? "bg-royal-blue text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="py-12 text-center text-gray-500">Loading…</p>
      ) : shown.length === 0 ? (
        <p className="rounded-2xl border border-gray-100 bg-white py-12 text-center text-gray-500">No event requests yet.</p>
      ) : (
        <div className="grid gap-4">
          {shown.map((ev) => {
            const wa = `https://wa.me/${ev.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
              `Hello ${ev.name}, this is Krishna Hotel about your ${eventTypeName(ev.eventType)} request for ${fmtDate(ev.eventDate)}.`
            )}`;
            return (
              <div key={ev._id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-heading text-lg font-bold text-gray-900">
                      {eventTypeName(ev.eventType)} · {fmtDate(ev.eventDate)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {eventSlotName(ev.slot)} · {ev.guests} guests
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLE[ev.status] || "bg-gray-100"}`}>{ev.status}</span>
                </div>

                {clash(ev) && (
                  <p className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                    <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                    Another event is already confirmed for this date and slot.
                  </p>
                )}

                <div className="mt-3 grid gap-1 text-sm text-gray-700 sm:grid-cols-2">
                  <p><span className="font-semibold">{ev.name}</span></p>
                  <p>{ev.email}</p>
                  <p>{ev.phone}</p>
                  <p className="text-gray-500">Received {new Date(ev.createdAt).toLocaleString("en-IN")}</p>
                </div>
                {ev.message && <p className="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-700">{ev.message}</p>}

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <select
                    value={ev.status}
                    disabled={busyId === ev._id}
                    onChange={(e) => setStatus(ev, e.target.value)}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                  >
                    {EVENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <a href={`tel:${ev.phone}`} className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200">
                    <Phone className="h-4 w-4" aria-hidden="true" /> Call
                  </a>
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-2 text-sm font-semibold text-green-700 hover:bg-green-100">
                    <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp
                  </a>
                  <button
                    onClick={() => remove(ev)}
                    disabled={busyId === ev._id}
                    className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
