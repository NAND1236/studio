
import React from 'react';

type MarkdownRendererProps = {
  content: string;
};

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const lines = content.split('\n');

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none space-y-2 text-sm">
      {lines.map((line, index) => {
        line = line.trim();

        if (line.startsWith('### ')) {
          return <h4 key={index} className="font-bold mt-4 mb-1 text-base">{line.substring(4)}</h4>;
        }
        if (line.startsWith('## ')) {
          return <h3 key={index} className="font-bold mt-4 mb-1 text-lg">{line.substring(3)}</h3>;
        }
        if (line.startsWith('# ')) {
          return <h2 key={index} className="font-bold mt-4 mb-2 text-xl">{line.substring(2)}</h2>;
        }
        if (line.startsWith('* ') || line.startsWith('- ')) {
          return (
            <div key={index} className="flex items-start">
              <span className="mr-2 mt-1">•</span>
              <p className="flex-1" dangerouslySetInnerHTML={{ __html: formatText(line.substring(2)) }} />
            </div>
          );
        }
        if (line === '') {
          return null;
        }
        return <p key={index} dangerouslySetInnerHTML={{ __html: formatText(line) }} />;
      })}
    </div>
  );
}

function formatText(text: string) {
    // Bold: **text**
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>');
    return text;
}
