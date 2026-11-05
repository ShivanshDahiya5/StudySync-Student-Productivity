import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, children, footer, small = false }) {
    const ref = useRef(null);

    useEffect(() => {
        if (!open) return undefined;
        const onKey = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            onClick={onClose}
            ref={ref}
        >
            <div
                className={`modal${small ? ' modal-sm' : ''}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h2 className="modal-title">{title}</h2>
                    <button
                        type="button"
                        className="btn-icon"
                        onClick={onClose}
                        aria-label="Close dialog"
                    >
                        <X size={18} />
                    </button>
                </div>
                <div className="modal-body">{children}</div>
                {footer ? <div className="modal-footer">{footer}</div> : null}
            </div>
        </div>
    );
}
