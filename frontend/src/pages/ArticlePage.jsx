import { useParams, Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useArticle } from '../hooks/useArticles';
import LoadingSpinner from '../components/LoadingSpinner';
import {
    FiArrowLeft,
    FiUser,
    FiCalendar,
    FiExternalLink,
    FiCheckCircle,
    FiFileText,
    FiAlertCircle
} from 'react-icons/fi';

const ArticlePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { article, loading, error } = useArticle(id);

    if (loading) {
        return <LoadingSpinner size="lg" fullScreen />;
    }

    if (error || !article) {
        return (
            <div className="container-custom py-16">
                <div className="card p-8 text-center max-w-2xl mx-auto">
                    <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h2>
                    <p className="text-gray-600 mb-6">{error || 'The article you are looking for does not exist.'}</p>
                    <button onClick={() => navigate('/')} className="btn-primary">
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    const formattedDate = article.publishedDate
        ? format(new Date(article.publishedDate), 'MMMM dd, yyyy')
        : 'No date';

    return (
        <div className="min-h-screen pb-16">
            {/* Back Button */}
            <div className="container-custom py-6">
                <button
                    onClick={() => navigate('/')}
                    className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors duration-300"
                >
                    <FiArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Back to Articles</span>
                </button>
            </div>

            {/* Article Header */}
            <div className="glass py-12 mb-12">
                <div className="container-custom max-w-4xl">
                    <div className="animate-slide-up">
                        {/* Badge */}
                        <div className="mb-4">
                            {article.isUpdated ? (
                                <span className="badge badge-updated inline-flex items-center space-x-1">
                                    <FiCheckCircle className="w-4 h-4" />
                                    <span>AI-Enhanced Version</span>
                                </span>
                            ) : (
                                <span className="badge badge-original">Original Article</span>
                            )}
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            {article.title}
                        </h1>

                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-6 text-gray-600">
                            <div className="flex items-center space-x-2">
                                <FiUser className="w-5 h-5" />
                                <span className="font-medium">{article.author || 'Unknown Author'}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <FiCalendar className="w-5 h-5" />
                                <span>{formattedDate}</span>
                            </div>
                            {article.metadata?.wordCount && (
                                <div className="flex items-center space-x-2">
                                    <FiFileText className="w-5 h-5" />
                                    <span>{article.metadata.wordCount} words</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Article Content */}
            <div className="container-custom max-w-4xl">
                <div className="card p-8 md:p-12">
                    {/* Featured Image */}
                    {article.imageUrl && (
                        <div className="mb-8 rounded-xl overflow-hidden">
                            <img
                                src={article.imageUrl}
                                alt={article.title}
                                className="w-full h-auto"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div
                        className="prose prose-lg max-w-none"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />

                    {/* References */}
                    {article.references && article.references.length > 0 && (
                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">References</h3>
                            <ol className="space-y-2">
                                {article.references.map((ref, index) => (
                                    <li key={index} className="flex items-start space-x-2">
                                        <span className="text-primary-600 font-medium">{index + 1}.</span>
                                        <a
                                            href={ref}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary-600 hover:text-primary-700 hover:underline flex items-center space-x-1 break-all"
                                        >
                                            <span>{ref}</span>
                                            <FiExternalLink className="w-4 h-4 flex-shrink-0" />
                                        </a>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )}

                    {/* Original/Updated Link */}
                    {article.originalArticleId && (
                        <div className="mt-8 p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
                            <p className="text-gray-700 mb-3">
                                This is an AI-enhanced version. Want to see the original?
                            </p>
                            <Link
                                to={`/article/${article.originalArticleId._id || article.originalArticleId}`}
                                className="btn-secondary inline-flex items-center space-x-2"
                            >
                                <span>View Original Article</span>
                                <FiArrowLeft className="w-4 h-4" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArticlePage;
