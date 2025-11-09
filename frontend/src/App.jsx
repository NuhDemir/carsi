// src/App.jsx

import { Box, Container } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { VStack, Heading, Text, Button } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import Navbar from "./components/layout/Navbar.jsx"; // Doğru import
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import { ProductProvider } from "./context/ProductContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

// Lazy loading ile performans optimizasyonu (Uzantıları eklemeyi unutmayın!)
const Home = lazy(() => import("./pages/Home.jsx"));
const Create = lazy(() => import("./pages/Create.jsx"));
const Explore = lazy(() => import("./pages/Explore.jsx"));
const Categories = lazy(() => import("./pages/Categories.jsx")); // İsmi Categories olarak değiştirdik.
const ProductDetail = lazy(() => import("./pages/ProductDetail.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const Orders = lazy(() => import("./pages/Orders.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const Blog = lazy(() => import("./pages/Blog.jsx"));
const FAQ = lazy(() => import("./pages/FAQ.jsx"));
const Footer = lazy(() => import("./components/layout/Footer.jsx"));

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
  <VStack
    role="alert"
    spacing={4}
    justify="center"
    minH="70vh"
    textAlign="center"
    p={4}
  >
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
      <AuthProvider>
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
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/faq" element={<FAQ />} />
                  {/* DEĞİŞİKLİK: Kategoriye özel sayfa rotası */}
                  <Route path="/category/:categoryId" element={<Home />} />{" "}
                  {/* Şimdilik Home'u göstersin, ileride filtrelenmiş bir sayfa olabilir */}
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </Container>
            {/* Footer */}
            <Suspense fallback={null}>
              <Footer />
            </Suspense>
          </Box>
        </ProductProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
