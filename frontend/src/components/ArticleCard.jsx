import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FiUser, FiCalendar, FiArrowRight, FiCheckCircle, FiFileText } from 'react-icons/fi';

const ArticleCard = ({ article }) => {
    const formattedDate = article.publishedDate
        ? format(new Date(article.publishedDate), 'MMM dd, yyyy')
        : 'No date';

    return (
        <div className="card overflow-hidden group animate-fade-in hover:scale-[1.02] transition-transform duration-300">
            {/* Image */}
            <div className="relative h-48 bg-gradient-to-br from-primary-400 to-secondary-400 overflow-hidden">
                {article.imageUrl ? (
                    <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <FiFileText className="w-16 h-16 text-white/50" />
                    </div>
                )}

                {/* Badge */}
                <div className="absolute top-4 right-4">
                    {article.isUpdated ? (
                        <span className="badge badge-updated flex items-center space-x-1 shadow-lg">
                            <FiCheckCircle className="w-3 h-3" />
                            <span>Updated</span>
                        </span>
                    ) : (
                        <span className="badge badge-original shadow-lg">Original</span>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors duration-300">
                    {article.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt || 'No description available'}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                        <FiUser className="w-4 h-4" />
                        <span>{article.author || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <FiCalendar className="w-4 h-4" />
                        <span>{formattedDate}</span>
                    </div>
                </div>

                {/* Read More Button */}
                <Link
                    to={`/article/${article._id}`}
                    className="inline-flex items-center space-x-2 text-primary-600 font-medium hover:text-primary-700 group/link"
                >
                    <span>Read More</span>
                    <FiArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300" />
                </Link>
            </div>
        </div>
    );
};

export default ArticleCard;
