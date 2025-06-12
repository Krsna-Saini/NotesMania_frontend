'use client'
import { setIsAuthenticated, setUser } from '@/state/Global'
import { Lock, Mail } from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { UserType } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useLoginMutation } from '@/state/Api/user/api'

type LoginResponse = {
  data: {
    authenticateUser: UserType
  }
}

const Login = () => {
  const [email, setEmail] = useState<string>('krishnasaini27169@gmail.com')
  const [password, setPassword] = useState<string>('kinnu005w')
  const [Login] = useLoginMutation()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    if (!email || !password) {
      console.log('Email and password are required')
      setLoading(false)
      return
    }

    Login({ email, password })
      .unwrap()
      .then((response: LoginResponse) => {
        if (response.data) {
          const user = response.data.authenticateUser
          dispatch(setUser({ ...user, createdAt: user.createdAt.toString() }))
          dispatch(setIsAuthenticated(true))
          router.push('/')
        }
      })
      .catch((error) => {
        console.error('Login failed:', error)
      })
      .finally(() => setLoading(false))
  }

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-purple-700 via-pink-500 to-rose-500 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl flex overflow-hidden">
        {/* Left visual section */}
        <div className="hidden md:flex w-1/2 relative">
          <div className="hidden md:flex w-full bg-gradient-to-br from-purple-800 to-pink-600 text-white flex-col items-center justify-center p-10 text-center">
            <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
            <p className="text-lg">Login to continue your amazing journey with us!</p>
          </div>
        </div>

        {/* Login form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center bg-gray-50">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">User Login</h2>
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="relative">
              <Mail className="absolute top-3 left-3 text-gray-400" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                type='email'
                placeholder='Email'
                className='w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-400 focus:outline-none'
              />
            </div>

            <div className="relative">
              <Lock className="absolute top-3 left-3 text-gray-400" />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                type='password'
                placeholder='Password'
                className='w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-400 focus:outline-none'
              />
            </div>

            <div className='text-right'>
              <a href='#' className='text-pink-600 hover:underline text-sm'>Forgot Password?</a>
            </div>

            <button
              disabled={loading}
              type='submit'
              className='w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2 rounded-lg hover:from-purple-700 hover:to-pink-600 transition duration-300 flex items-center justify-center'
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Loading...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <p className='mt-6 text-center text-gray-500'>
            Don&apos;t have an account?{' '}
            <a href='/auth/signup' className='text-pink-600 hover:underline'>Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
