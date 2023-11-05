import { useUser } from '../hooks'

export type LayoutProps = {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { isAuthenticated, logout } = useUser()
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between">
            <div className="flex space-x-7">
              <div>
                {/* Website Logo */}
                <a href="#" className="flex items-center py-4 px-2">
                  <span className="font-semibold text-gray-500 text-lg">
                    BAS
                  </span>
                </a>
              </div>
              {/* Primary Navbar items */}
              <div className="hidden md:flex items-center space-x-1"></div>
            </div>
            {/* Secondary Navbar items */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-3 ">
                <a
                  href="#"
                  onClick={logout}
                  className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-gray-700 hover:text-white transition duration-300"
                >
                  Log Out
                </a>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3 "></div>
            )}
          </div>
        </div>
      </nav>

      {/* Sidebar & Content */}
      <div className="flex flex-col md:flex-row">
        {/* Content */}
        <main className="p-4 w-full md:w-4/5 xl:w-5/6">{children}</main>
      </div>
    </div>
  )
}
