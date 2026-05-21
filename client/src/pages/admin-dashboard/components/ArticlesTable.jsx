import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import { format } from 'date-fns';

const ArticlesTable = ({ articles, onDeleteArticle }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');

  // Compute metrics
  const metrics = useMemo(() => {
    if (!articles) return { total: 0, published: 0, drafts: 0, views: 0 };
    return articles.reduce(
      (acc, article) => {
        acc.total += 1;
        if (article.status === 'published') {
          acc.published += 1;
        } else {
          acc.drafts += 1;
        }
        acc.views += article.views || 0;
        return acc;
      },
      { total: 0, published: 0, drafts: 0, views: 0 }
    );
  }, [articles]);

  // Filter and sort articles
  const processedArticles = useMemo(() => {
    if (!articles) return [];
    
    let result = [...articles];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (article) =>
          article.title.toLowerCase().includes(term) ||
          article.author?.name?.toLowerCase().includes(term) ||
          article.author?.email?.toLowerCase().includes(term) ||
          article.tags?.some((t) => t.toLowerCase().includes(term))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((article) => article.status === statusFilter);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'date_desc') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === 'date_asc') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (sortBy === 'views_desc') {
        return (b.views || 0) - (a.views || 0);
      }
      if (sortBy === 'views_asc') {
        return (a.views || 0) - (b.views || 0);
      }
      return 0;
    });

    return result;
  }, [articles, searchTerm, statusFilter, sortBy]);

  return (
    <div className="space-y-6">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Articles */}
        <div className="bg-card border border-border p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Articles</p>
            <h4 className="text-2xl font-bold mt-1 text-foreground">{metrics.total}</h4>
          </div>
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20 text-primary">
            <Icon name="BookOpen" size={20} />
          </div>
        </div>

        {/* Published */}
        <div className="bg-card border border-border p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Published</p>
            <h4 className="text-2xl font-bold mt-1 text-green-500">{metrics.published}</h4>
          </div>
          <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center border border-green-500/20 text-green-500">
            <Icon name="CheckCircle" size={20} />
          </div>
        </div>

        {/* Drafts */}
        <div className="bg-card border border-border p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Drafts</p>
            <h4 className="text-2xl font-bold mt-1 text-yellow-500">{metrics.drafts}</h4>
          </div>
          <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center border border-yellow-500/20 text-yellow-500">
            <Icon name="FileText" size={20} />
          </div>
        </div>

        {/* Total Views */}
        <div className="bg-card border border-border p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Views</p>
            <h4 className="text-2xl font-bold mt-1 text-purple-500">{metrics.views}</h4>
          </div>
          <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center border border-purple-500/20 text-purple-500">
            <Icon name="Eye" size={20} />
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="Search" size={18} className="text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search articles by title, author or tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>

          {/* Sort Filter */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
          >
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="views_desc">Most Views</option>
            <option value="views_asc">Least Views</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto bg-card border border-border rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Article</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Author</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Views</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Created</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {processedArticles.map((article) => (
              <tr key={article._id} className="hover:bg-muted/30 transition-colors">
                {/* Article Info */}
                <td className="px-4 py-4 max-w-[320px]">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-muted border border-border overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {article.coverImage ? (
                        <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
                      ) : (
                        <Icon name="Image" size={18} className="text-muted-foreground" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-foreground truncate" title={article.title}>
                        {article.title}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {article.tags?.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-muted/80 text-muted-foreground border border-border"
                          >
                            #{tag}
                          </span>
                        ))}
                        {article.tags?.length > 3 && (
                          <span className="text-[10px] text-muted-foreground pt-0.5">
                            +{article.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Author */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center mr-2.5 overflow-hidden border border-accent/20">
                      {article.author?.profilePic ? (
                        <img src={article.author.profilePic} alt={article.author?.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs font-bold text-accent">
                          {article.author?.name ? article.author.name.charAt(0).toUpperCase() : '?'}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{article.author?.name || 'Deleted User'}</div>
                      <div className="text-xs text-muted-foreground">{article.author?.email || 'N/A'}</div>
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                      article.status === 'published'
                        ? 'bg-green-500/10 text-green-500 border-green-500/20'
                        : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${article.status === 'published' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    {article.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                </td>

                {/* Views */}
                <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-foreground">
                  <div className="flex items-center gap-1.5">
                    <Icon name="Eye" size={14} className="text-muted-foreground" />
                    {article.views || 0}
                  </div>
                </td>

                {/* Created */}
                <td className="px-4 py-4 whitespace-nowrap text-sm text-muted-foreground">
                  {article.createdAt ? format(new Date(article.createdAt), 'MMM dd, yyyy') : 'N/A'}
                </td>

                {/* Actions */}
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    {/* View article */}
                    {article.slug && article.status === 'published' && (
                      <a
                        href={`/articles/${article.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-primary/5"
                        title="View Article"
                      >
                        <Icon name="ExternalLink" size={18} />
                      </a>
                    )}
                    {/* Delete article */}
                    <button
                      onClick={() => onDeleteArticle(article._id)}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/5"
                      title="Delete Article"
                    >
                      <Icon name="Trash2" size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {processedArticles.length === 0 && (
          <div className="text-center py-16">
            <div className="w-12 h-12 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icon name="BookOpen" size={24} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">No articles found.</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Try refining your search query or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlesTable;
