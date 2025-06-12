/* eslint-disable @typescript-eslint/no-explicit-any */
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

const MarkdownRenderer = ({ text }:{
  text:string
}) => {
  return (
    <div className="relative border p-4 rounded-lg bg-gray-900 text-white">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code({ inline, children, ...props }: { inline?: boolean; children?: React.ReactNode }) {
            let copied=false;
            const codeString = String(children).replace(/\n$/, "");

            const handleCopy = () => {
              navigator.clipboard.writeText(codeString);
              copied=true;
              setTimeout(() => copied=false, 1500);
            };

            return !inline ? (
              <div className="relative">
                <SyntaxHighlighter style={dracula as any} language="javascript" PreTag="div" {...props}>
                  {codeString}
                </SyntaxHighlighter>

                {/* Copy Button */}
                <button
                  onClick={handleCopy}
                  className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            ) : (
              <code className="bg-gray-700 px-1 py-0.5 rounded" {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
