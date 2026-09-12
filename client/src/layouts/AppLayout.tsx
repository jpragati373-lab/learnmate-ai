import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/layout/Sidebar'
export function AppLayout() { return <div className="page-shell"><Sidebar /><main className="min-h-screen lg:pl-64"><Outlet /></main></div> }
