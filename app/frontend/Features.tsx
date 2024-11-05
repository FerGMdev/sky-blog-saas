import { Rocket, ShieldCheck, Star, UserPlus } from "lucide-react";

const features = [
  {
    name: "Sign up for free",
    description:
      "Sign up for free and start blogging in minutes. Our platform allows you to create and customize your blog quickly, without the need for technical knowledge. Enjoy an intuitive user experience and powerful tools that will help you share your ideas with the world.",
    icon: UserPlus,
  },
  {
    name: "Balzing fast",
    description:
      "Our platform is designed to be blazing fast, ensuring that your blog loads quickly and runs smoothly. Enjoy a seamless experience with minimal latency and fast page loads.",
    icon: Rocket,
  },
  {
    name: "Super secure with Kinde",
    description:
      "Our platform is designed to be blazing fast, ensuring that your blog loads quickly and runs smoothly. Enjoy a seamless experience with minimal latency and fast page loads.",
    icon: ShieldCheck,
  },
  {
    name: "Easy to use",
    description:
      "Our platform is designed to be blazing fast, ensuring that your blog loads quickly and runs smoothly. Enjoy a seamless experience with minimal latency and fast page loads.",
    icon: Star,
  },
];

export function Features() {
  return (
    <div className="py-24 sm:py-32">
      <div className="max-w-2xl mx-auto lg:text-center">
        <p className="text-4xl font-semibold text-primary">Blog Faster</p>
        <h1 className="text-3xl font-bold mt-2 tracking-tight sm:text-5xl">
          Get your blog up and running in minutes
        </h1>
        <p className="mt-6 text-base leading-snug text-muted-foreground">
          Right here you can create a blog in minutes. We make it easy for you
          to create a blog in minutes. The blog is very fast and easy to create.
        </p>
      </div>

      <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
        <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
          {features.map((feature) => (
            <div key={feature.name} className="relative pl-16">
              <div className="text-base font-semibold leading-7">
                <div className="absolute left-0 top-0 flex size-10 items-center justify-center rounded-lg bg-primary">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                {feature.name}
              </div>
              <p className="mt-2 text-sm text-muted-foreground leading-snug">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
