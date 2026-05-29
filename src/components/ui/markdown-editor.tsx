"use client";

import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { 
    Highlighter, Table, Sigma 
} from 'lucide-react';

const mathSymbols = [
    { label: 'π', value: 'π' }, { label: 'Σ', value: 'Σ' }, { label: 'α', value: 'α' },
    { label: 'β', value: 'β' }, { label: 'γ', value: 'γ' }, { label: 'Δ', value: 'Δ' },
    { label: 'θ', value: 'θ' }, { label: 'λ', value: 'λ' }, { label: 'μ', value: 'μ' },
    { label: '∞', value: '∞' }, { label: '≈', value: '≈' }, { label: '≠', value: '≠' },
    { label: '±', value: '±' }, { label: '√', value: '√' }, { label: '∫', value: '∫' },
    { label: '∂', value: '∂' }, { label: '∇', value: '∇' }, { label: '∈', value: '∈' },
    { label: '⊆', value: '⊆' }, { label: '∀', value: '∀' }, { label: '∃', value: '∃' }
];

const snippets = {
    table: "| Column 1 | Column 2 |\n| -------- | -------- |\n| Cell 1 | Cell 2 |",
    question: "\n> **Question:** \n> \n> **Answer:** \n",
    note: "\n> [!NOTE]\n> \n"
};

interface MarkdownEditorProps {
    initialContent?: string;
    defaultValue?: string;
    fileName?: string;
    name?: string;
    id?: string;
    rows?: number;
    placeholder?: string;
}

