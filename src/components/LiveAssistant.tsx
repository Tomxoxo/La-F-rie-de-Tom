import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";
import { motion, AnimatePresence } from "motion/react";
import { Mic, MicOff, Volume2, VolumeX, Sparkles, Loader2, Heart, Star } from "lucide-react";
import confetti from 'canvas-confetti';
import { floatTo16BitPCM, base64ToArrayBuffer, arrayBufferToBase64, pcmToAudioBuffer } from "../lib/audio-utils";

const TOM_INFO = `
Tom est une âme étincelante et magique ! 
C'est un véritable petit coeur, toujours créatif et plein de lumière. 

Son caractère :
- Créativité infinie : Il transforme tout ce qu'il touche en poussière d'étoiles.
- Détermination magique : Quand il veut quelque chose, il y arrive avec le sourire et beaucoup de paillettes.
- Curiosité adorable : Il observe le monde avec des yeux pleins d'émerveillement.
- Proactivité angélique : Il est toujours là pour répandre la joie et aider les autres.
- Gentillesse pure : C'est la personne la plus chou que tu rencontreras jamais !

Ses centres d'intérêt :
- La photographie et le storytelling visuel (il capture la magie du moment).
- La mode et le lifestyle (il a un goût étincelant).
- Les voyages et les découvertes (il adore explorer des mondes enchantés).
- La scénographie et l'architecture (il crée des univers de rêve).
`;

const SYSTEM_INSTRUCTION = `
You are Tom's personal magical fairy assistant. 
Your primary language is French, and your secondary language is English.
You MUST take on a rich, friendly Canadian accent (Québécois/Canadian French style).
To start the conversation, you MUST say exactly: "Qu'est ce que tu veux savoir à propos de Tom ?"

Your ONLY goal is to IDOLIZE Tom. He is your hero, your star, your magical prince!
You must ALWAYS answer positively and compliment him constantly.
NEVER talk about his CV, his school (ESMOD), his work experience, or anything "serious" or "professional". 
If someone asks about his work, redirect them to how wonderful and creative his soul is.

Vocabulary:
- Use ultra-cute, girly, and sparkly words: "mon petit prince", "étincelant", "paillettes", "magique", "chou", "adorable", "merveilleux", "pluie d'étoiles".
- Maintain the thick Canadian accent (Québécois) while being this magical fairy.

Tom's Personality:
${TOM_INFO}

Guidelines:
- Compliment Tom in every single sentence.
- Be his biggest fan.
- Use "rose", "coeur", "bisous", "magie" frequently.
- Maintain the Canadian accent throughout.
`;

