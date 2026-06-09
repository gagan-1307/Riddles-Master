import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { 
  Bold, 
  Italic, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Undo, 
  Redo 
} from 'lucide-react';

interface TiptapEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function TiptapEditor({ value, onChange, placeholder = 'Write statement here...' }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: 'prose prose-sans max-w-none focus:outline-none min-h-[180px] p-4 text-[#3d3d3a] leading-relaxed text-[15px]',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync incoming value changes (e.g. from db pre-population) without losing editor focus
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  const toggleButtonStyles = (isActive: boolean) => {
    return `p-2 rounded transition-colors text-[#6c6a64] hover:text-[#141413] hover:bg-[#efe9de]/40 ${
      isActive ? 'bg-[#efe9de] text-[#cc785c] font-bold border border-[#e6dfd8]/80' : 'border border-transparent'
    }`;
  };

  return (
    <div className="rounded-lg border border-[#e6dfd8] bg-[#faf9f5] overflow-hidden focus-within:ring-2 focus-within:ring-[#cc785c]/10 focus-within:border-[#cc785c]">
      {/* Editor Toolbar - Styled matching design system */}
      <div className="flex flex-wrap items-center gap-1 bg-[#f5f0e8]/50 px-3 py-2 border-b border-[#e6dfd8]">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={toggleButtonStyles(editor.isActive('bold'))}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={toggleButtonStyles(editor.isActive('italic'))}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        
        <div className="w-px h-5 bg-[#e6dfd8] mx-1"></div>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={toggleButtonStyles(editor.isActive('heading', { level: 2 }))}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={toggleButtonStyles(editor.isActive('heading', { level: 3 }))}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </button>

        <div className="w-px h-5 bg-[#e6dfd8] mx-1"></div>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={toggleButtonStyles(editor.isActive('bulletList'))}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={toggleButtonStyles(editor.isActive('orderedList'))}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>

        <div className="w-px h-5 bg-[#e6dfd8] mx-1 flex-1 sm:flex-none"></div>

        <div className="flex gap-1 ml-auto">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className="p-2 text-[#6c6a64] hover:text-[#141413] hover:bg-[#efe9de]/40 rounded disabled:opacity-40 disabled:hover:bg-transparent"
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className="p-2 text-[#6c6a64] hover:text-[#141413] hover:bg-[#efe9de]/40 rounded disabled:opacity-40 disabled:hover:bg-transparent"
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="bg-[#faf9f5]">
        <style dangerouslySetInnerHTML={{ __html: `
          .ProseMirror h2 {
            font-family: Copernicus, Tiempos Headline, Georgia, serif;
            font-size: 1.45rem;
            font-weight: 500;
            color: #141413;
            margin-top: 1.25rem;
            margin-bottom: 0.5rem;
          }
          .ProseMirror h3 {
            font-family: StyreneB, Inter, sans-serif;
            font-size: 1.15rem;
            font-weight: 600;
            color: #141413;
            margin-top: 1rem;
            margin-bottom: 0.4rem;
          }
          .ProseMirror p {
            margin-bottom: 0.75rem;
          }
          .ProseMirror ul {
            list-style-type: disc;
            padding-left: 1.5rem;
            margin-bottom: 0.75rem;
          }
          .ProseMirror ol {
            list-style-type: decimal;
            padding-left: 1.5rem;
            margin-bottom: 0.75rem;
          }
          .ProseMirror li {
            margin-bottom: 0.25rem;
          }
        `}} />
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
