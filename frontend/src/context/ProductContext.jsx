// src/context/ProductContext.jsx
import { createContext, useContext, useReducer, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const initialState = {
  products: [],
  loading: false,
  error: null,
  searchResults: [],
  categories: [],
  currentProduct: null,
};

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
      return { ...state, currentProduct: action.payload, loading: false, error: null };
    default:
      return state;
  }
};

const ProductContext = createContext();

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};

const apiRequest = async (url, options = {}) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const fullUrl = `${API_BASE_URL}${url}`;
  const response = await fetch(fullUrl, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ 
        message: `API request failed with status: ${response.status}` 
    }));
    throw new Error(errorData.message);
  }

  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return null;
  }

  return response.json();
};

export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);
  const toast = useToast();

  const handleError = useCallback((error, customMessage) => {
    const errorMessage = customMessage || error.message || 'An unexpected error occurred';
    dispatch({ type: actionTypes.SET_ERROR, payload: errorMessage });
    toast({
      title: 'Error',
      description: errorMessage,
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  }, [toast]);

  const handleSuccess = useCallback((message) => {
    toast({
      title: 'Success',
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
    dispatch({ type: actionTypes.SET_LOADING, payload: true });
    try {
      const data = await apiRequest('/products');
      dispatch({ type: actionTypes.SET_PRODUCTS, payload: data });
    } catch (error) {
      handleError(error, 'Failed to load products.');
    }
  }, [handleError]);

  const fetchProduct = useCallback(async (id) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: true });
    try {
      const data = await apiRequest(`/products/${id}`);
      dispatch({ type: actionTypes.SET_CURRENT_PRODUCT, payload: data });
      return data;
    } catch (error) {
      handleError(error, 'Failed to load product details.');
      return null;
    }
  }, [handleError]);

  const createProduct = useCallback(async (productData) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: true });
    try {
      const data = await apiRequest('/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      });
      dispatch({ type: actionTypes.ADD_PRODUCT, payload: data });
      handleSuccess('Product created successfully.');
      return data;
    } catch (error) {
      handleError(error, 'Failed to create product.');
      return null;
    }
  }, [handleError, handleSuccess]);

  const updateProduct = useCallback(async (id, productData) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: true });
    try {
      const data = await apiRequest(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
      });
      dispatch({ type: actionTypes.UPDATE_PRODUCT, payload: data });
      handleSuccess('Product updated successfully.');
      return data;
    } catch (error) {
      handleError(error, 'Failed to update product.');
      return null;
    }
  }, [handleError, handleSuccess]);

  const deleteProduct = useCallback(async (id) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: true });
    try {
      const responseData = await apiRequest(`/products/${id}`, {
        method: 'DELETE',
      });
      dispatch({ type: actionTypes.DELETE_PRODUCT, payload: responseData.id });
      handleSuccess('Product deleted successfully.');
      return true;
    } catch (error) {
      handleError(error, 'Failed to delete product.');
      return false;
    }
  }, [handleError, handleSuccess]);

  const searchProducts = useCallback(async (query) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: true });
    try {
      const data = await apiRequest(`/products/search?q=${encodeURIComponent(query)}`);
      dispatch({ type: actionTypes.SET_SEARCH_RESULTS, payload: data });
      return data;
    } catch (error) {
      handleError(error, 'An error occurred during search.');
      dispatch({ type: actionTypes.SET_SEARCH_RESULTS, payload: [] });
      return [];
    }
  }, [handleError]);

  const fetchCategories = useCallback(async () => {
    dispatch({ type: actionTypes.SET_LOADING, payload: true });
    try {
      const data = await apiRequest('/categories');
      dispatch({ type: actionTypes.SET_CATEGORIES, payload: data });
      return data;
    } catch (error) {
      handleError(error, 'Failed to load categories.');
      return [];
    }
  }, [handleError]);

  const filterByCategory = useCallback(async (categoryId) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: true });
    try {
      const data = await apiRequest(`/products/category/${categoryId}`);
      dispatch({ type: actionTypes.SET_PRODUCTS, payload: data });
      return data;
    } catch (error) {
      handleError(error, 'Failed to filter by category.');
      return [];
    }
  }, [handleError]);
  
  const getProductsByPriceRange = useCallback(async (minPrice, maxPrice) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: true });
    try {
      const data = await apiRequest(`/products/price-range?min=${minPrice}&max=${maxPrice}`);
      dispatch({ type: actionTypes.SET_PRODUCTS, payload: data });
      return data;
    } catch (error) {
      handleError(error, 'Failed to filter by price range.');
      return [];
    }
  }, [handleError]);

  const updateProductStock = useCallback(async (id, newStock) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: true });
    try {
      const data = await apiRequest(`/products/${id}/stock`, {
        method: 'PATCH',
        body: JSON.stringify({ stock: newStock }),
      });
      dispatch({ type: actionTypes.UPDATE_PRODUCT, payload: data });
      handleSuccess('Stock updated successfully.');
      return data;
    } catch (error) {
      handleError(error, 'Failed to update stock.');
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