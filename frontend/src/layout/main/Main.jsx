import Button from "../../shared/components/Button/Button";
import viteLogo from '/vite.svg'
import reactLogo from '@/assets/react.svg'

export default function Main() {
    return (
        <main className="h-screen flex flex-col items-center justify-center gap-6">
            <h1>Main Content</h1>
            <Button icon={viteLogo} label="Vite Logo" slug="/about" />
            <Button icon={reactLogo} label="React Logo" slug="/about" />
            <Button icon={viteLogo} label="TestingPage" slug="/testing" />
            <Button icon={reactLogo} label="Login / Signup" slug="/access" />
            <Button icon={viteLogo} label="ProfilePage" slug="/profile" />
            <Button icon={reactLogo} label="Organizations" slug="/organizations" />
        </main>
    )
}
