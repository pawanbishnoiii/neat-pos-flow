import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useState } from 'react';

interface VideoSectionProps {
  videos: { id: string; url: string; title?: string }[];
}

const VideoSection = ({ videos }: VideoSectionProps) => {
  const [playing, setPlaying] = useState<string | null>(null);

  if (videos.length === 0) return null;

  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : null;
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-12 space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
        <Play className="w-6 h-6" /> Videos
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {videos.map((v, i) => {
          const ytId = getYouTubeId(v.url);
          return (
            <motion.div key={v.id}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
              {ytId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${ytId}`}
                  className="w-full aspect-video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen title={v.title || 'Video'}
                />
              ) : (
                <video src={v.url} controls className="w-full aspect-video object-cover" />
              )}
              {v.title && <p className="p-3 text-sm font-medium text-gray-900">{v.title}</p>}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default VideoSection;
