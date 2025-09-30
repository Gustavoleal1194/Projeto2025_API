import React from 'react';
import LogoutButton from '../LogoutButton';
import AnimatedSearchBar from '../AnimatedSearchBar';

interface UsuarioHeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    userName: string;
    onLogout: () => void;
    isSidebarCollapsed: boolean;
}

const UsuarioHeader: React.FC<UsuarioHeaderProps> = ({
    searchQuery,
    setSearchQuery,
    userName,
    onLogout,
    isSidebarCollapsed
}) => {
    return (
        <header className="fixed top-0 right-0 h-18 bg-white border-b border-blue-400 flex items-center justify-between px-8 z-40 transition-all duration-300" style={{ left: isSidebarCollapsed ? '4rem' : '17.5rem' }}>
            {/* Search Container */}
            <div className="flex-1 max-w-lg">
                <AnimatedSearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    placeholder="Buscar na estante..."
                />
            </div>

            {/* User Profile & Actions */}
            <div className="flex items-center gap-4">
                {/* User Profile */}
                <div className="flex items-center gap-3 cursor-pointer p-2 rounded-full hover:bg-blue-50 transition-colors duration-300">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-2" style={{ width: '50px', height: '50px' }}>
                        <svg viewBox="0 0 144.773 144.773" className="w-full h-full">
                            <g>
                                <circle style={{ fill: "#3b82f6" }} cx="72.387" cy="72.386" r="72.386" />
                                <g>
                                    <defs>
                                        <circle id="SVGID_1_" cx="72.387" cy="72.386" r="72.386" />
                                    </defs>
                                    <clipPath id="SVGID_2_">
                                        <use xlinkHref="#SVGID_1_" style={{ overflow: "visible" }} />
                                    </clipPath>
                                    <g style={{ clipPath: "url(#SVGID_2_)" }}>
                                        <g>
                                            <path style={{ fill: "#F1C9A5" }} d="M107.053,116.94c-4.666-8.833-34.666-14.376-34.666-14.376s-30,5.543-34.666,14.376c-3.449,12.258-6.334,27.833-6.334,27.833h41h41C113.387,144.773,111.438,128.073,107.053,116.94z" />
                                            <path style={{ fill: "#E4B692" }} d="M72.387,102.564c0,0,30,5.543,34.666,14.376c4.386,11.133,6.334,27.833,6.334,27.833h-41V102.564z" />
                                            <rect x="64.22" y="84.606" style={{ fill: "#F1C9A5" }} width="16.334" height="27.336" />
                                            <rect x="72.387" y="84.606" style={{ fill: "#E4B692" }} width="8.167" height="27.336" />
                                            <path style={{ opacity: "0.1", fill: "#DDAC8C" }} d="M64.22,97.273c1.469,4.217,7.397,6.634,11.751,6.634c1.575,0,3.107-0.264,4.583-0.747V84.606H64.22V97.273z" />
                                            <path style={{ fill: "#F1C9A5" }} d="M93.387,67.357c0-17.074-9.402-26.783-21-26.783c-11.598,0-21,9.709-21,26.783c0,22.966,9.402,30.917,21,30.917C83.984,98.274,93.387,89.366,93.387,67.357z" />
                                            <path style={{ fill: "#E4B692" }} d="M90.19,79.197c-3.807-0.399-6.377-4.5-5.733-9.156c0.637-4.66,4.242-8.12,8.051-7.724c3.805,0.396,6.371,4.496,5.729,9.156C97.599,76.134,93.997,79.591,90.19,79.197z" />
                                            <path style={{ fill: "#F1C9A5" }} d="M46.685,71.474c-0.643-4.66,1.924-8.76,5.727-9.156c3.811-0.397,7.416,3.063,8.055,7.724c0.642,4.656-1.93,8.758-5.734,9.156C50.925,79.591,47.323,76.134,46.685,71.474z" />
                                            <path style={{ fill: "#E4B692" }} d="M93.387,67.357c0-17.074-9.402-26.783-21-26.783v57.7C83.984,98.274,93.387,89.366,93.387,67.357z" />
                                        </g>
                                        <path style={{ fill: "#0D313D" }} d="M107.053,116.94c-2.726-5.158-14.082-9.191-23.065-11.656l-11.601,39.489l-11.601-39.489c-8.983,2.465-20.34,6.498-23.066,11.656c-3.449,12.258-6.334,27.833-6.334,27.833h41h41C113.387,144.773,111.438,128.073,107.053,116.94z" />
                                        <polygon style={{ fill: "#F1F2F2" }} points="60.413,105.284 72.387,144.773 84.032,105.284 72.387,118.544" />
                                        <polygon style={{ fill: "#2B5770" }} points="72.387,144.773 90.115,125.028 84.032,122.724 94.615,108.349 84.331,105.284" />
                                        <polygon style={{ fill: "#2B5770" }} points="72.387,144.773 54.658,125.028 60.741,122.724 50.158,108.349 60.442,105.284" />
                                        <path style={{ fill: "#FFFFFF" }} d="M57.359,121.332l9.077-8.437l5.935,5.648l-8.152-14.161l-4.979,0.383C58.883,110.271,57.359,121.332,57.359,121.332z" />
                                        <path style={{ fill: "#FFFFFF" }} d="M87.385,121.332l-9.077-8.437l-5.936,5.648l8.152-14.161l4.979,0.383C85.861,110.271,87.385,121.332,87.385,121.332z" />
                                        <path style={{ fill: "#262421" }} d="M95.443,63.508c0,0-3.744-2.825-5.348,5.467c0.521-7.792,0.142-18.541-6.181-20.508c-3.513,6.321-17.418,10.393-26.549,8.146c0.701,7.165-1.404,13.066-3.793,14.61c0.14-5.76,0.138-9.273-3.514-8.148c-0.982-12.08,5.634-27.393,23.474-27.393C91.373,35.683,97.27,47.773,95.443,63.508z" />
                                    </g>
                                </g>
                            </g>
                        </svg>
                    </div>
                    <span className="text-gray-700 font-medium">{userName}</span>
                </div>

                {/* Logout Button */}
                <LogoutButton onClick={onLogout} />
            </div>
        </header>
    );
};

export default UsuarioHeader;
