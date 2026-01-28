import { LoginButton } from "@/features/auth/components/LoginButton";

import viteLogo from '/vite.svg'
import reactLogo from '@/assets/react.svg'

export default function Header() {
    return (
        <header className="w-full border-b border-white/20">
            <div className="h-[80px] flex items-center justify-between px-[20px]">
                <p className="text-5xl text-left font-semibold">DokuFlow</p>

                <div className="ml-auto">
                    <LoginButton /> 
                </div>
            </div>
        </header>
    );
}