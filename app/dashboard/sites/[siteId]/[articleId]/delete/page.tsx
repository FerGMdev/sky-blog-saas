import { deletePostAction } from "@/app/actions";
import SubmitButtons from "@/app/components/dashboard/SubmitButtons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";

export default function DeleteArticleForm({
  params,
}: {
  params: { siteId: string; articleId: string };
}) {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Card className="w-full max-w-xl p-4">
        <CardHeader>
          <CardTitle>Are you sure you want to delete this article?</CardTitle>
          <CardDescription>
            This action cannot be undone and will permanently delete the
            article.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/sites/${params.siteId}`}>Cancel</Link>
          </Button>
          <form action={deletePostAction}>
            <input type="hidden" name="articleId" value={params.articleId} />
            <input type="hidden" name="siteId" value={params.siteId} />
            <SubmitButtons
              text="Yes, I want to delete this article"
              variant="destructive"
            />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
