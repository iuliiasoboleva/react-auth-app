import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { setUser, clearUser } from './store/userSlice';
import { RootState } from './store';
import { auth } from './firebaseConfig';
import Login from './components/Login';
import Registration from './components/Registration';
import Profile from './components/Profile';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    console.log('Setting up auth state change listener'); // Лог перед установкой слушателя состояния аутентификации
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User is signed in:', user.email); // Лог при наличии аутентифицированного пользователя
        dispatch(setUser(user.email!));
      } else {
        console.log('No user is signed in'); // Лог при отсутствии аутентифицированного пользователя
        dispatch(clearUser());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={user.loggedIn ? <Navigate to="/profile" /> : <Navigate to="/register" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/profile" element={user.loggedIn ? <Profile /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
