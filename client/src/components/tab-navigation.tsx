/*
    this file contains the tab navigation component for the application.
    It includes a top navigation bar for larger screens and a bottom navigation bar for smaller screens.
    The navigation links are dynamically generated based on the defined tabs.
*/
import { NavLink, Outlet } from 'react-router'
import { Home, BookOpen } from 'lucide-react'

/**
 * Default tabs for the navigation.
 */
const tabs = [
    { to: 'home', label: 'Home', icon: <Home size={20} /> },
    { to: 'library', label: 'Library', icon: <BookOpen size={20} /> }
]

const TopNavigation = () => {
    return tabs.map(({ to, label }) => (
        <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${isActive ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'
                }`
            }
        >
            {label}
        </NavLink>
    ))

}

const BottomNavigation = () => {
    return tabs.map(({ to, label, icon }) => (
        <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
                `flex flex-col items-center justify-center py-2 text-sm ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
                }`
            }
        >
            {icon}
            <span className="text-xs">{label}</span>
        </NavLink>
    ))
}

export default function TabNavigation() {
    return (
        <div className="flex flex-col min-h-screen w-screen h-screen">
            {/* Top Navigation for large screens */}
            <nav className="hidden lg:flex justify-center border-b border-gray-200 bg-white shadow-sm">
                <div className="flex space-x-8 py-2">
                    <TopNavigation />
                </div>
            </nav>

            {/* Page Content */}
            <div className="flex-1 p-4 w-full h-full">
                <Outlet />
            </div>

            {/* Bottom Navigation for small screens */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-inner">
                <div className="flex justify-around">
                    <BottomNavigation />
                </div>
            </nav>
        </div>
    )
}
