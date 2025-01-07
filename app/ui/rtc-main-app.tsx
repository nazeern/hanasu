"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Chat, { ChatMessageData, sampleChatMessages } from "@/app/ui/chat"; // eslint-disable-line
import { BlurBottom, BlurTop } from "@/app/ui/blur";
import { User } from "@supabase/auth-js";
import IconButton from "@/app/ui/icon-button";
import ProfileIcon from "./profile-icon";
import Microphone from "@/app/icons/microphone";
import MicrophoneSlash from "../icons/microphone-slash";
import debounce from "lodash/debounce";
import { insertSession, updateSession } from "@/app/lib/sessions";
import { LogoTitle } from "./logo";
import { HomeIcon } from "@heroicons/react/24/solid";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { langInfo } from "./lang-select";

export type TokenUsage = {
  audio: {
    input: number;
    output: number;
    input_cached: number;
  };
  text: {
    input: number;
    output: number;
    input_cached: number;
  };
};

export const startingTokenUsage: TokenUsage = {
  audio: {
    input: 0,
    output: 0,
    input_cached: 0,
  },
  text: {
    input: 0,
    output: 0,
    input_cached: 0,
  },
};

export type Session = {
  id?: string;
  userId: string;
  topic?: string;
  tokenUsage: TokenUsage;
  nResponses: number;
  avgResponseDurationMs: number;
  duration: number;
  lang: string;
};

type RTCManager = {
  conn?: RTCPeerConnection; // WebRTC Connection w/ Agent
  dc?: RTCDataChannel; // Data channel with OAI
  ms?: MediaStream; // Local user's media
};

export type Interval = {
  start?: number;
  end?: number;
};

type ConnectionState = "connecting" | "connected" | "disconnected";

let sessionStart: number = 0;
let initialized = false;

