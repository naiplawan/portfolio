/**
 * TipTap Editor Extensions Configuration
 *
 * This file exports TipTap extensions for the blog editor
 * You can customize and extend the editor with additional extensions here
 */

import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';

/**
 * Configure syntax highlighting for code blocks
 */
const lowlight = createLowlight(common);

/**
 * Default TipTap extensions
 */
export const defaultExtensions = [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3, 4, 5, 6],
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
    autolink: true,
    linkOnPaste: true,
  }),
  Placeholder.configure({
    placeholder: 'Write your blog post...',
    emptyEditorClass: 'is-editor-empty',
  }),
  Underline,
  TextAlign.configure({
    types: ['left', 'center', 'right', 'justify'],
  }),
  CodeBlockLowlight.configure({
    lowlight,
    defaultLanguage: null,
    HTMLAttributes: {
      class: 'bg-gray-900 text-gray-100 p-4 rounded-lg my-4 overflow-x-auto font-mono text-sm',
    },
  }),
];

/**
 * Extensions for read-only viewer
 */
export const viewerExtensions = [
  StarterKit.configure(),
  Image,
  Link,
];
