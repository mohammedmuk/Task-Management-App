import gsap from "gsap";

/**
 * Fade in from below
 */
export const fadeInUp = (element, delay = 0, duration = 0.6) => {
    gsap.fromTo(
        element,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration, delay, ease: "power3.out" }
    );
};

/**
 * Fade in from right
 */
export const fadeInRight = (element, delay = 0, duration = 0.5) => {
    gsap.fromTo(
        element,
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration, delay, ease: "power3.out" }
    );
};

/**
 * Stagger children animation
 */
export const staggerChildren = (parent, childSelector, stagger = 0.1) => {
    gsap.fromTo(
        `${parent} ${childSelector}`,
        { opacity: 0, y: 20 },
        {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger,
            ease: "power3.out",
        }
    );
};

/**
 * Scale pop (for modals, toasts)
 */
export const scalePop = (element, delay = 0) => {
    gsap.fromTo(
        element,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.35, delay, ease: "back.out(1.7)" }
    );
};

/**
 * Slide in from right (detail panel)
 */
export const slideInFromRight = (element) => {
    gsap.fromTo(
        element,
        { x: "100%", opacity: 0 },
        { x: "0%", opacity: 1, duration: 0.45, ease: "power3.out" }
    );
};

/**
 * Slide out to right
 */
export const slideOutToRight = (element, onComplete) => {
    gsap.to(element, {
        x: "100%",
        opacity: 0,
        duration: 0.35,
        ease: "power3.in",
        onComplete,
    });
};

/**
 * Counter animation (for stats)
 */
export const animateCounter = (element, endValue, duration = 1.5) => {
    const obj = { val: 0 };
    gsap.to(obj, {
        val: endValue,
        duration,
        ease: "power2.out",
        onUpdate: () => {
            if (element) element.textContent = Math.round(obj.val);
        },
    });
};