"use server";

import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import { PostSchema, SiteCreationSchema } from "./utils/zodSchemas";
import prisma from "./utils/db";
import { requireUser } from "./utils/requireUser";
import { stripe } from "./utils/stripe";

export async function createSiteAction(previousState: any, formData: FormData) {
  const user = await requireUser();

  // Check if the user has a subscription
  const [subStatus, sites] = await Promise.all([
    prisma.subscription.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        status: true,
      },
    }),

    prisma.site.findMany({
      where: {
        userId: user.id,
      },
    }),
  ]);

  // If the user is not subscribed, return an error
  if (!subStatus || subStatus.status !== "active") {
    if (sites.length < 1) {
      // Allow the user to create a site
      await createSite();
    } else {
      // Redirect to the subscription page
      return redirect("/dashboard/pricing");
    }
  } else if (subStatus.status === "active") {
    // User has a active subscription, then user can create unlimited sites
    await createSite();
  }

  async function createSite() {
    // Check if the user exists in the database
    const submission = await parseWithZod(formData, {
      schema: SiteCreationSchema({
        async isSubdirectoryUnique() {
          const subdirectory = formData.get("subdirectory") as string;
          const existingSubDirectory = await prisma.site.findFirst({
            where: {
              subdirectory: formData.get("subdirectory") as string,
            },
          });

          return !existingSubDirectory;
        },
      }),
      async: true,
    });

    if (submission.status !== "success") {
      return submission.reply();
    }

    // Create the site
    const site = await prisma.site.create({
      data: {
        name: submission.value.name,
        description: submission.value.description,
        subdirectory: submission.value.subdirectory,
        userId: user.id,
      },
    });
  }
  // Redirect to the site
  return redirect(`/dashboard/sites`);
}

export async function createPostAction(previousState: any, formData: FormData) {
  // Get the user to check if they are logged in
  const user = await requireUser();

  // Validate the form data
  const submission = parseWithZod(formData, {
    schema: PostSchema,
  });

  // If the form data is invalid, return the errors
  if (submission.status !== "success") {
    return submission.reply();
  }

  // Create the post
  const post = await prisma.post.create({
    data: {
      title: submission.value.title,
      slug: submission.value.slug,
      image: submission.value.coverImage,
      smallDescription: submission.value.smallDescription,
      articleContent: JSON.parse(submission.value.articleContent),
      userId: user.id,
      siteId: formData.get("siteId") as string,
    },
  });

  // Redirect to the site
  return redirect(`/dashboard/sites/${formData.get("siteId")}`);
}

export async function updatePostAction(previousState: any, formData: FormData) {
  const user = await requireUser();

  // Validate the form data
  const submission = parseWithZod(formData, {
    schema: PostSchema,
  });

  // If the form data is invalid, return the errors
  if (submission.status !== "success") {
    return submission.reply();
  }

  // Update the post
  const post = await prisma.post.update({
    where: {
      userId: user.id,
      id: formData.get("articleId") as string,
    },
    data: {
      title: submission.value.title,
      slug: submission.value.slug,
      image: submission.value.coverImage,
      smallDescription: submission.value.smallDescription,
      articleContent: JSON.parse(submission.value.articleContent),
    },
  });

  // Redirect to the site
  return redirect(`/dashboard/sites/${formData.get("siteId")}/`);
}

export async function deletePostAction(formData: FormData) {
  const user = await requireUser();

  const data = await prisma.post.delete({
    where: {
      userId: user.id,
      id: formData.get("articleId") as string,
    },
  });

  // Redirect to the site
  return redirect(`/dashboard/sites/${formData.get("siteId")}`);
}

export async function updateSiteImageAction(formData: FormData) {
  const user = await requireUser();

  const data = await prisma.site.update({
    where: {
      userId: user.id,
      id: formData.get("siteId") as string,
    },
    data: {
      imageUrl: formData.get("imageUrl") as string,
    },
  });

  return redirect(`/dashboard/sites/${formData.get("siteId")}`);
}

export async function deleteSiteAction(formData: FormData) {
  const user = await requireUser();

  const data = await prisma.site.delete({
    where: {
      userId: user.id,
      id: formData.get("siteId") as string,
    },
  });

  return redirect("/dashboard/sites");
}

export async function createSubscriptionAction(formData: FormData) {
  const user = await requireUser();

  let stripeUserId = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      customerId: true,
      email: true,
      firstName: true,
    },
  });

  if (!stripeUserId?.customerId) {
    // Create a stripe customer
    const stripeCustomer = await stripe.customers.create({
      email: stripeUserId?.email,
      name: `${stripeUserId?.firstName}`,
    });

    // Update the user with the stripe customer id
    stripeUserId = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        customerId: stripeCustomer.id,
      },
    });
  }

  const session = await stripe.checkout.sessions.create({
    customer: stripeUserId?.customerId as string,
    mode: "subscription",
    billing_address_collection: "auto",
    payment_method_types: ["card"],
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID,
        quantity: 1,
      },
    ],
    customer_update: {
      name: "auto",
      address: "auto",
    },
    success_url: "http://localhost:3000/dashboard/payment/success",
    cancel_url: "http://localhost:3000/dashboard/payment/cancelled",
  });

  return redirect(session.url as string);
}
