import styles from './Layouts.module.css'

export default function Col( {children, size} ){
    
    const classCol = size ? styles[`col${size}`] : styles.col;
    
    return(
        <div className={classCol}>
            { children }
        </div>
    )
}