"use client"
import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
    SignOutButton
} from '@clerk/clerk-react'
  
export default function Appbar() {
    return (
        <div>
            <header className="flex justify-end items-center p-4 gap-4 h-16">
                <SignedOut>
                    <SignInButton mode="modal" />
                    <SignUpButton mode="modal" />
                </SignedOut>
                <SignedIn>
                    <UserButton afterSignOutUrl="/"/>
                    <SignOutButton />
                </SignedIn>
            </header>
        </div>
    )
}
