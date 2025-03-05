import { useMemo } from "react";
import { unified, Plugin } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeReact from "rehype-react";
import { createElement, Fragment } from "react";
import * as prod from "react/jsx-runtime";
import rehypeStringify from "rehype-stringify";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";

import {
  Children,
  Fragment,
  createElement,
  isValidElement,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import React from "react";
import flattenChildren from "react-keyed-flatten-children";
import {
  ArrowsAltOutlined,
  CheckOutlined,
  CopyTwoTone,
} from "@ant-design/icons";

const CodeBlock = ({ children, className }: JSX.IntrinsicElements["code"]) => {
  const [copied, setCopied] = useState(false);
  const [showMermaidPreview, setShowMermaidPreview] = useState(false);
  const [showLatexPreview, setShowLatexPreview] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (copied) {
      const interval = setTimeout(() => setCopied(false), 1000);
      return () => clearTimeout(interval);
    }
  }, [copied]);

  // Highlight.js adds a `className` so this is a hack to detect if the code block
  // is a language block wrapped in a `pre` tag.
  if (className) {
    const isMermaid = className.includes("language-mermaid");
    const isLatex = className.includes("language-latex");

    return (
      <>
        <code
          ref={ref}
          className={`${className} flex-grow flex-shrink my-auto`}
        >
          {children}
        </code>
        <div className="flex flex-col gap-1 flex-grow-0 flex-shrink-0">
          <button
            type="button"
            className="rounded-md p-1 text-emerald-900 hover:bg-emerald-200 border-2 border-emerald-200 transition-colors"
            aria-label="copy code to clipboard"
            title="Copy code to clipboard"
            onClick={() => {
              if (ref.current) {
                navigator.clipboard.writeText(ref.current.innerText ?? "");
                setCopied(true);
              }
            }}
          >
            {copied ? (
              <CheckOutlined className="w-4 h-4" />
            ) : (
              <CopyTwoTone className="w-4 h-4" />
            )}
          </button>
          {isMermaid ? (
            <>
              <button
                type="button"
                className="rounded-md p-1 text-emerald-900 hover:bg-emerald-200 border-2 border-emerald-200 transition-colors"
                aria-label="Open Mermaid preview"
                title="Open Mermaid preview"
                onClick={() => {
                  setShowMermaidPreview(true);
                }}
              >
                <ArrowsAltOutlined className="w-4 h-4" />
              </button>
            </>
          ) : null}
        </div>
      </>
    );
  }

  return (
    <code className="inline-block font-code bg-emerald-100 text-emerald-950 p-0.5 -my-0.5 rounded">
      {children}
    </code>
  );
};
const production = {
  Fragment: prod.Fragment,
  jsx: prod.jsx,
  jsxs: prod.jsxs,
  components: {
    a: ({ href, children }: JSX.IntrinsicElements["a"]) => (
      <a href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    ),
    h1: ({ children, id }: JSX.IntrinsicElements["h1"]) => (
      <h1
        className="font-sans font-semibold text-2xl text-emerald-950 mb-6 mt-6"
        id={id}
      >
        {children}
      </h1>
    ),
    h2: ({ children, id }: JSX.IntrinsicElements["h2"]) => (
      <h2
        className="font-sans font-medium text-2xl text-emerald-950 mb-6 mt-6"
        id={id}
      >
        {children}
      </h2>
    ),
    h3: ({ children, id }: JSX.IntrinsicElements["h3"]) => (
      <h3
        className="font-sans font-semibold text-xl text-emerald-950 mb-6 mt-2"
        id={id}
      >
        {children}
      </h3>
    ),
    h4: ({ children, id }: JSX.IntrinsicElements["h4"]) => (
      <h4
        className="font-sans font-medium text-xl text-emerald-950 my-6"
        id={id}
      >
        {children}
      </h4>
    ),
    h5: ({ children, id }: JSX.IntrinsicElements["h5"]) => (
      <h5
        className="font-sans font-semibold text-lg text-emerald-950 my-6"
        id={id}
      >
        {children}
      </h5>
    ),
    h6: ({ children, id }: JSX.IntrinsicElements["h6"]) => (
      <h6
        className="font-sans font-medium text-lg text-emerald-950 my-6"
        id={id}
      >
        {children}
      </h6>
    ),
    p: (props: JSX.IntrinsicElements["p"]) => {
      return (
        <p
          className="font-sans text-sm text-emerald-900 mb-6"
          style={{ whiteSpace: "pre-wrap" }}
        >
          {props.children}
        </p>
      );
    },
    strong: ({ children }: JSX.IntrinsicElements["strong"]) => (
      <strong className="text-emerald-950 font-semibold">{children}</strong>
    ),
    em: ({ children }: JSX.IntrinsicElements["em"]) => <em>{children}</em>,
    code: CodeBlock,
    pre: ({ children }: JSX.IntrinsicElements["pre"]) => {
      return (
        <div className="relative mb-6">
          <pre className="p-4 rounded-lg border-2 border-emerald-200 bg-emerald-100 [&>code.hljs]:p-0 [&>code.hljs]:bg-transparent font-code text-sm overflow-x-auto flex items-start">
            {children}
          </pre>
        </div>
      );
    },
    ul: ({ children }: JSX.IntrinsicElements["ul"]) => (
      <ul className="flex flex-col gap-3 text-emerald-900 my-6 pl-3 [&_ol]:my-3 [&_ul]:my-3">
        {Children.map(
          flattenChildren(children).filter(isValidElement),
          (child, index) => (
            <li key={index} className="flex gap-2 items-start">
              <div className="w-1 h-1 rounded-full bg-current block shrink-0 mt-1" />
              {child}
            </li>
          ),
        )}
      </ul>
    ),
    ol: ({ children }: JSX.IntrinsicElements["ol"]) => (
      <ol className="flex flex-col gap-3 text-emerald-900 my-6 pl-3 [&_ol]:my-3 [&_ul]:my-3">
        {Children.map(
          flattenChildren(children).filter(isValidElement),
          (child, index) => (
            <li key={index} className="flex gap-2 items-start">
              <div
                className="font-sans text-sm text-emerald-900 font-semibold shrink-0 min-w-[1.4ch]"
                aria-hidden
              >
                {index + 1}.
              </div>
              {child}
            </li>
          ),
        )}
      </ol>
    ),
    li: ({ children }: JSX.IntrinsicElements["li"]) => (
      <div className="font-sans text-sm">{children}</div>
    ),
    table: ({ children }: JSX.IntrinsicElements["table"]) => (
      <div className="overflow-x-auto mb-6">
        <table className="table-auto border-2 border-emerald-200">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }: JSX.IntrinsicElements["thead"]) => (
      <thead className="bg-emerald-100">{children}</thead>
    ),
    th: ({ children }: JSX.IntrinsicElements["th"]) => (
      <th className="border-2 border-emerald-200 p-2 font-sans text-sm font-semibold text-emerald-950">
        {children}
      </th>
    ),
    td: ({ children }: JSX.IntrinsicElements["td"]) => (
      <td className="border-2 border-emerald-200 p-2 font-sans text-sm text-emerald-900">
        {children}
      </td>
    ),
    blockquote: ({ children }: JSX.IntrinsicElements["blockquote"]) => (
      <blockquote className="border-l-4 border-emerald-200 pl-2 text-emerald-900 italic">
        {children}
      </blockquote>
    ),
  },
};

interface MarkdownProcessorProps {
  content: string;
}

export const useMarkdownProcessor: React.FC<MarkdownProcessorProps> = ({
  content,
}) => {
  const [Content, setContent] = useState(createElement(Fragment));
  const processor = unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .use(rehypeReact, production);
  useEffect(
    function () {
      (async function () {
        const file = await processor.process(content);
        setContent(file.result);
      })();
    },
    [content],
  );
  return Content;
};
