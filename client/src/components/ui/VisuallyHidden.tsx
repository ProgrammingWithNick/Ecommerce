import React from "react";

const VisuallyHidden: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <span
            style={{
                position: "absolute",
                width: "1px",
                height: "1px",
                margin: "-1px",
                padding: "0",
                border: "0",
                clip: "rect(0 0 0 0)",
                clipPath: "inset(50%)",
                overflow: "hidden",
            }}
        >
            {children}
        </span>
    );
};

export { VisuallyHidden };
