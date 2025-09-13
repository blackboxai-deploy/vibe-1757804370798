'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { useAuth } from '@/contexts/AuthContext';
import { APP_NAME } from '@/lib/constants';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !isLoading) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if user is authenticated (will redirect)
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {APP_NAME}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Connect, chat, and collaborate in real-time
        </p>
      </div>

      {/* Form Container */}
      <div className="w-full max-w-md">
        {isLogin ? (
          <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
        ) : (
          <SignupForm onSwitchToLogin={() => setIsLogin(true)} />
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p className="mb-2">
          Demo credentials: demo@example.com / password123
        </p>
        <p>
          Or create an account with any email and password (minimum 6 characters)
        </p>
      </div>

      {/* Features Preview */}
      <div className="mt-12 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="p-4">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">💬</span>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Real-time Chat</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Instant messaging with live updates and notifications
          </p>
        </div>
        
        <div className="p-4">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">👥</span>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Multiple Rooms</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Join different chat channels and create custom rooms
          </p>
        </div>
        
        <div className="p-4">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">📁</span>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">File Sharing</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Share images and files with emoji reactions
          </p>
        </div>
      </div>
    </div>
  );
}