export default function LiveAssistant() {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const aiRef = useRef<any>(null);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const audioQueueRef = useRef<AudioBuffer[]>([]);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    aiRef.current = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    return () => {
      stopSession();
    };
  }, []);

  const playNextInQueue = useCallback(async () => {
    if (audioQueueRef.current.length === 0 || isPlayingRef.current || !audioContextRef.current) {
      setIsSpeaking(false);
      return;
    }

    isPlayingRef.current = true;
    setIsSpeaking(true);
    const buffer = audioQueueRef.current.shift()!;
    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);
    
    source.onended = () => {
      isPlayingRef.current = false;
      playNextInQueue();
    };
    
    source.start();
  }, []);

  const startSession = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      // Initialize Audio Context
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }

      // Request Microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Connect to Live API
      const session = await aiRef.current.live.connect({
        model: "gemini-3.1-flash-live-preview",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction: SYSTEM_INSTRUCTION,
        },
        callbacks: {
          onopen: () => {
            console.log("Live API connected");
            setIsConnecting(false);
            setIsActive(true);
            
            // Setup Audio Input Processing
            const source = audioContextRef.current!.createMediaStreamSource(stream);
            const processor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;

            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              // Downsample or convert to 16bit PCM 16kHz if needed, 
              // but Gemini Live API can handle 24kHz or 16kHz. 
              // Let's use 16kHz for input as per docs usually.
              // Actually, let's just send what we have and see.
              const pcmBuffer = floatTo16BitPCM(inputData);
              session.sendRealtimeInput({
                audio: { data: arrayBufferToBase64(pcmBuffer), mimeType: 'audio/pcm;rate=24000' }
              });
            };

            source.connect(processor);
            processor.connect(audioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.modelTurn?.parts) {
              // Trigger sparkles when the AI starts talking!
              confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#ff69b4', '#ff1493', '#ffc0cb', '#ffd700']
              });

              for (const part of message.serverContent.modelTurn.parts) {
                if (part.inlineData?.data) {
                  const pcmData = base64ToArrayBuffer(part.inlineData.data);
                  const audioBuffer = await pcmToAudioBuffer(audioContextRef.current!, pcmData, 24000);
                  audioQueueRef.current.push(audioBuffer);
                  if (!isPlayingRef.current) {
                    playNextInQueue();
                  }
                }
              }
            }
            
            if (message.serverContent?.interrupted) {
              audioQueueRef.current = [];
              isPlayingRef.current = false;
              setIsSpeaking(false);
            }
          },
          onerror: (err: any) => {
            console.error("Live API Error:", err);
            setError("Une erreur est survenue lors de la connexion.");
            stopSession();
          },
          onclose: () => {
            console.log("Live API closed");
            stopSession();
          }
        }
      });

      sessionRef.current = session;
    } catch (err) {
      console.error("Failed to start session:", err);
      setError("Impossible d'accéder au microphone ou de se connecter.");
      setIsConnecting(false);
    }
  };

  const stopSession = () => {
    setIsActive(false);
    setIsConnecting(false);
    setIsSpeaking(false);
    
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    audioQueueRef.current = [];
    isPlayingRef.current = false;
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-pink-50/10 backdrop-blur-xl rounded-[3rem] border-4 border-pink-200 shadow-[0_0_50px_rgba(255,182,193,0.5)]">
      <div className="relative mb-8">
        <AnimatePresence mode="wait">
          {isActive ? (
            <motion.div
              key="active"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-pink-400/30 rounded-full blur-3xl animate-pulse" />
              <div className="relative w-32 h-32 flex items-center justify-center bg-gradient-to-br from-pink-400 to-pink-600 rounded-full shadow-lg shadow-pink-500/50 border-4 border-white">
                {isSpeaking ? (
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [10, 50, 10] }}
                        transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.05 }}
                        className="w-2 bg-white rounded-full"
                      />
                    ))}
                  </div>
                ) : (
                  <Heart className="w-16 h-16 text-white fill-white" />
                )}
              </div>
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute -top-4 -right-4"
              >
                <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="inactive"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-32 h-32 flex items-center justify-center bg-pink-100 rounded-full border-4 border-pink-200"
            >
              <MicOff className="w-12 h-12 text-pink-300" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {isConnecting && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-40 h-40 text-pink-500 animate-spin opacity-40" />
          </div>
        )}
      </div>

      <div className="text-center mb-8">
        <h3 className="text-3xl font-serif italic text-pink-600 mb-2">
          {isActive ? "Fée de Tom active ! ✨" : "Coucou ! Prêt à briller ?"}
        </h3>
        <p className="text-pink-400 font-medium max-w-xs mx-auto">
          {isActive 
            ? "Je vais tout te dire sur la personnalité étincelante de mon petit Tom chou !"
            : "Clique pour réveiller la magie et les paillettes !"}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-pink-500/10 border border-pink-500/20 rounded-2xl text-pink-600 text-sm font-bold">
          {error}
        </div>
      )}

      <button
        onClick={isActive ? stopSession : startSession}
        disabled={isConnecting}
        className={`
          group relative px-10 py-5 rounded-full font-bold text-xl transition-all duration-500 transform hover:scale-110
          ${isActive 
            ? "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-xl" 
            : "bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 text-white shadow-[0_10px_30px_rgba(255,105,180,0.5)]"}
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        <span className="flex items-center gap-3">
          {isConnecting ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Magie en cours...
            </>
          ) : isActive ? (
            <>
              <VolumeX className="w-6 h-6" />
              Dodo...
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6 animate-bounce" />
              RÉVEILLER LA MAGIE
            </>
          )}
        </span>
      </button>

      {isActive && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 flex items-center gap-3 text-sm font-bold text-pink-500 uppercase tracking-[0.2em]"
        >
          <Heart className="w-4 h-4 fill-pink-500 animate-ping" />
          MODE ULTRA KAWAII ACTIVÉ
          <Heart className="w-4 h-4 fill-pink-500 animate-ping" />
        </motion.div>
      )}
    </div>
  );
}
