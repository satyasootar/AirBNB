const Profile = ({ 
    user, 
    size = 40, 
    textColor = '#FFFFFF',
    backgroundColor,
    fontSize,
    style = {},
    className = '',
    onClick,
    showTooltip = true 
}) => {
    
    const getFirstLetter = () => {
        if (!user?.username || typeof user.username !== 'string') return '?';
        return user.username.charAt(0).toUpperCase();
    };

    const getBackgroundColor = () => {
        if (backgroundColor) return backgroundColor;
        if (user?.profile_pic) return 'transparent';

        const colors = [
            '#000000',     // Black
            '#FF385C',     // Airbnb red
            '#E31C5F'      // Pinkish red
        ];
        
        const username = user?.username || '';
        const index = username ? username.charCodeAt(0) % colors.length : 0;
        return colors[index];
    };

    const getFontSize = () => {
        if (fontSize) return fontSize;
        return Math.floor(size * 0.4);
    };

    const circleStyle = {
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        backgroundColor: getBackgroundColor(),
        color: textColor,
        fontSize: `${getFontSize()}px`,
        backgroundImage: user?.profile_pic ? `url(${user.profile_pic})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        cursor: onClick ? 'pointer' : 'default',
        ...style
    };

    return (
        <div
            className={`circular-profile ${user?.profile_pic ? 'has-image' : ''} ${className}`}
            style={circleStyle}
            onClick={onClick}
            title={showTooltip ? user?.username : undefined}
        >
            {!user?.profile_pic && getFirstLetter()}
        </div>
    );
};

export default Profile;