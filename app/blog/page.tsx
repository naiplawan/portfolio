'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, Search, ArrowRight, Loader2, FileText, Star } from 'lucide-react';
import Link from 'next/link';
import { useBlogPosts, usePopularTags } from '@/lib/hooks';
import { formatDistanceToNow } from 'date-fns';

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  const { data: allTags, isLoading: isLoadingTags } = usePopularTags(30);
  const { data: blogPosts, isLoading: isLoadingPosts } = useBlogPosts({
    limit: 50,
  });

  const filteredPosts = blogPosts?.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || post.tags.some(t => t.slug === selectedTag);
    return matchesSearch && matchesTag;
  }) || [];

  const featuredPosts = filteredPosts.filter((post) => post.featured);
  const regularPosts = filteredPosts.filter((post) => !post.featured);

  if (isLoadingPosts || isLoadingTags) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading blog posts...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative py-20 px-6 lg:px-8">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Blog
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8">
              Thoughts, tutorials, and insights about web development, design, and technology
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative max-w-xl mx-auto"
          >
            <label htmlFor="blog-search" className="sr-only">
              Search articles
            </label>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
            <Input
              id="blog-search"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg shadow-sm"
              aria-label="Search articles"
            />
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <div
              className="flex flex-wrap gap-2 justify-center"
              role="group"
              aria-label="Filter articles by tag"
            >
              <Button
                variant={!selectedTag ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTag('')}
                className={!selectedTag ? 'bg-blue-600 hover:bg-blue-700' : ''}
                aria-label="Show all articles"
                aria-pressed={!selectedTag}
              >
                All
              </Button>
              {allTags?.map((tag) => (
                <Button
                  key={tag.id}
                  variant={selectedTag === tag.slug ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTag(tag.slug)}
                  className={
                    selectedTag === tag.slug
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'hover:bg-gray-100'
                  }
                  aria-label={`Filter by ${tag.name}`}
                  aria-pressed={selectedTag === tag.slug}
                >
                  {tag.name}
                  <span className="ml-1 text-xs opacity-75" aria-label={`${tag.postCount || 0} articles`}>({tag.postCount || 0})</span>
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-16"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Posts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Link href={`/blog/${post.slug}`}>
                      <Card className="h-full hover:shadow-lg transition-shadow group cursor-pointer">
                        <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500 rounded-t-lg overflow-hidden">
                          {post.coverImage ? (
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-white text-4xl font-bold opacity-50">
                                {post.title.charAt(0)}
                              </span>
                            </div>
                          )}
                          {post.featured && (
                            <Badge className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 border-0">
                              <Star className="w-3 h-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                        </div>
                        <CardContent className="p-6">
                          <div className="flex flex-wrap gap-2 mb-3">
                            {post.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag.id} variant="secondary" className="text-xs">
                                {tag.name}
                              </Badge>
                            ))}
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {post.publishedAt ? formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true }) : 'Draft'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {post.readTime} min read
                            </span>
                          </div>
                          <div className="mt-4">
                            <Button variant="ghost" className="w-full group-hover:bg-blue-50">
                              Read Article
                              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Regular Posts */}
          {regularPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {featuredPosts.length > 0 ? 'All Posts' : 'Recent Posts'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Link href={`/blog/${post.slug}`}>
                      <Card className="h-full hover:shadow-lg transition-shadow group cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex flex-wrap gap-2 mb-3">
                            {post.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag.id} variant="secondary" className="text-xs">
                                {tag.name}
                              </Badge>
                            ))}
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {post.publishedAt ? formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true }) : 'Draft'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {post.readTime} min read
                            </span>
                          </div>
                          <Button variant="ghost" className="w-full group-hover:bg-blue-50">
                            Read Article
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {filteredPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-16"
            >
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No articles found
              </h3>
              <p className="text-gray-600">
                {searchTerm || selectedTag
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No articles published yet.'}
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
