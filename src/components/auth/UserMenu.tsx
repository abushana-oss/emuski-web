'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { LogOut, UserPlus } from 'lucide-react'
import { useAuth } from './AuthProvider'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function UserMenu() {
  const { user, signOut, isAuthenticated } = useAuth()
  const pathname = usePathname()

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (error) {
      console.error('Sign out failed:', error)
      // Could show a toast notification here
    }
  }

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(' ')
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    if (email) {
      return email.charAt(0).toUpperCase()
    }
    return 'U'
  }

  if (!isAuthenticated) {
    // Create redirect URL with current pathname
    const loginUrl = `/auth/login?redirectTo=${encodeURIComponent(pathname)}`
    const registerUrl = `/auth/register?redirectTo=${encodeURIComponent(pathname)}`

    return (
      <div className="flex items-center space-x-3">
        <Link href={loginUrl}>
          <Button 
            variant="ghost"
            className="text-emuski-teal hover:text-emuski-teal-darker hover:bg-transparent border-0 focus:ring-0 focus-visible:ring-0"
          >
            Login
          </Button>
        </Link>
        <Link href={registerUrl}>
          <Button className="bg-emuski-teal hover:bg-emuski-teal-darker text-white">
            <UserPlus className="w-4 h-4 mr-2" />
            Sign up
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="group relative">
      <Button variant="ghost" className="flex items-center h-10 px-2 hover:bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
        <Avatar className="w-8 h-8">
          <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.name || user?.email} />
          <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
            {getInitials(user?.name, user?.email)}
          </AvatarFallback>
        </Avatar>
      </Button>
      
      <div className="absolute right-0 top-full mt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="w-56 bg-white rounded-md border shadow-lg">
          <div className="p-3 border-b">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user?.name || 'User Account'}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </div>
          
          <div className="p-1">
            <button 
              className="w-full flex items-center px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded cursor-pointer"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}