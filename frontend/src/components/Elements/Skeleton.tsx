import React from "react";

interface SkeletonProps {
    className?: string;
    variant?: "text" | "rectangular" | "circular";
    width?: string | number;
    height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    className = "",
    variant = "rectangular",
    width,
    height,
}) => {
    const baseClasses = "animate-pulse bg-gray-200 dark:bg-gray-700";

    const variantClasses = {
        text: "h-4 rounded",
        rectangular: "rounded-md",
        circular: "rounded-full",
    };

    const style: React.CSSProperties = {};
    if (width) style.width = typeof width === "number" ? `${width}px` : width;
    if (height) style.height = typeof height === "number" ? `${height}px` : height;

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={style}
        />
    );
};

// Product Card Skeleton
export const ProductCardSkeleton: React.FC = () => (
    <div className="animate-fadeIn relative rounded-xl drop-shadow-custom bg-white dark:bg-gray-800 mb-8">
        <Skeleton variant="rectangular" height={250} className="w-full rounded-xl" />
        <div className="text-center py-4">
            <Skeleton variant="text" width="60%" className="mb-1 mx-auto" />
            <Skeleton variant="text" width="40%" className="mb-1 mx-auto" />
            <Skeleton variant="text" width="30%" className="mx-auto" />
        </div>
    </div>
);

// Product Grid Skeleton
export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: count }, (_, index) => (
            <ProductCardSkeleton key={index} />
        ))}
    </div>
);
