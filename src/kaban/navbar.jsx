import { Layout } from 'lucide-react'
import ToggleButton from '../component/toggle'

export default function TrelloNavBar() {
  return (
    <header className="sticky top-0 z-50 bg-toggle/80 backdrop-blur-xl border-b border-gray-700/20">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex font-fontNavbar justify-between py-3 items-center">
        
        <div className="flex items-center gap-2 text-letters">
          <Layout size={22} strokeWidth={2} />
          <span className="text-[17px] font-semibold">Trello</span>
        </div>

        <ToggleButton />

      </nav>
    </header>
  )
}