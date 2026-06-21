import styles from './Layouts.module.css'

export default function Container({ children, fluid }){

    const containerClass = fluid ? styles.containerFluid : styles.container;

    return(
        <div className={containerClass}>
            { children }
        </div>
    );
}