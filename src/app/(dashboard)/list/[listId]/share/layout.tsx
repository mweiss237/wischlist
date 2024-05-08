import { GiverProvider } from "lib/giver"

export default function ChecklistLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <GiverProvider>{children}</GiverProvider>
}