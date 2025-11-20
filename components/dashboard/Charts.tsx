import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

// --- Task Donut Chart ---
export const TaskDonutChart: React.FC<{ percentage: number }> = ({ percentage }) => {
    const ref = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        d3.select(ref.current).selectAll("*").remove();

        const width = 200;
        const height = 200;
        const radius = Math.min(width, height) / 2;
        const thickness = 10;

        const svg = d3.select(ref.current)
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);

        // Background Circle
        const arcBg = d3.arc<any>()
            .innerRadius(radius - thickness)
            .outerRadius(radius)
            .startAngle(0)
            .endAngle(2 * Math.PI);

        svg.append("path")
            .attr("d", arcBg as any)
            .attr("fill", "#e5e7eb") // Gray-200
            .attr("opacity", 1);

        // Foreground Circle
        const arcFg = d3.arc<any>()
            .innerRadius(radius - thickness)
            .outerRadius(radius)
            .startAngle(0)
            .endAngle((percentage / 100) * 2 * Math.PI);

        svg.append("path")
            .attr("d", arcFg as any)
            .attr("fill", "#111827") // Black
            .attr("class", "drop-shadow-lg");

        // Center Text
        svg.append("text")
            .text(`${percentage}%`)
            .attr("text-anchor", "middle")
            .style("alignment-baseline", "middle")
            .style("font-size", "40px")
            .style("font-weight", "300")
            .style("fill", "#111827");

    }, [percentage]);

    return <svg ref={ref} className="w-full h-full" />;
};

// --- Simplified World Map Component ---
export const WorldMap: React.FC = () => {
    return (
        <div className="w-full h-full flex items-center justify-center opacity-100">
            <svg viewBox="0 0 800 400" className="w-full h-auto" fill="#f3f4f6">
                {/* Abstract Map Representation */}
                <g transform="scale(0.8) translate(100, 20)">
                    {/* North America */}
                    <path d="M150,50 Q100,60 80,120 L100,150 Q180,140 200,100 Z" className="text-gray-300 fill-current hover:text-gray-500 transition-colors duration-300" />
                    <circle cx="140" cy="100" r="4" className="fill-black animate-pulse" />
                    
                    {/* South America */}
                    <path d="M210,180 Q180,250 220,350 Q280,250 260,180 Z" className="text-gray-300 fill-current hover:text-gray-500 transition-colors duration-300" />

                    {/* Europe */}
                    <path d="M350,60 Q380,50 420,60 L410,100 Q360,110 350,60 Z" className="text-gray-300 fill-current hover:text-gray-500 transition-colors duration-300" />

                    {/* Africa */}
                    <path d="M350,120 Q450,120 460,200 Q400,300 380,280 Q340,200 350,120 Z" className="text-gray-300 fill-current hover:text-gray-500 transition-colors duration-300" />

                    {/* Asia */}
                    <path d="M450,50 Q600,40 650,100 Q600,180 500,150 Z" className="text-gray-200 fill-current" /> 
                    
                    {/* Australia */}
                    <path d="M580,250 Q650,250 660,300 Q600,320 580,250 Z" className="text-gray-200 fill-current" />
                </g>
            </svg>
        </div>
    );
};

export const LineChart: React.FC = () => <div />;
export const DonutChart: React.FC = () => <div />;