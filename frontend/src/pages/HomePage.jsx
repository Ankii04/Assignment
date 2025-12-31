import { useState, useMemo } from 'react';
import { useArticles } from '../hooks/useArticles';
import ArticleList from '../components/ArticleList';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiAlertCircle } from 'react-icons/fi';

const HomePage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all');

    const filterParams = useMemo(() => {
        if (filter === 'original') return { isUpdated: false };
        if (filter === 'updated') return { isUpdated: true };
        return {};
    }, [filter]);

    const { articles, loading, error, pagination } = useArticles(filterParams);

    // Client-side search filtering
    const filteredArticles = useMemo(() => {
        if (!searchQuery.trim()) return articles;

        const query = searchQuery.toLowerCase();
        return articles.filter(article =>
            article.title.toLowerCase().includes(query) ||
            article.excerpt?.toLowerCase().includes(query) ||
            article.author?.toLowerCase().includes(query)
        );
    }, [articles, searchQuery]);

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="glass py-16 mb-12">
                <div className="container-custom">
                    <div className="text-center max-w-3xl mx-auto animate-slide-up">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            <span className="text-gradient">BeyondChats</span> Blog
                        </h1>
                        <p className="text-xl text-gray-600 mb-8">
                            Discover insightful articles about customer support, AI, and technology.
                            Explore both original content and AI-enhanced versions.
                        </p>

                        {/* Stats */}
                        <div className="flex justify-center space-x-8 text-center">
                            <div className="bg-white/50 px-6 py-4 rounded-lg">
                                <div className="text-3xl font-bold text-gradient">{pagination.total}</div>
                                <div className="text-sm text-gray-600">Total Articles</div>
                            </div>
                            <div className="bg-white/50 px-6 py-4 rounded-lg">
                                <div className="text-3xl font-bold text-gradient">
                                    {articles.filter(a => a.isUpdated).length}
                                </div>
                                <div className="text-sm text-gray-600">AI Enhanced</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="container-custom pb-16">
                {/* Search and Filter */}
                <div className="mb-8 space-y-6">
                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search by title, excerpt, or author..."
                    />

                    <FilterBar filter={filter} onFilterChange={setFilter} />
                </div>

                {/* Articles */}
                {loading ? (
                    <LoadingSpinner size="lg" fullScreen />
                ) : error ? (
                    <div className="card p-8 text-center">
                        <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Articles</h3>
                        <p className="text-gray-600">{error}</p>
                    </div>
                ) : (
                    <>
                        <div className="mb-6 text-gray-600">
                            Showing <span className="font-semibold">{filteredArticles.length}</span> article{filteredArticles.length !== 1 ? 's' : ''}
                        </div>
                        <ArticleList articles={filteredArticles} />
                    </>
                )}
            </div>
        </div>
    );
};

export default HomePage;
