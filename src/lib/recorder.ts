import { hidePluginWindow } from "./utils";
import { v4 as uuid } from "uuid";
import io from 'socket.io-client';
import { toast } from "sonner";

let videoTransferFileName: string | undefined;
let mediaRecorder: MediaRecorder;
let userId: string;
let isRecording: boolean = false; // Flag to track recording state

const socket = io(import.meta.env.VITE_SOCKET_URL as string);

export const StartRecording = (onSourses: {
	screen: string;
	audio: string;
	id: string;
}) => {
	hidePluginWindow(true);
	videoTransferFileName = `${uuid()}-${onSourses?.id.slice(0, 8)}.webm`;
	isRecording = true; // Set recording flag to true
	mediaRecorder.start(1000);
};



export const onStopRecording = () => {
	mediaRecorder.stop()
}

export const stopRecording = () => {
	hidePluginWindow(false);
	isRecording = false; // Set recording flag to false
	socket.emit("process-video", {
		filename: videoTransferFileName,
		userId,
	}, (response: { status: number, message: string }) => {
		if (response.status == 200) {
			console.log(response.message);
		} else {
			console.error(response.message);
		}
	});

};

export const onDataAvailable = (e: BlobEvent) => {
	if (isRecording) { // Only emit chunks if recording is still active
		socket.emit('video-chunks', {
			chunks: e.data,
			filename: videoTransferFileName,
		});
	}
};

export const onPauseRecording = () => {
	if (mediaRecorder && mediaRecorder.state === "recording") {
		mediaRecorder.pause();
	}
}

export const onResumeRecording = () => {
	if (mediaRecorder && mediaRecorder.state === "paused") {
		mediaRecorder.resume();
	}
}

export const selectSources = async (
	onSourses: {
		screen: string;
		audio: string;
		id: string;
		preset: "HD" | "SD";
	},
	videoElement: React.RefObject<HTMLVideoElement>
) => {
	try {
		if (onSourses && onSourses.screen && onSourses.audio && onSourses.id) {
			const constraints: any = {
				audio: false,
				video: {
					mandatory: {
						chromeMediaSource: "desktop",
						chromeMediaSourceId: onSourses?.screen,
					},
					optional: [
						{ minWidth: onSourses.preset === "HD" ? 1920 : 1280 },
						{ minHeight: onSourses.preset === "HD" ? 1080 : 720 },
						{ frameRate: 30 },
					],
				},
			};

			userId = onSourses.id;

			const stream = await navigator.mediaDevices.getUserMedia(constraints);

			const audioStream = await navigator.mediaDevices.getUserMedia({
				video: false,
				audio: { deviceId: { exact: onSourses.audio } },
			});

			if (videoElement && videoElement.current) {
				videoElement.current.srcObject = stream;
				await videoElement.current.play();
			}

			const combinedStream = new MediaStream([
				...stream.getTracks(),
				...audioStream.getTracks(),
			]);

			mediaRecorder = new MediaRecorder(combinedStream, {
				mimeType: "video/webm; codecs=vp9",
			});

			mediaRecorder.ondataavailable = onDataAvailable;
			mediaRecorder.onstop = stopRecording;
		}
	} catch (error: any) {
		toast('An error occurred')
		// alert('An error occurred');
		// alert(`Error Name: ${error.name}, Error Message: ${error.message}`);
	}
};