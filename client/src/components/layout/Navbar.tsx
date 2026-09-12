import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'

export function Navbar() {
  return <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
    <Link to="/" className="flex items-center gap-2.5 font-bold tracking-tight text-slate-950"><span className="rounded-xl bg-indigo-600 p-2 text-white"><Sparkles className="h-4 w-4" /></span><span>LearnMate <span className="text-indigo-600">AI</span></span></Link>
    <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex" aria-label="Public navigation"><a href="#how-it-works" className="transition hover:text-slate-950">How it works</a><a href="#features" className="transition hover:text-slate-950">Features</a><Link to="/responsible-ai" className="transition hover:text-slate-950">Responsible AI</Link></nav>
    <Link to="/dashboard"><Button variant="secondary" className="hidden sm:inline-flex">Explore demo <ArrowRight className="ml-1 inline h-4 w-4" /></Button></Link>
  </header>
}
