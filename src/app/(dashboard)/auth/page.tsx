import AuthDecision from "components/Auth/AuthDecision"

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>
}) {
  return <AuthDecision searchParams={searchParams} />
}
