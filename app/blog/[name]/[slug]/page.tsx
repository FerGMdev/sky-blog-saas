import { RenderArticle } from "@/app/components/dashboard/RenderArticle";
import prisma from "@/app/utils/db";
import { formatDate } from "@/app/utils/helpers";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JSONContent } from "novel";

async function getBlogPost(slug: string) {
  const data = await prisma.post.findUnique({
    where: {
      slug,
    },
    select: {
      title: true,
      articleContent: true,
      smallDescription: true,
      image: true,
      createdAt: true,
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

export default async function BlogPostPage({
  params,
}: {
  params: { name: string; slug: string };
}) {
  const data = await getBlogPost(params.slug);
  return (
    <>
      <div className="flex items-center gap-x-3 pt-10 pb-5">
        <Link href={`/blog/${params.name}`}>
          <Button size="icon" variant="outline">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>

        <h2 className="text-2xl font-bold">Go Back</h2>
      </div>

      <div className="relative m-auto mb-10 h-80 w-full max-w-screen-lg overflow-hidden md:mb-20 md:h-[450px] md:w-5/6 md:rounded-2xl lg:w-2/3">
        <Image
          src={data.image}
          alt={data.title}
          width={1000}
          height={500}
          className="h-full w-full object-cover"
          priority
        />
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black to-transparent bg-opacity-70 p-5">
          <p className="text-sm text-white font-light">
            {formatDate(data.createdAt)}
          </p>
          <h1 className="text-4xl text-white font-bold mb-2 tracking-tight">
            {data.title}
          </h1>
          <p className="text-white font-light text-lg line-clamp-2">
            {data.smallDescription}
          </p>
        </div>
      </div>

      <RenderArticle json={data.articleContent as JSONContent} />
    </>
  );
}
