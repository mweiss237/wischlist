import Register from "components/Auth/Register"
export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>
}) {
  return <Register searchParams={searchParams} />
}
