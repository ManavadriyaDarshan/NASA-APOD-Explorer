import React, { useState } from 'react';
import { X, Calendar, User, ExternalLink, Heart, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { addFavorite, removeFavorite, checkFavorite } from '../api/apodApi';
import { toast } from 'sonner';

const ApodDetailModal = ({ apod, open, onClose }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  React.useEffect(() => {
    if (apod) {
      loadFavoriteStatus();
    }
  }, [apod]);

  const loadFavoriteStatus = async () => {
    try {
      const result = await checkFavorite(apod.date);
      setIsFavorite(result.is_favorite);
    } catch (error) {
      console.error('Failed to check favorite status', error);
    }
  };

  const toggleFavorite = async () => {
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

  if (!apod) return null;

  const isVideo = apod.media_type === 'video';
  const imageUrl = apod.hdurl || apod.url;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] bg-gradient-to-br from-slate-900 to-slate-800 border border-white/20 text-white" data-testid="apod-detail-modal">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold pr-8" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            {apod.title}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-full pr-4">
          <div className="space-y-6">
            {/* Image/Video */}
            <div className="relative rounded-lg overflow-hidden">
              {isVideo ? (
                <div className="aspect-video">
                  <iframe
                    src={apod.url}
                    title={apod.title}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="encrypted-media"
                    allowFullScreen
                  />
                </div>
              ) : (
                <img
                  src={imageUrl}
                  alt={apod.title}
                  className="w-full h-auto rounded-lg"
                />
              )}
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4">
              <Badge className="bg-blue-500/80 text-white border-none">
                {isVideo ? 'Video' : 'Image'}
              </Badge>
              <div className="flex items-center gap-2 text-gray-300">
                <Calendar className="w-4 h-4" />
                <span>{apod.date}</span>
              </div>
              {apod.copyright && (
                <div className="flex items-center gap-2 text-gray-300">
                  <User className="w-4 h-4" />
                  <span>{apod.copyright}</span>
                </div>
              )}
            </div>

            {/* Explanation */}
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Explanation
              </h3>
              <p className="text-gray-300 leading-relaxed text-base">
                {apod.explanation}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4">
              <Button
                onClick={toggleFavorite}
                disabled={favoriteLoading}
                className={`${
                  isFavorite
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white`}
                data-testid="modal-favorite-button"
              >
                <Heart
                  className={`w-4 h-4 mr-2 ${
                    isFavorite ? 'fill-white' : ''
                  }`}
                />
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </Button>

              {apod.hdurl && !isVideo && (
                <Button
                  asChild
                  variant="outline"
                  className="border-white/20 hover:bg-white/10 text-white"
                >
                  <a href={apod.hdurl} target="_blank" rel="noopener noreferrer" data-testid="view-hd-button">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View HD Image
                  </a>
                </Button>
              )}

              {!isVideo && (
                <Button
                  asChild
                  variant="outline"
                  className="border-white/20 hover:bg-white/10 text-white"
                >
                  <a href={imageUrl} download data-testid="download-button">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </a>
                </Button>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ApodDetailModal;
