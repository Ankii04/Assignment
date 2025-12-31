const Footer = () => {
    return (
        <footer className="glass mt-20 border-t border-gray-200/50">
            <div className="container-custom py-8">
                <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                    <div className="text-center md:text-left">
                        <p className="text-gray-600">
                            © 2024 <span className="font-semibold text-gradient">BeyondChats</span>. All rights reserved.
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            Built with React, Tailwind CSS & Node.js
                        </p>
                    </div>

                    <div className="flex items-center space-x-6">
                        <a
                            href="https://beyondchats.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-primary-600 transition-colors duration-300"
                        >
                            About
                        </a>
                        <a
                            href="https://beyondchats.com/blogs"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-primary-600 transition-colors duration-300"
                        >
                            Blog
                        </a>
                        <a
                            href="https://beyondchats.com/contact"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-primary-600 transition-colors duration-300"
                        >
                            Contact
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
