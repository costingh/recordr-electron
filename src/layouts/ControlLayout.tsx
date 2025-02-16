import Logo from "@/components/Global/Logo";
import { cn, onCloseApp } from "@/lib/utils";
import { UserButton, useAuth } from "@clerk/clerk-react";
import { LogOut, X } from "lucide-react";
import { useState } from "react";

type Props = {
	children: React.ReactNode;
	className?: string;
};

const ControlLayout = ({ children, className }: Props) => {
	const [isVisible, setIsVisible] = useState<boolean>(false);
	const { signOut } = useAuth();

	window.ipcRenderer.on("hide-plugin", (event, payload) => {
		console.log(event);
		setIsVisible(payload.state);
	});

	return (
		<div
			className={cn(
				className,
				isVisible && "invisible",
				"bg-[#171717] border-2 border-neutral-700 flex px-1 flex-col rounded-3xl overflow-hidden"
			)}
		>
			<div className="flex justify-between items-center p-5 draggable">
				<span className="non-draggable">
					<UserButton />
				</span>
				<div className="flex items-cebter gap-2">
					<div
						className="text-gray-300 hover:opacity-[0.8] cursor-pointer"
						//@ts-ignore
						onClick={signOut}
					>
						<LogOut size={18} />
					</div>
					<X
						size={18}
						className="text-gray-400 non-draggable hover:text-white cursor-pointer"
						onClick={onCloseApp}
					/>
				</div>
			</div>
			<div className="flex-1 h-0 overflow-auto">{children}</div>
			
			<div className="flex items-center justify-center pb-[15px]">
				<Logo />
			</div>

		</div>
	);
};

export default ControlLayout;
