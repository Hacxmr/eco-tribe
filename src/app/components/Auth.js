"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SignIn, SignUp, UserButton } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";

export default function Auth({ isLogin: initialIsLogin, onClose }) {
  const [isLogin, setIsLogin] = useState(initialIsLogin);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          isLogin
        }),
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      
      if (data.success) {
        onClose();
        router.push('/chat');
      } else {
        throw new Error(data.message || 'Authentication failed');
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        {isLogin ? 'Login' : 'Sign Up'}
      </h2>
      <div className="flex space-x-4 mb-6 border-b">
        <button
          className={`pb-2 px-4 ${isLogin ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button
          className={`pb-2 px-4 ${!isLogin ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setIsLogin(false)}
        >
          Sign Up
        </button>
      </div>
      <form onSubmit={handleAuth} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
        >
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}

export function SignInButton() {
  return <SignIn />;
}

export function SignUpButton() {
  return <SignUp />;
}

export function UserProfileButton() {
  const { isSignedIn } = useAuth();
  
  if (!isSignedIn) {
    return null;
  }
  
  return <UserButton afterSignOutUrl="/" />;
}