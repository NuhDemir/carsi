// src/App.jsx

import { Box, Container } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Navbar from "./components/Navbar.jsx";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import { ProductProvider } from "./context/ProductContext.jsx";

// Lazy loading ile performans optimizasyonu
const Home = lazy(() => import("./pages/Home.jsx"));
const Create = lazy(() => import("./pages/Create.jsx"));
const Explore = lazy(() => import("./pages/Explore.jsx"));
const CategoryPage = lazy(() => import("./pages/Categories.jsx")); // Eski 'Categories' yerine yeni sayfa
const ProductDetail = lazy(() => import("./pages/ProductDetail.jsx"));

// Suspense için bekleme ekranı bileşeni
const AppLoading = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minH="60vh"
  >
    <LoadingSpinner size="xl" />
  </Box>
);

// 404 Sayfa bulunamadı bileşeni
const NotFoundPage = () => {
  const bg = { base: "white", _dark: { bg: "gray.800" } };
  const textColor = { base: "gray.800", _dark: { color: "white" } };
  
  return (
    <Box
      textAlign="center"
      py={20}
      px={6}
      bg={bg}
      color={textColor}
      borderRadius="xl"
      boxShadow="xl"
      mx="auto"
      maxW="md"
    >
      <Box fontSize="6xl" mb={4}>
        🔍
      </Box>
      <Box fontSize="3xl" fontWeight="bold" mb={2}>
        404
      </Box>
      <Box fontSize="xl" color="gray.500" mb={6}>
        Aradığınız sayfa bulunamadı
      </Box>
      <Box
        as="button"
        onClick={() => window.history.back()}
        px={6}
        py={3}
        bg="teal.500"
        color="white"
        borderRadius="lg"
        fontWeight="medium"
        transition="all 0.2s"
        _hover={{
          bg: "teal.600",
          transform: "translateY(-2px)",
          boxShadow: "lg"
        }}
        _active={{
          transform: "translateY(0)"
        }}
      >
        Geri Dön
      </Box>
    </Box>
  );
};

function App() {
  const appBg = { base: "gray.50", _dark: { bg: "gray.900" } };

  // Hata durumunda gösterilecek yedek bileşen
  const ErrorFallback = ({ error, resetErrorBoundary }) => {
    const bg = { base: "white", _dark: { bg: "gray.800" } };
    const textColor = { base: "gray.800", _dark: { color: "white" } };
    
    return (
      <Box
        textAlign="center"
        py={20}
        px={6}
        role="alert"
        bg={bg}
        color={textColor}
        borderRadius="xl"
        boxShadow="xl"
        mx="auto"
        maxW="md"
        mt={10}
      >
        <Box fontSize="6xl" mb={4}>
          😵
        </Box>
        <Box fontSize="2xl" fontWeight="bold" mb={2}>
          Oops! Bir şeyler ters gitti
        </Box>
        <Box fontSize="lg" color="gray.500" mb={6}>
          {error.message || "Beklenmedik bir hata oluştu"}
        </Box>
        <Box
          as="button"
          onClick={resetErrorBoundary}
          px={6}
          py={3}
          bg="teal.500"
          color="white"
          borderRadius="lg"
          fontWeight="medium"
          transition="all 0.2s"
          _hover={{
            bg: "teal.600",
            transform: "translateY(-2px)",
            boxShadow: "lg"
          }}
          _active={{
            transform: "translateY(0)"
          }}
        >
          Tekrar Dene
        </Box>
      </Box>
    );
  };
  
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        window.location.reload();
      }}
    >
      <ProductProvider>
        <Box minH="100vh" bg={appBg} transition="background-color 0.2s">
          <Navbar />
          
          <Container maxW="container.xl" py={8}>
            <Suspense fallback={<AppLoading />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create" element={<Create />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/category/:categoryId" element={<CategoryPage />} />
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