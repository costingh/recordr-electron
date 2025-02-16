import {
	onStopRecording,
	selectSources,
	StartRecording,
	onPauseRecording,
	onResumeRecording,
} from "@/lib/recorder";
import { cn, formatTime, resizeWindow, videoRecordingTime } from "@/lib/utils";
import { Cast, Pause, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type OnSourcesProps = {
	screen: string;
	id: string;
	audio: string;
	preset: "HD" | "SD";
	plan: "PRO" | "FREE" | "BUSSINESS";
};
const StudioTray = () => {
	const initialTime = new Date();

	const [preview, setPreview] = useState(false);
	const [onTimer, setOnTimer] = useState<string>("00:00:00");
	const [count, setCount] = useState(0);

	const [recording, setRecording] = useState(false);
	const [onSources, setOnSources] = useState<OnSourcesProps | undefined>(
		undefined
	);
	const [paused, setPaused] = useState(false);

	const videoElement = useRef<HTMLVideoElement | null>(null);
	const camElement = useRef<HTMLVideoElement | null>(null);

	const clearTime = () => {
		setOnTimer("00:00:00");
		setCount(0);
	};

	window.ipcRenderer.on("profile-received", (event, payload) => {
		console.log(event);
		setOnSources(payload);
	});

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
		if (!recording || paused) return;

		const recordTimeInterval = setInterval(() => {
			const time = count + (new Date().getTime() - initialTime.getTime());
			setCount(time);
			const recordingTime = videoRecordingTime(time);

			// if (onSources?.plan === "FREE" && recordingTime.minute == "05") {
			// 	setRecording(false);
			// 	clearTime();
			// 	onStopRecording();
			// }

			setOnTimer(recordingTime.length);
			if (time <= 0) {
				setOnTimer("00:00:00");
				clearInterval(recordTimeInterval);
			}
		}, 1);

		return () => clearInterval(recordTimeInterval);
	}, [recording, paused]);

	const streamWebCam = async (retries = 20) => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: true,
			});

			if (camElement.current) {
				camElement.current.srcObject = stream;
				await camElement.current.play();
			} else {
				throw new Error("Error");
			}
		} catch (error) {
			if (retries > 0) {
				console.warn(
					`Retrying webcam stream... Attempts left: ${retries}`
				);
				setTimeout(() => streamWebCam(retries - 1), 500);
			} else {
				console.error(
					"Failed to access webcam after multiple attempts",
					error
				);
			}
		}
	};

	useEffect(() => {
		streamWebCam();
	}, []);

	const handlePauseVideo = () => {
		if (recording) {
			if (!paused) {
				onPauseRecording();
				setPaused(true);
			} else {
				onResumeRecording();
				setPaused(false);
			}
		}
	};

	const handleStopVideo = () => {
		setRecording(false);
		clearTime();
		onStopRecording();
	};

	const handleStartVideo = (onSources: OnSourcesProps) => {
		setRecording(true);
		StartRecording(onSources);
	};

	return !onSources ? (
		<></>
	) : (
		<div className="flex flex-col justify-center items-center gap-y-3 mt-[30px] h-screen ">
			<video
				ref={camElement}
				className="h-[100px] w-[100px] rounded-full draggable object-cover aspect-video border-[1px] relative border-gray-199"
			></video>
			{/* {preview && (
				<video
					autoPlay
					ref={videoElement}
					className={cn("w-8/12 self-end bg-white")}
				></video>
			)} */}
			<div className="rounded-full py-[5px] px-[15px] flex justify-around items-center h-[40px] gap-[15px] border-[3px] bg-gray-100 draggable border-gray-500/40">
				<div
					{...(onSources && {
						onClick: () =>
							recording
								? handleStopVideo()
								: handleStartVideo(onSources),
					})}
					className={cn(
						"non-draggable cursor-pointer relative hover:opacity-80 transition-all duration-3",
						!recording
							? "bg-red-400 w-[18px] h-[18px] rounded-full"
							: "bg-red-400 w-[17px] h-[17px] rounded-[4px]"
					)}
				></div>
				<span className="font-[700] text-gray-900 text-[10px]">
					{formatTime(onTimer)}
				</span>
				<div className="bg-gray-300 h-[calc(100%-5px)] w-[1px]"></div>
				<button
					disabled={!recording}
					className={cn(
						"flex items-center gap-[3px] non-draggable cursor-pointer transition-all duration-350",
						!recording
							? "opacity-50 pointer-events-none"
							: "hover:opacity-80"
					)}
					onClick={() => recording && handlePauseVideo()}
				>
					{!paused ? (
						<>
							<div className="bg-gray-900 w-[4px] rounded-lg h-[13px]"></div>
							<div className="bg-gray-900 w-[4px] rounded-lg h-[13px]"></div>
						</>
					) : (
						<div className="w-0 h-0 border-l-[12px] border-l-gray-900 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent rounded-sm"></div>
					)}
				</button>
			</div>
		</div>
	);
};

export default StudioTray;
