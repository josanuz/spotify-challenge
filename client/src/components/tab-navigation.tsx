/*
    this file contains the tab navigation component for the application.
    It includes a top navigation bar for larger screens and a bottom navigation bar for smaller screens.
    The navigation links are dynamically generated based on the defined tabs.
*/
import { Tab, TabGroup, TabList } from '@headlessui/react';
import clsx from 'clsx';
import { BookOpen, Home } from 'lucide-react';
import { NavLink, Outlet, useSearchParams } from 'react-router';

/**
 * Default tabs for the navigation.
 */
const tabs = [
    { to: 'home', label: 'Home', icon: <Home size={20} /> },
    { to: 'library', label: 'Library', icon: <BookOpen size={20} /> },
];
// data-selected:border-b data-selected:border-green-500 data-selected:text-white data-hover:border-green-300/50 text-gray-300 flex items-center gap-2 px-4 py-2 transition-colors
const TopNavigation = () => {
    const [searchParams] = useSearchParams();
    return (
        <TabGroup manual>
            <TabList className="flex flex-row gap-4">
                {tabs.map(({ to, label }) => (
                    <Tab as={'div'}>
                        <NavLink
                            key={to}
                            to={searchParams.has('query') ? `${to}?${searchParams.toString()}` : to}
                            className={({ isActive }) =>
                                clsx(
                                    'data-hover:border-b data-hover:border-green-300/50 flex items-center gap-2 px-4 py-2 transition-colors',
                                    isActive
                                        ? 'border-b border-green-300 text-white'
                                        : 'text-gray-300',
                                )
                            }
                        >
                            {label}
                        </NavLink>
                    </Tab>
                ))}
            </TabList>
        </TabGroup>
    );
};

const BottomNavigation = () => {
    const [searchParams] = useSearchParams();
    return (
        <TabGroup manual>
            <TabList className="flex flex-row gap-4">
                {tabs.map(({ to, label, icon }) => (
                    <Tab as={'div'} className="data-hover:text-green-100">
                        <NavLink
                            key={to}
                            to={searchParams.has('query') ? `${to}?${searchParams.toString()}` : to}
                            className={({ isActive }) =>
                                clsx(
                                    'flex items-center gap-2 px-4 py-2 transition-colors',
                                    isActive ? 'text-green-500' : 'text-gray-300',
                                )
                            }
                        >
                            {icon}
                            {label}
                        </NavLink>
                    </Tab>
                ))}
            </TabList>
        </TabGroup>
    );
};

export default function TabNavigation() {
    return (
        <div className="flex flex-col min-h-screen w-screen h-screen">
            {/* Top Navigation for large screens */}
            <nav className="hidden lg:flex justify-center basis-[50px] shrink-0">
                <div className="flex space-x-8 py-2">
                    <TopNavigation />
                </div>
            </nav>

            {/* Page Content */}
            <div className="grow shrink p-4 w-full overflow-auto">
                <Outlet />
            </div>

            {/* Bottom Navigation for small screens */}
            <nav className="lg:hidden basis-[50px] shrink-0 border-t border-gray-200 shadow-inner">
                <div className="flex justify-around">
                    <BottomNavigation />
                </div>
            </nav>
        </div>
    );
}
