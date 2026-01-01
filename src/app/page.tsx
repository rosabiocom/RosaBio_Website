import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Technology } from "@/components/sections/Technology";
import { Applications } from "@/components/sections/Applications";
import { About } from "@/components/sections/About";
import { Leadership } from "@/components/sections/Leadership";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Technology />
        <Applications />
        <About />
        <Leadership />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
