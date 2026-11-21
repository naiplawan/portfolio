import { loginAction } from '../actions'
import { LoginForm } from '@/components/admin/AdminForms'

export default function AdminLoginPage() {
  return (
    <div className="max-w-md">
      <h1 className="mb-2 font-display text-2xl font-semibold tracking-tight">Content admin</h1>
      <p className="mb-8 text-sm text-muted-foreground">Sign in to edit the portfolio content.</p>
      <LoginForm action={loginAction} />
    </div>
  )
}
