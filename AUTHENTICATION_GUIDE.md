# Admin Authentication Implementation Guide

## Current State
Your application has a simple toggle button that switches between Student and Admin views, but **there is no authentication**. Anyone can access admin features.

## Solutions

### Option 1: Simple Password Protection (Quick, Not Recommended for Production)

This adds a password prompt but is **not secure** because the password is visible in your source code.

#### Changes needed:

**`src/App.jsx`**
```javascript
// Add at the top of the App component
const [isAuthenticated, setIsAuthenticated] = useState(() => {
  return localStorage.getItem('adminAuth') === 'true';
});

const handleAdminLogin = () => {
  const password = prompt('Enter admin password:');
  const ADMIN_PASSWORD = 'your-secure-password'; // Change this!
  
  if (password === ADMIN_PASSWORD) {
    setIsAuthenticated(true);
    localStorage.setItem('adminAuth', 'true');
    setIsStudentMode(false);
  } else {
    alert('Incorrect password!');
  }
};

const handleLogout = () => {
  setIsAuthenticated(false);
  localStorage.removeItem('adminAuth');
  setIsStudentMode(true);
};
```

**Update the Header component to use authentication**
```javascript
<Header 
  isStudentMode={isStudentMode} 
  onToggleMode={isAuthenticated ? () => setIsStudentMode(!isStudentMode) : handleAdminLogin}
  isAuthenticated={isAuthenticated}
  onLogout={handleLogout}
  // ... rest of props
/>
```

> [!WARNING]
> This is NOT truly secure! The password is in your JavaScript code, which anyone can read. Use this only for:
> - Testing
> - Personal projects
> - Demonstrationspurposes

---

### Option 2: Firebase Authentication (Recommended)

This is a **proper authentication system** with secure login.

#### Step 1: Set up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Create Firestore Database
5. Copy your Firebase config

#### Step 2: Install Firebase

```bash
npm install firebase
```

#### Step 3: Create Firebase configuration

**`src/config/firebase.js`**
```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

#### Step 4: Create Authentication Context

**`src/context/AuthContext.jsx`**
```javascript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../config/firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    logout,
    isAdmin: !!currentUser // If logged in, they're admin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
```

#### Step 5: Create Login Component

**`src/components/Login.jsx`**
```javascript
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
    } catch (err) {
      setError('Failed to log in: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <LogIn size={48} />
          <h2>Admin Login</h2>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
```

#### Step 6: Update main.jsx

**`src/main.jsx`**
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);
```

#### Step 7: Update App.jsx

**`src/App.jsx`**
```javascript
import { useAuth } from './context/AuthContext';
import Login from './components/Login';

function App() {
  const { currentUser, isAdmin, logout } = useAuth();
  
  // If not logged in, show login page
  if (!currentUser) {
    return <Login />;
  }
  
  // Rest of your existing App code...
  // Remove the isStudentMode toggle and just show admin view
  // Or keep it but only show if isAdmin is true
  
  return (
    <div className="app-container">
      <Header 
        isAdmin={isAdmin}
        onLogout={logout}
        // ... rest of props
      />
      {/* Rest of your app */}
    </div>
  );
}
```

#### Step 8: Migrate Data to Firestore

Instead of storing resources in localStorage, store them in Firestore:

**`src/hooks/useResources.js`**
```javascript
import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

export const useResources = () => {
  const [resources, setResources] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'resources'),
      (snapshot) => {
        const data = {};
        snapshot.forEach((doc) => {
          data[doc.id] = doc.data();
        });
        setResources(data);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const addResource = async (standardId, board, type, folderData) => {
    // Implementation to add to Firestore
  };

  return { resources, loading, addResource };
};
```

#### Step 9: Create Admin User

Use Firebase Console to create your first admin user, or add this temporary registration code:

```javascript
// Temporary - remove after creating admin account
import { createUserWithEmailAndPassword } from 'firebase/auth';

const createAdmin = async () => {
  try {
    await createUserWithEmailAndPassword(auth, 'admin@example.com', 'your-password');
    console.log('Admin created!');
  } catch (error) {
    console.error('Error creating admin:', error);
  }
};
```

---

## Summary

| Solution | Security | Effort | Best For |
|----------|----------|--------|----------|
| Password Prompt | ⚠️ Low | 5 min | Testing only |
| Firebase Auth | ✅ High | 2-3 hours | Production use |

## Next Steps

1. **For quick deployment**: Use current version, understand it's not secure
2. **For production**: Implement Firebase authentication
3. **Deploy**: Use Vercel or Netlify

Would you like me to implement one of these solutions for you?
