import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table';
import Placeholder from '@tiptap/extension-placeholder';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight, common } from 'lowlight';
import { useState } from 'react';

const lowlight = createLowlight(common);

const ToolBtn = ({ onClick, active, title, children }) => (
  <button type="button" onClick={onClick} title={title}
    className={`px-2 py-1 rounded text-sm hover:bg-gray-200 transition-colors ${active ? 'bg-gray-300 font-bold' : ''}`}>
    {children}
  </button>
);

const Divider = () => <div className="w-px h-5 bg-gray-300 mx-1" />;

export default function RichEditor({ value, onChange }) {
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      CodeBlockLowlight.configure({ lowlight }),
      Image.configure({ inline: false }),
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Table.configure({ resizable: true }),
      TableRow, TableCell, TableHeader,
      Placeholder.configure({ placeholder: 'লিখতে শুরু করো...' }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
      setShowImageInput(false);
    }
  };

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 px-2 py-1.5 flex flex-wrap items-center gap-0.5">
        {/* Headings */}
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })} title="Heading 1">H1</ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })} title="Heading 2">H2</ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })} title="Heading 3">H3</ToolBtn>

        <Divider />

        {/* Text formatting */}
        <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')} title="Bold"><b>B</b></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')} title="Italic"><i>I</i></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')} title="Strikethrough"><s>S</s></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive('code')} title="Inline Code">`c`</ToolBtn>

        <Divider />

        {/* Alignment */}
        <ToolBtn onClick={() => editor.chain().focus().setTextAlign('left').run()}
          active={editor.isActive({ textAlign: 'left' })} title="Align Left">⬅</ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setTextAlign('center').run()}
          active={editor.isActive({ textAlign: 'center' })} title="Align Center">↔</ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setTextAlign('right').run()}
          active={editor.isActive({ textAlign: 'right' })} title="Align Right">➡</ToolBtn>

        <Divider />

        {/* Lists */}
        <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')} title="Bullet List">• List</ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')} title="Numbered List">1. List</ToolBtn>

        <Divider />

        {/* Blocks */}
        <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')} title="Blockquote">" "</ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive('codeBlock')} title="Code Block">{'</>'}</ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">—</ToolBtn>

        <Divider />

        {/* Table */}
        <ToolBtn onClick={insertTable} title="Insert Table">⊞ Table</ToolBtn>
        {editor.isActive('table') && <>
          <ToolBtn onClick={() => editor.chain().focus().addColumnAfter().run()} title="Add Column">+Col</ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().addRowAfter().run()} title="Add Row">+Row</ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().deleteTable().run()} title="Delete Table">✕Tbl</ToolBtn>
        </>}

        <Divider />

        {/* Image */}
        <ToolBtn onClick={() => setShowImageInput(v => !v)} title="Insert Image">🖼 Image</ToolBtn>

        {/* Link */}
        <ToolBtn onClick={() => setShowLinkInput(v => !v)}
          active={editor.isActive('link')} title="Insert Link">🔗 Link</ToolBtn>
        {editor.isActive('link') &&
          <ToolBtn onClick={() => editor.chain().focus().unsetLink().run()} title="Remove Link">✕Link</ToolBtn>
        }

        <Divider />

        {/* Undo/Redo */}
        <ToolBtn onClick={() => editor.chain().focus().undo().run()} title="Undo">↩</ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().redo().run()} title="Redo">↪</ToolBtn>
      </div>

      {/* Image URL input */}
      {showImageInput && (
        <div className="flex gap-2 px-3 py-2 bg-blue-50 border-b border-gray-200">
          <input className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
            placeholder="Image URL দাও..." value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addImage()} />
          <button type="button" onClick={addImage}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">Add</button>
          <button type="button" onClick={() => setShowImageInput(false)}
            className="px-3 py-1 bg-gray-300 text-sm rounded hover:bg-gray-400">Cancel</button>
        </div>
      )}

      {/* Link URL input */}
      {showLinkInput && (
        <div className="flex gap-2 px-3 py-2 bg-blue-50 border-b border-gray-200">
          <input className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
            placeholder="Link URL দাও..." value={linkUrl}
            onChange={e => setLinkUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addLink()} />
          <button type="button" onClick={addLink}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">Add</button>
          <button type="button" onClick={() => setShowLinkInput(false)}
            className="px-3 py-1 bg-gray-300 text-sm rounded hover:bg-gray-400">Cancel</button>
        </div>
      )}

      {/* Editor area */}
      <EditorContent editor={editor}
        className="min-h-[500px] px-6 py-4 prose prose-gray max-w-none focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[500px]" />
    </div>
  );
}
