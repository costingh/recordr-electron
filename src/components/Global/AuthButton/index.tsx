import { Button } from "@/components/ui/button";
import { SignedOut, SignInButton, SignUpButton } from "@clerk/clerk-react";

function AuthButton() {
	return <SignedOut>
        <div className="flex gap-x-3 h-[200px] justify-center items-center">
            <SignInButton>
                <Button
                    variant={'outline'}
                    className="px-10 rounded-full bg-gray-200 hover:bg-gray-300"
                >
                    Sign In
                </Button>
            </SignInButton>

            <SignUpButton>
                <Button
                    variant={'outline'}
                    className="px-10 rounded-full bg-gray-200 hover:bg-gray-300"
                >
                    Sign Up
                </Button>
            </SignUpButton>
        </div>
    </SignedOut>;
}

export default AuthButton;
