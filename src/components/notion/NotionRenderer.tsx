/* eslint-disable @next/next/no-img-element -- static export; images are local files in public/cms */
import type { ReactNode } from "react";
import type { RichTextItemResponse } from "@notionhq/client";
import type { NotionBlock } from "@/lib/notion/types";
import { cn } from "@/lib/utils";

/**
 * Renders Notion page bodies (About, project case studies) with theme styling.
 * Covers the blocks you'd write in a portfolio; anything else is skipped.
 */

export function RichText({ items }: { items: RichTextItemResponse[] }) {
  return (
    <>
      {items.map((item, i) => {
        const { bold, italic, strikethrough, underline, code } = item.annotations;
        let node: ReactNode = item.plain_text;
        if (code) node = <code className="rounded-sm bg-glass px-1.5 py-0.5 text-[0.9em] text-fg">{node}</code>;
        if (bold) node = <strong className="font-semibold text-fg">{node}</strong>;
        if (italic) node = <em>{node}</em>;
        if (strikethrough) node = <s>{node}</s>;
        if (underline) node = <u>{node}</u>;
        const href = item.href;
        if (href) {
          const external = /^https?:/.test(href);
          node = (
            <a
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer" : undefined}
              className="text-fg underline decoration-line-strong hover:decoration-fg"
            >
              {node}
            </a>
          );
        }
        return <span key={i}>{node}</span>;
      })}
    </>
  );
}

function mediaUrl(media: { type: string; file?: { url: string }; external?: { url: string } }) {
  return media.type === "file" ? media.file?.url : media.external?.url;
}

function youtubeEmbed(url: string) {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  return match ? `https://www.youtube-nocookie.com/embed/${match[1]}` : null;
}

