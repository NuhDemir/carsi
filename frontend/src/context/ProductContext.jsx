// src/context/ProductContext.jsx
import { createContext, useContext, useReducer, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';

// API Base URL (Vite'a uygun şekilde)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Initial state (currentProduct için null yerine {} daha güvenli olabilir)
const initialState = {
  products: [],
  loading: false,
  error: null,
  searchResults: [],
  categories: [],
  currentProduct: null,
};

// Action types
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_PRODUCTS: 'SET_PRODUCTS',
  ADD_PRODUCT: 'ADD_PRODUCT',
  UPDATE_PRODUCT: 'UPDATE_PRODUCT',
  DELETE_PRODUCT: 'DELETE_PRODUCT',
  SET_SEARCH_RESULTS: 'SET_SEARCH_RESULTS',
  SET_CATEGORIES: 'SET_CATEGORIES',
  SET_CURRENT_PRODUCT: 'SET_CURRENT_PRODUCT',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer
const productReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case actionTypes.CLEAR_ERROR:
      return { ...state, error: null };
    
    case actionTypes.SET_PRODUCTS:
      return { ...state, products: action.payload, loading: false, error: null };
    
    case actionTypes.ADD_PRODUCT:
      // Yeni eklenen ürünü listenin başına ekleyelim ki hemen görünsün
      return {
        ...state,
        products: [action.payload, ...state.products],
        loading: false,
        error: null,
      };
    
    case actionTypes.UPDATE_PRODUCT:
      return {
        ...state,
        products: state.products.map(product =>
          product._id === action.payload._id ? action.payload : product
        ),
        currentProduct: state.currentProduct?._id === action.payload._id ? action.payload : state.currentProduct,
        loading: false,
        error: null,
      };
    
    case actionTypes.DELETE_PRODUCT:
      return {
        ...state,
        products: state.products.filter(product => product._id !== action.payload),
        loading: false,
        error: null,
      };
    
    case actionTypes.SET_SEARCH_RESULTS:
      return { ...state, searchResults: action.payload, loading: false };
    
    case actionTypes.SET_CATEGORIES:
      return { ...state, categories: action.payload, loading: false };
    
    case actionTypes.SET_CURRENT_PRODUCT:
        // Yükleme bitince currentProduct'ı set et
      return { ...state, currentProduct: action.payload, loading: false, error: null };
    
    default:
      return state;
  }
};

// Create context
const ProductContext = createContext();

// Custom hook
export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};

// API helper function
const apiRequest = async (url, options = {}) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };
  
  const response = await fetch(`${API_BASE_URL}${url}`, config);
  
  if (!response.ok) {
    // API'dan gelen hata mesajını yakalamak için response.json() kullanılır
    const errorData = await response.json();
    throw new Error(errorData.message || `API isteği başarısız oldu. Durum: ${response.status}`);
  }

  // DELETE gibi bazı istekler boş cevap dönebilir.
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return null; 
  }

  const data = await response.json();
  return data;
};

