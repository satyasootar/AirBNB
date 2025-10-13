
export default function Loader({ size = 40, ariaLabel = "Loading..." }) {
    const style = {
        width: size,
        height: size,
        border: `${size / 8}px solid rgba(255, 255, 255, 0.2)`, // track
        borderTop: `${size / 8}px solid #fff`, // active part
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
    };

    return (
        <div
            role="status"
            aria-label={ariaLabel}
            style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div style={style}></div>
            <style>
                {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
            </style>
        </div>
    );
}
