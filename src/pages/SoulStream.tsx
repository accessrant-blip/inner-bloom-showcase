import CategoryCarousel from "@/components/soulstream/CategoryCarousel";
import { categories } from "@/components/soulstream/soulStreamData";

const SoulStream = () => {
  return (
    <div className="min-h-screen bg-background/50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 animate-fade-up">
          <h1 className="text-4xl font-bold text-foreground mb-2">Soul Stream</h1>
          <p className="text-muted-foreground">
            Find calm and inspiration with this curated collection of videos.
          </p>
        </div>

        <div className="space-y-10">
          {categories.map((category) => (
            <CategoryCarousel key={category.name} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SoulStream;
