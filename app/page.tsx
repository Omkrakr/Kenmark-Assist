import ChatWidget from '@/components/chat/ChatWidget'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Kenmark ITan Solutions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Comprehensive IT Services Under One Roof
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/admin"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Admin Panel
            </Link>
            <a
              href="https://kenmarkitan.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Visit Website
            </a>
          </div>
        </header>

        {/* Services Section */}
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Web Hosting
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Shared hosting, VPS, dedicated servers, email services, VPN solutions, and private cloud storage.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Development
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Web and mobile app development, eCommerce solutions, blockchain, ERP, security solutions, and custom projects.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Design & Branding
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              UI/UX design, graphic design services, and tailored branding solutions.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Marketing
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              SEO, Social Media Marketing (SMM), and offline marketing strategies.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Consultancy
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Third-party guidance and technical advice for your business needs.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Contact Us
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              <strong>Address:</strong> 601-603, Chaitanya Building, Ram Mandir Signal, Goregaon West, Mumbai - 400104
            </p>
          </div>
        </section>

        {/* About Section */}
        <section className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            About Kenmark ITan Solutions
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Kenmark ITan Solutions is a technology company based in Mumbai, India, offering comprehensive IT services 
            under one roof. We cater to startups, small-medium businesses, and sole proprietors, providing end-to-end 
            solutions from web hosting and development to design, branding, marketing, and consultancy services.
          </p>
        </section>

        {/* Chat Widget */}
        <ChatWidget />

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 dark:text-gray-400 text-sm">
          Designed & Developed by Omkar Gaikwad
        </footer>
      </main>
    </div>
  )
}
