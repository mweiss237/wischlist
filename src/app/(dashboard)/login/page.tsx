import Login from "components/Auth/Login"

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>
}) {
  return <Login searchParams={searchParams} />
}
