export const metadata = {
  title: 'Admin Dashboard - Memora',
  description: 'Manage orders and settings',
}

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-gray-800">Memora Admin</span>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {children}
        </div>
      </main>
    </div>
  )
}
