'use client';

import { useSelector } from 'react-redux';
import { themeStatetype } from '@/state/Global';
import {
  Mail, User, Info, Image, Calendar, Users, FileText
} from 'lucide-react';
import { UpdateProfileDialog } from '@/components/Multipurpose/updateProfile';

export default function ProfilePage() {
  const user = useSelector((state: { global: themeStatetype }) => state.global.user);

  return (
    <div className="min-h-screen absolute top-0 w-full bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-black flex justify-center px-4 py-20">
      <div className="w-full max-w-5xl bg-white dark:bg-gray-900/60 backdrop-blur-lg border border-gray-300 dark:border-gray-700 rounded-3xl shadow-2xl px-8 py-12 flex flex-col gap-12 transition-all">

        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-center gap-10">
          {/* Profile Image */}
          <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-blue-500 shadow-xl">
            {user.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                <Image className="w-10 h-10 text-gray-500" />
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white flex justify-center md:justify-start items-center gap-2">
              <User className="text-blue-500 w-6 h-6" />
              {user.username || 'Unnamed Hero'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 flex justify-center md:justify-start items-center gap-2">
              <Mail className="text-blue-400 w-5 h-5" />
              {user.email || 'user@example.com'}
            </p>
            {user.description && (
              <p className="text-gray-600 dark:text-gray-400 flex justify-center md:justify-start items-center gap-2">
                <Info className="text-purple-400 w-5 h-5" />
                {user.description}
              </p>
            )}
            {/* Edit Button */}
            <div className="pt-4 flex justify-center md:justify-start">
              <UpdateProfileDialog />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-gray-300 dark:bg-gray-700 w-full" />

        {/* About Me */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">About Me</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
            {user.description || 'This user hasn’t written anything about themselves yet. Be the first to know when they do!'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="bg-gradient-to-br from-purple-200 via-white to-blue-200 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 shadow-lg">
            <Users className="mx-auto text-blue-500 w-6 h-6" />
            <h3 className="text-lg font-semibold mt-2 text-gray-800 dark:text-white">Followers</h3>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">120</p>
          </div>
          <div className="bg-gradient-to-br from-purple-200 via-white to-blue-200 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 shadow-lg">
            <FileText className="mx-auto text-purple-500 w-6 h-6" />
            <h3 className="text-lg font-semibold mt-2 text-gray-800 dark:text-white">Posts</h3>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">34</p>
          </div>
          <div className="bg-gradient-to-br from-purple-200 via-white to-blue-200 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 shadow-lg">
            <Calendar className="mx-auto text-green-500 w-6 h-6" />
            <h3 className="text-lg font-semibold mt-2 text-gray-800 dark:text-white">Joined</h3>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">Apr 2024</p>
          </div>
        </div>
      </div>
    </div>
  );
}
