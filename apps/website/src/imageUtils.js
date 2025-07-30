import React from 'react'

// Image optimization utilities for better performance

// Lazy loading image component with placeholder
export const LazyImage = ({
    src,
    alt,
    className = '',
    style = {},
    placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y0ZjRmNCIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Mb2FkaW5nLi4uPC90ZXh0Pjwvc3ZnPg==',
    ...props
}) => {
    const [isLoaded, setIsLoaded] = React.useState(false)
    const [hasError, setHasError] = React.useState(false)
    const imgRef = React.useRef(null)

    React.useEffect(() => {
        if (!imgRef.current) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    // Start loading the actual image
                    const img = new Image()
                    img.onload = () => setIsLoaded(true)
                    img.onerror = () => setHasError(true)
                    img.src = src
                    observer.disconnect()
                }
            },
            { threshold: 0.1 }
        )

        observer.observe(imgRef.current)
        return () => observer.disconnect()
    }, [src])

    return (
        <div ref={imgRef} className={className} style={style}>
            <img
                src={isLoaded ? src : placeholder}
                alt={alt}
                style={{
                    ...style,
                    transition: 'opacity 0.3s ease',
                    opacity: isLoaded ? 1 : 0.7,
                    filter: isLoaded ? 'none' : 'blur(2px)',
                }}
                {...props}
            />
            {hasError && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: '#999',
                    fontSize: '14px'
                }}>
                    Failed to load image
                </div>
            )}
        </div>
    )
}

// Optimized image URLs with different resolutions
export const getOptimizedImageUrl = (url, width = 800, quality = 80) => {
    if (!url || !url.includes('unsplash.com')) return url

    return `${url}&w=${width}&q=${quality}&auto=format&fit=crop`
}

// Image preloader for critical images
export const preloadImage = (src) => {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = resolve
        img.onerror = reject
        img.src = src
    })
}

// Critical images that should be preloaded
export const preloadCriticalImages = async () => {
    const criticalImages = [
        'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop',
    ]

    try {
        await Promise.all(criticalImages.map(preloadImage))
        console.log('Critical images preloaded')
    } catch (error) {
        console.warn('Some critical images failed to preload:', error)
    }
}
