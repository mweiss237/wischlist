import React from "react"
import Image from "next/image"
import styles from "./Menu.module.scss"

interface MenuProps {
    entries: {
        iconSrc: string
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
                <Image
                    src={"/dots.svg"}
                    alt="Menu öffnen"
                    height={20}
                    width={20}
                    unoptimized
                    loading="lazy"
                />
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
                            <Image
                                src={entry.iconSrc}
                                alt={entry.label}
                                height={20}
                                width={20}
                                unoptimized
                                loading="lazy"
                            />

                        </button>
                    )
                }
                )}
            </div>
        </div>
    )
}

export default Menu
