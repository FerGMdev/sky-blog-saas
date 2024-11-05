import { EditArticleForm } from "@/app/components/dashboard/forms/EditArticle";
import prisma from "@/app/utils/db";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getData(postId: string) {
  const data = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    select: {
      image: true,
      title: true,
      smallDescription: true,
      articleContent: true,
      slug: true,
      id: true,
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

export default async function EditArticlePage({
  params,
}: {
  params: { articleId: string; siteId: string };
}) {
  const data = await getData(params.articleId);
  return (
    <div>
      <div>
        <div className="flex items-center">
          <Button className="mr-4" size="icon" variant="outline" asChild>
            <Link href={`/dashboard/sites/${params.siteId}`}>
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Edit Article</h1>
        </div>
        <EditArticleForm data={data} siteId={params.siteId} />
      </div>
    </div>
  );
}