function Block({ block }: { block: NotionBlock }) {
  const children = block.children?.length ? <Blocks blocks={block.children} /> : null;

  switch (block.type) {
    case "paragraph":
      return block.paragraph.rich_text.length ? (
        <p>
          <RichText items={block.paragraph.rich_text} />
        </p>
      ) : null;
    case "heading_1":
      return (
        <h2 className="mt-14 text-2xl font-bold text-fg">
          <RichText items={block.heading_1.rich_text} />
        </h2>
      );
    case "heading_2":
      return (
        <h3 className="mt-12 text-xl font-bold text-fg">
          <RichText items={block.heading_2.rich_text} />
        </h3>
      );
    case "heading_3":
      return (
        <h4 className="mt-10 text-lg font-semibold text-fg">
          <RichText items={block.heading_3.rich_text} />
        </h4>
      );
    case "quote":
      return (
        <blockquote className="border-l border-line-strong pl-5 text-lg text-fg">
          <RichText items={block.quote.rich_text} />
          {children}
        </blockquote>
      );
    case "callout":
      return (
        <div className="glass rounded-md px-5 py-4 text-fg">
          <RichText items={block.callout.rich_text} />
          {children}
        </div>
      );
    case "divider":
      return <hr className="my-10 border-line" />;
    case "code":
      return (
        <pre className="glass overflow-x-auto rounded-md p-5 text-sm leading-relaxed">
          <code>{block.code.rich_text.map((t) => t.plain_text).join("")}</code>
        </pre>
      );
    case "to_do":
      return (
        <div className="flex gap-3">
          <span
            aria-hidden="true"
            className={cn(
              "mt-1.5 size-4 shrink-0 rounded-[4px] border border-line-strong",
              block.to_do.checked && "bg-accent shadow-[var(--glow-sm)]",
            )}
          />
          <span className={cn(block.to_do.checked && "text-subtle line-through")}>
            <RichText items={block.to_do.rich_text} />
          </span>
        </div>
      );
    case "toggle":
      return (
        <details className="group rounded-md border border-line px-5 py-3">
          <summary className="cursor-pointer font-semibold text-fg">
            <RichText items={block.toggle.rich_text} />
          </summary>
          <div className="mt-3">{children}</div>
        </details>
      );
    case "image": {
      const src = mediaUrl(block.image);
      if (!src) return null;
      const caption = block.image.caption;
      return (
        <figure className="my-10">
          <img
            src={src}
            alt={caption.map((t) => t.plain_text).join("") || ""}
            loading="lazy"
            className="w-full rounded-md border border-line"
          />
          {caption.length ? (
            <figcaption className="mt-3 text-sm text-subtle">
              <RichText items={caption} />
            </figcaption>
          ) : null}
        </figure>
      );
    }
    case "video": {
      const src = mediaUrl(block.video);
      if (!src) return null;
      const embed = youtubeEmbed(src);
      return (
        <figure className="my-10 overflow-hidden rounded-md border border-line">
          {embed ? (
            <iframe
              src={embed}
              title="Embedded video"
              className="aspect-video w-full"
              allow="accelerometer; encrypted-media; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          ) : (
            <video src={src} controls playsInline className="w-full" />
          )}
        </figure>
      );
    }
    case "bookmark":
    case "embed":
    case "link_preview": {
      const url =
        block.type === "bookmark" ? block.bookmark.url : block.type === "embed" ? block.embed.url : block.link_preview.url;
      return (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="glass block truncate rounded-md px-5 py-4 text-sm text-muted hover:text-fg"
        >
          {url}
        </a>
      );
    }
    case "pdf":
    case "file": {
      const media = block.type === "pdf" ? block.pdf : block.file;
      const src = mediaUrl(media);
      if (!src) return null;
      return (
        <a href={src} target="_blank" rel="noreferrer" className="glass inline-block rounded-md px-5 py-3 text-sm text-fg">
          Open attached file
        </a>
      );
    }
    case "column_list":
      return <div className="grid gap-8 md:grid-flow-col md:auto-cols-fr">{children}</div>;
    case "column":
      return <div className="space-y-5">{children}</div>;
    case "table": {
      const rows = (block.children ?? []).filter((b) => b.type === "table_row");
      const hasHeader = block.table.has_column_header;
      return (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <tbody>
              {rows.map((row, r) =>
                row.type === "table_row" ? (
                  <tr key={row.id} className="border-b border-line">
                    {row.table_row.cells.map((cell, c) => {
                      const Cell = hasHeader && r === 0 ? "th" : "td";
                      return (
                        <Cell key={c} className="px-3 py-2 text-left align-top">
                          <RichText items={cell} />
                        </Cell>
                      );
                    })}
                  </tr>
                ) : null,
              )}
            </tbody>
          </table>
        </div>
      );
    }
    default:
      return children;
  }
}

/** Groups consecutive list items so they render as real <ul>/<ol>. */
function Blocks({ blocks }: { blocks: NotionBlock[] }) {
  const out: ReactNode[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (block.type === "bulleted_list_item" || block.type === "numbered_list_item") {
      const type = block.type;
      const items: NotionBlock[] = [];
      while (i < blocks.length && blocks[i].type === type) items.push(blocks[i++]);
      i--;
      const List = type === "bulleted_list_item" ? "ul" : "ol";
      out.push(
        <List
          key={block.id}
          className={cn("space-y-2 pl-5", List === "ul" ? "list-disc marker:text-accent" : "list-decimal marker:text-subtle")}
        >
          {items.map((item) => (
            <li key={item.id}>
              <RichText
                items={item.type === "bulleted_list_item" ? item.bulleted_list_item.rich_text : item.type === "numbered_list_item" ? item.numbered_list_item.rich_text : []}
              />
              {item.children?.length ? <Blocks blocks={item.children} /> : null}
            </li>
          ))}
        </List>,
      );
      continue;
    }
    out.push(<Block key={block.id} block={block} />);
  }
  return <>{out}</>;
}

export function NotionRenderer({ blocks, className }: { blocks: NotionBlock[]; className?: string }) {
  if (blocks.length === 0) return null;
  return (
    <div className={cn("measure space-y-5 text-base leading-relaxed text-muted", className)}>
      <Blocks blocks={blocks} />
    </div>
  );
}