export default function RTCMainApp({
  user,
  lang,
  ephemeralToken,
  topic,
}: {
  user: User;
  lang: string;
  ephemeralToken: string;
  topic: string;
}) {
  const [connState, setConnState] = useState<ConnectionState>("connecting");
  useEffect(() => {
    if (!initialized) {
      initialized = true;
      console.log("starting session");
      startSession(topic);
    }

    () => closeRTC(rtc.current);
  }, [connState]);

  const persistSession = useCallback(
    debounce(
      (session, chatMessages) => updateSession(session, chatMessages),
      2 * 1000,
      {
        leading: false,
        trailing: true,
      }
    ),
    []
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const rtc = useRef<RTCManager | null>(null);

  const [muted, setMuted] = useState<boolean>(true);
  const [chatMessages, setChatMessages] = useState<ChatMessageData[]>([]);
  const [userResponseInterval, setUserResponseInterval] = useState<Interval>(
    {}
  );
  const [session, setSession] = useState<Session>({
    userId: user.id,
    tokenUsage: startingTokenUsage,
    nResponses: 0,
    avgResponseDurationMs: 0,
    duration: 0,
    lang: lang,
  });

  useEffect(() => {
    persistSession(session, chatMessages);
  }, [session]);

  useEffect(() => {
    if (userResponseInterval.start && userResponseInterval.end) {
      const newDuration = userResponseInterval.end - userResponseInterval.start;
      const n = session.nResponses;
      setSession((s) => ({
        ...s,
        avgResponseDurationMs:
          ((n - 1) / n) * s.avgResponseDurationMs + newDuration / n,
        duration: Math.round((performance.now() - sessionStart) / 1000),
      }));
      setUserResponseInterval({});
    }
  }, [userResponseInterval]);

  return (
    <div className="flex flex-col h-screen w-screen px-1 py-2">
      <BlurTop />
      <BlurBottom />
      <audio ref={audioRef} autoPlay={true}></audio>
      <div className="flex items-center justify-between px-2 py-2">
        <IconButton
          className="py-1"
          href="/dashboard"
          text="Back"
          icon={ChevronLeftIcon}
        />
        <LogoTitle />
        <ProfileIcon initial={user.user_metadata?.name[0]} />
      </div>
      {connState == "connecting" ? (
        <div className="h-full w-full pb-48 flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          Checking if Kohtaro is available...
        </div>
      ) : (
        <Chat
          user={user}
          lang={lang}
          chatMessages={chatMessages}
          setChatMessages={setChatMessages}
        />
      )}
      {/* Control Bar */}
      {connState == "connected" ? (
        <div className="relative flex items-center pt-4">
          <IconButton
            onClick={mute}
            icon={muted ? MicrophoneSlash : Microphone}
            size={8}
            className={
              muted
                ? "mx-auto p-2 bg-primary fill-primarybg"
                : "mx-auto p-2 bg-primarybg fill-primary rounded-full border border-primarybg"
            }
          />
          <IconButton
            className="absolute right-0 bottompy-1 px-2 bg-red-200 text-red-500"
            onClick={() => closeRTC(rtc.current)}
            text="End"
          />
        </div>
      ) : connState == "disconnected" ? (
        <IconButton
          icon={HomeIcon}
          text="Return to Home"
          className="mx-auto w-fit px-4 py-2 bg-primary text-onprimary rounded-full"
          href="/dashboard"
        />
      ) : null}
    </div>
  );

  /** Handle an event from OpenAI. */
  // eslint-disable-next-line
  function handleEventOAI(e: MessageEvent<any>) {
    const oai = JSON.parse(e.data);
    // console.log(oai);

    switch (oai.type) {
      case "conversation.item.created":
        setChatMessages((chat) => [
          ...chat,
          {
            id: oai.item.id,
            from: oai.item.role,
            content: "",
            hidden: true,
          },
        ]);
        break;
      case "conversation.item.input_audio_transcription.completed":
        setChatMessages((chat) =>
          chat.map((msg) =>
            msg.id != oai.item_id
              ? msg
              : { ...msg, content: oai.transcript.replace("～", "") }
          )
        );
        break;
      case "response.audio_transcript.done":
        setChatMessages((chat) =>
          chat.map((msg) =>
            msg.id != oai.item_id
              ? msg
              : { ...msg, content: oai.transcript.replace("～", "") }
          )
        );
        break;
      case "session.updated":
        break;
      case "input_audio_buffer.speech_started":
        setUserResponseInterval(() => ({ start: performance.now() }));
        break;
      case "input_audio_buffer.speech_stopped":
        setUserResponseInterval((obj) => ({ ...obj, end: performance.now() }));
        setSession((s) => ({ ...s, nResponses: s.nResponses + 1 }));
        break;
      case "response.done":
        const oaiTokenUsage = oai.response.usage;
        updateTokenUsage(oaiTokenUsage);
        break;
    }
  }

  /** Create a WebRTC session with OpenAI agent. */
  async function initRTC(): Promise<RTCManager> {
    setConnState("connecting");
    // When we recv track, autoplay
    const conn = new RTCPeerConnection();
    conn.addEventListener("track", (ev) => {
      if (audioRef.current) {
        audioRef.current.srcObject = ev.streams[0];
      }
    });

    // Send microphone input from browser
    // Start as enabled=false, so mute functionality works
    const ms = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    const localTrack = ms.getTracks()[0];
    localTrack.enabled = false;
    conn.addTrack(localTrack);

    // Create WebRTC Data channel to send/recv events
    const dc = conn.createDataChannel("oai-events");
    dc.addEventListener("message", (e) => {
      // Realtime server events appear here!
      handleEventOAI(e);
    });

    // Start the session using the Session Description Protocol (SDP)
    const offer = await conn.createOffer();
    await conn.setLocalDescription(offer);

    const baseUrl = "https://api.openai.com/v1/realtime";
    const model = "gpt-4o-realtime-preview-2024-12-17";
    const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
      method: "POST",
      body: offer.sdp,
      headers: {
        Authorization: `Bearer ${ephemeralToken}`,
        "Content-Type": "application/sdp",
      },
    });

    const answer: RTCSessionDescriptionInit = {
      type: "answer",
      sdp: await sdpResponse.text(),
    };
    await conn.setRemoteDescription(answer);

    return {
      conn,
      ms,
      dc,
    };
  }

  /** Close the WebRTC connection & related variables. */
  function closeRTC(rtc: RTCManager | null) {
    rtc?.ms?.getTracks().forEach((t) => t.stop());
    rtc?.dc?.close();
    rtc?.conn?.close();
  }

  /** Disable local microphone. */
  function mute() {
    const localTrack = rtc.current?.ms?.getAudioTracks()[0];
    if (localTrack) {
      localTrack.enabled = !localTrack.enabled;
      setMuted((m) => !m);
    }
  }

  /** Update the prompt of the AI session. */
  async function startSession(topic: string) {
    const [rtcSession, sessionId] = await Promise.all([
      initRTC(),
      insertSession(user.id, lang),
    ]);
    rtc.current = rtcSession;

    // Configure local audio transcription & topic
    const langName =
      langInfo.find((info) => info.lang == lang)?.name ?? "English";
    rtc.current.dc?.addEventListener(
      "open",
      () => {
        const updateMsg = {
          type: "session.update",
          session: {
            input_audio_transcription: {
              model: "whisper-1",
            },
            voice: "alloy",
            instructions: `Always speak in ${langName}. You are casually conversing about the user and asking questions in a friendly manner. The topic is: ${topic}`,
          },
        };
        const responseMsg = {
          type: "response.create",
          response: {
            instructions: `Ask "${topic}" in ${langName}.`,
          },
        };
        rtc.current?.dc?.send(JSON.stringify(updateMsg));
        setConnState("connected");
        rtc.current?.dc?.send(JSON.stringify(responseMsg));
      },
      { once: true }
    );

    // Show closed state when disconnected
    rtc.current.dc?.addEventListener("close", () => {
      setConnState("disconnected");
    });

    // Store chosen topic
    setSession((s) => ({ ...s, id: sessionId, topic: topic }));
    sessionStart = performance.now();
  }

  /** Update the token usage of the session. */
  // eslint-disable-next-line
  function updateTokenUsage(newUsage: any) {
    setSession((s) => ({
      ...s,
      tokenUsage: {
        audio: {
          input:
            s.tokenUsage.audio.input +
            newUsage.input_token_details.audio_tokens,
          output:
            s.tokenUsage.audio.output +
            newUsage.output_token_details.audio_tokens,
          input_cached:
            s.tokenUsage.audio.input_cached +
            newUsage.input_token_details.cached_tokens_details.audio_tokens,
        },
        text: {
          input:
            s.tokenUsage.text.input + newUsage.input_token_details.text_tokens,
          output:
            s.tokenUsage.text.output +
            newUsage.output_token_details.text_tokens,
          input_cached:
            s.tokenUsage.text.input_cached +
            newUsage.input_token_details.cached_tokens_details.text_tokens,
        },
      },
    }));
  }
}
