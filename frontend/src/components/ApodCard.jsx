import React, { useState } from 'react';
import { Play, Heart, Calendar, User } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { addFavorite, removeFavorite, checkFavorite } from '../api/apodApi';
import { toast } from 'sonner';
import { Button } from './ui/button';

const ApodCard = ({ apod, onClick, featured = false }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  React.useEffect(() => {
    loadFavoriteStatus();
  }, [apod.date]);

  const loadFavoriteStatus = async () => {
    try {
      const result = await checkFavorite(apod.date);
      setIsFavorite(result.is_favorite);
    } catch (error) {
      console.error('Failed to check favorite status', error);
    }
  };

  const toggleFavorite = async (e) => {
    e.stopPropagation();
    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        await removeFavorite(apod.date);
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        await addFavorite({
          date: apod.date,
          title: apod.title,
          url: apod.url,
          hdurl: apod.hdurl,
          media_type: apod.media_type
        });
        setIsFavorite(true);
        toast.success('Added to favorites');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update favorites');
    } finally {
      setFavoriteLoading(false);
    }
  };

  const isVideo = apod.media_type === 'video';
  const imageUrl = apod.url;

  return (
    <Card
      className={`group overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-400/50 transition-all duration-300 cursor-pointer ${
        featured ? 'hover:shadow-2xl hover:shadow-blue-500/20' : 'hover:shadow-lg hover:shadow-blue-500/10'
      }`}
      onClick={onClick}
      data-testid="apod-card"
    >
      <div className={`relative overflow-hidden ${featured ? 'h-[500px]' : 'h-[280px]'}`}>
        {isVideo ? (
          <div className="relative w-full h-full bg-black/50 flex items-center justify-center">
            <iframe
              src={imageUrl}
              title={apod.title}
              className="w-full h-full"
              frameBorder="0"
              allow="encrypted-media"
              allowFullScreen
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none">
              <Play className="w-16 h-16 text-white/80" />
            </div>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={apod.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        {/* Favorite Button */}
        <Button
          onClick={toggleFavorite}
          disabled={favoriteLoading}
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm hover:bg-black/70 border border-white/20"
          data-testid="favorite-button"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-white'
            }`}
          />
        </Button>

        {/* Media Type Badge */}
        <Badge className="absolute top-3 left-3 bg-blue-500/80 backdrop-blur-sm text-white border-none">
          {isVideo ? 'Video' : 'Image'}
        </Badge>
      </div>

      <CardContent className="p-4 space-y-3">
        <h3
          className={`font-semibold text-white line-clamp-2 ${
            featured ? 'text-2xl' : 'text-lg'
          }`}
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          {apod.title}
        </h3>

        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{apod.date}</span>
          </div>
          {apod.copyright && (
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span className="truncate max-w-[150px]">{apod.copyright}</span>
            </div>
          )}
        </div>

        {featured && (
          <p className="text-gray-300 text-sm line-clamp-3">{apod.explanation}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ApodCard;
