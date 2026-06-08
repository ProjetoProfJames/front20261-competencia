import styles from './Layouts.module.css'

export default function Row( {children, align, justify} ){
    let rowClass = [styles.row] 

    if(align === 'center') rowClass.push(styles.alignCenter);
    if(align === 'start') rowClass.push(styles.alignStart);
    if(align === 'end') rowClass.push(styles.alignEnd);

    if(justify === 'evenly') rowClass.push(styles.justifyEvenly);
    if(justify === 'between') rowClass.push(styles.justifyBetween);

    return(
        <div className={rowClass.join(' ')}>
            { children }
        </div>
    )
}