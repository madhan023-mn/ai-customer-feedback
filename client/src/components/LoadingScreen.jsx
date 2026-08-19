import React from "react";
import { Sparkles, Layers, Cpu, Database, BarChart3 } from "lucide-react";

function LoadingScreen({
    title = "Loading LOOP Intelligence...",
    subtitle = "Syncing real-time workspace feedback & sentiment clusters",
    minHeight = "60vh",
    icon: CustomIcon
}) {
    const IconComponent = CustomIcon || Sparkles;

    return (
        <div className="loop-page-loader-container" style={{ minHeight }}>
            {/* Animated Glowing Multi-Ring Orb */}
            <div className="loop-loader-orb">
                <div className="loop-loader-ring-outer"></div>
                <div className="loop-loader-ring-inner"></div>
                <div className="loop-loader-core">
                    <IconComponent size={20} style={{ animation: "spin 4s linear infinite" }} />
                </div>
            </div>

            {/* Title & Subtitle */}
            <h3 className="loop-loader-title">{title}</h3>
            <p className="loop-loader-subtitle">{subtitle}</p>

            {/* Shimmering Animated Progress Wave */}
            <div className="loop-loader-progress-bar">
                <div className="loop-loader-progress-fill"></div>
            </div>
        </div>
    );
}

export default LoadingScreen;
