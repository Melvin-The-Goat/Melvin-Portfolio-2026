const ArtCard = ({ title, type, image, onClick }) => {
  return (
    <div 
      onClick={onClick}  // <--- THIS WAS MISSING
      className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:scale-105 cursor-pointer"
    >
      <div className="h-64 bg-gradient-to-br from-purple-900/20 to-gray-900 flex items-center justify-center">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="text-7xl opacity-30">{type === '3D Model' ? '🎨' : '✏️'}</div>
        )}
      </div>
      <div className="p-4">
        <h4 className="text-white font-semibold">{title}</h4>
        <p className="text-gray-500 text-xs mt-1">{type}</p>
      </div>
    </div>
  );
};

export default ArtCard;