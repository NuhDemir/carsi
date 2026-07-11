import { useEffect, useState } from "react";
import {
  Box,
  Text,
  Alert,
  AlertIcon,
  Container,
  VStack,
} from "@chakra-ui/react";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import Hero from "../components/home/Hero.jsx";
import TrustBar from "../components/home/TrustBar.jsx";
import CategoryShowcase from "../components/home/CategoryShowcase.jsx";
import ProductStrip from "../components/home/ProductStrip.jsx";

let API_BASE = import.meta.env.VITE_API_URL || "";
// Normalize common misconfigurations: if empty use '/api',
// if starts with ':' (e.g. ':5000/api') prefix with current hostname and protocol.
if (!API_BASE) {
  API_BASE = "/api";
} else if (API_BASE.startsWith(":")) {
  const proto = window.location.protocol;
  const host = window.location.hostname; // excludes port
  API_BASE = `${proto}//${host}${API_BASE}`;
}

const Home = () => {
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHome = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/home`);
        if (!res.ok) throw new Error("Ana sayfa verisi alınamadı");
        const json = await res.json();
        setHomeData(json.data || json);
      } catch (err) {
        setError(err.message || "Bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };
    fetchHome();
  }, []);

  if (loading) return <LoadingSpinner text="Ana sayfa yükleniyor..." />;
  if (error)
    return (
      <Alert status="error" borderRadius="lg">
        <AlertIcon />
        <Text>{error}</Text>
      </Alert>
    );

  if (!homeData)
    return (
      <Container py={12}>
        <Text>Gösterilecek içerik bulunamadı.</Text>
      </Container>
    );

  return (
    <Box
      pb={{ base: "80px", md: 8 }}
      sx={{
        // Hide scrollbar for product strips
        ".product-strip-container": {
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE and Edge
          "&::-webkit-scrollbar": {
            display: "none", // Chrome, Safari and Opera
          },
        },
      }}
    >
      <Hero campaign={homeData.hero} />

      <Container maxW="container.xl" px={{ base: 4, md: 6 }}>
        <VStack spacing={{ base: 8, md: 12 }} align="stretch">
          {/* Trust Signals */}
          <TrustBar items={homeData.trustSignals} />

          {/* Featured Categories */}
          <CategoryShowcase categories={homeData.featuredCategories} />

          {/* Bestsellers */}
          <ProductStrip
            title="Çok Satanlar"
            products={homeData.bestsellers}
            hideScrollbar
          />

          {/* Daily Deals */}
          <ProductStrip
            title="Günün Fırsatları"
            products={homeData.deals?.map((d) => d.product) || []}
            showCountdown
            productsDeals={homeData.deals}
            hideScrollbar
          />

          {/* New Arrivals */}
          <ProductStrip
            title="Yeni Gelenler"
            products={homeData.newArrivals}
            hideScrollbar
          />
        </VStack>
      </Container>

      {/* Spacer for mobile bottom nav */}
      <Box h={{ base: 4, md: 8 }} />
    </Box>
  );
};

export default Home;
