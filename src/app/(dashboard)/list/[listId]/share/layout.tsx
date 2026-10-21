import { GiverProvider } from "lib/giver"

export default function SharedListLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <GiverProvider>{children}</GiverProvider>
}