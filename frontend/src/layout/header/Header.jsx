import { useNavigate } from 'react-router-dom';
import { LoginButton } from "@/features/auth/components/LoginButton";

import viteLogo from '/vite.svg'
import reactLogo from '@/assets/react.svg'

export default function Header() {
    const navigate = useNavigate();

    return (
        <header className="w-full border-b border-white/20">
            <div className="h-[80px] flex items-center justify-between px-[20px]">
                <button
                    onClick={() => navigate('/')}
                    className="text-[3.5rem] text-left font-semibold hover:opacity-80 transition-opacity cursor-pointer bg-transparent border-0 p-0 leading-none"
                    style={{ fontSize: '3.5rem' }}
                >
                    DocuFlow
                </button>

                <div className="ml-auto">
                    <LoginButton /> 
                </div>
            </div>
        </header>
    );
}