// Provider component
export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);
  const toast = useToast();

  const handleError = useCallback((error, customMessage) => {
    const errorMessage = customMessage || error.message || 'Bir hata oluştu';
    dispatch({ type: actionTypes.SET_ERROR, payload: errorMessage });
    
    toast({
      title: 'Hata',
      description: errorMessage,
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  }, [toast]);

  const handleSuccess = useCallback((message) => {
    toast({
      title: 'Başarılı',
      description: message,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  }, [toast]);

  const clearError = useCallback(() => {
    dispatch({ type: actionTypes.CLEAR_ERROR });
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      const data = await apiRequest('/products');
      dispatch({ type: actionTypes.SET_PRODUCTS, payload: data });
    } catch (error) {
      handleError(error, 'Ürünler yüklenirken bir hata oluştu.');
    }
  }, [handleError]);

  const fetchProduct = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      const data = await apiRequest(`/products/${id}`);
      dispatch({ type: actionTypes.SET_CURRENT_PRODUCT, payload: data });
      return data;
    } catch (error) {
      handleError(error, 'Ürün detayı yüklenirken bir hata oluştu.');
      return null;
    }
  }, [handleError]);

  const createProduct = useCallback(async (productData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      // productData artık name, price, image, description, category, stock içermeli
      const data = await apiRequest('/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      });
      dispatch({ type: actionTypes.ADD_PRODUCT, payload: data });
      handleSuccess('Ürün başarıyla oluşturuldu.');
      return data;
    } catch (error) {
      handleError(error, 'Ürün oluşturulurken bir hata oluştu.');
      return null;
    }
  }, [handleError, handleSuccess]);

  const updateProduct = useCallback(async (id, productData) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      const data = await apiRequest(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
      });
      dispatch({ type: actionTypes.UPDATE_PRODUCT, payload: data });
      handleSuccess('Ürün başarıyla güncellendi.');
      return data;
    } catch (error) {
      handleError(error, 'Ürün güncellenirken bir hata oluştu.');
      return null;
    }
  }, [handleError, handleSuccess]);

  const deleteProduct = useCallback(async (id) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      // Backend artık { id: '...' } gibi bir obje dönüyor
      const responseData = await apiRequest(`/products/${id}`, {
        method: 'DELETE',
      });
      dispatch({ type: actionTypes.DELETE_PRODUCT, payload: responseData.id });
      handleSuccess('Ürün başarıyla silindi.');
      return true;
    } catch (error) {
      handleError(error, 'Ürün silinirken bir hata oluştu.');
      return false;
    }
  }, [handleError, handleSuccess]);

  const searchProducts = useCallback(async (query) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      const data = await apiRequest(`/products/search?q=${encodeURIComponent(query)}`);
      dispatch({ type: actionTypes.SET_SEARCH_RESULTS, payload: data });
      return data;
    } catch (error) {
      handleError(error, 'Arama sırasında bir hata oluştu.');
      dispatch({ type: actionTypes.SET_SEARCH_RESULTS, payload: [] }); // Hata durumunda sonuçları temizle
      return [];
    }
  }, [handleError]);

  const fetchCategories = useCallback(async () => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      const data = await apiRequest('/categories');
      dispatch({ type: actionTypes.SET_CATEGORIES, payload: data });
      return data;
    } catch (error) {
      handleError(error, 'Kategoriler yüklenirken bir hata oluştu.');
      return [];
    }
  }, [handleError]);

  const filterByCategory = useCallback(async (categoryId) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      const data = await apiRequest(`/products/category/${categoryId}`);
      dispatch({ type: actionTypes.SET_PRODUCTS, payload: data });
      return data;
    } catch (error) {
      handleError(error, 'Kategoriye göre filtreleme sırasında bir hata oluştu.');
      return [];
    }
  }, [handleError]);

  const getProductsByPriceRange = useCallback(async (minPrice, maxPrice) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      const data = await apiRequest(`/products/price-range?min=${minPrice}&max=${maxPrice}`);
      dispatch({ type: actionTypes.SET_PRODUCTS, payload: data });
      return data;
    } catch (error) {
      handleError(error, 'Fiyat aralığına göre filtreleme sırasında bir hata oluştu.');
      return [];
    }
  }, [handleError]);

  const updateProductStock = useCallback(async (id, newStock) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      const data = await apiRequest(`/products/${id}/stock`, {
        method: 'PATCH',
        body: JSON.stringify({ stock: newStock }),
      });
      dispatch({ type: actionTypes.UPDATE_PRODUCT, payload: data });
      handleSuccess('Stok başarıyla güncellendi.');
      return data;
    } catch (error) {
      handleError(error, 'Stok güncellenirken bir hata oluştu.');
      return null;
    }
  }, [handleError, handleSuccess]);

  const setCurrentProduct = useCallback((product) => {
    dispatch({ type: actionTypes.SET_CURRENT_PRODUCT, payload: product });
  }, []);

  const contextValue = {
    ...state,
    fetchProducts,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    fetchCategories,
    filterByCategory,
    getProductsByPriceRange,
    updateProductStock,
    setCurrentProduct,
    clearError,
  };

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
};