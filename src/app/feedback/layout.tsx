import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rate Your Stay | Krishna Hotel Ambedkar Nagar",
  description: "Stayed at Krishna Hotel on the Ayodhya-Akbarpur Road? Share your feedback with us.",
  alternates: { canonical: "/feedback" },
};

export default function FeedbackLayout({ children }: { children: React.ReactNode }) {
  return children;
}
