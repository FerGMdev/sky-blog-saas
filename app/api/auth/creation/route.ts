import prisma from "@/app/utils/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  // Get the user
  const { getUser } = getKindeServerSession();

  const user = await getUser();

  // If there is no user, throw an error
  if (!user || user === null || !user.id) {
    throw new Error("Something went wrong");
  }

  // Check if the user exists in the database
  const dbUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  // If the user does not exist, create them
  if (!dbUser) {
    await prisma.user.create({
      data: {
        id: user.id,
        firstName: user.given_name ?? "",
        lastName: user.family_name ?? "",
        email: user.email ?? "",
        profileImage:
          user.picture ?? `https://avatar.vercel.sh/${user.given_name}`,
      },
    });
  }

  // Redirect to the dashboard
  return NextResponse.redirect("http://localhost:3000/dashboard");
}
