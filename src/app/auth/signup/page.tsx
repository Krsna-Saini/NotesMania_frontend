'use client'
import React, { useState } from 'react'
import { User, Mail, Lock } from 'lucide-react'
import { useSignupMutation } from '@/state/Api/user/api'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
const Signup = () => {

  const [username, setUsername] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [signup] = useSignupMutation()
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await signup({ username, email, password }).unwrap().then((data) => {
        if (data.data) {
          toast.success('Registration successful')
          router.push('/auth/login')
        }
        else{
          toast.error("fill the form correctly")
        }
      })

    } catch (error) {
      console.error('Registration failed:', error)
    }
    setLoading(false)
  }

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-purple-700 via-pink-500 to-rose-500 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl flex overflow-hidden">
        {/* Left side */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-purple-800 to-pink-600 text-white flex-col items-center justify-center p-10 text-center">
          <h2 className="text-4xl font-bold mb-4">Join Us!</h2>
          <p className="text-lg">Create your account and get started today.</p>
        </div>

        {/* Signup form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col text-black justify-center bg-gray-50">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">User Signup</h2>
          <form className="space-y-6" onSubmit={handleRegister}>
            <div className="relative">
              <User className="absolute top-3 left-3 text-gray-400" />
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                type='text'
                placeholder='Username'
                className='w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-400 focus:outline-none'
              />
            </div>

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

            <button
              type='submit'
              disabled={loading}
              className='w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2 rounded-lg hover:from-purple-700 hover:to-pink-600 transition duration-300 flex items-center justify-center'
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Registering...
                </>
              ) : (
                'Register'
              )}
            </button>
          </form>

          <p className='mt-6 text-center text-gray-500'>
            Already have an account?{' '}
            <button onClick={()=>{
              router.push("/auth/login")
            }} className='text-pink-600 hover:underline cursor-pointer'>
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
