import { Contact } from "@/models/Contact";
import { getSettings } from "@/lib/settings";

// How many rooms of a type are still free for the given dates (YYYY-MM-DD strings).
// A booking holds a room while it is Pending, Confirmed or Checked-in.
export async function getAvailability(roomType: string, checkIn: string, checkOut: string) {
  const { inventory } = await getSettings();
  const total = inventory[roomType];
  if (total === undefined) return null;

  const bookedCount = await Contact.countDocuments({
    roomType,
    status: { $nin: ["Cancelled", "Checked-out"] },
    checkIn: { $lt: checkOut },
    checkOut: { $gt: checkIn },
  });
  const remaining = Math.max(0, total - bookedCount);
  return { available: remaining > 0, remaining, total, bookedCount };
}
