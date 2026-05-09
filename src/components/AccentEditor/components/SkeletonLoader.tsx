import { useMemo } from 'react';

import './SkeletonLoader.css';

interface SkeletonLoaderProps {
    lines?: number;
    className?: string;
}

export default function SkeletonLoader({ lines = 3, className = '' }: SkeletonLoaderProps) {
    const widths = useMemo(
        () => Array.from({ length: lines }, () => `${Math.random() * 40 + 60}%`),
        [lines],
    );

    return (
        <div className={`skeleton-container ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
                <div key={i} className='skeleton-line' style={{ width: widths[i] }}></div>
            ))}
        </div>
    );
}
