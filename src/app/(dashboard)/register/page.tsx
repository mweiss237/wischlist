import Register from "components/Auth/Register"
export default function Page({
  searchParams,
}: {
  searchParams: { email?: string }
}) {
  return <Register searchParams={searchParams} />
}
