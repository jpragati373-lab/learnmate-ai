import type { ButtonHTMLAttributes } from 'react'
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' }
export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const styles = { primary: 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700', secondary: 'border border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:text-indigo-700', ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900' }
  return <button className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`} {...props} />
}
