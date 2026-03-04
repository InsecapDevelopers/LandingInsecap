import { useEffect, useRef, useState, useCallback } from 'react';

interface UseScrollAnimationOptions {
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
}

/**
 * Hook that detects when an element enters the viewport using IntersectionObserver.
 * Returns a ref to attach to the element and a boolean indicating visibility.
 */
export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
    const { threshold = 0.15, rootMargin = '0px', triggerOnce = false } = options;
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (triggerOnce) {
                        observer.unobserve(element);
                    }
                } else if (!triggerOnce) {
                    setIsVisible(false);
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(element);

        return () => {
            observer.unobserve(element);
        };
    }, [threshold, rootMargin, triggerOnce]);

    return { ref, isVisible };
}

/**
 * Hook for staggered children animations.
 * Returns a ref and isVisible, plus a helper to get delay for each child index.
 */
export function useStaggerAnimation(options: UseScrollAnimationOptions = {}) {
    const { ref, isVisible } = useScrollAnimation(options);

    const getDelay = useCallback((index: number, baseDelay = 100) => {
        return `${index * baseDelay}ms`;
    }, []);

    return { ref, isVisible, getDelay };
}
