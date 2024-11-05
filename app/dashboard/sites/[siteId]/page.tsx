import prisma from "@/app/utils/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableRow,
  TableHeader,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {
  Book,
  Edit,
  Eye,
  MoreHorizontal,
  PlusCircle,
  Settings,
  Trash,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { formatDate } from "@/app/utils/helpers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/app/components/dashboard/EmptyState";

async function getData(userId: string, siteId: string) {
  /* const data = await prisma.post.findMany({
    where: { userId: userId, siteId: siteId },
    select: {
      image: true,
      title: true,
      createdAt: true,
      id: true,
      Site: {
        select: {
          subdirectory: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  }); */
  const data = await prisma.site.findUnique({
    where: { id: siteId, userId: userId },
    select: {
      subdirectory: true,
      posts: {
        select: {
          image: true,
          title: true,
          createdAt: true,
          id: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
  return data;
}

export default async function SiteIdPage({
  params,
}: {
  params: { siteId: string };
}) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    redirect("/api/auth/login");
  }
  const data = await getData(user?.id, params.siteId);
  return (
    <>
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" asChild>
          <Link href={`/blog/${data?.subdirectory}`}>
            <Eye className="size-4 mr-2" />
            View Blog
          </Link>
        </Button>

        <Button variant="outline" asChild>
          <Link href={`/dashboard/sites/${params.siteId}/settings`}>
            <Settings className="size-4 mr-2" />
            Settings
          </Link>
        </Button>

        <Button asChild>
          <Link href={`/dashboard/sites/${params.siteId}/create`}>
            <PlusCircle className="size-4 mr-2" />
            Create Article
          </Link>
        </Button>
      </div>

      {data?.posts.length === 0 || data?.posts === undefined ? (
        <EmptyState
          title="No Articles Created Yet"
          description="It looks like you haven't created any articles yet. Start by creating some to manage them from this page."
          buttonText="Create Article"
          href={`/dashboard/sites/${params.siteId}/create`}
        />
      ) : (
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Articles</CardTitle>
              <CardDescription>
                Manage your articles from this page. You can create, edit, and
                delete articles here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/6">Image</TableHead>
                    <TableHead className="w-2/6">Title</TableHead>
                    <TableHead className="w-1/6">Status</TableHead>
                    <TableHead className="w-1/6">Created At</TableHead>
                    <TableHead className="w-1/6 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <Image
                          src={post.image}
                          alt={post.title}
                          width={64}
                          height={64}
                          className="rounded-md size-16 object-cover"
                        />
                      </TableCell>
                      <TableCell>{post.title}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-500/10 text-green-500 border-green-500/20"
                        >
                          Published
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(post.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/dashboard/sites/${params.siteId}/${post.id}`}
                              >
                                <Edit className="size-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/dashboard/sites/${params.siteId}/${post.id}/delete`}
                              >
                                <Trash className="size-4 mr-2 text-red-500" />
                                Delete
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
