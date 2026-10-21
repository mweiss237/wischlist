import Login from "components/Auth/Login"

export default function Page({
  searchParams,
}: {
  searchParams: { email?: string }
}) {
  return <Login searchParams={searchParams} />
}
