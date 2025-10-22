import Button from "../../shared/components/Button/Button";

import viteLogo from '/vite.svg'
import reactLogo from '@/assets/react.svg'

export default function Main() {

    return (
        <main>
            <h1>Main Content</h1>
            <Button icon={viteLogo} label="Vite Logo" slug="/about" />
            <Button icon={reactLogo} label="React Logo" slug="/about" />
        </main>
    )
}