import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import SubmitButtons from "../dashboard/SubmitButtons";
import Link from "next/link";
import { createSubscriptionAction } from "@/app/actions";

type PricingTableProps = {
  id: number;
  cardTitle: string;
  cardDescription: string;
  priceTitle: string;
  benefits: string[];
};

export const pricingPlans: PricingTableProps[] = [
  {
    id: 0,
    cardTitle: "Freelancer",
    cardDescription: "The best pricing plan for people starting out",
    priceTitle: "Free",
    benefits: ["1 site", "Up to 1000 visitors", "Up to 1000 blogs"],
  },
  {
    id: 1,
    cardTitle: "Pro Plan",
    cardDescription: "The best pricing plan for professionals",
    priceTitle: "$29 / month",
    benefits: ["Unlimited sites", "Unlimited visitors", "Unlimited blogs"],
  },
];

export function PricingTable() {
  return (
    <>
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-4xl font-semibold text-primary">Pricing</p>
        <h1 className="text-3xl font-bold mt-2 tracking-tight sm:text-5xl">
          Choose the plan that&apos;s right for you.
        </h1>
      </div>

      <p className="text-muted-foreground mt-6 max-w-2xl mx-auto leading-relaxed">
        Proin quis magna commodo urna ullamcorper tempus. Fusce semper bibendum
        nunc a pulvinar. Sed efficitur arcu eget porta viverra.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
        {pricingPlans.map((plan) => (
          <Card key={plan.id} className={plan.id === 1 ? "border-primary" : ""}>
            <CardHeader>
              <CardTitle>
                {plan.id === 1 ? (
                  <div className="flex items-center justify-between">
                    <h3 className="text-primary">{plan.cardTitle}</h3>
                    <span className="text-primary text-sm rounded-full bg-primary/10 px-3 py-1 font-semibold">
                      Most Popular
                    </span>
                  </div>
                ) : (
                  <>{plan.cardTitle}</>
                )}
              </CardTitle>
              <CardDescription>{plan.cardDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <CardTitle>{plan.priceTitle}</CardTitle>
              <ul className="list-disc list-inside mt-4 space-y-2 text-muted-foreground">
                {plan.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-2">
                    <Check className="size-5 text-primary" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {plan.id === 1 ? (
                <form className="w-full" action={createSubscriptionAction}>
                  <SubmitButtons className="w-full mt-6" text="Buy now" />
                </form>
              ) : (
                <Button className="w-full mt-6" variant="outline">
                  <Link href="/dashboard">Try for free</Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
