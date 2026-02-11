import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import visionBg from "@/assets/vision-background.webp";

const Vision = () => {
  return (
    <main className="min-h-screen bg-background text-foreground relative">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <img
          src={visionBg}
          alt="Illustration of people embracing in a peaceful green landscape"
          className="w-full h-full object-cover opacity-25 dark:opacity-15"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/65 to-background/90" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20 max-w-2xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-12">Our Vision</h1>

        <section className="space-y-6 text-muted-foreground leading-relaxed">
          <p>
            We're living in an age of constant connection — and quiet loneliness.
          </p>
          <p>
            Technology is faster, smarter, and everywhere.
            Yet many people feel more unseen, unheard, and emotionally isolated than ever before.
          </p>
          <p className="text-foreground font-medium">
            RantFree exists to restore human presence in a digital world.
          </p>
          <p>
            Our vision is to create a space where emotions aren't optimized, analyzed, or rushed — but felt, expressed, and held with care.
          </p>

          <div className="space-y-3 py-4">
            <p className="text-foreground font-medium">We believe:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>Mental wellness should be accessible</li>
              <li>Human connection can't be replaced by automation</li>
              <li>People deserve to be heard before they reach a breaking point</li>
            </ul>
          </div>

          <p>
            RantFree is not here to replace therapy or human relationships.
            It's here to protect them — by offering a safe place to pause, breathe, and speak freely.
          </p>
        </section>

        <section className="mt-16 space-y-6 text-muted-foreground leading-relaxed">
          <h2 className="text-2xl font-semibold text-foreground">RantFree is for you if:</h2>
          <ul className="space-y-2 list-disc list-inside">
            <li>You carry thoughts that feel heavy but hard to share</li>
            <li>You want support without pressure or judgment</li>
            <li>You're navigating anxiety, stress, or emotional overwhelm</li>
            <li>You simply need a safe place to be honest</li>
          </ul>
          <p>
            You don't need to have it all figured out.
            <br />
            You're welcome here as you are.
          </p>
        </section>

        <section className="mt-16 space-y-6 text-muted-foreground leading-relaxed border-t border-border pt-12">
          <h2 className="text-2xl font-semibold text-foreground">A Note From the RantFree Team</h2>

          <p>
            AI can answer questions.
            It can generate words.
            But it can't replace the feeling of being genuinely understood.
          </p>
          <p>
            RantFree was built in response to something we kept seeing — people overwhelmed, overstimulated, and emotionally exhausted, yet hesitant to ask for help. Not because they didn't need it — but because they didn't want to be judged, diagnosed, or dismissed.
          </p>
          <p className="text-foreground font-medium">
            This platform exists for the in-between moments:
          </p>
          <ul className="space-y-2 list-disc list-inside">
            <li>When emotions are heavy but unclear</li>
            <li>When you don't need fixing — just listening</li>
            <li>When silence feels louder than words</li>
          </ul>
          <p>
            Every feature in RantFree is designed with intention — from journaling and panic tools to compassionate listeners and guided grounding. Not to overwhelm you, but to meet you where you are.
          </p>
          <p>
            If RantFree helps even one person feel less alone — even briefly — then it's doing what it was built to do.
          </p>
          <p>
            Thank you for trusting us with something so human.
            <br />
            We're really glad you are.
          </p>
          <p className="text-foreground font-medium mt-8">
            — Team RantFree
          </p>
        </section>
      </div>
    </main>
  );
};

export default Vision;
