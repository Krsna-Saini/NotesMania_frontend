import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CheckCheckIcon, Clipboard, Cross, Pencil, Quote } from "lucide-react";
import Button from "../../Multipurpose/Button/Index";
import { MarddownClasses } from "@/lib/utils";
const MarkdownRenderer = ({
  pending,
  content,
  scrollRef,
  setSelectedTextForQuery
}: {
  pending: boolean;
  content: string;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  setSelectedTextForQuery?: (content: string) => void
}) => {


  const wrapperRef = useRef<HTMLDivElement>(null);
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number } | null>(null);
  const [selectedText, setSelectedText] = useState("");
  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      const wrapper = wrapperRef.current;

      if (selection && !selection.isCollapsed && wrapper?.contains(selection.anchorNode)) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        setTooltipPos({
          top: rect.top + window.scrollY - 40,
          left: rect.left + window.scrollX,
        });

        setSelectedText(selection.toString());
      } else {
        setTooltipPos(null);
        setSelectedText("");
      }
    };

    const handleScroll = () => {
      setTooltipPos(null);
      setSelectedText("");
    };

    const scrollContainer = scrollRef?.current;

    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
    }

    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [scrollRef]);


  const handleTooltip = () => {
    if(!setSelectedTextForQuery)return;
    setSelectedTextForQuery(selectedText);
    setTooltipPos(null);
  };

  return (
    <div ref={wrapperRef} className="relative">
      {/* ToolTip For Selected Text */}
      {tooltipPos && setSelectedTextForQuery && (
        <div
          className="fixed w-fit text-white rounded text-sm shadow-lg z-10"
          style={{
            top: tooltipPos.top,
            left: tooltipPos.left,
          }}
        >
          <Button icon={Quote} align="top" role="Ask AI" onClick={handleTooltip}></Button>
        </div>
      )}
      {/* Markdown Content */}
      <div  className={MarddownClasses}>
        <ReactMarkdown
          remarkPlugins={[
            remarkGfm,
            [remarkMath, { singleDollarTextMath: false }] 
          ]}
          rehypePlugins={[
            [rehypeKatex, {
              output: 'html',
              strict: false 
            }]
          ]}
          components={{
            hr: ({ ...props }) => (
              <hr
                className="my-18 border-gray-300 dark:border-gray-600"
                style={{ ...props.style }}
                {...props}
              />
            ),
            code({  className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              const codeString = String(children).replace(/\n$/, "");

              if (match) {
                return (
                  <CodeComponent language={match[1]} props={props} setSelectedTextForQuery={setSelectedTextForQuery} codeString={codeString} />
                );
              } else {
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }
            },
          }}
        >
          {content}
        </ReactMarkdown>


        {/* Loading Spinner */}

        {pending && (
          <div className="w-full flex justify-center items-center">
            <div className="items-center relative justify-center px-3 mt-2 py-1 gap-2 flex w-[10px] h-[10px] rounded-lg">
              <div className="loader backdrop:blur-2xl h-screen w-screen">
                <div className="inner one"></div>
                <div className="inner two"></div>
                <div className="inner three"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(MarkdownRenderer);

const CodeComponent = ({ codeString, setSelectedTextForQuery, language, props }: {
  codeString: string,
  setSelectedTextForQuery?: (codestring: string) => void,
  language: string,
  props: React.HTMLAttributes<HTMLElement>
}) => {
  const [copied, setCopied] = useState(false);
  const [Edited, setEdited] = useState(false);
  const handleEdited = (text: string) => {
    if (!setSelectedTextForQuery) return;
    setSelectedTextForQuery(text)
    setEdited(true);
    setTimeout(() => setEdited(false), 1500);
  };
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="relative ">


      {/* Sticky toolbar (now using absolute positioning) */}

      <div className="translate-y-10 bg-neutral-600 p-2 rounded-t-lg">
        <span>{language}</span>
      </div>
      <div className="sticky ml-[100%] -translate-x-full w-full -translate-y-2 justify-end right-2 top-0 pt-4 z-10 flex  bg-transparent  pr-2 pl-2 ">


        {/* Icons or Buttons */}

        <div className="flex gap-2 bg-neutral-600 ">
          <button
            onClick={() => handleCopy(codeString)}
            className="flex items-center gap-1 text-xs cursor-pointer text-white hover:bg-gray-700 px-2 py-1 rounded transition-all"
          >
            {!copied ? <Clipboard className="size-3" /> : <CheckCheckIcon className="size-3" />}
            {copied ? "Copied!" : "Copy"}
          </button>
          {
            setSelectedTextForQuery && (
              <button
                onClick={() => handleEdited(codeString)}
                className="flex items-center gap-1 text-xs cursor-pointer text-white hover:bg-gray-700 px-2 py-1 rounded transition-all"
              >
                <span className="relative">
                  <Pencil className="size-3" />
                  <Cross
                    size={7}
                    className="absolute -top-[1px] -left-[1px] bg-gray-700 text-white rounded-full"
                  />
                </span>
                {Edited ? "Ready!" : "Edit"}
              </button>
            )
          }
        </div>
      </div>

      {/* Code block (SyntaxHighlighter) */}
      <div className="relative overflow-auto max-h-[70vh] pt-6 bg-[#2b2b2b]">
        <SyntaxHighlighter
          language={language}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          style={a11yDark as any}
          PreTag="div"
          customStyle={{
            margin: 0,
            borderRadius: "0 0 0.5rem 0.5rem",
            padding: "0 0 1rem 1rem",
            position: "relative",
            overflow: "auto",
          }}
          {...props}
        >
          {codeString}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}