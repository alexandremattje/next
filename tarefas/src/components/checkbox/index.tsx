import { HTMLProps } from "react"
import styles from "./styles.module.css"

interface CheckBoxProps extends HTMLProps<HTMLInputElement> {
    label: string
}

export function CheckBox (props: CheckBoxProps) {
    return (
    <div className={styles.checkboxArea}>
        <input type="checkbox" className={ styles.checkbox } {...props}/>
        <label>{props.label}</label>
    </div>
    )
}