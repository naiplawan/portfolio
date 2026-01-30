'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ArrowLeft, Tag, Eye, Loader2, Star } from 'lucide-react';
import Link from 'next/link';
import TipTapEditor from '@/components/blog/editor/TipTapEditor';
import { useBlogPost, useBlogPosts } from '@/lib/hooks';
import { Card } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: post, isLoading, error } = useBlogPost(slug);

  // Fetch related posts (same tags, excluding current post)
  const { data: relatedPosts } = useBlogPosts({
    limit: 3,
  });

  const postsWithSameTags = relatedPosts?.filter(
    (p) => p.id !== post?.id && p.tags.some((t) => post?.tags.some((pt) => pt.id === t.id))
  ).slice(0, 3) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading article...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Article Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The blog post you're looking for doesn't exist, has been removed, or is still a draft.
          </p>
          <Link href="/blog">
            <Button size="lg">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <article className="py-12 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <nav aria-label="Back to blog">
              <Link href="/blog">
                <Button variant="outline" className="mb-8 bg-white hover:bg-gray-50">
                  <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
                  Back to Blog
                </Button>
              </Link>
            </nav>

            <header className="mb-12">
              <div className="flex flex-wrap items-center gap-2 mb-4" role="list" aria-label="Article metadata">
                {post.featured && (
                  <Badge className="bg-yellow-100 text-yellow-800 border-0" role="listitem">
                    <Star className="w-3 h-3 mr-1" aria-hidden="true" />
                    Featured
                  </Badge>
                )}
                {post.status === 'published' && (
                  <Badge variant="outline" className="text-green-600 border-green-600" role="listitem">
                    Published
                  </Badge>
                )}
                {post.status !== 'published' && (
                  <Badge variant="outline" className="text-gray-600 border-gray-600" role="listitem">
                    {post.status === 'draft' ? 'Draft' : post.status}
                  </Badge>
                )}
                {post.viewCount !== undefined && post.viewCount > 0 && (
                  <Badge variant="outline" className="text-blue-600 border-blue-600" role="listitem">
                    <Eye className="w-3 h-3 mr-1" aria-hidden="true" />
                    {post.viewCount} views
                  </Badge>
                )}
              </div>

              <h1 id="article-title" className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {post.excerpt}
              </p>

              {/* Author Info */}
              {post.author && (
                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200" role="group" aria-label="Author information">
                  {post.author.avatar ? (
                    <img
                      src={post.author.avatar}
                      alt={`Avatar of ${post.author.name || 'the author'}`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold" aria-hidden="true">
                      {post.author.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-gray-900">
                      <span className="sr-only">Author: </span>
                      {post.author.name || 'Anonymous'}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8">
                {post.publishedAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Published {formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}</span>
                  </div>
                )}
                {post.readTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime} min read</span>
                  </div>
                )}
                {post.updatedAt && post.updatedAt !== post.publishedAt && (
                  <div className="flex items-center gap-2">
                    <span>Updated {formatDistanceToNow(new Date(post.updatedAt), { addSuffix: true })}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2" role="list" aria-label="Article tags">
                {post.tags.map((tag) => (
                  <Link key={tag.id} href={`/blog?tag=${tag.slug}`}>
                    <Badge variant="secondary" className="text-sm hover:bg-gray-200 cursor-pointer" role="listitem">
                      <Tag className="w-3 h-3 mr-1" aria-hidden="true" />
                      {tag.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            </header>

            {/* Cover Image */}
            {post.coverImage && (
              <div className="mb-12 rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-auto"
                />
              </div>
            )}

            {/* Content */}
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm" role="article" aria-labelledby="article-title">
              <TipTapEditor
                content={post.content}
                onChange={() => {}}
                editable={false}
              />
            </div>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <nav className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" aria-label="Article footer navigation">
                <Link href="/blog">
                  <Button variant="outline" className="bg-white hover:bg-gray-50">
                    <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
                    Back to Blog
                  </Button>
                </Link>
                {post.updatedAt && (
                  <div className="text-gray-500 text-sm" aria-label={`Last updated ${formatDistanceToNow(new Date(post.updatedAt), { addSuffix: true })}`}>
                    Last updated: {formatDistanceToNow(new Date(post.updatedAt), { addSuffix: true })}
                  </div>
                )}
              </nav>
            </div>
          </motion.div>

          {/* Related Posts */}
          {postsWithSameTags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-16"
            >
              <h2 id="related-posts-heading" className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6" role="list" aria-labelledby="related-posts-heading">
                {postsWithSameTags.map((relatedPost) => (
                  <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                    <Card className="h-full hover:shadow-lg transition-shadow group cursor-pointer" role="listitem">
                      <div className="relative h-40 bg-gradient-to-br from-blue-400 to-purple-500 rounded-t-lg overflow-hidden">
                        {relatedPost.coverImage ? (
                          <img
                            src={relatedPost.coverImage}
                            alt={`Cover image for ${relatedPost.title}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center" aria-hidden="true">
                            <span className="text-white text-3xl font-bold opacity-50">
                              {relatedPost.title.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {relatedPost.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                          {relatedPost.excerpt}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          {relatedPost.readTime && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {relatedPost.readTime}m
                            </span>
                          )}
                          {relatedPost.publishedAt && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDistanceToNow(new Date(relatedPost.publishedAt), { addSuffix: true })}
                            </span>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </article>
    </div>
  );
}
