import { StarterKit } from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Code from "@tiptap/extension-code";
import Strike from "@tiptap/extension-strike";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Placeholder from "@tiptap/extension-placeholder";
import { Markdown } from "tiptap-markdown";

export const baseExtensions = [
  StarterKit,
  Bold,
  Italic,
  Underline,
  Image,
  Code,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  Heading.configure({
    levels: [1, 2, 3],
  }),
  Markdown.configure({
    html: true,
    tightLists: true,
    tightListClass: "tight",
    bulletListMarker: "-",
    linkify: true,
    breaks: true,
    transformPastedText: true,
    transformCopiedText: true,
  }),
  Placeholder.configure({
    placeholder: "Write something amazing...",
  }),
  Link.configure({
    openOnClick: false,
    autolink: true,
    defaultProtocol: "https",
    protocols: ["http", "https"],
    isAllowedUri: (url, ctx) => {
      try {
        const parsedUrl = url.includes(":")
          ? new URL(url)
          : new URL(`${ctx.defaultProtocol}://${url}`);

        if (!ctx.defaultValidate(parsedUrl.href)) return false;

        const disallowedProtocols = ["ftp", "file", "mailto"];
        const protocol = parsedUrl.protocol.replace(":", "");
        if (disallowedProtocols.includes(protocol)) return false;

        const allowedProtocols = ctx.protocols.map((p) =>
          typeof p === "string" ? p : p.scheme
        );
        if (!allowedProtocols.includes(protocol)) return false;

        const disallowedDomains = [
          "example-phishing.com",
          "malicious-site.net",
        ];
        if (disallowedDomains.includes(parsedUrl.hostname)) return false;

        return true;
      } catch {
        return false;
      }
    },
    shouldAutoLink: (url) => {
      try {
        const parsedUrl = url.includes(":")
          ? new URL(url)
          : new URL(`https://${url}`);

        const disallowedDomains = [
          "example-no-autolink.com",
          "another-no-autolink.com",
        ];
        return !disallowedDomains.includes(parsedUrl.hostname);
      } catch {
        return false;
      }
    },
  }),
];
