import React from 'react';
import ApodCard from './ApodCard';

const Gallery = ({ apods, onApodClick }) => {
  if (!apods || apods.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400" data-testid="empty-gallery">
        <p className="text-lg">No APODs to display</p>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      data-testid="gallery-grid"
    >
      {apods.map((apod) => (
        <ApodCard
          key={apod.date}
          apod={apod}
          onClick={() => onApodClick(apod)}
        />
      ))}
    </div>
  );
};

export default Gallery;
