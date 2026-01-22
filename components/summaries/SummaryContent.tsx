"use client";

import { useEffect, useRef } from "react";
import katex from "katex";

interface SummaryContentProps {
  content: string;
}

export function SummaryContent({ content }: SummaryContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    // Process the content to render LaTeX
    const processContent = () => {
      if (!contentRef.current) return;

      // Find all inline math (delimited by $...$)
      const inlineMathRegex = /\$([^$]+)\$/g;
      // Find all display math (delimited by $$...$$)
      const displayMathRegex = /\$\$([^$]+)\$\$/g;

      let processedContent = content;

      // Process display math first (to avoid conflicts with inline math)
      processedContent = processedContent.replace(displayMathRegex, (_, math) => {
        try {
          return katex.renderToString(math.trim(), {
            displayMode: true,
            throwOnError: false,
          });
        } catch {
          return `$$${math}$$`;
        }
      });

      // Process inline math
      processedContent = processedContent.replace(inlineMathRegex, (_, math) => {
        try {
          return katex.renderToString(math.trim(), {
            displayMode: false,
            throwOnError: false,
          });
        } catch {
          return `$${math}$`;
        }
      });

      // Convert markdown-style formatting to HTML
      // Headers
      processedContent = processedContent.replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold mt-6 mb-3 text-gray-900 dark:text-white">$1</h3>');
      processedContent = processedContent.replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">$1</h2>');
      processedContent = processedContent.replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mt-10 mb-5 text-gray-900 dark:text-white">$1</h1>');

      // Bold and italic
      processedContent = processedContent.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>');
      processedContent = processedContent.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');

      // Code blocks
      processedContent = processedContent.replace(/```(\w+)?\n([\s\S]+?)```/g, '<pre class="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto my-4"><code class="text-sm">$2</code></pre>');

      // Inline code
      processedContent = processedContent.replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded text-sm">$1</code>');

      // Lists
      processedContent = processedContent.replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>');
      
      // Paragraphs (wrap text not in other tags)
      const lines = processedContent.split('\n');
      const formattedLines = lines.map(line => {
        if (line.trim() === '') return '<br/>';
        if (line.match(/^<[^>]+>/)) return line;
        if (line.trim().startsWith('|')) return line; // Table row
        return `<p class="mb-4 text-gray-700 dark:text-gray-300">${line}</p>`;
      });
      processedContent = formattedLines.join('\n');

      // Tables
      processedContent = processContentTables(processedContent);

      contentRef.current.innerHTML = processedContent;
    };

    processContent();
  }, [content]);

  return (
    <div
      ref={contentRef}
      className="prose prose-lg max-w-none dark:prose-invert"
    />
  );
}

// Helper function to process markdown tables
function processContentTables(content: string): string {
  const lines = content.split('\n');
  let inTable = false;
  let tableRows: string[] = [];
  const result: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.trim().startsWith('|')) {
      if (!inTable) {
        inTable = true;
        tableRows = [];
      }
      tableRows.push(line);
    } else {
      if (inTable) {
        // Process the table
        result.push(convertTableToHTML(tableRows));
        inTable = false;
        tableRows = [];
      }
      result.push(line);
    }
  }

  if (inTable && tableRows.length > 0) {
    result.push(convertTableToHTML(tableRows));
  }

  return result.join('\n');
}

function convertTableToHTML(rows: string[]): string {
  if (rows.length < 2) return rows.join('\n');

  const headerRow = rows[0];
  const dataRows = rows.slice(2);

  // Parse header
  const headers = headerRow.split('|').filter(h => h.trim()).map(h => h.trim());

  // Parse data rows
  const parsedDataRows = dataRows.map(row => 
    row.split('|').filter(cell => cell.trim()).map(cell => cell.trim())
  );

  let html = '<table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 my-6 border border-gray-200 dark:border-gray-700">';
  
  // Header
  html += '<thead class="bg-gray-50 dark:bg-gray-800">';
  html += '<tr>';
  headers.forEach(header => {
    html += `<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">${header}</th>`;
  });
  html += '</tr>';
  html += '</thead>';

  // Body
  html += '<tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">';
  parsedDataRows.forEach(row => {
    html += '<tr>';
    row.forEach(cell => {
      html += `<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">${cell}</td>`;
    });
    html += '</tr>';
  });
  html += '</tbody>';
  html += '</table>';

  return html;
}
