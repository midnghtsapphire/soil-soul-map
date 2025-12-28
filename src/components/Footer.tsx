import { Leaf, Mail, Instagram, Twitter, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const footerLinks = {
    discover: [
      { name: "Find Farms", href: "#" },
      { name: "Farmers Markets", href: "#" },
      { name: "Restaurants", href: "#" },
      { name: "CSA Programs", href: "#" },
    ],
    forFarmers: [
      { name: "List Your Farm", href: "#" },
      { name: "Pricing", href: "#" },
      { name: "Success Stories", href: "#" },
      { name: "Resources", href: "#" },
    ],
    learn: [
      { name: "What is Regenerative?", href: "#" },
      { name: "Soil Health", href: "#" },
      { name: "Carbon Farming", href: "#" },
      { name: "Blog", href: "#" },
    ],
    company: [
      { name: "About Us", href: "#" },
      { name: "Contact", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Press", href: "#" },
    ],
  };

  return (
    <footer className="bg-foreground text-primary-foreground">
      {/* Newsletter Section */}
      <div className="border-b border-primary-foreground/10">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-2xl font-semibold mb-2">
                Stay Connected
              </h3>
              <p className="text-primary-foreground/70">
                Get updates on new farms, seasonal markets, and regenerative
                agriculture news.
              </p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-72">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full h-12 pl-10 pr-4 rounded-lg bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50 border border-primary-foreground/20 focus:outline-none focus:border-primary-foreground/40"
                />
              </div>
              <Button variant="secondary" className="h-12 px-6">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Logo & Description */}
          <div className="col-span-2">
            <a href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-semibold">
                RegenFood
              </span>
            </a>
            <p className="text-primary-foreground/60 text-sm mb-6 max-w-xs">
              Connecting communities with regenerative farms, markets, and
              restaurants for a healthier planet.
            </p>
            <div className="flex gap-3">
              {[Instagram, Twitter, Facebook].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Discover</h4>
            <ul className="space-y-3">
              {footerLinks.discover.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">For Farmers</h4>
            <ul className="space-y-3">
              {footerLinks.forFarmers.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Learn</h4>
            <ul className="space-y-3">
              {footerLinks.learn.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/50">
          <p>© 2025 RegenFood. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary-foreground transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
