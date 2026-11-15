
import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {

  // State to switch between Sign Up and Login
  const [state, setState] = useState('Sign Up')

  // Navigation hook from React Router
  const navigate = useNavigate()

  const {backendUrl, setIsLoggedIn} = useContext(AppContext)

  // States to store user input values
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // States to store uploaded image files (optional)
  const [avatar, setAvatar] = useState(null)
  const [coverImage, setCoverImage] = useState(null)

  // Handle form submission
  const handleSubmit = async (e) => {
    try{
e.preventDefault() // Prevent page reload

axios.defaults.withCredentials = true

    // Display form data in console
    console.log('Name:', name)
    console.log('Email:', email)
    console.log('Password:', password)
    console.log('Avatar:', avatar)
    console.log('Cover Image:', coverImage)

    if(state === 'Sign Up'){
      const {data} = await axios.post(backendUrl + '/api/v1/auth/register', {
        name, email, password, avatar, coverImage
      })

      if(data.success){
        setIsLoggedIn(true)
        navigate('/')
      }else{
        toast.error(data.message)
      }
    }else{

      const {data} = await axios.post(backendUrl + '/api/v1/auth/login', {
        name, email, password, avatar, coverImage
      })

      if(data.success){
        setIsLoggedIn(true)
        navigate('/')
      }else{
        toast.error(data.message)
      }

    }
    }catch(error){
      toast.error(data.message)
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>

      {/* Logo - Clicking the logo navigates to Home */}
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt="Logo"
        className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'
      />

      {/* Login / Sign Up Container */}
      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>

        {/* Dynamic Heading */}
        <h2 className='text-3xl font-semibold text-white text-center mb-5'>
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </h2>

        {/* Dynamic Description */}
        <p className='text-sm text-center mb-6'>
          {state === 'Sign Up'
            ? 'Create your account'
            : 'Login to your account'}
        </p>

        {/* Form Submission */}
        <form onSubmit={handleSubmit}>

          {/* Full Name - Only visible during Sign Up */}
          {state === 'Sign Up' && (
            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
              <img src={assets.person_icon} alt="" />

              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className='bg-transparent outline-none text-white w-full'
                type="text"
                placeholder='Full Name'
                required
              />
            </div>
          )}

          {/* Email Input */}
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt="" />

            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className='bg-transparent outline-none text-white w-full'
              type="email"
              placeholder='Email id'
              required
            />
          </div>

          {/* Password Input */}
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt="" />

            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className='bg-transparent outline-none text-white w-full'
              type="password"
              placeholder='Password'
              required
            />
          </div>

          {/* Avatar and Cover Image - Only visible during Sign Up */}
          {state === 'Sign Up' && (
            <>
              {/* Optional Avatar Upload */}
              <div className='mb-4'>
                <label className='block text-white mb-2'>
                  Upload Avatar (Optional)
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatar(e.target.files[0] || null)}
                  className='w-full text-xs text-white file:mr-3 file:py-2 file:px-3 file:rounded-full file:border-0 file:bg-indigo-500 file:text-white cursor-pointer'
                />
              </div>

              {/* Optional Cover Image Upload */}
              <div className='mb-4'>
                <label className='block text-white mb-2'>
                  Upload Cover Image (Optional)
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverImage(e.target.files[0] || null)}
                  className='w-full text-xs text-white file:mr-3 file:py-2 file:px-3 file:rounded-full file:border-0 file:bg-indigo-500 file:text-white cursor-pointer'
                />
              </div>
            </>
          )}

          {/* Forgot Password - Only visible during Login */}
          {state === 'Login' && (
            <p
              onClick={() => navigate('/reset-password')}
              className='mb-4 text-indigo-400 cursor-pointer hover:underline'
            >
              Forgot Password?
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium'
          >
            {state}
          </button>

        </form>

        {/* Switch Between Sign Up and Login */}
        {state === 'Sign Up' ? (
          <p className='text-gray-400 text-center text-xs mt-4'>
            Already have an account?{' '}

            <span
              onClick={() => setState('Login')}
              className='text-blue-400 cursor-pointer underline'
            >
              Login here
            </span>
          </p>
        ) : (
          <p className='text-gray-400 text-center text-xs mt-4'>
            Don't have an account?{' '}

            <span
              onClick={() => setState('Sign Up')}
              className='text-blue-400 cursor-pointer underline'
            >
              Sign Up
            </span>
          </p>
        )}

      </div>
    </div>
  )
}

export default Login
