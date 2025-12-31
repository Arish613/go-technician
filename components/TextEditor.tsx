"use client";

import { Controller, Control, FieldValues, Path } from "react-hook-form";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldContent,
} from "./ui/field";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Unlink,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";

interface RichTextEditorProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const addLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl || "");

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  const addImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 p-3 flex flex-wrap gap-1 sticky top-0 z-10 bg-background">
      {/* Text Formatting */}
      <Button
        type="button"
        variant={editor.isActive("bold") ? "default" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="w-4 h-4" />
      </Button>

      <Button
        type="button"
        variant={editor.isActive("italic") ? "default" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="w-4 h-4" />
      </Button>

      <Button
        type="button"
        variant={editor.isActive("strike") ? "default" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="w-4 h-4" />
      </Button>

      <Separator orientation="vertical" className="h-8 mx-1" />

      {/* Headings */}
      <Button
        type="button"
        variant={editor.isActive("heading", { level: 1 }) ? "default" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 className="w-4 h-4" />
      </Button>

      <Button
        type="button"
        variant={editor.isActive("heading", { level: 2 }) ? "default" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="w-4 h-4" />
      </Button>

      <Button
        type="button"
        variant={editor.isActive("heading", { level: 3 }) ? "default" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="w-4 h-4" />
      </Button>

      <Separator orientation="vertical" className="h-8 mx-1" />

      {/* Lists */}
      <Button
        type="button"
        variant={editor.isActive("bulletList") ? "default" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="w-4 h-4" />
      </Button>

      <Button
        type="button"
        variant={editor.isActive("orderedList") ? "default" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="w-4 h-4" />
      </Button>

      <Separator orientation="vertical" className="h-8 mx-1" />

      {/* Alignment */}
      <Button
        type="button"
        variant={editor.isActive({ textAlign: "left" }) ? "default" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <AlignLeft className="w-4 h-4" />
      </Button>

      <Button
        type="button"
        variant={editor.isActive({ textAlign: "center" }) ? "default" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenter className="w-4 h-4" />
      </Button>

      <Button
        type="button"
        variant={editor.isActive({ textAlign: "right" }) ? "default" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <AlignRight className="w-4 h-4" />
      </Button>

      <Separator orientation="vertical" className="h-8 mx-1" />

      {/* Quote & Code */}
      <Button
        type="button"
        variant={editor.isActive("blockquote") ? "default" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="w-4 h-4" />
      </Button>

      <Button
        type="button"
        variant={editor.isActive("codeBlock") ? "default" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <Code className="w-4 h-4" />
      </Button>

      <Separator orientation="vertical" className="h-8 mx-1" />

      {/* Link & Image */}
      <Button
        type="button"
        variant={editor.isActive("link") ? "default" : "ghost"}
        size="sm"
        onClick={addLink}
        title="Add or edit link"
      >
        <LinkIcon className="w-4 h-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={removeLink}
        disabled={!editor.isActive("link")}
        title="Remove link"
        className="disabled:opacity-50"
      >
        <Unlink className="w-4 h-4" />
      </Button>

      <Button type="button" variant="ghost" size="sm" onClick={addImage}>
        <ImageIcon className="w-4 h-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() =>
          editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run()
        }
      >
        Insert Table
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().addColumnAfter().run()}
      >
        Add Column
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().addRowAfter().run()}
      >
        Add Row
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().deleteTable().run()}
      >
        Delete Table
      </Button>

      <Separator orientation="vertical" className="h-8 mx-1" />

      {/* Undo/Redo */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        <Undo className="w-4 h-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        <Redo className="w-4 h-4" />
      </Button>
    </div>
  );
};

const RichTextEditor = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder = "Start writing...",
  description,
  disabled = false,
}: RichTextEditorProps<T>) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fieldRef = useRef<any>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 hover:text-blue-800 underline cursor-pointer",
        },
      }),
      Image,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Color,
      Highlight,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: "",
    onUpdate: ({ editor }) => {
      if (fieldRef.current) {
        fieldRef.current.onChange(editor.getHTML());
      }
    },
    editable: !disabled,
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4",
        placeholder: placeholder,
      },
    },
  });

  useEffect(() => {
    if (editor) {
      const currentValue = control._formValues[name] || "";
      if (editor.getHTML() !== currentValue) {
        editor.commands.setContent(currentValue);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, control._formValues[name], name]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        fieldRef.current = field;

        return (
          <Field data-invalid={!!fieldState.error}>
            <FieldLabel>{label}</FieldLabel>
            <FieldContent>
              <div className="border border-input rounded-md bg-background overflow-hidden max-h-125 overflow-y-auto">
                <MenuBar editor={editor} />
                <EditorContent
                  editor={editor}
                  className="min-h-50 [&_.ProseMirror]:min-h-50 [&_.ProseMirror]:p-4 [&_.ProseMirror]:focus:outline-none"
                />
              </div>
              {description && (
                <FieldDescription>{description}</FieldDescription>
              )}
              <FieldError errors={fieldState.error ? [fieldState.error] : []} />
            </FieldContent>
          </Field>
        );
      }}
    />
  );
};

export default RichTextEditor;
