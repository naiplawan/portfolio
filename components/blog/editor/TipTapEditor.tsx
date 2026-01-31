'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import { useCallback, useEffect, useRef } from 'react';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Image as ImageIcon,
  Link as LinkIcon,
  Link2Off,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

/**
 * TipTap Editor Props
 */
interface TipTapEditorProps {
  content: any; // TipTap JSON content
  onChange: (content: any) => void;
  onSave?: () => void;
  editable?: boolean;
  placeholder?: string;
  onImageUpload?: (file: File) => Promise<string>;
}

/**
 * TipTap Editor Component
 *
 * A modern WYSIWYG editor with Medium-like experience
 * Supports rich text, images, links, and more
 */
export default function TipTapEditor({
  content,
  onChange,
  onSave,
  editable = true,
  placeholder = 'Write your blog post...',
  onImageUpload,
}: TipTapEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc list-inside ml-4',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal list-inside ml-4',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4',
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'bg-gray-900 text-gray-100 p-4 rounded-lg my-4 overflow-x-auto font-mono text-sm',
          },
        },
        code: {
          HTMLAttributes: {
            class: 'bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono',
          },
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: false,
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto my-4',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-700 underline',
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content,
    editable,
    immediatelyRender: false, // Prevent SSR hydration mismatch
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[500px] px-4 py-3 sm:px-6 sm:py-4',
        role: 'textbox',
        'aria-multiline': 'true',
        'aria-label': editable ? 'Blog post content editor' : 'Blog post content',
      },
    },
  });

  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editor) return;

    try {
      if (onImageUpload) {
        // Use custom upload handler
        const url = await onImageUpload(file);
        editor.chain().focus().setImage({ src: url }).run();
      } else {
        // Fallback: convert to base64 (not recommended for large files)
        const reader = new FileReader();
        reader.onload = (e) => {
          const url = e.target?.result as string;
          editor.chain().focus().setImage({ src: url }).run();
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
      toast.error('Failed to upload image. Please try again.');
    }

    // Reset input
    event.target.value = '';
  }, [editor, onImageUpload]);

  const triggerImageUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Handle drag and drop
  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      if (file && file.type.startsWith('image/') && editor) {
        if (onImageUpload) {
          onImageUpload(file)
            .then((url) => {
              editor.chain().focus().setImage({ src: url }).run();
            })
            .catch((error) => {
              console.error('Failed to upload image:', error);
              toast.error('Failed to upload image. Please try again.');
            });
        } else {
          // Fallback: convert to base64
          const reader = new FileReader();
          reader.onload = (e) => {
            const url = e.target?.result as string;
            editor.chain().focus().setImage({ src: url }).run();
          };
          reader.readAsDataURL(file);
        }
      }
    },
    [editor, onImageUpload]
  );

  useEffect(() => {
    if (editor && content !== editor.getJSON()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div className="border rounded-lg p-8">
        <p className="text-center text-gray-500">Loading editor...</p>
      </div>
    );
  }

  const MenuBar = () => (
    <Card className="p-2 sticky top-0 z-10 mb-4 border-b rounded-b-none" role="toolbar" aria-label="Text formatting toolbar">
      <div className="flex flex-wrap items-center gap-1">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-gray-200' : ''}
          title="Bold (Ctrl+B)"
          aria-label="Toggle bold text"
          aria-pressed={editor.isActive('bold')}
        >
          <Bold className="w-4 h-4" aria-hidden="true" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-gray-200' : ''}
          title="Italic (Ctrl+I)"
          aria-label="Toggle italic text"
          aria-pressed={editor.isActive('italic')}
        >
          <Italic className="w-4 h-4" aria-hidden="true" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? 'bg-gray-200' : ''}
          title="Strikethrough"
          aria-label="Toggle strikethrough"
          aria-pressed={editor.isActive('strike')}
        >
          <Strikethrough className="w-4 h-4" aria-hidden="true" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={editor.isActive('code') ? 'bg-gray-200' : ''}
          title="Code"
          aria-label="Toggle inline code"
          aria-pressed={editor.isActive('code')}
        >
          <Code className="w-4 h-4" aria-hidden="true" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1 hidden sm:block" aria-hidden="true" />

        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}
          title="Heading 1"
          aria-label="Toggle heading 1"
          aria-pressed={editor.isActive('heading', { level: 1 })}
        >
          <Heading1 className="w-4 h-4" aria-hidden="true" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}
          title="Heading 2"
          aria-label="Toggle heading 2"
          aria-pressed={editor.isActive('heading', { level: 2 })}
        >
          <Heading2 className="w-4 h-4" aria-hidden="true" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}
          title="Heading 3"
          aria-label="Toggle heading 3"
          aria-pressed={editor.isActive('heading', { level: 3 })}
        >
          <Heading3 className="w-4 h-4" aria-hidden="true" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1 hidden sm:block" aria-hidden="true" />

        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}
          title="Bullet List"
          aria-label="Toggle bullet list"
          aria-pressed={editor.isActive('bulletList')}
        >
          <List className="w-4 h-4" aria-hidden="true" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-gray-200' : ''}
          title="Numbered List"
          aria-label="Toggle numbered list"
          aria-pressed={editor.isActive('orderedList')}
        >
          <ListOrdered className="w-4 h-4" aria-hidden="true" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'bg-gray-200' : ''}
          title="Blockquote"
          aria-label="Toggle blockquote"
          aria-pressed={editor.isActive('blockquote')}
        >
          <Quote className="w-4 h-4" aria-hidden="true" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1 hidden sm:block" aria-hidden="true" />

        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            const url = window.prompt('Enter URL:');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          className={editor.isActive('link') ? 'bg-gray-200' : ''}
          title="Add Link"
          aria-label="Add link"
          aria-pressed={editor.isActive('link')}
        >
          <LinkIcon className="w-4 h-4" aria-hidden="true" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive('link')}
          title="Remove Link"
          aria-label="Remove link"
        >
          <Link2Off className="w-4 h-4" aria-hidden="true" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1 hidden sm:block" aria-hidden="true" />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
          aria-label="Upload image"
        />
        <Button
          size="sm"
          variant="ghost"
          onClick={triggerImageUpload}
          title="Insert Image"
          aria-label="Insert image"
        >
          <ImageIcon className="w-4 h-4" aria-hidden="true" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1 hidden sm:block" aria-hidden="true" />

        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo (Ctrl+Z)"
          aria-label="Undo"
        >
          <Undo className="w-4 h-4" aria-hidden="true" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo (Ctrl+Y)"
          aria-label="Redo"
        >
          <Redo className="w-4 h-4" aria-hidden="true" />
        </Button>
      </div>
    </Card>
  );

  return (
    <div
      className={`space-y-4 ${editable ? '' : 'pointer-events-none opacity-75'}`}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      {editable && <MenuBar />}

      <Card
        className={`overflow-hidden rounded-t-none ${editable ? 'min-h-[500px]' : ''}`}
        onClick={() => editor?.chain().focus()}
      >
        <EditorContent
          editor={editor}
          className="prose max-w-none"
        />
      </Card>

      {onSave && editable && (
        <div className="flex justify-end">
          <Button onClick={onSave} size="lg">
            Save Post
          </Button>
        </div>
      )}

      {/* Editor Styles */}
      <style jsx global>{`
        .ProseMirror p.is-editor-empty::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }

        .ProseMirror:focus {
          outline: none;
        }

        .ProseMirror h1 {
          font-size: 2em;
          font-weight: bold;
          margin-bottom: 0.5em;
          margin-top: 1em;
        }

        .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin-bottom: 0.5em;
          margin-top: 1em;
        }

        .ProseMirror h3 {
          font-size: 1.25em;
          font-weight: bold;
          margin-bottom: 0.5em;
          margin-top: 1em;
        }

        .ProseMirror p {
          margin-bottom: 1em;
        }

        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.5em;
          margin-bottom: 1em;
        }

        .ProseMirror li {
          margin-bottom: 0.25em;
        }

        .ProseMirror blockquote {
          border-left: 3px solid #e5e7eb;
          padding-left: 1em;
          font-style: italic;
          margin-bottom: 1em;
          color: #6b7280;
        }

        .ProseMirror code {
          background-color: #f3f4f6;
          padding: 0.2em 0.4em;
          border-radius: 0.25em;
          font-size: 0.875em;
        }

        .ProseMirror pre {
          background-color: #1f2937;
          color: #f9fafb;
          padding: 1em;
          border-radius: 0.5em;
          overflow-x: auto;
          margin-bottom: 1em;
        }

        .ProseMirror pre code {
          background-color: transparent;
          padding: 0;
          color: inherit;
        }

        .ProseMirror img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 1em auto;
        }

        .ProseMirror a {
          color: #2563eb;
          text-decoration: underline;
        }

        .ProseMirror a:hover {
          color: #1d4ed8;
        }
      `}</style>
    </div>
  );
}

/**
 * Read-only TipTap viewer component
 */
export function TipTapViewer({ content }: { content: any }) {
  return (
    <TipTapEditor
      content={content}
      onChange={() => {}}
      editable={false}
    />
  );
}
