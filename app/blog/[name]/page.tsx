import prisma from "@/app/utils/db";
import Image from "next/image";
import { notFound } from "next/navigation";
import Logo from "@/public/logo.svg";
import Link from "next/link";
import { ThemeToggle } from "@/app/components/dashboard/ThemeToggle";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import DefaultImage from "@/public/default.png";

async function getData(subDir: string) {
  const data = await prisma.site.findUnique({
    where: {
      subdirectory: subDir,
    },
    select: {
      name: true,
      posts: {
        select: {
          smallDescription: true,
          title: true,
          image: true,
          createdAt: true,
          slug: true,
          id: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

export default async function BlogIndexPage({
  params,
}: {
  params: { name: string };
}) {
  const data = await getData(params.name);
  return (
    <>
      <nav className="grid grid-cols-3 gap-4 my-10">
        <div className="col-span-1" />
        <div className="flex items-center justify-center gap-x-6">
          <Image src={Logo} alt="logo" width={40} height={40} />
          <h1 className="text-3xl font-semibold tracking-tight">{data.name}</h1>
        </div>
        <div className="col-span-1 flex justify-end">
          <ThemeToggle />
        </div>
      </nav>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.posts.map((post) => (
          <Card key={post.id}>
            <Image
              src={post.image ?? DefaultImage}
              alt={post.title}
              className="rounded-t-lg object-cover w-full h-[200px]"
              width={400}
              height={200}
            />
            <CardHeader>
              <CardTitle className="truncate">{post.title}</CardTitle>
              <CardDescription className="line-clamp-3">
                {post.smallDescription}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/blog/${params.name}/${post.slug}`}>
                  Read More
                  <ArrowRight className="size-4 ml-2" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
