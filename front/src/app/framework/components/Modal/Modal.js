"use client";

import styles from './modal.module.css';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  className = "",
}) {
  const shouldRender = isOpen === undefined ? true : isOpen;

  if (!shouldRender) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={`${styles.modalBox} ${className}`.trim()}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || onClose) && (
          <div>
            {title ? <h2>{title}</h2> : null}
            {onClose ? (
              <button
                type="button"
                className={styles.closeButton}
                onClick={onClose}
                aria-label="Fechar modal"
              >
                ×
              </button>
            ) : null}
          </div>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
}