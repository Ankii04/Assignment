import ArticleCard from './ArticleCard';

const ArticleList = ({ articles }) => {
    if (articles.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                    <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Articles Found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
                <ArticleCard key={article._id} article={article} />
            ))}
        </div>
    );
};

export default ArticleList;
