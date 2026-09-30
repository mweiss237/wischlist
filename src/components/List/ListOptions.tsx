import React from 'react';
import styles from "./ListOptions.module.scss"

interface CheckboxProps {
    label: string;
    description?: string;
    checked: boolean;
    disabled?: boolean;
    onToggle: () => void;
}

// rendered as a switch
const Checkbox: React.FC<CheckboxProps> = ({ label, description, disabled = false, checked, onToggle }) => {
    const inputId = React.useId()
    return (
        <label htmlFor={inputId} className={`${styles.option} ${disabled ? styles.disabled : ""}`}>
            <span className={styles.text}>
                <span className={styles.label}>{label}</span>
                {description ? <span className={styles.description}>{description}</span> : null}
            </span>
            <input
                disabled={disabled}
                id={inputId}
                type="checkbox"
                role="switch"
                checked={checked}
                onChange={onToggle}
                className={styles.input}
            />
            <span className={styles.track} aria-hidden />
        </label>
    );
};

export default Checkbox;
