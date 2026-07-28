import { Metadata } from 'next';
import Link from 'next/link';
import { Baby, ShieldCheck, Award, Sparkles, HeartHandshake, ArrowRight } from 'lucide-react';
import connectToDatabase from '@/lib/db';
import GlobalSettings from '@/models/GlobalSettings';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'About Us | Care Mom',
  description: 'Care Mom - Premium Mother & Baby care brand in Bangladesh. Explore our high-quality collection of baby clothing, maternity essentials, baby gear, organic baby food, and accessories designed for parenting comfort.',
};

async function getSettings() {
  try {
    await connectToDatabase();
    const settings = await GlobalSettings.findOne().lean();
    if (!settings) {
      return {
        brandName: "Care Mom",
        contact: {
          email: "support@caremom.com",
          phone: "+8801234567890",
          address: "Dhaka, Bangladesh"
        }
      };
    }
    return JSON.parse(JSON.stringify(settings));
  } catch (error) {
    console.error('Error fetching settings for about page:', error);
    return null;
  }
}

export default async function AboutPage() {
  const settings = await getSettings();
  const brandName = settings?.brandName || "Care Mom";

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-transparent py-20 md:py-28 border-b border-primary/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-4">
            <Sparkles className="h-3 w-3" /> Premium Mother & Baby Essentials
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-6">
            About <span className="text-primary">Us</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            Driven by a passion for gentle care and baby safety, <strong className="text-primary">{brandName}</strong> delivers premium quality mother and baby products designed for modern parenting. From organic cotton clothing to safe feeding accessories, we redefine early childhood care.
          </p>
        </div>
      </section>

      {/* Stats / Key features */}
      <section className="py-12 bg-card/30 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 space-y-1">
              <p className="text-3xl md:text-4xl font-extrabold text-primary">100%</p>
              <p className="text-xs md:text-sm text-muted-foreground font-medium">Baby-Safe Materials</p>
            </div>
            <div className="p-4 space-y-1">
              <p className="text-3xl md:text-4xl font-extrabold text-primary">10k+</p>
              <p className="text-xs md:text-sm text-muted-foreground font-medium">Happy Parents</p>
            </div>
            <div className="p-4 space-y-1">
              <p className="text-3xl md:text-4xl font-extrabold text-primary">100%</p>
              <p className="text-xs md:text-sm text-muted-foreground font-medium">Quality Guaranteed</p>
            </div>
            <div className="p-4 space-y-1">
              <p className="text-3xl md:text-4xl font-extrabold text-primary">24/7</p>
              <p className="text-xs md:text-sm text-muted-foreground font-medium">Customer Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Story & Mission Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                Nurturing Your Little One with Gentle & Safe Products
              </h2>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                At Care Mom, we believe that safety and comfort should go hand in hand. We curate each of our mother and baby essentials—whether it is soft baby clothing, organic diapers, feeding accessories, or developmental toys—using certified non-toxic and hypoallergenic materials that ensure the utmost care.
              </p>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                Our materials are ethically sourced and processed under strict safety inspections. By prioritizing certified BPA-free plastics, hypoallergenic fabrics, and non-toxic dyes, we ensure you receive the safest essentials for your baby.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="flex gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Baby className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1">Our Mission</h4>
                    <p className="text-xs text-muted-foreground">To deliver premium, safe, and comfortable baby and maternity essentials that empower mothers and nurture babies' growth.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <HeartHandshake className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1">Our Vision</h4>
                    <p className="text-xs text-muted-foreground">To become Bangladesh's leading choice for premium mother and baby care products by setting standard benchmarks for safety, quality, and parental trust.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Decorative visual container */}
            <div className="relative aspect-square md:aspect-video lg:aspect-square max-w-md mx-auto w-full rounded-3xl overflow-hidden bg-gradient-to-br from-primary to-primary-foreground/30 p-1 shadow-2xl">
              <div className="w-full h-full bg-slate-900 rounded-[22px] overflow-hidden relative flex flex-col justify-end p-8 text-white">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10" />

                {/* Embedded dynamic design background */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_10%,transparent_10.1%)] bg-[length:20px_20px]" />

                <div className="relative z-20 space-y-3">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-primary px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md self-start inline-block">
                    Our Slogan
                  </span>
                  <blockquote className="text-lg md:text-xl font-bold leading-relaxed italic">
                    "Nurture with love, safety, and ultimate comfort."
                  </blockquote>
                  <p className="text-xs text-slate-300 font-medium">
                    — The {brandName} Family
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 md:py-24 bg-primary/5 border-t border-b border-primary/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Why Choose Us?</h2>
            <p className="text-muted-foreground text-sm">
              Discover what makes our baby and maternity collection highly safe, comfortable, and trusted.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background p-8 rounded-2xl border shadow-sm space-y-4 text-center flex flex-col items-center hover:-translate-y-1 transition-all duration-300">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">100% Premium Quality</h3>
              <p className="text-muted-foreground text-xs leading-relaxed max-w-[280px]">
                We maintain rigorous safety standards, choosing certified non-toxic, hypoallergenic, and baby-safe materials.
              </p>
            </div>

            <div className="bg-background p-8 rounded-2xl border shadow-sm space-y-4 text-center flex flex-col items-center hover:-translate-y-1 transition-all duration-300">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Baby className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Hypoallergenic & Organic</h3>
              <p className="text-muted-foreground text-xs leading-relaxed max-w-[280px]">
                Our products feature organic fabrics, skin-friendly components, and durable finishes for your baby's delicate skin.
              </p>
            </div>

            <div className="bg-background p-8 rounded-2xl border shadow-sm space-y-4 text-center flex flex-col items-center hover:-translate-y-1 transition-all duration-300">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Trusted Parental Choice</h3>
              <p className="text-muted-foreground text-xs leading-relaxed max-w-[280px]">
                Thousands of satisfied parents across Bangladesh trust Care Mom for their babies' daily comfort and safety.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Information Section */}
      <section className="py-16 bg-gradient-to-b from-card to-background border-y border-muted relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.15)_1px,transparent_1px)] bg-[length:16px_16px]" />
        <div className="container mx-auto px-4 max-w-3xl text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold tracking-widest uppercase">
            <span>Technology Partner</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
            Crafted by Jia Pixel
          </h3>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            This high-performance e-commerce platform is designed, built, and optimized by Jia Pixel, the{' '}
            <a
              href="https://www.jiapixel.com"
              target="_blank"
              rel="noopener"
              className="text-primary font-semibold hover:underline transition-all"
            >
              Leading Digital Agency In Bangladesh
            </a>
            . Our team is dedicated to engineering custom digital solutions with superior speed and seamless user experiences. As a specialized{' '}
            <a
              href="https://www.jiapixel.com/projects/premium-fashion-web-design-agency-for-iconic-brands"
              target="_blank"
              rel="noopener"
              className="text-primary font-semibold hover:underline transition-all"
            >
              Fashion Web Design Agency
            </a>
            , we merge cutting-edge aesthetics with clean, scalable code to elevate retail brands and accelerate their digital growth.
          </p>
        </div>
      </section>

      {/* Call To Action Section */}
      <section className="py-20 text-center relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 space-y-6">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight max-w-2xl mx-auto leading-tight">
            Nurture Your Little One with Care Mom Essentials
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm">
            Browse our collection today and choose the perfect products for your baby's comfort and growth.
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Link href="/shop" passHref>
              <Button size="lg" className="rounded-full px-8 py-6 font-black uppercase text-sm tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                Shop Our Collection <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact" passHref>
              <Button size="lg" variant="outline" className="rounded-full px-8 py-6 font-bold text-sm transition-all hover:bg-muted/50">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
