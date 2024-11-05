import SubmitButtons from "@/app/components/dashboard/SubmitButtons";
import { PricingTable } from "@/app/components/shared/Pricing";
import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/requireUser";
import { stripe } from "@/app/utils/stripe";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect } from "next/navigation";

async function getSubscriptionStatus(userId: string) {
  const data = await prisma.subscription.findUnique({
    where: { userId: userId },
    select: {
      status: true,
      User: {
        select: {
          customerId: true,
        },
      },
    },
  });

  return data;
}

export default async function PricingPage() {
  const user = await requireUser();
  const data = await getSubscriptionStatus(user.id);

  async function handleViewSubscriptionDetails() {
    "use server";
    const session = await stripe.billingPortal.sessions.create({
      customer: data?.User?.customerId as string,
      return_url: "http://localhost:3000/dashboard",
    });
    return redirect(session.url);
  }

  if (data?.status === "active") {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>You are subscribed</CardTitle>
          <CardDescription>
            You can create unlimited sites and blogs. Click on the button below
            to manage your subscription.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleViewSubscriptionDetails}>
            <SubmitButtons text="View Subscription Details" />
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <PricingTable
        id={1}
        cardTitle="Basic"
        cardDescription="For small businesses"
        priceTitle="Free"
        benefits={[]}
      />
    </div>
  );
}
