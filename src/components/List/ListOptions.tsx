import React from 'react';
interface CheckboxProps {
    label: string;
    checked: boolean;
    disabled?: boolean;
    onToggle: () => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, disabled = false, checked, onToggle }) => {
    const inputId = `checkbox-${label}`
    return (<>
            <input
                disabled={disabled}
                id={inputId}
                type="checkbox"
                checked={checked}
                onChange={onToggle}
                className="checkbox-input"
            />
            <label htmlFor={inputId}>{label}</label>
            <style jsx>{`
                input {
                    display: none;
                }
                label {
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    padding: 4px;
                }

                label::before {
                    content: '';
                    display: block;
                    width: 18px;
                    height: 18px;
                    border: 1px solid #444;
                    border-radius: 4px;
                    margin-right: 8px;
                    background-color: #fff
                }
                label::after {
                    content: '';
                    width: 12px;
                    height: 6px;
                    border-radius: 2px;
                    margin-left: 3px;
                    position: absolute;
                    border:  solid #333;
                    border-width: 0 0 2px 2px;
                    transform: rotate(-45deg);
                    display: ${checked ? 'block' : 'none'}
                }
                input:disabled + label::before {
                    background-color: #ccc !important;
                    
                }
                input:disabled + label {
                    cursor: unset;
                }

            `}</style>
        </>
    );
};

export default Checkbox;
