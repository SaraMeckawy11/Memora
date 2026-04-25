'use client'
import Link from 'next/link'

export default function OrderFailed() {
  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-max">
        <main className="sm:flex">
          <div className="sm:ml-6">
            <div className="sm:border-l sm:border-gray-200 sm:pl-6">
              <h1 className="text-4xl font-bold tracking-tight text-red-600 sm:text-5xl">Payment Failed</h1>
              <p className="mt-1 text-base text-gray-500">Something went wrong with your transaction.</p>
            </div>
            <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
              <Link
                href="/order"
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Try Again
              </Link>
              <a
                href="https://wa.me/1234567890" // Replace with actual number
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Contact Support (WhatsApp)
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
