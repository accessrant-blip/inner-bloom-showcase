import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
}

interface Category {
  name: string;
  videos: Video[];
}

const SoulStream = () => {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const categories: Category[] = [
    {
      name: "Calming Videos",
      videos: [
        {
          id: "79kpoGF8KWU",
          title: "Instant Relief from Stress and Anxiety",
          description: "Find relief from stress with soothing sounds of a forest river and calming music.",
          thumbnail: "https://img.youtube.com/vi/79kpoGF8KWU/hqdefault.jpg"
        },
        {
          id: "1ZYbU82GVz4",
          title: "Relaxing Sleep Music",
          description: "Deep sleep music for peaceful rest and rejuvenation.",
          thumbnail: "https://img.youtube.com/vi/1ZYbU82GVz4/hqdefault.jpg"
        },
        {
          id: "7Zw9qUC4a3k",
          title: "Sound Bath Music",
          description: "Deeply relaxing sound bath music for meditation and healing.",
          thumbnail: "https://img.youtube.com/vi/7Zw9qUC4a3k/hqdefault.jpg"
        }
      ]
    },
    {
      name: "Meditation",
      videos: [
        {
          id: "0y0586ffZWQ",
          title: "Just Be - Guided Meditation",
          description: "A gentle guided meditation to help you simply be present.",
          thumbnail: "https://img.youtube.com/vi/0y0586ffZWQ/hqdefault.jpg"
        },
        {
          id: "aIIEI33EUqI",
          title: "Deep Meditation Music",
          description: "15 minutes of peaceful meditation music for deep relaxation.",
          thumbnail: "https://img.youtube.com/vi/aIIEI33EUqI/hqdefault.jpg"
        },
        {
          id: "qTJ2Z-geCW8",
          title: "Meditation for Positive Energy",
          description: "Cultivate positive energy and inner peace with this meditation.",
          thumbnail: "https://img.youtube.com/vi/qTJ2Z-geCW8/hqdefault.jpg"
        }
      ]
    },
    {
      name: "Work",
      videos: [
        {
          id: "WPni755-Krg",
          title: "Study Music Alpha Waves",
          description: "Alpha waves music to enhance concentration and studying.",
          thumbnail: "https://img.youtube.com/vi/WPni755-Krg/hqdefault.jpg"
        },
        {
          id: "pQI64hD2sJw",
          title: "FOCUS & CONCENTRATION",
          description: "Music designed to boost focus and productivity.",
          thumbnail: "https://img.youtube.com/vi/pQI64hD2sJw/hqdefault.jpg"
        },
        {
          id: "OoSzt2Ga8Oc",
          title: "Playlist for Focus Time",
          description: "Curated playlist to help you stay focused and productive.",
          thumbnail: "https://img.youtube.com/vi/OoSzt2Ga8Oc/hqdefault.jpg"
        }
      ]
    },
    {
      name: "Workout",
      videos: [
        {
          id: "ww6N-jyjsbw",
          title: "Gentleman Songs",
          description: "Energetic workout playlist to keep you motivated.",
          thumbnail: "https://img.youtube.com/vi/ww6N-jyjsbw/hqdefault.jpg"
        },
        {
          id: "spHkzkRSDTs",
          title: "Girl Summer Playlist",
          description: "Upbeat summer vibes for your workout sessions.",
          thumbnail: "https://img.youtube.com/vi/spHkzkRSDTs/hqdefault.jpg"
        },
        {
          id: "8MG-mDI7Sns",
          title: "Hip Hop Gym Workout Music",
          description: "High-energy hip hop to power through your gym session.",
          thumbnail: "https://img.youtube.com/vi/8MG-mDI7Sns/hqdefault.jpg"
        }
      ]
    },
    {
      name: "Yoga",
      videos: [
        {
          id: "0Ni00XDSd6E",
          title: "Tibetan Healing Relaxation Music",
          description: "Tibetan healing sounds for deep relaxation and yoga practice.",
          thumbnail: "https://img.youtube.com/vi/0Ni00XDSd6E/hqdefault.jpg"
        },
        {
          id: "c8n3dqJW4y0",
          title: "45 min of Modern Yoga Music",
          description: "Contemporary yoga music for your complete practice.",
          thumbnail: "https://img.youtube.com/vi/c8n3dqJW4y0/hqdefault.jpg"
        },
        {
          id: "2RTZNLL0wss",
          title: "Yoga Music",
          description: "Peaceful music to enhance your yoga flow.",
          thumbnail: "https://img.youtube.com/vi/2RTZNLL0wss/hqdefault.jpg"
        }
      ]
    },
    {
      name: "Nature",
      videos: [
        {
          id: "Nn6-uMinE_o",
          title: "Hiking the Mount Marcy",
          description: "Experience the beauty of hiking Mount Marcy.",
          thumbnail: "https://img.youtube.com/vi/Nn6-uMinE_o/hqdefault.jpg"
        },
        {
          id: "I2I4EySGYEU",
          title: "Discovering Tibetan Nepal",
          description: "Journey through the stunning landscapes of Tibetan Nepal.",
          thumbnail: "https://img.youtube.com/vi/I2I4EySGYEU/hqdefault.jpg"
        },
        {
          id: "TLZOWDF8lqQ",
          title: "Silent Hiking the John Muir Trail",
          description: "Peaceful silent hike through the John Muir Trail.",
          thumbnail: "https://img.youtube.com/vi/TLZOWDF8lqQ/hqdefault.jpg"
        }
      ]
    },
    {
      name: "Jazz",
      videos: [
        {
          id: "K110MtP_Mis",
          title: "Vintage Jazz",
          description: "Classic vintage jazz for a sophisticated atmosphere.",
          thumbnail: "https://img.youtube.com/vi/K110MtP_Mis/hqdefault.jpg"
        },
        {
          id: "ZHV_Hc2Wbrw",
          title: "Just Business, Darling",
          description: "Smooth jazz for work or relaxation.",
          thumbnail: "https://img.youtube.com/vi/ZHV_Hc2Wbrw/hqdefault.jpg"
        },
        {
          id: "ziOus5-1kXw",
          title: "Jazzy But Not Too Jazzy",
          description: "The perfect balance of jazz vibes.",
          thumbnail: "https://img.youtube.com/vi/ziOus5-1kXw/hqdefault.jpg"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background/50 p-8">
      <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-fade-up">
            <h1 className="text-4xl font-bold text-foreground mb-2">Soul Stream</h1>
            <p className="text-muted-foreground">
              Find calm and inspiration with this curated collection of videos.
            </p>
          </div>

          {/* Categories */}
          <div className="space-y-12">
            {categories.map((category) => (
              <div key={category.name}>
                <h2 className="text-2xl font-bold text-foreground mb-6 border-b-4 border-primary inline-block pb-2">
                  {category.name}
                </h2>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.videos.map((video) => (
                    <div
                      key={video.id}
                      className="bg-card rounded-2xl overflow-hidden shadow-soft border border-border hover:shadow-glow transition-all duration-300 animate-fade-in"
                    >
                      <div className="relative aspect-video bg-accent group cursor-pointer">
                        {playingVideo === video.id ? (
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
                              onError={(e) => {
                                e.currentTarget.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
                              }}
                            />
                            <div
                              onClick={() => setPlayingVideo(video.id)}
                              className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center"
                            >
                              <div className="w-16 h-16 bg-card/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Play className="h-8 w-8 text-primary ml-1" fill="currentColor" />
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      
                      <div className="p-5">
                        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                          {video.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {video.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
  );
};

export default SoulStream;
