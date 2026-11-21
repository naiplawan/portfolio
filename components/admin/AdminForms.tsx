'use client'

import { useActionState } from 'react'
import type { ActionState } from '@/app/admin/actions'

type Action = (previous: ActionState, form: FormData) => Promise<ActionState>

const initial: ActionState = { ok: false, message: '' }
const primary =
  'inline-flex h-11 items-center rounded-lg bg-foreground px-5 text-background transition-opacity hover:opacity-85 active:translate-y-px disabled:opacity-50'
const field =
  'w-full rounded-lg border border-[hsl(var(--rule))] bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]'

function Status({ state }: { state: ActionState }) {
  if (!state.message) return null
  return (
    <p
      role={state.ok ? 'status' : 'alert'}
      className={`whitespace-pre-wrap border-l-2 pl-4 text-sm ${state.ok ? 'border-success text-success' : 'border-destructive text-destructive'}`}
    >
      {state.message}
    </p>
  )
}

export function LoginForm({ action }: { action: Action }) {
  const [state, formAction, pending] = useActionState(action, initial)
  return (
    <form action={formAction} className="max-w-sm space-y-4">
      <label className="block space-y-2">
        <span className="mono-tag">Password</span>
        <input name="password" type="password" autoComplete="current-password" required className={field} />
      </label>
      <Status state={state} />
      <button type="submit" disabled={pending} className={primary}>
        <span className="pixel-label">{pending ? 'Signing in…' : 'Sign in'}</span>
      </button>
    </form>
  )
}

export function JsonEditor({ action, initialJson, label }: { action: Action; initialJson: string; label: string }) {
  const [state, formAction, pending] = useActionState(action, initial)
  return (
    <form action={formAction} className="space-y-4">
      <label className="block space-y-2">
        <span className="mono-tag">{label}</span>
        <textarea
          name="json"
          defaultValue={initialJson}
          spellCheck={false}
          rows={Math.min(40, Math.max(12, initialJson.split('\n').length + 2))}
          className={`${field} font-mono text-sm leading-relaxed`}
        />
      </label>
      <Status state={state} />
      <button type="submit" disabled={pending} className={primary}>
        <span className="pixel-label">{pending ? 'Saving…' : 'Save'}</span>
      </button>
    </form>
  )
}

export function SlugForm({ action }: { action: Action }) {
  const [state, formAction, pending] = useActionState(action, initial)
  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <label className="space-y-2">
        <span className="mono-tag block">New project slug</span>
        <input name="slug" placeholder="my-project" required className={field} />
      </label>
      <button type="submit" disabled={pending} className={primary}>
        <span className="pixel-label">Create</span>
      </button>
      <div className="w-full">
        <Status state={state} />
      </div>
    </form>
  )
}

export function DeleteForm({ action, slug }: { action: Action; slug: string }) {
  const [state, formAction, pending] = useActionState(action, initial)
  return (
    <form action={formAction} className="space-y-3">
      <label className="block space-y-2">
        <span className="mono-tag">Type {slug} to delete this project</span>
        <input name="confirm" autoComplete="off" className={field} />
      </label>
      <Status state={state} />
      <button type="submit" disabled={pending} className="ed-link text-sm text-destructive">
        Delete project
      </button>
    </form>
  )
}
