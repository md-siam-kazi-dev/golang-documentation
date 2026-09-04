import { notFound, redirect } from "next/navigation";
import { getDocs } from "@/lib/docs";

export default function DocsIndexPage() {
  const docs = getDocs();
  const first = docs[0];
  if (!first) notFound();
  redirect(`/docs/${first.slug.join("/")}`);
}
