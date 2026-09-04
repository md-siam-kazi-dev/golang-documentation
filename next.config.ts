import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Allow .mdx files to be used as routes or imported as components.
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      // Turbopack requires plugin names as strings when options are not serializable.
      "remark-frontmatter",
      ["remark-mdx-frontmatter", { name: "metadata" }],
      // Enables GFM: tables, strikethrough, task lists, autolinks.
      "remark-gfm",
    ],
  },
});

export default withMDX(nextConfig);
