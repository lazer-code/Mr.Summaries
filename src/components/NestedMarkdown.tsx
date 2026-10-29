import React, { useMemo, useEffect, useState } from 'react';
import ReactMarkdown, { defaultUrlTransform } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkBreaks from 'remark-breaks';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { motion } from 'motion/react';
import { ZoomIn, X, Sun, Moon } from 'lucide-react';
import 'katex/dist/katex.min.css';
import remarkMergeSvg from './remarkMergeSvg';

interface SectionNode {
  id: string;
  title: string;
  content: string;
  level: number;
  children: SectionNode[];
}

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\u0590-\u05fe\w-]+/g, '') // Remove all non-word chars (keep Hebrew)
    .replace(/--+/g, '-');    // Replace multiple - with single -
};

const parseSections = (text: string): SectionNode[] => {
  const rawSections = (text || '').split(/(?=^#{1,6}\s)/m).filter(s => s.trim().length > 0);
  const rootNodes: SectionNode[] = [];
  const stack: SectionNode[] = [];

  const usedIds = new Set<string>();

  rawSections.forEach((content, idx) => {
    const match = content.match(/^(#{1,6})\s+(.*)/);
    const level = match ? match[1].length : 6;
    const title = match ? match[2].trim() : `Section ${idx + 1}`;
    let baseId = slugify(title) || `sec-${idx}`;
    let id = baseId;
    let counter = 1;
    
    while (usedIds.has(id)) {
      id = `${baseId}-${counter}`;
      counter++;
    }
    usedIds.add(id);
    
    const node: SectionNode = { id, title, content, level, children: [] };

    while (stack.length > 0 && stack[stack.length - 1].level >= level) {
      stack.pop();
    }

    if (stack.length === 0) {
      rootNodes.push(node);
    } else {
      stack[stack.length - 1].children.push(node);
    }

    stack.push(node);
  });

  return rootNodes;
};

import { Mermaid } from './Mermaid';
import remarkMark, { markHandler } from './remarkMark';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const proseClasses = "prose prose-zinc prose-invert max-w-none break-words prose-headings:break-words prose-headings:font-bold prose-h1:text-cyan-400 prose-h2:text-teal-400 prose-h3:text-emerald-400 prose-h4:text-amber-400 prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-emerald-400 prose-code:text-pink-400 prose-code:bg-pink-900/20 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-700 prose-blockquote:border-s-4 prose-blockquote:border-cyan-500 prose-blockquote:bg-cyan-900/20 prose-blockquote:py-2 prose-blockquote:px-3 sm:px-4 prose-blockquote:rounded-e-lg prose-blockquote:text-cyan-200 prose-li:marker:text-cyan-500 prose-img:rounded-xl prose-img:shadow-md prose-img:max-w-full";

export const customUrlTransform = (url: string) => {
  // Allow data:image/... URIs (svg+xml, png, jpeg, webp, gif, etc.)
  if (/^data:image\//i.test(url)) {
    return url;
  }
  return defaultUrlTransform(url);
};

const decodeSvgDataUri = (dataUri: string): string | null => {
  if (!dataUri || typeof dataUri !== 'string') return null;
  if (!dataUri.startsWith('data:image/svg+xml')) return null;
  try {
    if (dataUri.includes(';base64,')) {
      const base64 = dataUri.split(';base64,')[1].trim();
      const decoded = typeof window !== 'undefined'
        ? decodeURIComponent(escape(atob(base64)))
        : Buffer.from(base64, 'base64').toString('utf-8');
      return decoded.includes('<svg') ? decoded : null;
    }
    const raw = dataUri.split('data:image/svg+xml')[1];
    const content = raw.startsWith(',') ? raw.slice(1) : raw.startsWith(';utf8,') ? raw.slice(6) : raw;
    const decoded = decodeURIComponent(content);
    return decoded.includes('<svg') ? decoded : null;
  } catch {
    try {
      if (dataUri.includes(';base64,')) {
        const base64 = dataUri.split(';base64,')[1].trim();
        const decoded = atob(base64);
        return decoded.includes('<svg') ? decoded : null;
      }
    } catch {}
    return null;
  }
};

interface ParsedImageMeta {
  cleanAlt: string;
  targetWidth?: number | string;
  targetHeight?: number | string;
}

const parseMarkdownImageAlt = (rawAlt?: string): ParsedImageMeta => {
  if (!rawAlt || typeof rawAlt !== 'string') {
    return { cleanAlt: '' };
  }

  const trimmed = rawAlt.trim();

  // Pipe syntax: e.g. "1.svg|700", "title|700x450", "|700", "image.png|80%"
  if (trimmed.includes('|')) {
    const lastPipeIndex = trimmed.lastIndexOf('|');
    const cleanAlt = trimmed.slice(0, lastPipeIndex).trim();
    const sizePart = trimmed.slice(lastPipeIndex + 1).trim();

    // Size can be "700", "700px", "700x450", "80%"
    const dimMatch = sizePart.match(/^(\d+(?:%|px)?)(?:x(\d+(?:%|px)?))?$/i);
    if (dimMatch) {
      const rawW = dimMatch[1];
      const rawH = dimMatch[2];
      const targetWidth = rawW.endsWith('%') || rawW.endsWith('px') ? rawW : parseFloat(rawW);
      const targetHeight = rawH ? (rawH.endsWith('%') || rawH.endsWith('px') ? rawH : parseFloat(rawH)) : undefined;
      return { cleanAlt, targetWidth, targetHeight };
    }
    return { cleanAlt };
  }

  // Size only: e.g. "700" or "700x450"
  const sizeOnlyMatch = trimmed.match(/^(\d+)(?:x(\d+))?$/);
  if (sizeOnlyMatch) {
    return {
      cleanAlt: '',
      targetWidth: parseFloat(sizeOnlyMatch[1]),
      targetHeight: sizeOnlyMatch[2] ? parseFloat(sizeOnlyMatch[2]) : undefined,
    };
  }

  return { cleanAlt: trimmed };
};

interface SvgDimensions {
  width?: number;
  height?: number;
  viewBoxWidth?: number;
  viewBoxHeight?: number;
  aspectRatio?: number;
}

const getSvgDimensions = (svgStr: string): SvgDimensions => {
  if (!svgStr) return {};
  try {
    const svgTagMatch = svgStr.match(/<svg\b([^>]*)>/i);
    if (!svgTagMatch) return {};
    const attrs = svgTagMatch[1];

    // Check raw width / height attributes
    const rawWidthMatch = attrs.match(/\bwidth\s*=\s*["']?([^"'\s>]+)["']?/i);
    const rawHeightMatch = attrs.match(/\bheight\s*=\s*["']?([^"'\s>]+)["']?/i);

    const rawWidth = rawWidthMatch ? rawWidthMatch[1].trim() : '';
    const rawHeight = rawHeightMatch ? rawHeightMatch[1].trim() : '';

    // Ignore percentage widths like "100%" when determining intrinsic pixel size
    let width: number | undefined;
    if (rawWidth && !rawWidth.includes('%')) {
      const num = parseFloat(rawWidth);
      if (!isNaN(num) && num > 0) width = num;
    }

    let height: number | undefined;
    if (rawHeight && !rawHeight.includes('%')) {
      const num = parseFloat(rawHeight);
      if (!isNaN(num) && num > 0) height = num;
    }

    let viewBoxWidth: number | undefined;
    let viewBoxHeight: number | undefined;

    const vbMatch = attrs.match(/\bviewBox\s*=\s*["']\s*([-\d.]+)[,\s]+([-\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)["']/i);
    if (vbMatch) {
      const w = parseFloat(vbMatch[3]);
      const h = parseFloat(vbMatch[4]);
      if (!isNaN(w) && w > 0) viewBoxWidth = w;
      if (!isNaN(h) && h > 0) viewBoxHeight = h;
    }

    // If explicit pixel width is absent (e.g. was 100% or omitted), use viewBox
    if (width === undefined && viewBoxWidth !== undefined) {
      width = viewBoxWidth;
    }
    if (height === undefined && viewBoxHeight !== undefined) {
      height = viewBoxHeight;
    }

    const aspectRatio =
      width && height
        ? width / height
        : viewBoxWidth && viewBoxHeight
        ? viewBoxWidth / viewBoxHeight
        : undefined;

    return { width, height, viewBoxWidth, viewBoxHeight, aspectRatio };
  } catch {
    return {};
  }
};

const MarkdownImage = ({ src, alt, ...props }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [bgLight, setBgLight] = useState(false);

  // Prevent passing AST 'node' or non-standard props to DOM elements
  const { node, ...cleanProps } = props || {};

  const parsedAlt = useMemo(() => parseMarkdownImageAlt(alt), [alt]);

  const svgContent = useMemo(() => {
    return decodeSvgDataUri(src);
  }, [src]);

  const dimensions = useMemo(() => {
    return getSvgDimensions(svgContent || '');
  }, [svgContent]);

  const explicitWidth = cleanProps.width || parsedAlt.targetWidth || dimensions.width;
  const explicitHeight = cleanProps.height || parsedAlt.targetHeight;

  const styleObj = useMemo(() => {
    const styles: React.CSSProperties = {
      maxWidth: '100%',
    };

    if (explicitWidth) {
      styles.width = typeof explicitWidth === 'number' ? `${explicitWidth}px` : explicitWidth;
    }

    if (explicitHeight) {
      styles.height = typeof explicitHeight === 'number' ? `${explicitHeight}px` : explicitHeight;
    } else if (dimensions.aspectRatio) {
      styles.aspectRatio = `${dimensions.viewBoxWidth || dimensions.width} / ${dimensions.viewBoxHeight || dimensions.height}`;
      styles.height = 'auto';
    } else {
      styles.height = 'auto';
    }

    return styles;
  }, [explicitWidth, explicitHeight, dimensions]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (hasError && !svgContent) {
    return (
      <span className="not-prose my-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-950/30 border border-rose-800/40 text-rose-300 text-xs">
        <span>⚠️ שגיאה בטעינת התמונה</span>
      </span>
    );
  }

  return (
    <span className="not-prose my-4 block text-center">
      <span
        onClick={() => setIsOpen(true)}
        className="group relative inline-block cursor-zoom-in rounded-xl border border-zinc-800/80 hover:border-cyan-500/50 bg-zinc-900/60 p-1.5 transition-all max-w-full shadow-sm hover:shadow-cyan-500/10 text-center"
        title="לחץ להגדלה"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
      >
        {svgContent ? (
          <span
            className="svg-renderer block max-w-full overflow-hidden [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-full [&>svg]:block [&>svg]:mx-auto"
            style={styleObj}
            dir="ltr"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        ) : (
          <img
            src={src}
            alt={parsedAlt.cleanAlt || ''}
            loading="eager"
            decoding="sync"
            onError={() => setHasError(true)}
            style={styleObj}
            className="object-contain rounded-lg block mx-auto"
            {...cleanProps}
          />
        )}
      </span>

      {/* Lightbox Modal */}
      {isOpen && (
        <span
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md cursor-default text-right"
          dir="rtl"
          onClick={() => setIsOpen(false)}
        >
          <span
            className="relative flex flex-col w-full max-w-4xl max-h-[92vh] bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <span className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/95 text-zinc-200">
              <span className="text-sm font-medium">
                תצוגת תמונה
              </span>
              <span className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBgLight(!bgLight)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                    bgLight
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
                  }`}
                  title={bgLight ? 'החלף לרקע כהה' : 'החלף לרקע בהיר (לדיאגרמות שחורות)'}
                >
                  {bgLight ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{bgLight ? 'רקע כהה' : 'רקע בהיר'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  title="סגור (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </span>
            </span>

            {/* Modal Body */}
            <span
              className={`flex items-center justify-center p-4 sm:p-8 overflow-auto max-h-[80vh] transition-colors ${
                bgLight ? 'bg-white text-zinc-900' : 'bg-zinc-950/80 text-zinc-100'
              }`}
            >
              {svgContent ? (
                <span
                  className="svg-renderer block max-w-full [&>svg]:max-w-full [&>svg]:h-auto [&>svg]:max-h-[75vh] [&>svg]:w-auto [&>svg]:min-w-[200px] [&>svg]:min-h-[200px] [&>svg]:mx-auto"
                  dir="ltr"
                  dangerouslySetInnerHTML={{ __html: svgContent }}
                />
              ) : (
                <img
                  src={src}
                  alt={alt || ''}
                  className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-sm"
                />
              )}
            </span>
          </span>
        </span>
      )}
    </span>
  );
};

const markdownComponents = {
  img: MarkdownImage,
  table({ children, ...props }: any) {
    return (
      <div className="w-full overflow-x-auto my-4 rounded-xl border border-zinc-800 -webkit-overflow-scrolling-touch">
        <table className="min-w-full divide-y divide-zinc-800" {...props}>
          {children}
        </table>
      </div>
    );
  },
  pre({ children, node, ...props }: any) {
    // For mermaid and svg blocks the `code` component returns its own
    // styled component; bypass the `<pre>` wrapper so its
    // prose-pre dark background doesn't bleed through.
    const codeClass: string =
      node?.children?.[0]?.properties?.className?.[0] ?? '';
    if (/^language-(mermaid|svg)$/.test(codeClass)) {
      return <>{children}</>;
    }
    if (codeClass.startsWith('language-')) {
      return <>{children}</>;
    }
    return <pre className="overflow-x-auto max-w-full" {...props}>{children}</pre>;
  },
  code({ node, inline, className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || '');
    if (!inline && match && match[1] === 'mermaid') {
      return (
        <div className="overflow-x-auto my-4 max-w-full">
          <Mermaid chart={String(children).replace(/\n$/, '')} />
        </div>
      );
    }
    if (!inline && match && match[1] === 'svg') {
      return <span dangerouslySetInnerHTML={{ __html: String(children).replace(/\n$/, '') }} className="svg-renderer overflow-x-auto block my-2" />;
    }
    if (!inline && match) {
      return (
        <div className="overflow-x-auto max-w-full my-4 rounded-xl">
          <SyntaxHighlighter
            {...props}
            style={vscDarkPlus}
            language={match[1]}
            PreTag="div"
            CodeTag="span"
            className="rounded-xl !my-0 !bg-zinc-900 border border-zinc-700 text-xs sm:text-sm"
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      );
    }
    return (
      <code className={`${className || ''} break-all`} {...props}>
        {children}
      </code>
    );
  }
};

const SectionRenderer = React.memo(({ node, index }: { node: SectionNode, index: number }) => {
  let containerClasses = '';
  if (node.level === 1) {
    containerClasses = 'p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-zinc-900/60 border border-zinc-700/50 shadow-sm mb-6 sm:mb-8 backdrop-blur-xl scroll-mt-24';
  } else if (node.level === 2) {
    containerClasses = 'p-3.5 sm:p-6 rounded-xl sm:rounded-2xl bg-zinc-800/50 border border-zinc-600/50 shadow-sm mt-4 sm:mt-6 backdrop-blur-lg scroll-mt-24';
  } else if (node.level === 3) {
    containerClasses = 'p-3 sm:p-5 rounded-lg sm:rounded-xl bg-zinc-700/40 border border-zinc-500/50 shadow-sm mt-3 sm:mt-4 backdrop-blur-md scroll-mt-24';
  } else {
    containerClasses = 'p-2.5 sm:p-4 rounded-lg bg-zinc-600/30 border border-zinc-400/50 shadow-sm mt-3 sm:mt-4 backdrop-blur-sm scroll-mt-24';
  }

  return (
    <motion.div
      id={node.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className={containerClasses}
      data-section-title={node.title}
    >
      <div className={proseClasses}>
        <ReactMarkdown 
          remarkPlugins={[remarkGfm, remarkMath, remarkBreaks, remarkMark, remarkMergeSvg]} 
          rehypePlugins={[
            rehypeRaw,
            [rehypeKatex, { strict: false }]
          ]}
          remarkRehypeOptions={{ handlers: { mark: markHandler } as Record<string, unknown> }}
          components={markdownComponents}
          urlTransform={customUrlTransform}
        >
          {node.content}
        </ReactMarkdown>
      </div>
      
      {node.children.length > 0 && (
        <div className="mt-2">
          {node.children.map((child, idx) => (
            <SectionRenderer key={child.id} node={child} index={idx} />
          ))}
        </div>
      )}
    </motion.div>
  );
});

export const NestedMarkdown = React.memo(({ content, rightAlign = false, onTOCChange }: { content: string, rightAlign?: boolean, onTOCChange?: (toc: { id: string, title: string, level: number }[]) => void }) => {
  const rootNodes = useMemo(() => parseSections(content), [content]);
  
  useEffect(() => {
    if (onTOCChange) {
      const toc: { id: string, title: string, level: number }[] = [];
      const flatten = (nodes: SectionNode[]) => {
        nodes.forEach(node => {
          toc.push({ id: node.id, title: node.title, level: node.level });
          flatten(node.children);
        });
      };
      flatten(rootNodes);
      onTOCChange(toc);
    }
  }, [rootNodes, onTOCChange]);

  return (
    <div className={`pb-12 ${rightAlign ? 'text-right' : 'text-left'}`} dir={rightAlign ? 'rtl' : 'ltr'}>
      {rootNodes.map((node, idx) => (
        <SectionRenderer key={node.id} node={node} index={idx} />
      ))}
    </div>
  );
});
