import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './components/theme-provider'
import RootLayout from './layouts/root-layout'
import Home from './pages/home'
import CategoryPage from './pages/category/[slug]'
import ListingPage from './pages/listing/[id]'
import LoginPage from './pages/auth/login'
import RegisterPage from './pages/auth/register'
import CreateListingPage from './pages/create-listing'

export default function App() {
  return (
    <Router>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route path="category/:slug" element={<CategoryPage />} />
            <Route path="listing/:id" element={<ListingPage />} />
            <Route path="create-listing" element={<CreateListingPage />} />
            <Route path="auth/login" element={<LoginPage />} />
            <Route path="auth/register" element={<RegisterPage />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </Router>
  )
}
