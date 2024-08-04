import styles from "./button.module.scss"

export const Button = ({ children, ...props }) => {
    return <button className={styles.button} {...props}>{children}</button>
}
