'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Plus,
  Edit,
  Trash2,
  Save,
  FileText,
  Clock,
  Calendar,
  Star,
  BookOpen,
  Tag,
  Search,
  LogOut,
  User,
  X,
  Loader2,
} from 'lucide-react';
import NavBar from '@/components/portfolio/NavBar';
import { BlogPostDto, CreateBlogPostInput } from '@/lib/types/blog-types';
import {
  useAuthorPosts,
  useAuthorStats,
  useCreatePost,
  useUpdatePost,
  useDeletePost,
} from '@/lib/hooks';
import { useSupabaseAuth } from '@/lib/hooks/use-auth';
import SupabaseProtectedRoute from '@/components/auth/SupabaseProtectedRoute';
import TipTapEditor from '@/components/blog/editor/TipTapEditor';
import { formatDistanceToNow } from 'date-fns';
import { UploadService } from '@/lib/services/upload.service';
import { createClient } from '@/lib/supabase/client';
import {
  createBlogPostSchema,
  updateBlogPostSchema,
  extractValidationErrors,
} from '@/lib/validations/blog-schemas';

interface BlogFormProps {
  post?: BlogPostDto;
  onSave: () => void;
  onCancel: () => void;
  userId: string;
}

function BlogForm({ post, onSave, onCancel, userId }: BlogFormProps) {
  const [formData, setFormData] = useState<CreateBlogPostInput>({
    title: post?.title || '',
    excerpt: post?.excerpt || '',
    content: post?.content || { type: 'doc', content: [] },
    tags: post?.tags.map(t => t.name) || [],
    featured: post?.featured || false,
    status: post?.status || 'draft',
    category: post?.category || 'technical',
    coverImageUrl: post?.coverImage || undefined,
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { mutate: createPost, isPending: isCreating } = useCreatePost();
  const { mutate: updatePost, isPending: isUpdating } = useUpdatePost();

  const handleSave = async () => {
    setErrors({});

    // Validate form data using Zod
    const schema = post ? updateBlogPostSchema : createBlogPostSchema;
    const validationResult = schema.safeParse(formData);

    if (!validationResult.success) {
      const validationErrors = extractValidationErrors(validationResult.error);
      setErrors(validationErrors);
      return;
    }

    setIsSaving(true);

    try {
      if (post) {
        await updatePost({
          id: post.id,
          input: formData,
          authorId: userId,
        });
      } else {
        await createPost({
          input: formData,
          authorId: userId,
        });
      }
      onSave();
    } catch (error) {
      console.error('Failed to save post:', error);
      // Toast is handled by the hook
    } finally {
      setIsSaving(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag) || [],
    }));
  };

  const handleCoverUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const client = createClient();
      const service = new UploadService(client);
      const url = await service.uploadCoverImage(file, userId, post?.id);

      setFormData(prev => ({ ...prev, coverImageUrl: url }));
    } catch (error) {
      console.error('Failed to upload cover:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const isLoading = isSaving || isCreating || isUpdating;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
        <h2 className="text-xl sm:text-2xl font-bold">
          {post ? 'Edit Post' : 'Create New Post'}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel} className="flex-1 sm:flex-none" disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1 sm:flex-none" disabled={isLoading || isUploading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4 order-2 lg:order-1">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <Input
              value={formData.title}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, title: e.target.value }));
                setErrors(prev => ({ ...prev, title: undefined }));
              }}
              placeholder="Enter post title..."
              className={`text-lg ${errors.title ? 'border-red-500' : ''}`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Excerpt</label>
            <Textarea
              value={formData.excerpt}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, excerpt: e.target.value }));
                setErrors(prev => ({ ...prev, excerpt: undefined }));
              }}
              placeholder="Brief description of your post..."
              rows={3}
              className={errors.excerpt ? 'border-red-500' : ''}
            />
            {errors.excerpt && (
              <p className="text-red-500 text-sm mt-1">{errors.excerpt}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Content</label>
            <div className={errors.content ? 'border border-red-500 rounded-lg' : ''}>
              <TipTapEditor
                content={formData.content}
                onChange={(value) => {
                  setFormData(prev => ({ ...prev, content: value }));
                  setErrors(prev => ({ ...prev, content: undefined }));
                }}
                onImageUpload={async (file) => {
                  // For inline images in content, you can implement upload here
                  // For now, we'll use base64 for inline images
                  return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target?.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                  });
                }}
              />
            </div>
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content}</p>
            )}
          </div>
        </div>

        <div className="space-y-4 order-1 lg:order-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Post Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as 'technical' | 'career' | 'tutorial' | 'thoughts' }))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="technical">Technical</option>
                  <option value="career">Career</option>
                  <option value="tutorial">Tutorial</option>
                  <option value="thoughts">Thoughts</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="featured" className="text-sm font-medium">
                  Featured Post
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Cover Image</label>
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      handleCoverUpload(e);
                      setErrors(prev => ({ ...prev, coverImageUrl: undefined }));
                    }}
                    disabled={isUploading}
                    className={`text-sm ${errors.coverImageUrl ? 'border-red-500' : ''}`}
                  />
                  {formData.coverImageUrl && (
                    <div className="relative group">
                      <img
                        src={formData.coverImageUrl}
                        alt="Cover preview"
                        className="w-full h-32 object-cover rounded"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                        onClick={() => setFormData(prev => ({ ...prev, coverImageUrl: undefined }))}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
                {errors.coverImageUrl && (
                  <p className="text-red-500 text-sm mt-1">{errors.coverImageUrl}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add tag..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className={`flex-1 text-sm ${errors.tags ? 'border-red-500' : ''}`}
                  />
                  <Button
                    onClick={() => {
                      addTag();
                      setErrors(prev => ({ ...prev, tags: undefined }));
                    }}
                    size="sm"
                    className="px-3"
                    disabled={isLoading}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {formData.tags?.map(tag => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeTag(tag)}
                    >
                      {tag} <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
                {errors.tags && (
                  <p className="text-red-500 text-sm mt-1">{errors.tags}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function BlogManageContent() {
  const [selectedPost, setSelectedPost] = useState<BlogPostDto | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  const { user, signOut } = useSupabaseAuth();

  const { data: posts, isLoading: isLoadingPosts } = useAuthorPosts(user?.id || '', true);
  const { data: stats } = useAuthorStats(user?.id || '');

  const refreshPosts = () => {
    // React Query will auto-refresh
    setIsEditing(false);
    setSelectedPost(null);
  };

  const handleDeleteClick = (id: string) => {
    setPostToDelete(id);
    setDeleteDialogOpen(true);
  };

  const { mutate: deletePost, isPending: isDeleting } = useDeletePost();

  const handleDeleteConfirm = () => {
    if (postToDelete && user) {
      deletePost({
        id: postToDelete,
        authorId: user.id,
      });
    }
    setDeleteDialogOpen(false);
    setPostToDelete(null);
  };

  const filteredPosts = posts?.filter(post => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></Loader2>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="pt-24 pb-16 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {selectedPost ? (
              <BlogForm
                post={selectedPost}
                onSave={refreshPosts}
                onCancel={() => setIsEditing(false)}
                userId={user.id}
              />
            ) : (
              <BlogForm
                onSave={refreshPosts}
                onCancel={() => setIsEditing(false)}
                userId={user.id}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <section className="pt-24 pb-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="mb-6">
              <div className="mb-4">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  Blog Management
                </h1>
                <p className="text-gray-600">
                  Create, edit, and organize your blog posts
                </p>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg w-fit">
                  <User className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-800 font-medium">Admin</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button
                    variant="outline"
                    onClick={() => signOut()}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 w-full sm:w-auto"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                  <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    New Post
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Posts</p>
                      <p className="text-2xl font-bold">{stats?.total || 0}</p>
                    </div>
                    <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Published</p>
                      <p className="text-2xl font-bold text-green-600">{stats?.published || 0}</p>
                    </div>
                    <BookOpen className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Drafts</p>
                      <p className="text-2xl font-bold text-yellow-600">{stats?.drafts || 0}</p>
                    </div>
                    <Edit className="w-8 h-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Featured</p>
                      <p className="text-2xl font-bold text-purple-600">{stats?.featured || 0}</p>
                    </div>
                    <Star className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'published' | 'draft')}
                  className="px-3 py-2 border rounded-md w-full sm:w-auto min-w-0"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Drafts</option>
                </select>
              </div>
            </div>

            {/* Posts List */}
            <div className="space-y-4">
              {isLoadingPosts ? (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Loading posts...</p>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No posts found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || statusFilter !== 'all'
                      ? 'Try adjusting your search or filter criteria.'
                      : 'Get started by creating your first blog post.'}
                  </p>
                  <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Post
                  </Button>
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="space-y-3 sm:space-y-0 sm:flex sm:justify-between sm:items-start">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate flex-1 min-w-0">
                            {post.title}
                          </h3>
                          <div className="flex gap-1 flex-shrink-0">
                            <Badge
                              variant={post.status === 'published' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {post.status}
                            </Badge>
                            {post.featured && (
                              <Badge variant="outline" className="text-purple-600 border-purple-600 text-xs">
                                <Star className="w-3 h-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-600 mb-3 line-clamp-2 text-sm sm:text-base">
                          {post.excerpt}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{post.publishedAt ? formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true }) : 'Draft'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{post.readTime} min read</span>
                          </div>
                          <div className="flex items-center gap-1 min-w-0">
                            <Tag className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span className="truncate">{post.tags.map(t => t.name).join(', ') || 'No tags'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 sm:ml-4 justify-end sm:justify-start">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedPost(post);
                            setIsEditing(true);
                          }}
                          className="h-8 w-8 sm:h-9 sm:w-auto sm:px-3"
                        >
                          <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline sm:ml-1">Edit</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(post.id)}
                          className="text-red-600 hover:text-red-700 h-8 w-8 sm:h-9 sm:w-auto sm:px-3"
                          disabled={isDeleting}
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline sm:ml-1">{isDeleting ? 'Deleting...' : 'Delete'}</span>
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function BlogManagePage() {
  return (
    <SupabaseProtectedRoute>
      <BlogManageContent />
    </SupabaseProtectedRoute>
  );
}
