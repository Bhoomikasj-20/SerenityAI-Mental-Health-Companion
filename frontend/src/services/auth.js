// Re-export from the JSX-based implementation so Vite doesn't attempt to parse JSX in this .js file.
export { AuthProvider, useAuth } from './auth.jsx'

// Default export for compatibility (if any modules import default)
export default null