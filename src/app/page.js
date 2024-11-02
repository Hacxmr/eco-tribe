'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Auth from './components/Auth';
import PopupChat from './components/PopupChat';
// import { auth } from './utils/firebase';

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white bg-opacity-90 rounded-2xl p-8 h-full flex flex-col items-center transition-transform duration-300 ease-in-out hover:transform hover:-translate-y-2 hover:shadow-lg">
    <div className="bg-blue-900 rounded-full p-4 mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-blue-400 mb-2 text-center">
      {title}
    </h3>
    <p className="text-gray-600 text-center flex-grow">
      {description}
    </p>
  </div>
);

export default function LandingPage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [medFriendOpen, setMedFriendOpen] = useState(false);
  const [user, setUser ] = useState(null);
  const router = useRouter();

  const handleAuthOpen = (loginMode) => {
    setIsLogin(loginMode);
    setAuthOpen(true);
  };

  const handleAuthClose = () => setAuthOpen(false);
  const handleTryMedFriend = () => setMedFriendOpen(true);
  const handleCloseMedFriend = () => setMedFriendOpen(false);

  const handleEnterChatRoom = () => {
    if (user) {
      router.push('/chat');
    } else {
      handleAuthOpen(true);
    }
  };

  return (
    <div className="font-sans">
      <header className="fixed w-full bg-transparent backdrop-blur-lg p-4 flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-blue-900 mr-2">❤️</span>
          <h1 className="text-xl font-bold text-white">ECOVIBE TRIBE</h1>
        </div>
        <div>
          <button onClick={() => handleAuthOpen(true)} className="mr-2 text-green-500">Login</button>
          <button onClick={() => handleAuthOpen(false)} className="bg-green-500 text-white px-4 py-2 rounded">Sign Up</button>
        </div>
      </header>

      <main className="relative min-h-screen flex flex-col justify-center items-center text-white text-center pt-16 bg-cover bg-center" style={{ backgroundImage: 'url("/images/Health_friend.png")' }}>
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 bg-white bg-opacity-90 backdrop-blur-lg rounded-2xl p-8 shadow-lg">
          <h2 className="text-4xl font-bold text-blue-500">Your Friendly Styling Companion</h2>
          <p className="text-lg text-gray-800 mb-4">Get caring, reliable health advice anytime, anywhere</p>
          <div className="flex justify-center mt-4 gap-2">
            <button onClick={handleTryMedFriend} className="bg-blue-500 text-white px-6 py-3 rounded-lg flex items-center">
              <span className="mr-2">💬</span> Try Eco-Tribe
            </button>
            <button onClick={handleEnterChatRoom} className="border border-white-500 bg-blue-500 text-white-500 px-6 py-3 rounded-lg">
              Enter Chat
            </button>
          </div>
        </div>
      </main>

      <section className="py-12 bg-gradient-to-r from-green-100 to-green-200">
        <h2 className="text-4xl font-bold text-blue-500 text-center mb-8">Why Choose Eco-Vibe Tribe?</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <div className="flex-1 max-w-xs">
            <FeatureCard
              icon={<span className="text-white text-5xl">💬</span>}
              title="Friendly Conversations"
              description="Engage in warm, understanding chats about your health concerns with our AI companion."
            />
          </div>
        </div>
      </section>

      {authOpen && <Auth isLogin={isLogin} onClose={handleAuthClose} setUser={setUser} />}
      {medFriendOpen && <PopupChat onClose={handleCloseMedFriend} />}
    </div>
  );
}