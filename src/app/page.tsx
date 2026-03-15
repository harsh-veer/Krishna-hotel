import Hero from "@/components/Hero";
import About from "@/components/About";
import Rooms from "@/components/Rooms";
import Features from "@/components/Features";
import Reviews from "@/components/Reviews";
import Location from "@/components/Location";
import Gallery from "@/components/Gallery";
import Dining from "@/components/Dining";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Rooms />
      <Features />
      <Dining />
      <Gallery />
      <Reviews />
      <Location />
      <Contact />
    </main>
  );
}