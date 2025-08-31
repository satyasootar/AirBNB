

const MapEmbed = ({ latitude , longitude  }) => {
  const mapSrc = `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&hl=en&output=embed`;

  return (
    <div className="w-full h-[500px] rounded-2xl overflow-hidden shadow-lg">
      <iframe
        title="Google Map"
        src={mapSrc}
        className="w-full h-full border-0"
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default MapEmbed;
