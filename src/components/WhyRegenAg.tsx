import { Leaf, Sprout, Heart, Recycle } from "lucide-react";

const features = [
  {
    icon: Sprout,
    title: "Regenerative Practices",
    description:
      "All listings are verified for regenerative practices including no-till, cover cropping, and rotational grazing.",
  },
  {
    icon: Leaf,
    title: "Carbon Sequestration",
    description:
      "Support farms actively building soil health and capturing carbon to combat climate change.",
  },
  {
    icon: Heart,
    title: "Nutrient-Dense Food",
    description:
      "Access food grown in healthy soils, resulting in higher nutritional value and better taste.",
  },
  {
    icon: Recycle,
    title: "Closed-Loop Systems",
    description:
      "Connect with farms using holistic approaches that minimize waste and maximize biodiversity.",
  },
];

const WhyRegenAg = () => {
  return (
    <section id="learn" className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
            Why Regenerative Agriculture?
          </h2>
          <p className="text-primary-foreground/80 text-lg">
            Regenerative agriculture goes beyond sustainable farming to actively
            restore and revitalize ecosystems while producing nutrient-dense food.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="text-center p-6 rounded-2xl bg-primary-foreground/5 border border-primary-foreground/10 hover:bg-primary-foreground/10 transition-colors duration-300 animate-fade-in-up opacity-0"
                style={{
                  animationDelay: `${index * 150}ms`,
                  animationFillMode: "forwards",
                }}
              >
                <div className="w-14 h-14 rounded-xl bg-primary-foreground/10 flex items-center justify-center mx-auto mb-5">
                  <Icon className="w-7 h-7 text-wheat" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">
                  {feature.title}
                </h3>
                <p className="text-primary-foreground/70 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyRegenAg;
