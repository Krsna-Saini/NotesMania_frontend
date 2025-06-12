'use client'

import { useSelector } from 'react-redux'
import { themeStatetype } from '@/state/Global'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
    const isAuthenticated = useSelector((state: { global: themeStatetype }) => state.global.isAuthenticated)
    const path = usePathname()
    const router = useRouter()

    useEffect(() => {
        const isAuthPage = path.includes('/auth')
        if (path === '/' || path === '/home' && !isAuthenticated) {
            return
        }
        if (isAuthenticated && isAuthPage) {
            router.push('/')
        }

        if (!isAuthenticated && !isAuthPage) {
            router.push('/auth/login')
        }
    }, [isAuthenticated, path, router])

    return <>{children}</>  // ✅ Render children
}

export default AuthWrapper
