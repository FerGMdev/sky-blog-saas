// Importamos el cliente de Prisma para interactuar con la base de datos
import prisma from "@/app/utils/db";
// Importamos la instancia configurada de Stripe para procesar pagos
import { stripe } from "@/app/utils/stripe";
// Importamos la utilidad de headers de Next.js para acceder a los headers de la petición
import { headers } from "next/headers";
// Importamos los tipos de Stripe para TypeScript
import Stripe from "stripe";

// Definimos la función POST que manejará los webhooks de Stripe
export async function POST(req: Request) {
  // Obtenemos el cuerpo de la petición como texto plano (necesario para la verificación de firma)
  const body = await req.text();

  // Extraemos la firma de Stripe del header (necesaria para verificar la autenticidad del webhook)
  const signature = headers().get("Stripe-Signature") as string;

  // Declaramos la variable event que contendrá el evento de Stripe una vez verificado
  let event: Stripe.Event;

  // Bloque try-catch para verificar la autenticidad del webhook
  try {
    // Verificamos que el evento sea legítimo usando la firma y el secreto del webhook
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error: unknown) {
    // Si la verificación falla, retornamos un error 400
    return new Response("Webhook error", { status: 400 });
  }

  // Extraemos la sesión del evento y la tipamos como una sesión de checkout
  const session = event.data.object as Stripe.Checkout.Session;

  // Verificamos si el evento es de tipo "checkout.session.completed". Este evento se ejecuta cuando un usuario completa el proceso de pago y la sesión de checkout.
  if (event.type === "checkout.session.completed") {
    // Obtenemos los detalles de la suscripción usando el ID de suscripción de la sesión
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    // Extraemos el ID del cliente de Stripe de la sesión
    const customerId = session.customer as string;

    // Buscamos el usuario en nuestra base de datos que corresponde al cliente de Stripe
    const user = await prisma.user.findUnique({
      where: {
        customerId,
      },
    });

    // Si no encontramos el usuario, retornamos un error 404
    if (!user) return new Response("User not found", { status: 404 });

    await prisma.subscription.create({
      data: {
        stripeSubscriptionId: subscription.id,
        userId: user.id,
        currentPeriodStart: subscription.current_period_start,
        currentPeriodEnd: subscription.current_period_end,
        status: subscription.status,
        planId: subscription.items.data[0].plan.id,
        interval: String(subscription.items.data[0].plan.interval),
      },
    });
  }

  // Verificamos si el evento es de tipo "invoice.payment_succeeded". Este evento se ejecuta cuando un pago de factura es exitoso.
  if (event.type === "invoice.payment_succeeded") {
    // Obtenemos los detalles de la suscripción usando el ID de suscripción de la factura
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    // Actualizamos la suscripción en nuestra base de datos para reflejar el pago exitoso
    await prisma.subscription.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        planId: subscription.items.data[0].plan.id,
        currentPeriodStart: subscription.current_period_start,
        currentPeriodEnd: subscription.current_period_end,
        status: subscription.status,
      },
    });
  }

  return new Response("Webhook received", { status: 200 });
}
