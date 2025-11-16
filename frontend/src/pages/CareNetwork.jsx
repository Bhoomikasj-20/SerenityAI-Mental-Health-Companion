import { Link } from 'react-router-dom'

export default function CareNetwork() {
  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Care Network</h2>
        <p className="text-sm text-gray-500">Connect with professionals and services for additional support.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-medium">Find a counselor</h3>
          <p className="text-sm text-gray-600 mt-2">Browse verified counselors and book a session directly from SerenityAI.</p>
          <Link to="/care/contact" className="inline-block mt-4 px-4 py-2 bg-primary-500 text-white rounded">Contact Your Counselor</Link>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-medium">Professional Resources</h3>
          <p className="text-sm text-gray-600 mt-2">Find helplines, directories, and resources curated for your region.</p>
        </div>
      </div>
    </div>
  )
}
