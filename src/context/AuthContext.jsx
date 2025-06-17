import { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { auth, database } from '../firebase/config';

const AuthContext = createContext();

// Helper function to check network connectivity
const checkConnectivity = () => {
  return new Promise((resolve) => {
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      // Try to fetch a small resource to verify real connectivity
      fetch('https://www.google.com/favicon.ico', {
        mode: 'no-cors',
      })
        .then(() => resolve(true))
        .catch(() => resolve(false));
    } else {
      resolve(false);
    }
  });
};

// Helper function to delay execution
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to handle retry logic with progressive delays
const retryOperation = async (operation, maxAttempts = 5, initialDelayMs = 1000) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      // Check connectivity before each attempt
      const isOnline = await checkConnectivity();
      if (!isOnline) {
        throw new Error('No internet connection available');
      }

      return await operation();
    } catch (error) {
      lastError = error;
      
      // Check if error is retryable
      const isRetryableError = 
        error.code === 'auth/visibility-check-was-unavailable' ||
        error.code === 'auth/network-request-failed' ||
        error.message?.includes('503') ||
        error.message?.includes('No internet connection available');
      
      if (isRetryableError && attempt < maxAttempts) {
        const delayMs = Math.min(initialDelayMs * Math.pow(2, attempt - 1), 10000); // Cap at 10 seconds
        console.log(`Retry attempt ${attempt}/${maxAttempts} after ${delayMs}ms`);
        await delay(delayMs);
        continue;
      }
      
      throw error;
    }
  }
  
  throw lastError;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // Get user role from Realtime Database
          const userRef = ref(database, `users/${user.uid}`);
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            setUserRole(snapshot.val().role);
          }
          setCurrentUser(user);
        } else {
          setCurrentUser(null);
          setUserRole(null);
        }
        setError(null);
      } catch (err) {
        console.error('Auth state change error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const signup = async (email, password, name, role) => {
    try {
      // Wrap the signup operation in retry logic
      const userCredential = await retryOperation(async () => {
        try {
          // Create user in Firebase Auth
          const credential = await createUserWithEmailAndPassword(auth, email, password);
          
          // If we get here, the auth creation was successful
          try {
            // Update user profile with name
            await updateProfile(credential.user, {
              displayName: name
            });

            // Store additional user data in Realtime Database
            const userRef = ref(database, `users/${credential.user.uid}`);
            await set(userRef, {
              name,
              email,
              role,
              createdAt: new Date().toISOString()
            });
          } catch (profileError) {
            // If profile update fails, delete the created user to maintain consistency
            await credential.user.delete();
            throw profileError;
          }

          return credential;
        } catch (error) {
          if (error.code === 'auth/visibility-check-was-unavailable') {
            // Force reload the auth instance before retrying
            await auth.updateCurrentUser(null);
          }
          throw error;
        }
      }, 5, 1000); // 5 attempts, starting with 1s delay

      return userCredential.user;
    } catch (error) {
      // Enhanced error messages
      if (error.code === 'auth/visibility-check-was-unavailable') {
        error.message = 'Firebase service is temporarily unavailable. We tried multiple times but could not connect. Please try again in a few moments.';
      } else if (error.code === 'auth/network-request-failed') {
        error.message = 'Network connection is unstable. Please check your internet connection and try again.';
      } else if (!error.code && error.message?.includes('No internet connection available')) {
        error.message = 'No internet connection available. Please check your network connection and try again.';
      }
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };

  const value = {
    currentUser,
    userRole,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 