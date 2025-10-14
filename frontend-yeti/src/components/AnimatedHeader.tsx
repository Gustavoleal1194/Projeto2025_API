import React, { useEffect, useState } from "react";
import AnimatedText from "./AnimatedText";

interface AnimatedHeaderProps {
    className?: string;
}

const AnimatedHeader: React.FC<AnimatedHeaderProps> = ({ className = "" }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className={`relative overflow-hidden ${className}`}>
            <div className="flex items-center gap-3">
                {/* Texto animado */}
                <div
                    className={`transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                        }`}
                    style={{ transitionDelay: "200ms" }}
                >
                    <AnimatedText text="Yeti Library System" />
                </div>
            </div>
        </div>
    );
};

export default AnimatedHeader;