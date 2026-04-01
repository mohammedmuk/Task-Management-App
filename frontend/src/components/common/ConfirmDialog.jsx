import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { HiExclamation } from "react-icons/hi";
import {
    selectConfirmDialog,
    closeConfirmDialog,
} from "@features/ui/uiSlice";
import Button from "./Button";

const ConfirmDialog = () => {
    const dispatch = useDispatch();
    const dialog = useSelector(selectConfirmDialog);
    const panelRef = useRef(null);
    const bgRef = useRef(null);

    useEffect(() => {
        if (!dialog.open) return;
        gsap.fromTo(
            bgRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.25 }
        );
        gsap.fromTo(
            panelRef.current,
            { scale: 0.88, opacity: 0, y: 20 },
            { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: "back.out(1.7)" }
        );
    }, [dialog.open]);

    const handleClose = () => {
        gsap.to(panelRef.current, {
            scale: 0.9,
            opacity: 0,
            duration: 0.2,
            ease: "power2.in",
        });
        gsap.to(bgRef.current, {
            opacity: 0,
            duration: 0.2,
            onComplete: () => dispatch(closeConfirmDialog()),
        });
    };

    const handleConfirm = () => {
        if (typeof dialog.onConfirm === "function") dialog.onConfirm();
        handleClose();
    };

    if (!dialog.open) return null;

    return createPortal(
        <div
            ref={bgRef}
            className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        >
            <div
                ref={panelRef}
                className="w-full max-w-sm card border border-white/10 overflow-hidden"
            >
                {/* Icon */}
                <div className="px-6 pt-6 pb-4 text-center">
                    <div className="
            w-14 h-14 rounded-2xl
            bg-danger/15 border border-danger/25
            flex items-center justify-center
            mx-auto mb-4
          ">
                        <HiExclamation size={28} className="text-danger" />
                    </div>

                    <h3 className="
            text-lg font-display font-bold
            text-white mb-2
          ">
                        {dialog.title}
                    </h3>
                    <p className="text-sm text-white/50 leading-relaxed">
                        {dialog.message}
                    </p>
                </div>

                {/* Actions */}
                <div className="
          flex gap-3 px-6 pb-6
        ">
                    <Button
                        variant="secondary"
                        size="md"
                        fullWidth
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        size="md"
                        fullWidth
                        onClick={handleConfirm}
                    >
                        Delete
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ConfirmDialog;