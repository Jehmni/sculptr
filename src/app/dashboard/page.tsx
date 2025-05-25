'use client';

import { useUser } from '@/lib/user-context';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Logo from '@/components/Logo';

export default function Dashboard() {
  const { user, signOut } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      router.push('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
      setMessage('Error signing out. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null; // ProtectedRoute will handle redirect
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 w-full">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8 mt-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Logo size={32} showText={false} />
            <h1 className="text-2xl font-bold text-gray-800 ml-2">Dashboard</h1>
          </div>
          <button
            onClick={handleSignOut}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isLoading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
            }`}
          >
            {isLoading ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>

        {message && (
          <div className="p-3 mb-4 rounded-lg bg-red-100 text-red-800">
            {message}
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Your Profile</h2>
          <div className="space-y-2">
            <p className="text-gray-600">
              <span className="font-medium">Email:</span> {user.email}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">User ID:</span> {user.id}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Last Sign In:</span>{' '}
              {new Date(user.last_sign_in_at || '').toLocaleString()}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-blue-700 mb-4">Projects</h2>
            <p className="text-blue-600 mb-4">
              You have no projects yet. Start creating your 3D designs today!
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              New Project
            </button>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-purple-700 mb-4">Account Settings</h2>
            <ul className="space-y-2">
              <li>
                <button className="text-purple-600 hover:text-purple-800 transition-colors">
                  Edit Profile
                </button>
              </li>
              <li>
                <button className="text-purple-600 hover:text-purple-800 transition-colors">
                  Change Password
                </button>
              </li>
              <li>
                <button className="text-purple-600 hover:text-purple-800 transition-colors">
                  Notification Settings
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
