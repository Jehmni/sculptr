'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import Button from '@/components/Button';

type TestStatus = 'pending' | 'running' | 'success' | 'failed';

interface TestResult {
  name: string;
  status: TestStatus;
  message?: string;
}

export default function TestPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testPassword, setTestPassword] = useState('password123');

  const addResult = (name: string, status: TestStatus, message?: string) => {
    setResults(prev => [...prev, { name, status, message }]);
  };

  const updateResult = (index: number, status: TestStatus, message?: string) => {
    setResults(prev => {
      const newResults = [...prev];
      newResults[index] = { ...newResults[index], status, message };
      return newResults;
    });
  };

  const runTests = async () => {
    setResults([]);
    setIsRunning(true);

    // Test 1: Check if Supabase is accessible
    addResult('Check Supabase Connection', 'running');
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        updateResult(0, 'failed', `Error: ${error.message}`);
      } else {
        updateResult(0, 'success', 'Supabase connection successful');
      }
    } catch (error: any) {
      updateResult(0, 'failed', `Error: ${error?.message || error}`);
    }

    // Test 2: Register a new user
    addResult('Register New User', 'running');
    try {
      // Generate a random email to avoid conflicts
      const randomEmail = `test-${Math.random().toString(36).substring(2, 15)}@example.com`;
      
      const { data, error } = await supabase.auth.signUp({
        email: randomEmail,
        password: testPassword,
      });
      
      if (error) {
        updateResult(1, 'failed', `Error: ${error.message}`);
      } else {
        updateResult(1, 'success', `User registered with email: ${randomEmail}`);
        // Save the email for the next tests
        setTestEmail(randomEmail);
      }
    } catch (error: any) {
      updateResult(1, 'failed', `Error: ${error?.message || error}`);
    }

    // Test 3: Sign out
    addResult('Sign Out', 'running');
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        updateResult(2, 'failed', `Error: ${error.message}`);
      } else {
        updateResult(2, 'success', 'User signed out successfully');
      }
    } catch (error: any) {
      updateResult(2, 'failed', `Error: ${error?.message || error}`);
    }

    // Test 4: Login with created user
    addResult('Login', 'running');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });
      
      if (error) {
        updateResult(3, 'failed', `Error: ${error.message}`);
      } else {
        updateResult(3, 'success', 'User logged in successfully');
      }
    } catch (error: any) {
      updateResult(3, 'failed', `Error: ${error?.message || error}`);
    }
    
    // Test 5: Get user data
    addResult('Get User Data', 'running');
    try {
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        updateResult(4, 'failed', `Error: ${error.message}`);
      } else if (!data.user) {
        updateResult(4, 'failed', 'User data not found');
      } else {
        updateResult(4, 'success', `User data retrieved: ${data.user.email}`);
      }
    } catch (error: any) {
      updateResult(4, 'failed', `Error: ${error?.message || error}`);
    }
    
    // Test 6: Final sign out
    addResult('Final Sign Out', 'running');
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        updateResult(5, 'failed', `Error: ${error.message}`);
      } else {
        updateResult(5, 'success', 'User signed out successfully');
      }
    } catch (error: any) {
      updateResult(5, 'failed', `Error: ${error?.message || error}`);
    }

    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Authentication Tests</h1>
              <p className="mt-2 text-gray-600">
                Run basic tests for authentication functionality
              </p>
            </div>
            
            <div className="flex justify-center mb-8">
              <Button
                onClick={runTests}
                isLoading={isRunning}
                disabled={isRunning}
                className="w-full sm:w-auto"
              >
                {isRunning ? 'Running Tests...' : 'Run Tests'}
              </Button>
            </div>
            
            <div>
              {results.length > 0 ? (
                <div className="space-y-4">
                  {results.map((result, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg ${
                        result.status === 'pending' ? 'bg-gray-100' :
                        result.status === 'running' ? 'bg-blue-100' :
                        result.status === 'success' ? 'bg-green-100' :
                        'bg-red-100'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 w-5 h-5 mr-3 rounded-full ${
                          result.status === 'pending' ? 'bg-gray-400' :
                          result.status === 'running' ? 'bg-blue-500' :
                          result.status === 'success' ? 'bg-green-500' :
                          'bg-red-500'
                        }`}></div>
                        <div>
                          <h3 className="font-medium text-gray-900">{result.name}</h3>
                          {result.message && (
                            <p className={`mt-1 text-sm ${
                              result.status === 'success' ? 'text-green-700' :
                              result.status === 'failed' ? 'text-red-700' :
                              'text-gray-700'
                            }`}>
                              {result.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  No test results yet. Click the button above to run tests.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
    
    // Test 5: Get user data
    addResult('Get User Data', 'running');
    try {
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        updateResult(4, 'failed', `Error: ${error.message}`);
      } else if (!data.user) {
        updateResult(4, 'failed', 'User data not found');
      } else {
        updateResult(4, 'success', `User data retrieved: ${data.user.email}`);
      }
    } catch (error) {
      updateResult(4, 'failed', `Error: ${error}`);
    }
    
    // Test 6: Final sign out
    addResult('Final Sign Out', 'running');
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        updateResult(5, 'failed', `Error: ${error.message}`);
      } else {
        updateResult(5, 'success', 'User signed out successfully');
      }
    } catch (error) {
      updateResult(5, 'failed', `Error: ${error}`);
    }

    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Authentication Tests</h1>
              <p className="mt-2 text-gray-600">
                Run basic tests for authentication functionality
              </p>
            </div>
            
            <div className="flex justify-center mb-8">
              <Button
                onClick={runTests}
                isLoading={isRunning}
                disabled={isRunning}
                className="w-full sm:w-auto"
              >
                {isRunning ? 'Running Tests...' : 'Run Tests'}
              </Button>
            </div>
            
            <div>
              {results.length > 0 ? (
                <div className="space-y-4">
                  {results.map((result, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg ${
                        result.status === 'pending' ? 'bg-gray-100' :
                        result.status === 'running' ? 'bg-blue-100' :
                        result.status === 'success' ? 'bg-green-100' :
                        'bg-red-100'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 w-5 h-5 mr-3 rounded-full ${
                          result.status === 'pending' ? 'bg-gray-400' :
                          result.status === 'running' ? 'bg-blue-500' :
                          result.status === 'success' ? 'bg-green-500' :
                          'bg-red-500'
                        }`}></div>
                        <div>
                          <h3 className="font-medium text-gray-900">{result.name}</h3>
                          {result.message && (
                            <p className={`mt-1 text-sm ${
                              result.status === 'success' ? 'text-green-700' :
                              result.status === 'failed' ? 'text-red-700' :
                              'text-gray-700'
                            }`}>
                              {result.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  No test results yet. Click the button above to run tests.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
    
    // Test 5: Get user data
    addResult('Get User Data', 'running');
    try {
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        updateResult(4, 'failed', `Error: ${error.message}`);
      } else if (!data.user) {
        updateResult(4, 'failed', 'User data not found');
      } else {
        updateResult(4, 'success', `User data retrieved: ${data.user.email}`);
      }
    } catch (error) {
      updateResult(4, 'failed', `Error: ${error}`);
    }
    
    // Test 6: Final sign out
    addResult('Final Sign Out', 'running');
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        updateResult(5, 'failed', `Error: ${error.message}`);
      } else {
        updateResult(5, 'success', 'User signed out successfully');
      }
    } catch (error) {
      updateResult(5, 'failed', `Error: ${error}`);
    }

    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Authentication Tests</h1>
              <p className="mt-2 text-gray-600">
                Run basic tests for authentication functionality
              </p>
            </div>
            
            <div className="flex justify-center mb-8">
              <Button
                onClick={runTests}
                isLoading={isRunning}
                disabled={isRunning}
                className="w-full sm:w-auto"
              >
                {isRunning ? 'Running Tests...' : 'Run Tests'}
              </Button>
            </div>
            
            <div>
              {results.length > 0 ? (
                <div className="space-y-4">
                  {results.map((result, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg ${
                        result.status === 'pending' ? 'bg-gray-100' :
                        result.status === 'running' ? 'bg-blue-100' :
                        result.status === 'success' ? 'bg-green-100' :
                        'bg-red-100'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 w-5 h-5 mr-3 rounded-full ${
                          result.status === 'pending' ? 'bg-gray-400' :
                          result.status === 'running' ? 'bg-blue-500' :
                          result.status === 'success' ? 'bg-green-500' :
                          'bg-red-500'
                        }`}></div>
                        <div>
                          <h3 className="font-medium text-gray-900">{result.name}</h3>
                          {result.message && (
                            <p className={`mt-1 text-sm ${
                              result.status === 'success' ? 'text-green-700' :
                              result.status === 'failed' ? 'text-red-700' :
                              'text-gray-700'
                            }`}>
                              {result.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  No test results yet. Click the button above to run tests.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

    // Test 5: Get user data
    addResult('Get User Data', 'running');
    try {
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        updateResult(4, 'failed', `Error: ${error.message}`);
      } else if (!data.user) {
        updateResult(4, 'failed', 'User data not found');
      } else {
        updateResult(4, 'success', `User ID: ${data.user.id}, Email: ${data.user.email}`);
      }
    } catch (error) {
      updateResult(4, 'failed', `Error: ${error}`);
    }

    // Test 6: Final sign out
    addResult('Final Sign Out', 'running');
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        updateResult(5, 'failed', `Error: ${error.message}`);
      } else {
        updateResult(5, 'success', 'User signed out successfully');
      }
    } catch (error) {
      updateResult(5, 'failed', `Error: ${error}`);
    }

    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Authentication Tests</h1>
          <p className="mt-2 text-gray-600">
            Run this test suite to verify that authentication features are working correctly.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Test Password (for new user)
            </label>
            <input 
              type="text" 
              value={testPassword}
              onChange={(e) => setTestPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <Button
            onClick={runTests}
            isLoading={isRunning}
            disabled={isRunning}
            className="w-full sm:w-auto"
          >
            Run Authentication Tests
          </Button>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Test
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                    No tests run yet. Click the button above to start testing.
                  </td>
                </tr>
              ) : (
                results.map((result, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {result.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        result.status === 'running' ? 'bg-blue-100 text-blue-800' :
                        result.status === 'success' ? 'bg-green-100 text-green-800' :
                        result.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {result.status === 'running' ? 'Running...' :
                         result.status === 'success' ? 'Success' :
                         result.status === 'failed' ? 'Failed' :
                         'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {result.message || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-8 bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Manual Testing Instructions</h2>
          <p className="text-gray-600 mb-4">
            Please also perform the following manual tests:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>Verify the navbar and logo display on all pages</li>
            <li>Test that tab navigation between Login and Register works</li>
            <li>Check form validation for empty fields and invalid inputs</li>
            <li>Test protected routes by trying to access the dashboard when not logged in</li>
            <li>Verify the dashboard shows correct user information</li>
            <li>Test the responsive design on mobile and desktop viewports</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
