import { useState, useEffect } from 'react';
import { articlesAPI } from '../services/api';

export const useArticles = (filters = {}) => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        pages: 1,
        total: 0,
        count: 0
    });

    const fetchArticles = async (params = {}) => {
        try {
            setLoading(true);
            setError(null);

            const data = await articlesAPI.getAll({ ...filters, ...params });

            setArticles(data.data);
            setPagination({
                page: data.page,
                pages: data.pages,
                total: data.total,
                count: data.count
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch articles');
            console.error('Fetch articles error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, [JSON.stringify(filters)]);

    const refetch = () => fetchArticles();

    return {
        articles,
        loading,
        error,
        pagination,
        refetch,
        fetchArticles
    };
};

export const useArticle = (id) => {
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticle = async () => {
            if (!id) return;

            try {
                setLoading(true);
                setError(null);

                const data = await articlesAPI.getById(id);
                setArticle(data.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch article');
                console.error('Fetch article error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [id]);

    return { article, loading, error };
};
