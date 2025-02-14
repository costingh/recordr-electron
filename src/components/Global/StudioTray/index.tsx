import { onStopRecording, selectSources, StartRecording } from "@/lib/recorder";
import { cn, resizeWindow, videoRecordingTime } from "@/lib/utils";
import { Cast, Pause, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const StudioTray = () => {
	const initialTime = new Date();

	const [preview, setPreview] = useState(false);
	const [onTimer, setOnTimer] = useState<string>("00:00:00");
	const [count, setCount] = useState(0);

	const [recording, setRecording] = useState(false);
	const [onSources, setOnSources] = useState<
		| {
				screen: string;
				id: string;
				audio: string;
				preset: "HD" | "SD";
				plan: "PRO" | "FREE";
		  }
		| undefined
	>(undefined);

	const clearTime = () => {
		setOnTimer("00:00:00");
		setCount(0);
	};

	window.ipcRenderer.on("profile-received", (event, payload) => {
		console.log(event);
		setOnSources(payload);
	});

	const videoElement = useRef<HTMLVideoElement | null>(null);

	useEffect(() => {
		resizeWindow(preview);
		return () => resizeWindow(preview);
	}, [preview]);

	useEffect(() => {
		if (onSources && onSources.screen)
			selectSources(onSources, videoElement);
		return () => {
			selectSources(onSources!, videoElement);
		};
	}, [onSources]);

	useEffect(() => {
		if (!recording) return;
		const recordTimeInterval = setInterval(() => {
			const time = count + (new Date().getTime() - initialTime.getTime());
			setCount(time);
			const recordingTime = videoRecordingTime(time);
			if (onSources?.plan === "FREE" && recordingTime.minute == "05") {
				setRecording(false);
				clearTime();
				onStopRecording();
			}
			setOnTimer(recordingTime.length);
			if (time <= 0) {
				setOnTimer("00:00:00");
				clearInterval(recordTimeInterval);
			}
		}, 1);
		return () => clearInterval(recordTimeInterval);
	}, [recording]);
	
	return !onSources ? (
		<></>
	) : (
		<div className="flex flex-col justify-end gap-y-3 h-screen">
			{preview && (
				<video
					autoPlay
					ref={videoElement}
					className={cn("w-8/12 self-end bg-white")}
				></video>
			)}
			<div className="rounded-full py-[10px] flex justify-around items-center h-[40px] w-full border-1 bg-[#171717] draggable border-white/40">
				<div
					{...(onSources && {
						onClick: () => {
							setRecording(true);
							StartRecording(onSources);
						},
					})}
					className={cn(
						"non-draggable rounded-full cursor-pointer relative hover:opacity-80",
						recording ? "bg-red-500 w-[26px] h-[26px]" : "bg-red-400 w-[24px] h-[24px]"
					)}
				>
					{recording && (
						<span className="absolute -right-16 top-1/2 transform -translate-y-1/2 text-white">
							{onTimer}
						</span>
					)}
				</div>
				{!recording ? (
					<Pause
						className="non-draggable opacity-50"
						size={24}
						fill="white"
						stroke="none"
					/>
				) : (
					<Square
						size={24}
						className="non-draggable cursor-pointer hover:scale-110 transfrom transition duration-150"
						fill="white"
						onClick={() => {
							setRecording(false);
							clearTime();
							onStopRecording();
						}}
						stroke="white"
					/>
				)}
				<Cast
					onClick={() => setPreview((prev) => !prev)}
					size={24}
					fill="white"
					className="non-draggable cursor-pointer opacity-50 hover:opacity-100"
					stroke="white"
				/>
			</div>
		</div>
	);
};

export default StudioTray;
