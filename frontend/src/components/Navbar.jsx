import { Link } from 'react-router-dom';
import { FiBook, FiGithub } from 'react-icons/fi';

const Navbar = () => {
    return (
        <nav className="glass sticky top-0 z-50 border-b border-gray-200/50 shadow-sm">
            <div className="container-custom">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                            <FiBook className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gradient">
                            BeyondChats Blog
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center space-x-6">
                        <Link
                            to="/"
                            className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-300"
                        >
                            Home
                        </Link>
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors duration-300"
                        >
                            <FiGithub className="w-5 h-5" />
                            <span className="hidden sm:inline font-medium">GitHub</span>
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
