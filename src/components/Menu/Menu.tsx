import React from "react"
import styles from "./Menu.module.scss"
import { MoreHorizontal } from "react-feather"

interface MenuProps {
    entries: {
        Icon: JSX.Element
        label: string
        onClick: () => void
        active?: boolean
        activeColor?: string
    }[]
}

const Menu = ({ entries }: MenuProps) => {
    const [isShown, setShowMenu] = React.useState(false)

    const menuRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={menuRef} className={styles.wrapper}>
            <button
                type="button"
                className={`${styles.toggle} ${isShown ? styles.open : ""}`}
                onClick={() => setShowMenu(value => !value)}
                title="Menü öffnen"
                aria-expanded={isShown}
            >
                <MoreHorizontal size={18} />
            </button>
            <div className={`${styles.entries} ${isShown ? styles.active : ""}`} role="menu">
                {entries.map((entry, index) => (
                    <button
                        type="button"
                        role="menuitem"
                        key={`menu-entry-${index}`}
                        className={`${styles.entry} ${entry.active ? styles.entryActive : ""}`}
                        style={entry.activeColor ? { ["--active" as string]: entry.activeColor } : undefined}
                        title={entry.label}
                        onClick={entry.onClick}
                    >
                        {entry.Icon}
                        <span>{entry.label}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}

export default Menu
