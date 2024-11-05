import prisma from "@/app/utils/db";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Eye, FileIcon, PlusCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import DefaultImage from "@/public/default.png";
import { EmptyState } from "@/app/components/dashboard/EmptyState";

async function getSites(userId: string) {
  const sites = await prisma.site.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return sites;
}

export default async function SitesPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  const data = await getSites(user.id);

  return (
    <>
      <div className="flex w-full justify-end">
        <Button asChild>
          <Link href={"/dashboard/sites/new"}>
            <PlusCircle className="size-4 mr-2" />
            Create Site
          </Link>
        </Button>
      </div>

      {data.length === 0 || data === undefined ? (
        <EmptyState
          title="You don't have any sites yet."
          description="You don't have any sites. Please create some so you can manage them here."
          buttonText="Create Site"
          href="/dashboard/sites/new"
        />
      ) : (
        <div>
          <h1>Sites</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((site) => (
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
        </div>
      )}
    </>
  );
}
