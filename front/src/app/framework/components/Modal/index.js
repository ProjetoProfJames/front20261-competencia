import styles from './modal.module.css';

export default function Modal({title, children}){
    return (
        <div className={styles.overlay}>
            <div className={styles.modalBox}>
                {children}
            </div>
        </div>
    );
}