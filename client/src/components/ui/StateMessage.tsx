import { AlertCircle, Inbox } from 'lucide-react'
import { Card } from './Card'
export function ErrorState({ message = 'Something went wrong. Please try again.' }: { message?: string }) { return <Card className="border-red-100 bg-red-50"><div className="flex items-start gap-3 text-red-700"><AlertCircle className="mt-0.5 h-5 w-5 shrink-0" /><div><h2 className="font-semibold">We could not load this</h2><p className="mt-1 text-sm">{message}</p></div></div></Card> }
export function EmptyState({ title, message }: { title: string; message: string }) { return <Card className="text-center"><Inbox className="mx-auto h-8 w-8 text-slate-300" /><h2 className="mt-3 font-semibold text-slate-900">{title}</h2><p className="mt-1 text-sm text-slate-500">{message}</p></Card> }
