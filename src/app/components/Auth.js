"use client";

import React, { useState } from 'react';
import { Button, TextField, Typography, Box, Tabs, Tab } from '@mui/material';
import { auth, googleProvider } from '../utils/firebase';
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function Auth({ isLogin: initialIsLogin, onClose }) {
  const [isLogin, setIsLogin] = useState(initialIsLogin);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      onClose();
      router.push('/chat');
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      onClose();
      router.push('/chat');
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        {isLogin ? 'Login' : 'Sign Up'}
      </Typography>
      <Tabs value={isLogin ? 0 : 1} onChange={(_, newValue) => setIsLogin(newValue === 0)} sx={{ mb: 2 }}>
        <Tab label="Login" />
        <Tab label="Sign Up" />
      </Tabs>
      <form onSubmit={handleAuth}>
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button fullWidth variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
          {isLogin ? 'Login' : 'Sign Up'}
        </Button>
      </form>
      <Button fullWidth variant="outlined" onClick={handleGoogleSignIn} sx={{ mt: 2 }}>
        {isLogin ? 'Sign in with Google' : 'Sign Up with Google'}
      </Button>
    </Box>
  );
}