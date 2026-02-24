import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { 
    BookOpenIcon, 
    UserCircleIcon, 
    ArrowRightOnRectangleIcon,
    BookmarkIcon,
    StarIcon 
} from '@heroicons/react/24/outline';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex items-center">
                            <BookOpenIcon className="h-8 w-8 text-blue-600" />
                            <span className="ml-2 text-xl font-bold text-gray-800">
                                LibraryManager
                            </span>
                        </Link>
                        
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link
                                to="/books"
                                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
                            >
                                Books
                            </Link>
                            {user && (
                                <>
                                    <Link
                                        to="/my-borrowings"
                                        className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
                                    >
                                        My Borrowings
                                    </Link>
                                    <Link
                                        to="/waiting-list"
                                        className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
                                    >
                                        Waiting List
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center">
                        {user ? (
                            <Menu as="div" className="relative ml-3">
                                <Menu.Button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    {user.profilePicture ? (
                                        <img
                                            src={user.profilePicture}
                                            alt={user.fullName}
                                            className="h-8 w-8 rounded-full"
                                        />
                                    ) : (
                                        <UserCircleIcon className="h-8 w-8 text-gray-400" />
                                    )}
                                    <span className="ml-2 text-gray-700">
                                        {user.firstName}
                                    </span>
                                </Menu.Button>
                                
                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-200"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <Link
                                                    to="/profile"
                                                    className={`${
                                                        active ? 'bg-gray-100' : ''
                                                    } flex items-center px-4 py-2 text-sm text-gray-700`}
                                                >
                                                    <UserCircleIcon className="mr-3 h-5 w-5" />
                                                    Profile
                                                </Link>
                                            )}
                                        </Menu.Item>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <Link
                                                    to="/my-reviews"
                                                    className={`${
                                                        active ? 'bg-gray-100' : ''
                                                    } flex items-center px-4 py-2 text-sm text-gray-700`}
                                                >
                                                    <StarIcon className="mr-3 h-5 w-5" />
                                                    My Reviews
                                                </Link>
                                            )}
                                        </Menu.Item>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    onClick={handleLogout}
                                                    className={`${
                                                        active ? 'bg-gray-100' : ''
                                                    } flex items-center w-full text-left px-4 py-2 text-sm text-gray-700`}
                                                >
                                                    <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
                                                    Logout
                                                </button>
                                            )}
                                        </Menu.Item>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        ) : (
                            <div className="space-x-4">
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;