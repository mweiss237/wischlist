import ForgotPassword from "components/Auth/ForgotPassword"

export default function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>
}) {
  return <ForgotPassword searchParams={searchParams} />
}
