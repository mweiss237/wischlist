import React from "react"
import styles from "./Menu.module.scss"
import { MoreVertical } from "react-feather"

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

    const menuRef = React.useRef(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // @ts-ignore
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={menuRef} className={styles.wrapper} >
            <button
                className={styles.toggle}
                onClick={() => setShowMenu(value => !value)}
                title="Menü öffnen"
            >
                <MoreVertical size={20} />
            </button>
            <div className={`${styles.entries} ${isShown ? styles.active : ""}`}>
                {entries.map((entry, index) => {
                    return (
                        <button
                            key={`menu-entry-${index}`}
                            className={styles.entry}
                            style={
                                entry.active
                                    ? { backgroundColor: entry.activeColor || "lightgreen" }
                                    : undefined
                            }
                            title={entry.label}
                            onClick={() => {
                                entry.onClick();
                            }}
                        >
                            {entry.Icon}

                        </button>
                    )
                }
                )}
            </div>
        </div>
    )
}

export default Menu
