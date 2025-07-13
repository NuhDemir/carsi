// src/App.jsx

import { Box, Container } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Navbar from "./components/layout/Navbar.jsx"; // Doğru import
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import { ProductProvider } from "./context/ProductContext.jsx";

// Lazy loading ile performans optimizasyonu (Uzantıları eklemeyi unutmayın!)
const Home = lazy(() => import("./pages/Home.jsx"));
const Create = lazy(() => import("./pages/Create.jsx"));
const Explore = lazy(() => import("./pages/Explore.jsx"));
const Categories = lazy(() => import("./pages/Categories.jsx")); // İsmi Categories olarak değiştirdik.
const ProductDetail = lazy(() => import("./pages/ProductDetail.jsx"));

// Suspense için bekleme ekranı bileşeni
const PageLoader = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minH="70vh">
    <LoadingSpinner text="Sayfa Yükleniyor..." />
  </Box>
);

// 404 Sayfa bulunamadı bileşeni (Daha sade bir tasarım)
const NotFoundPage = () => (
  <VStack spacing={4} justify="center" minH="70vh" textAlign="center">
    <Heading size="2xl">404</Heading>
    <Text fontSize="xl" color={{ base: "gray.600", _dark: "gray.400" }}>
      Aradığınız sayfa bulunamadı.
    </Text>
    <Button as={RouterLink} to="/" colorScheme="blue">
      Ana Sayfaya Dön
    </Button>
  </VStack>
);

// Hata durumunda gösterilecek yedek bileşen
const ErrorFallback = ({ error, resetErrorBoundary }) => (
    <VStack role="alert" spacing={4} justify="center" minH="70vh" textAlign="center" p={4}>
      <Heading size="lg">Bir şeyler ters gitti!</Heading>
      <Text color="red.500">{error.message}</Text>
      <Button onClick={resetErrorBoundary} colorScheme="blue">
        Tekrar Dene
      </Button>
    </VStack>
);

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <ProductProvider>
        <Box 
          minH="100vh" 
          // DEĞİŞİKLİK: Yeni arka plan rengi
          bg={{ base: "gray.50", _dark: "gray.900" }} 
          transition="background-color 0.2s"
        >
          <Navbar />
          <Container as="main" maxW="container.xl" py={{ base: 6, md: 8 }}>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create" element={<Create />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/categories" element={<Categories />} />
                {/* DEĞİŞİKLİK: Kategoriye özel sayfa rotası */}
                <Route path="/category/:categoryId" element={<Home />} /> {/* Şimdilik Home'u göstersin, ileride filtrelenmiş bir sayfa olabilir */}
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </Container>
        </Box>
      </ProductProvider>
    </ErrorBoundary>
  );
}

export default App;