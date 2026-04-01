import { useEffect, useRef } from "react";
import gsap from "gsap";

const useGsapAnimation = (type = "fadeInUp", deps = []) => {
    const ref = useRef(null);

    useEffect(() => {
        if (!ref.current) return;

        const el = ref.current;
        let ctx = gsap.context(() => { }, el);

        switch (type) {
            case "fadeInUp":
                gsap.fromTo(
                    el,
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
                );
                break;

            case "fadeInRight":
                gsap.fromTo(
                    el,
                    { opacity: 0, x: 40 },
                    { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" }
                );
                break;

            case "fadeIn":
                gsap.fromTo(
                    el,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.4, ease: "power2.out" }
                );
                break;

            case "scalePop":
                gsap.fromTo(
                    el,
                    { opacity: 0, scale: 0.9 },
                    { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.7)" }
                );
                break;

            case "slideInRight":
                gsap.fromTo(
                    el,
                    { x: "100%", opacity: 0 },
                    { x: "0%", opacity: 1, duration: 0.45, ease: "power3.out" }
                );
                break;

            case "stagger":
                gsap.fromTo(
                    el.children,
                    { opacity: 0, y: 20 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        stagger: 0.08,
                        ease: "power3.out",
                    }
                );
                break;

            default:
                break;
        }

        return () => ctx.revert();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return ref;
};

export default useGsapAnimation;