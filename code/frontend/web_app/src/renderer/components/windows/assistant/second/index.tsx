import { useState, useRef } from "react";
import ChatInput from "@myComponents/chatInput";
import styles from "./styles.module.scss";
import GlowingCard from "@/components/glowingCard";
import RecommendationCard from "@myComponents/recommendationCard";
import BlossomImg from "@myComponents/blossomImg";
import { messageStream, healthCheck } from "@myUtils/message";
import GutenbergRenderer from "./gutenberg";

type SSEMessage = { raw: string; json?: any; phase?: string };

function Second() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [streamText, setStreamText] = useState("");
  const [finalJSX, setFinalJSX] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  async function ask(question: string) {
    if (!question) throw new Error("Question is required");

    // reset state for a new run
    setIsReady(false);
    setFinalJSX("");
    setStreamText("");
    setIsLoading(true);

    // local accumulator is the single source of truth
    let acc = "";

    try {
      const isHealthy = await healthCheck();
      if (!isHealthy) throw new Error("Health check failed");

      await messageStream(question, {
        onMessage: ({ raw, phase }: SSEMessage) => {
          if (!phase) {
            acc += raw; // keep latest here
            setStreamText(prev => prev + raw);
          } else if (
            phase === "[OPENAI_RAW_RESPONSE_END]" ||
            phase === "[UNPROCESSED_GUTENBERG_END]"
          ) {
            acc = "";            // reset local too
            setStreamText("");   // and the visual buffer
          }
        },
        onDone: () => {
          setFinalJSX(acc);      // always has the latest
          setIsReady(true);
        },
      });
    } catch (e) {
      console.error("stream error:", e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.container + " " + (isLoading ? styles.loading : "")}>
      <div className={styles.middle + " " + (isReady ? styles.showGutenberg : "")}>
        {!isReady && !isLoading && (
          <GlowingCard className={styles.glowingCard} bgImg={BlossomImg}>
            <div className={styles.content}>
              <h2>What can I teach you today?</h2>
              <div className={styles.recommendations}>
                <RecommendationCard />
                <RecommendationCard />
                <RecommendationCard />
              </div>
            </div>
          </GlowingCard>
        )}

        {isLoading && (
          <div className={styles.gutenbergLoading}>
            {/* preserve whitespace while streaming */}
            <pre style={{ whiteSpace: "pre-wrap", margin: 0, color: "var(--white-700)" }}>
              {streamText}
            </pre>
          </div>
        )}

        {isReady && <GutenbergRenderer jsx={finalJSX} />}
      </div>

      <ChatInput
        ref={inputRef as any}
        className={styles.chatInput}
        hasFileUpload={true}
        theme="dark"
        placeholder="Ask Cherry Blossom to explain something."
        onSubmit={ask}
      />
    </div>
  );
}

export default Second;