import {
  Card,
  CardFooter,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "../utils/db";
import { requireUser } from "../utils/requireUser";
import { EmptyState } from "../components/dashboard/EmptyState";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Eye, Pencil } from "lucide-react";
import DefaultImage from "@/public/default.png";

async function getData(userId: string) {
  const [sites, articles] = await Promise.all([
    prisma.site.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
    }),
    prisma.post.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
    }),
  ]);

  return { sites, articles };
}

export default async function Dashboard() {
  const user = await requireUser();
  const data = await getData(user.id);

  const { sites, articles } = data;
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-4">Dashboard</h1>
      <h2 className="text-2xl font-medium mb-4">Recent sites.</h2>
      {sites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sites.map((site) => (
            <Card key={site.id}>
              <Image
                src={site.imageUrl ?? DefaultImage}
                alt={site.name}
                className="rounded-t-lg object-cover w-full h-[200px]"
                width={400}
                height={200}
              />
              <CardHeader>
                <CardTitle className="truncate">{site.name}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {site.description}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/dashboard/sites/${site.id}`}>
                    <Eye className="size-4 mr-2" />
                    View Articles
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="You don't have any sites created yet"
          description="You currently don't have any sites created. Create a site to get started."
          buttonText="Create Site"
          href="/dashboard/sites/new"
        />
      )}

      <h2 className="text-2xl font-medium mb-4 mt-8">Recent articles.</h2>
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((article) => (
            <Card key={article.id}>
              <Image
                src={article.image ?? DefaultImage}
                alt={article.title}
                className="rounded-t-lg object-cover w-full h-[200px]"
                width={400}
                height={200}
              />
              <CardHeader>
                <CardTitle className="truncate">{article.title}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {article.smallDescription}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link
                    href={`/dashboard/sites/${article.siteId}/${article.id}`}
                  >
                    <Pencil className="size-4 mr-2" />
                    Edit Article
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="You don't have any articles created yet"
          description="You currently don't have any articles created. Create an article to get started."
          buttonText="Create Article"
          href="/dashboard/sites"
        />
      )}
    </div>
  );
}
