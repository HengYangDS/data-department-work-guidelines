import { decodeHTML } from "entities";
import { lint } from "markdownlint/sync";
import { Parser } from "htmlparser2";
import { micromark } from "micromark";
import { gfmTable, gfmTableHtml } from "micromark-extension-gfm-table";

function parseMarkdown(source, name) {
  let tokens;
  let frontMatterLines = 0;
  lint({
    strings: { [name]: source },
    noInlineConfig: true,
    config: { default: false, "document-structure": true },
    customRules: [
      {
        names: ["document-structure"],
        tags: ["structure"],
        description: "Expose the native Markdown structure to its consumers",
        parser: "micromark",
        function(params) {
          tokens = params.parsers.micromark.tokens;
          frontMatterLines = params.frontMatterLines.length;
        },
      },
    ],
  });
  if (!Array.isArray(tokens)) throw new Error("native Markdown structure is unavailable");
  return {
    tokens,
    frontMatterLines,
    body: frontMatterLines
      ? source
          .split(/\r\n|\n|\r/u)
          .slice(frontMatterLines)
          .join("\n")
      : source,
  };
}

export function markdownTokens(source, name = "document.md") {
  const { tokens, frontMatterLines } = parseMarkdown(source, name);
  if (!frontMatterLines) return tokens;
  function sourceCoordinates(token, parent) {
    const mapped = {
      ...token,
      startLine: token.startLine + frontMatterLines,
      endLine: token.endLine + frontMatterLines,
      parent,
      children: [],
    };
    mapped.children = token.children.map((child) => sourceCoordinates(child, mapped));
    return mapped;
  }
  return tokens.map((token) => sourceCoordinates(token, undefined));
}

export function* walkMarkdown(tokens) {
  for (const token of tokens) {
    // Native unresolved-reference annotations repeat source content; they are
    // not additional document nodes.
    if (token.type.startsWith("undefinedReference")) continue;
    yield token;
    yield* walkMarkdown(token.children);
  }
}

export function headingLevel(token) {
  if (token.type === "atxHeading") {
    return token.children.find((child) => child.type === "atxHeadingSequence").text.length;
  }
  if (token.type === "setextHeading") {
    return token.children.find((child) => child.type === "setextHeadingLine").text.startsWith("-")
      ? 2
      : 1;
  }
  return 0;
}

export function markdownText(token, { links = true, code = false } = {}) {
  if (token.type === "data" || token.type === "characterEscapeValue") return token.text;
  if (token.type === "characterReference") return decodeHTML(token.text);
  if (token.type === "lineEnding" || token.type === "lineEndingBlank") return "\n";
  if (token.type === "codeText") {
    return code
      ? token.children
          .filter((child) => child.type === "codeTextData")
          .map((child) => child.text)
          .join(" ")
      : " ";
  }
  if (token.type === "link") {
    return links
      ? token.children
          .filter((child) => child.type === "label")
          .map((child) => markdownText(child, { links, code }))
          .join("")
      : " ";
  }
  if (
    [
      "image",
      "autolink",
      "literalAutolink",
      "resource",
      "htmlFlow",
      "htmlText",
      "codeFenced",
      "codeIndented",
      "mathText",
      "mathFlow",
    ].includes(token.type) ||
    token.type.startsWith("undefinedReference")
  )
    return " ";
  return token.children.map((child) => markdownText(child, { links, code })).join("");
}

export function headingText(token) {
  return token.children
    .filter((child) => ["atxHeadingText", "setextHeadingText"].includes(child.type))
    .map((child) => markdownText(child, { code: true }))
    .join("");
}

export function markdownLinkDestinations(source) {
  const destinations = [];
  let anchor;
  new Parser({
    onopentag(name, attributes) {
      if (name === "a" && attributes.href !== undefined) {
        anchor = { destination: attributes.href, label: "" };
      } else if (name === "img" && anchor) {
        anchor.label += attributes.alt ?? "";
      }
    },
    ontext(text) {
      if (anchor) anchor.label += text;
    },
    onclosetag(name) {
      if (name === "a" && anchor) {
        if (/[^\p{White_Space}\p{Default_Ignorable_Code_Point}]/u.test(anchor.label))
          destinations.push(anchor.destination);
        anchor = undefined;
      }
    },
  }).end(
    micromark(parseMarkdown(source, "document.md").body, {
      extensions: [gfmTable()],
      htmlExtensions: [gfmTableHtml()],
    }),
  );
  return destinations;
}

// Match Vale's native comment controls after HTML decoding, not prose mentions.
const valeControl = /^vale (?:on|off|styles? = [^\r\n]*|[^\r\n]+ = (?:YES|NO|on|off))$/u;

/** @type {import("markdownlint").Rule} */
export const noQualityControl = {
  names: ["no-quality-control"],
  description: "Prose rules are configured by the repository, not document comments",
  tags: ["comments"],
  parser: "micromark",
  function(params, onError) {
    const pending = [...params.parsers.micromark.tokens];
    while (pending.length) {
      const token = pending.pop();
      pending.push(...token.children);
      if (token.type === "htmlFlow" || token.type === "htmlText") {
        new Parser({
          oncomment(comment) {
            const consumer = valeControl.test(decodeHTML(comment).trim()) ? "Vale" : "";
            if (consumer) {
              onError({
                lineNumber: token.startLine,
                detail: `Remove the ${consumer} control comment; correct the source or its governed policy.`,
              });
            }
          },
        }).end(token.text);
      }
    }
  },
};

export default noQualityControl;
