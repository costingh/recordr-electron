import { getMediaSources } from "@/lib/utils";
import { useReducer } from "react";

export type SourcesDevicesStateProps = {
  displays?: {
    appIcon: null;
    display_id: string;
    id: string;
    name: string;
    thumbnail: unknown[];
  }[];
  audioInputs?: {
    deviceId: string;
    kind: string;
    label: string;
    groupId: string;
  }[];
  error?: string | null;
  isPending?: boolean;
};

type DisplayDeviceActionProps = {
  type: "GET_DEVICES";
  payload: SourcesDevicesStateProps;
};

export const useMediaSources = () => {
  const [state, action] = useReducer(
    (state: SourcesDevicesStateProps, action: DisplayDeviceActionProps) => {
      switch (action.type) {
        case "GET_DEVICES":
          return { ...state, ...action.payload };

        default:
          return state;
      }
    },
    {
      displays: [],
      audioInputs: [],
      error: null,
      isPending: false,
    }
  );
  const fetchMediaResources = () => {
    action({ type: "GET_DEVICES", payload: { isPending: true } });
    getMediaSources().then((sources) =>
      action({
        type: "GET_DEVICES",
        payload: {
          displays: sources.displays,
          audioInputs: sources.audio,
          isPending: false,
        },
      })
    )
  };

  return { state, fetchMediaResources };
};