export function MarkdownEditor({ 
    initialContent = "", 
    defaultValue = "",
    fileName = "Document.md",
    name = "content",
    id,
    rows = 20,
    placeholder = "Start typing your markdown..."
}: MarkdownEditorProps) {
    const [content, setContent] = useState(initialContent || defaultValue);
    const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');
    
    // Toolbar state
    const [isHighlightMode, setIsHighlightMode] = useState(false);
    const [isTableDialogOpen, setIsTableDialogOpen] = useState(false);
    const [tableRows, setTableRows] = useState(3);
    const [tableCols, setTableCols] = useState(3);
    const [showSymbols, setShowSymbols] = useState(false);

    // Refs for synchronized scrolling
    const editorRef = useRef<HTMLDivElement>(null);
    const previewRef = useRef<HTMLDivElement>(null);
    const isScrolling = useRef<'editor' | 'preview' | null>(null);

    const handleEditorScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (viewMode !== 'split' || isScrolling.current === 'preview') return;
        isScrolling.current = 'editor';
        const target = e.target as HTMLDivElement;
        const { scrollTop, scrollHeight, clientHeight } = target;
        const ratio = scrollTop / (scrollHeight - clientHeight);
        if (previewRef.current) {
            previewRef.current.scrollTop = ratio * (previewRef.current.scrollHeight - previewRef.current.clientHeight);
        }
        setTimeout(() => isScrolling.current = null, 50);
    };

    const handlePreviewScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (viewMode !== 'split' || isScrolling.current === 'editor') return;
        isScrolling.current = 'preview';
        const target = e.target as HTMLDivElement;
        const { scrollTop, scrollHeight, clientHeight } = target;
        const ratio = scrollTop / (scrollHeight - clientHeight);
        if (editorRef.current) {
            editorRef.current.scrollTop = ratio * (editorRef.current.scrollHeight - editorRef.current.clientHeight);
        }
        setTimeout(() => isScrolling.current = null, 50);
    };

    const insertSnippet = (snippet: string) => {
        const textarea = document.getElementById(id || 'markdown-editor') as HTMLTextAreaElement | null;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = content || "";
        const before = text.substring(0, start);
        const after = text.substring(end, text.length);

        const newContent = before + snippet + after;
        setContent(newContent);
        
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + snippet.length, start + snippet.length);
        }, 10);
    };

    const handleInsertTable = () => {
        let md = "\n|";
        for (let c = 1; c <= tableCols; c++) md += ` Column ${c} | `;
        md += "\n|";
        for (let c = 1; c <= tableCols; c++) md += " --- |";
        md += "\n";
        for (let r = 1; r <= tableRows; r++) {
            md += "|";
            for (let c = 1; c <= tableCols; c++) md += ` Cell ${r}-${c} | `;
            md += "\n";
        }
        insertSnippet(md);
        setIsTableDialogOpen(false);
    };

    const toggleHighlight = () => {
        const textarea = document.getElementById(id || 'markdown-editor') as HTMLTextAreaElement | null;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = content || "";
        
        if (start !== end) {
            const selectedText = text.substring(start, end);
            const newSnippet = "`" + selectedText + "`";
            const before = text.substring(0, start);
            const after = text.substring(end, text.length);
            const newContent = before + newSnippet + after;
            setContent(newContent);
            setIsHighlightMode(false);
            
            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(start, start + newSnippet.length);
            }, 10);
        } else {
            const before = text.substring(0, start);
            const after = text.substring(end, text.length);
            const newContent = before + "`" + after;
            setContent(newContent);
            setIsHighlightMode(!isHighlightMode);

            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(start + 1, start + 1);
            }, 10);
        }
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden h-full min-h-[500px] w-full border border-zinc-200 dark:border-zinc-800 rounded-lg">
            <input type="hidden" name={name} value={content} />
            {/* Toolbar */}
            <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-zinc-950 gap-4 relative z-20 overflow-visible rounded-t-lg">
                <div className="flex items-center gap-4 shrink-0">
                    <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
                        <button
                            type="button"
                            onClick={() => setViewMode('edit')}
                            className={cn("px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all", viewMode === 'edit' ? "bg-white dark:bg-zinc-700 text-blue-600 shadow-sm" : "text-zinc-500 hover:text-zinc-700")}
                        >
                            Source
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('preview')}
                            className={cn("px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all", viewMode === 'preview' ? "bg-white dark:bg-zinc-700 text-blue-600 shadow-sm" : "text-zinc-500 hover:text-zinc-700")}
                        >
                            Preview
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('split')}
                            className={cn("px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all", viewMode === 'split' ? "bg-white dark:bg-zinc-700 text-blue-600 shadow-sm" : "text-zinc-500 hover:text-zinc-700")}
                        >
                            Split
                        </button>
                    </div>
                </div>

                {/* Editor Actions */}
                <div className="flex items-center gap-1.5 flex-1 justify-center min-w-max">
                    <button
                        type="button"
                        onClick={toggleHighlight}
                        className={cn(
                            "p-2 rounded-lg transition-all",
                            isHighlightMode
                                ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30 animate-pulse" 
                                : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        )}
                        title="Highlight Mode (`)"
                    >
                        <Highlighter className="w-4 h-4" />
                    </button>

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsTableDialogOpen(!isTableDialogOpen)}
                            className={cn(
                                "p-2 rounded-lg transition-all",
                                isTableDialogOpen ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600" : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            )}
                            title="Insert Table"
                        >
                            <Table className="w-4 h-4" />
                        </button>

                        {isTableDialogOpen && (
                            <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-[100] p-4">
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Rows</label>
                                        <input
                                            type="number"
                                            value={tableRows}
                                            onChange={(e) => setTableRows(parseInt(e.target.value))}
                                            className="w-full h-8 px-2 text-xs rounded-lg bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Columns</label>
                                        <input
                                            type="number"
                                            value={tableCols}
                                            onChange={(e) => setTableCols(parseInt(e.target.value))}
                                            className="w-full h-8 px-2 text-xs rounded-lg bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 outline-none"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleInsertTable}
                                        className="w-full h-8 text-[10px] font-black uppercase tracking-widest bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                                    >
                                        Insert Table
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="w-[1px] h-4 bg-zinc-200 dark:bg-zinc-800 mx-1" />

                    <button
                        type="button"
                        onClick={() => insertSnippet(snippets.question)}
                        className="px-2 py-1 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-all"
                    >
                        Question
                    </button>
                    <button
                        type="button"
                        onClick={() => insertSnippet(snippets.note)}
                        className="px-2 py-1 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-all"
                    >
                        Note
                    </button>

                    <div className="w-[1px] h-4 bg-zinc-200 dark:bg-zinc-800 mx-1" />

                    <button
                        type="button"
                        onClick={() => setShowSymbols(!showSymbols)}
                        className={cn(
                            "p-2 rounded-lg transition-all",
                            showSymbols ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600" : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        )}
                    >
                        <Sigma className="w-4 h-4" />
                    </button>

                    {showSymbols && (
                        <div className="flex items-center gap-0.5 ml-2 bg-zinc-50 dark:bg-zinc-900 p-0.5 rounded-lg border border-zinc-200 dark:border-zinc-800 max-w-[200px] overflow-x-auto no-scrollbar">
                            {mathSymbols.map((sym, i) => (
                                <button
                                    type="button"
                                    key={i}
                                    onClick={() => insertSnippet(sym.value)}
                                    className="w-7 h-7 shrink-0 flex items-center justify-center text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-800 rounded transition-all"
                                >
                                    {sym.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Editor Content */}
            <div className="flex-1 overflow-y-auto bg-zinc-50/30 dark:bg-zinc-950/20 rounded-b-lg">
                <div className={cn("mx-auto bg-white dark:bg-zinc-900 shadow-sm min-h-full", viewMode === 'split' ? "max-w-none w-full h-full flex" : "w-full h-full flex flex-col p-4")}>
                    {viewMode === 'split' ? (
                        <>
                            <div className="flex-1 border-r border-zinc-200 dark:border-zinc-800 overflow-y-auto p-4" onScroll={handleEditorScroll} ref={editorRef}>
                                <textarea
                                    id={id || "markdown-editor"}
                                    name={name}
                                    rows={rows}
                                    className="w-full h-full min-h-[500px] bg-transparent outline-none font-mono text-sm leading-relaxed border-none resize-none"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder={placeholder}
                                />
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 prose dark:prose-invert max-w-none" onScroll={handlePreviewScroll} ref={previewRef}>
                                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={{ img: ({ node, ...props }) => <img style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} {...props} /> }}>
                                    {content}
                                </ReactMarkdown>
                            </div>
                        </>
                    ) : viewMode === 'preview' ? (
                        <div className="flex-1 overflow-y-auto p-4 prose dark:prose-invert max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={{ img: ({ node, ...props }) => <img style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} {...props} /> }}>
                                {content}
                            </ReactMarkdown>
                        </div>
                    ) : (
                        <textarea
                            id={id || "markdown-editor"}
                            name={name}
                            rows={rows}
                            className="w-full flex-1 min-h-[500px] bg-transparent outline-none font-mono text-sm leading-relaxed border-none resize-none p-4"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder={placeholder}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
