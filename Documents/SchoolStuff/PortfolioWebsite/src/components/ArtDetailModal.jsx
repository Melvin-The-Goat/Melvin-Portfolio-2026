import { useEffect } from 'react';
import { X } from 'lucide-react';
import ModelViewer from './ModelViewer';

const ArtDetailModal = ({ artwork, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (artwork) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [artwork, onClose]);

  if (!artwork) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-10">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-gray-900 border border-gray-700 w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white z-10 bg-gray-800 p-2 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          {/* Title */}
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            {artwork.title}
          </h2>
          <p className="text-gray-400 mb-6">{artwork.type}</p>

          {/* 3D Model Viewer or Image */}
          {artwork.modelPath ? (
            <ModelViewer modelPath={artwork.modelPath} title={artwork.title} />
          ) : artwork.image ? (
            <div className="w-full h-[500px] bg-gray-950 rounded-lg overflow-hidden border border-gray-700 flex items-center justify-center">
              <img 
                src={artwork.image} 
                alt={artwork.title}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-full h-[500px] bg-gradient-to-br from-purple-900/20 to-gray-900 rounded-lg flex items-center justify-center border border-gray-700">
              <div className="text-8xl opacity-20">
                {artwork.type === '3D Model' ? '🎨' : '✏️'}
              </div>
            </div>
          )}

          {/* Description */}
          {artwork.description && (
            <div className="mt-6 bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-purple-400 font-semibold mb-3 text-lg">About This Asset</h3>
              <p className="text-gray-300 leading-relaxed">{artwork.description}</p>
            </div>
          )}

          {/* Technical Details */}
          {artwork.technicalDetails && artwork.technicalDetails.length > 0 && (
            <div className="mt-4 bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-pink-400 font-semibold mb-3 text-lg">Technical Details</h3>
              <div className="flex flex-wrap gap-2">
                {artwork.technicalDetails.map((detail, idx) => (
                  <span key={idx} className="px-3 py-1 bg-purple-900/30 text-purple-300 text-sm rounded-full border border-purple-700/50">
                    {detail}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtDetailModal;