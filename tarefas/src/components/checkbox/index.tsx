import styles from "./styles.module.css"

interface CheckBoxProps {
    label: string
}

export function CheckBox (props: CheckBoxProps) {
    return (
    <div className={styles.checkboxArea}>
        <input type="checkbox" className={ styles.checkbox }/>
        <label>{props.label}</label>
    </div>
    )
}