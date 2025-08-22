import { useState } from "react";
import { Heart } from "lucide-react";

export const HeartButton = ({
    initialLiked = false,
    size = 24,
    likedColor = "red",
    unlikedColor = "white",
    onToggle = () => { },
}) => {
    const [liked, setLiked] = useState(initialLiked);
    const [hover, setHover] = useState(false)

    const toggleLike = () => {
        const newState = !liked;
        setLiked(newState);
        onToggle(newState);
    };

    return (
        <button
            onClick={toggleLike}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease-in-out",
                transform: hover ? "scale(1.1)" : "scale(1)"
            }}
        >
            <Heart
                style={{
                    width: size,
                    height: size,
                    color: liked ? likedColor : unlikedColor,
                    fill: liked ? likedColor : "transparent",
                    transition: "all 0.3s ease-in-out",
                }}
            />
        </button>
    );
};
