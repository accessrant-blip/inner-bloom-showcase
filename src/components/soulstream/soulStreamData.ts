export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
}

export interface Category {
  name: string;
  videos: Video[];
}

export const categories: Category[] = [
  {
    name: "Calming Videos",
    videos: [
      { id: "79kpoGF8KWU", title: "Instant Relief from Stress and Anxiety", description: "Find relief from stress with soothing sounds of a forest river and calming music.", thumbnail: "https://img.youtube.com/vi/79kpoGF8KWU/hqdefault.jpg" },
      { id: "1ZYbU82GVz4", title: "Relaxing Sleep Music", description: "Deep sleep music for peaceful rest and rejuvenation.", thumbnail: "https://img.youtube.com/vi/1ZYbU82GVz4/hqdefault.jpg" },
      { id: "7Zw9qUC4a3k", title: "Sound Bath Music", description: "Deeply relaxing sound bath music for meditation and healing.", thumbnail: "https://img.youtube.com/vi/7Zw9qUC4a3k/hqdefault.jpg" },
      { id: "bP9gMpl1gyQ", title: "Calming Nature Sounds", description: "Peaceful nature sounds to help you unwind and relax.", thumbnail: "https://img.youtube.com/vi/bP9gMpl1gyQ/hqdefault.jpg" },
      { id: "Kvy6TDztiTU", title: "Live Calming Stream", description: "A live stream of calming visuals and soothing music.", thumbnail: "https://img.youtube.com/vi/Kvy6TDztiTU/hqdefault.jpg" },
      { id: "IPmXzg0ZL80", title: "Peaceful Relaxation", description: "Gentle music and visuals for deep relaxation.", thumbnail: "https://img.youtube.com/vi/IPmXzg0ZL80/hqdefault.jpg" },
    ],
  },
  {
    name: "Meditation",
    videos: [
      { id: "0y0586ffZWQ", title: "Just Be - Guided Meditation", description: "A gentle guided meditation to help you simply be present.", thumbnail: "https://img.youtube.com/vi/0y0586ffZWQ/hqdefault.jpg" },
      { id: "aIIEI33EUqI", title: "Deep Meditation Music", description: "15 minutes of peaceful meditation music for deep relaxation.", thumbnail: "https://img.youtube.com/vi/aIIEI33EUqI/hqdefault.jpg" },
      { id: "qTJ2Z-geCW8", title: "Meditation for Positive Energy", description: "Cultivate positive energy and inner peace with this meditation.", thumbnail: "https://img.youtube.com/vi/qTJ2Z-geCW8/hqdefault.jpg" },
      { id: "5WhQ2mHeTJc", title: "Morning Meditation", description: "Start your day with clarity and calm through guided meditation.", thumbnail: "https://img.youtube.com/vi/5WhQ2mHeTJc/hqdefault.jpg" },
      { id: "thcEuMDWxoI", title: "Mindfulness Meditation", description: "A mindfulness practice to ground you in the present moment.", thumbnail: "https://img.youtube.com/vi/thcEuMDWxoI/hqdefault.jpg" },
      { id: "IPDtrQZThAs", title: "Evening Wind Down Meditation", description: "Gentle meditation to release the day and prepare for rest.", thumbnail: "https://img.youtube.com/vi/IPDtrQZThAs/hqdefault.jpg" },
    ],
  },
  {
    name: "Work",
    videos: [
      { id: "WPni755-Krg", title: "Study Music Alpha Waves", description: "Alpha waves music to enhance concentration and studying.", thumbnail: "https://img.youtube.com/vi/WPni755-Krg/hqdefault.jpg" },
      { id: "pQI64hD2sJw", title: "FOCUS & CONCENTRATION", description: "Music designed to boost focus and productivity.", thumbnail: "https://img.youtube.com/vi/pQI64hD2sJw/hqdefault.jpg" },
      { id: "OoSzt2Ga8Oc", title: "Playlist for Focus Time", description: "Curated playlist to help you stay focused and productive.", thumbnail: "https://img.youtube.com/vi/OoSzt2Ga8Oc/hqdefault.jpg" },
      { id: "MYW0TgV67RE", title: "Deep Work Soundtrack", description: "Ambient music to enter a deep work flow state.", thumbnail: "https://img.youtube.com/vi/MYW0TgV67RE/hqdefault.jpg" },
      { id: "S02l82H9yks", title: "Productivity Beats", description: "Lo-fi beats curated for sustained focus and productivity.", thumbnail: "https://img.youtube.com/vi/S02l82H9yks/hqdefault.jpg" },
      { id: "88ExZwnCU44", title: "Concentration Music", description: "Background music designed to sharpen your concentration.", thumbnail: "https://img.youtube.com/vi/88ExZwnCU44/hqdefault.jpg" },
    ],
  },
  {
    name: "Workout",
    videos: [
      { id: "ww6N-jyjsbw", title: "Gentleman Songs", description: "Energetic workout playlist to keep you motivated.", thumbnail: "https://img.youtube.com/vi/ww6N-jyjsbw/hqdefault.jpg" },
      { id: "spHkzkRSDTs", title: "Girl Summer Playlist", description: "Upbeat summer vibes for your workout sessions.", thumbnail: "https://img.youtube.com/vi/spHkzkRSDTs/hqdefault.jpg" },
      { id: "8MG-mDI7Sns", title: "Hip Hop Gym Workout Music", description: "High-energy hip hop to power through your gym session.", thumbnail: "https://img.youtube.com/vi/8MG-mDI7Sns/hqdefault.jpg" },
      { id: "iYqdKrFnprc", title: "Power Workout Mix", description: "High-intensity mix to fuel your toughest workouts.", thumbnail: "https://img.youtube.com/vi/iYqdKrFnprc/hqdefault.jpg" },
      { id: "vFai116E69M", title: "Cardio Boost Playlist", description: "Upbeat tracks to keep your cardio session going strong.", thumbnail: "https://img.youtube.com/vi/vFai116E69M/hqdefault.jpg" },
      { id: "FeR-4_Opt-g", title: "Gym Motivation", description: "Motivational playlist to push through every rep.", thumbnail: "https://img.youtube.com/vi/FeR-4_Opt-g/hqdefault.jpg" },
    ],
  },
  {
    name: "Yoga",
    videos: [
      { id: "0Ni00XDSd6E", title: "Tibetan Healing Relaxation Music", description: "Tibetan healing sounds for deep relaxation and yoga practice.", thumbnail: "https://img.youtube.com/vi/0Ni00XDSd6E/hqdefault.jpg" },
      { id: "c8n3dqJW4y0", title: "45 min of Modern Yoga Music", description: "Contemporary yoga music for your complete practice.", thumbnail: "https://img.youtube.com/vi/c8n3dqJW4y0/hqdefault.jpg" },
      { id: "2RTZNLL0wss", title: "Yoga Music", description: "Peaceful music to enhance your yoga flow.", thumbnail: "https://img.youtube.com/vi/2RTZNLL0wss/hqdefault.jpg" },
      { id: "_8kV4FHSdNA", title: "Gentle Yoga Flow", description: "A calming yoga session for flexibility and peace of mind.", thumbnail: "https://img.youtube.com/vi/_8kV4FHSdNA/hqdefault.jpg" },
      { id: "C2RAjUEAoLI", title: "Morning Yoga Stretch", description: "Wake up your body with a gentle morning yoga stretch.", thumbnail: "https://img.youtube.com/vi/C2RAjUEAoLI/hqdefault.jpg" },
      { id: "8VwufJrUhic", title: "Restorative Yoga", description: "Deep restorative yoga for relaxation and recovery.", thumbnail: "https://img.youtube.com/vi/8VwufJrUhic/hqdefault.jpg" },
    ],
  },
  {
    name: "Nature",
    videos: [
      { id: "Nn6-uMinE_o", title: "Hiking the Mount Marcy", description: "Experience the beauty of hiking Mount Marcy.", thumbnail: "https://img.youtube.com/vi/Nn6-uMinE_o/hqdefault.jpg" },
      { id: "I2I4EySGYEU", title: "Discovering Tibetan Nepal", description: "Journey through the stunning landscapes of Tibetan Nepal.", thumbnail: "https://img.youtube.com/vi/I2I4EySGYEU/hqdefault.jpg" },
      { id: "TLZOWDF8lqQ", title: "Silent Hiking the John Muir Trail", description: "Peaceful silent hike through the John Muir Trail.", thumbnail: "https://img.youtube.com/vi/TLZOWDF8lqQ/hqdefault.jpg" },
      { id: "RlNSBk_vUrg", title: "Forest Walk", description: "Immerse yourself in the tranquility of a forest walk.", thumbnail: "https://img.youtube.com/vi/RlNSBk_vUrg/hqdefault.jpg" },
      { id: "PRbpcDnUvMQ", title: "Ocean Waves", description: "Calming ocean waves for relaxation and mindfulness.", thumbnail: "https://img.youtube.com/vi/PRbpcDnUvMQ/hqdefault.jpg" },
      { id: "M8Vr0MMVrLg", title: "Mountain Scenery", description: "Breathtaking mountain views for a peaceful escape.", thumbnail: "https://img.youtube.com/vi/M8Vr0MMVrLg/hqdefault.jpg" },
    ],
  },
  {
    name: "Jazz",
    videos: [
      { id: "K110MtP_Mis", title: "Vintage Jazz", description: "Classic vintage jazz for a sophisticated atmosphere.", thumbnail: "https://img.youtube.com/vi/K110MtP_Mis/hqdefault.jpg" },
      { id: "ZHV_Hc2Wbrw", title: "Just Business, Darling", description: "Smooth jazz for work or relaxation.", thumbnail: "https://img.youtube.com/vi/ZHV_Hc2Wbrw/hqdefault.jpg" },
      { id: "ziOus5-1kXw", title: "Jazz Selection", description: "The perfect balance of jazz vibes.", thumbnail: "https://img.youtube.com/vi/ziOus5-1kXw/hqdefault.jpg" },
      { id: "pp572S9SLO8", title: "Late Night Jazz", description: "Smooth late-night jazz for winding down.", thumbnail: "https://img.youtube.com/vi/pp572S9SLO8/hqdefault.jpg" },
      { id: "BHq-DHxArQo", title: "Jazz Café Vibes", description: "Relaxing café jazz to set a cozy mood.", thumbnail: "https://img.youtube.com/vi/BHq-DHxArQo/hqdefault.jpg" },
      { id: "kibjNuFEeMQ", title: "Classic Jazz Collection", description: "A curated collection of timeless jazz classics.", thumbnail: "https://img.youtube.com/vi/kibjNuFEeMQ/hqdefault.jpg" },
    ],
  },
];
