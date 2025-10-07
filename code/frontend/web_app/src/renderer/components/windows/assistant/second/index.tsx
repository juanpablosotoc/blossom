import { useState, useRef } from "react";
import ChatInput from "@myComponents/chatInput";
import styles from "./styles.module.scss";
import GlowingCard from "@/components/glowingCard";
import RecommendationCard from "@myComponents/recommendationCard";
import BlossomImg from "@myComponents/blossomImg";
import { messageStream, healthCheck } from "@myUtils/message";
import GutenbergRenderer from "./gutenberg";
import ErrorPopup from "@/components/errorPopup";

type SSEMessage = { raw: string; json?: any; phase?: string };

function Second() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [gutenbergStage, setGutenbergStage] = useState<'unprocessed-gutenberg' | 'processed-gutenberg'>('unprocessed-gutenberg');
  const [unprocessedGutenbergReady, setUnprocessedGutenbergReady] = useState(false);

  const [streamText, setStreamText] = useState("");
  const [unprocessedGutenbergJSX, setUnprocessedGutenbergJSX] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorPopup, setErrorPopup] = useState("");
  const [prevQuestion, setPrevQuestion] = useState("");

  async function ask(question: string) {
    if (!question) throw new Error("Question is required");

    setPrevQuestion(question);

    // reset state for a new run
    setUnprocessedGutenbergReady(false);
    setStreamText("");
    setUnprocessedGutenbergJSX("");
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
          } else {
            // Is phase
            if (phase.trim() === "[OPENAI_RAW_RESPONSE_END]") {
              acc = "";            // reset local too
              setStreamText("");   // and the visual buffer
            }
          }
        },
        onDone: () => {
          setUnprocessedGutenbergJSX(acc);      // always has the latest
          setUnprocessedGutenbergReady(true);
        },
      });
    } catch (e) {
      console.error("stream error:", e);
    } finally {
      setIsLoading(false);
    }
  }

  function setError(error: string) {
    console.error(error);
    setErrorPopup(error);
    setIsLoading(false);
    setUnprocessedGutenbergReady(false);
    setTimeout(() => {
      setErrorPopup("");
    }, 3000);

    // Try ask again
    ask(prevQuestion);
  }

  return (
    <div className={styles.container + " " + (isLoading ? styles.loading : "")}>
      <div className={styles.middle + " " + (unprocessedGutenbergReady ? styles.showGutenberg : "")}>
        {!unprocessedGutenbergReady && !isLoading && (
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

        {errorPopup && <ErrorPopup error={errorPopup} />}

        {isLoading && (
          <div className={styles.gutenbergLoading}>
            {/* preserve whitespace while streaming */}
            <pre style={{ whiteSpace: "pre-wrap", margin: 0, color: "var(--white-700)" }}>
              {streamText}
            </pre>
          </div>
        )}

        {unprocessedGutenbergReady && <GutenbergRenderer jsxCode={unprocessedGutenbergJSX} stage={gutenbergStage} setError={setError} />}
      </div>

      <ChatInput
        ref={inputRef as any}
        className={styles.chatInput}
        hasFileUpload={true}
        theme="dark"
        placeholder="Ask Gutenberg to explain something."
        onSubmit={ask}
      />
    </div>
  );
}

export default Second;