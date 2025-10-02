
const Profile = ({
    name = "",
    imageUrl = null,
    size = 40,
    backgroundColor = null,
    textColor = "#ffffff",
    fontSize = null,
    className = "",
    onClick,
    style = {},
    showTooltip = false
}) => {
    const getFirstLetter = () => {
        if (!name || typeof name !== 'string') return '?';
        return name.charAt(0).toUpperCase();
    };

    const getBackgroundColor = () => {
        if (backgroundColor) return backgroundColor;
        if (imageUrl) return 'transparent';

        const colors = [
            '#000000',     // Black
            '#FF385C',     // Airbnb red
            '#E31C5F'      // Pinkish red
        ];
        const index = name ? name.charCodeAt(0) % colors.length : 0;
        return colors[index];
    };

    const getFontSize = () => {
        if (fontSize) return fontSize;
        return Math.floor(size * 0.4);
    };

    const circleStyle = {
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: getBackgroundColor(),
        color: textColor,
        fontSize: `${getFontSize()}px`,
        backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        ...style
    };

    return (
        <div
            className={`circular-profile ${imageUrl ? 'has-image' : ''} ${className}`}
            style={circleStyle}
            onClick={onClick}
            title={showTooltip ? name : undefined}
        >
            {!imageUrl && getFirstLetter()}
        </div>
    );
};

export default Profile;