import AuthDecision from "components/Auth/AuthDecision"

export default function Page({
  searchParams,
}: {
  searchParams: { email?: string }
}) {
  return <AuthDecision searchParams={searchParams} />
}
