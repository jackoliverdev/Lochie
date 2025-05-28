import { GalleryHero } from "@/components/website/gallery/hero";
import { GalleryGrid } from "@/components/website/gallery/gallery-grid";

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-white">
      <GalleryHero />
      <GalleryGrid />
    </div>
  );
} 