import { useState } from "react";
import { Play } from "lucide-react";
import type { Video } from "./soulStreamData";

const VideoCard = ({ video }: { video: Video }) => {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="min-w-[280px] max-w-[320px] flex-shrink-0 snap-start bg-card rounded-2xl overflow-hidden shadow-soft border border-border hover:shadow-glow transition-all duration-300">
      <div className="relative aspect-video bg-accent group cursor-pointer">
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        ) : (
          <>
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
              }}
            />
            <div
              onClick={() => setPlaying(true)}
              className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center"
            >
              <div className="w-14 h-14 bg-card/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="h-7 w-7 text-primary ml-0.5" fill="currentColor" />
              </div>
            </div>
          </>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground mb-1 line-clamp-1 text-sm">{video.title}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2">{video.description}</p>
      </div>
    </div>
  );
};

export default VideoCard;
