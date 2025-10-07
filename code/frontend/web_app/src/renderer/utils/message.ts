const domain = 'https://api.notblossom.com';
const unprocessedGutenbergStream_endpoint = `${domain}/messages/unprocessed-gutenberg`;
const dummyJWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0fQ.iakE_QRFcKSp0uDwcfkoUY7J8rgwvWU7WmKcoo8tbrs";


type SSEMessage = {
    raw: string;   
    json?: any;           
    phase?: string;        // [OPENAI_RAW_RESPONSE], [UNPROCESSED_GUTENBERG_RESPONSE], ...
  };
  
async function messageStream(
    question: string,
    {
      onMessage,              // called for every SSE message
      onDone,                 // called once when [DONE] arrives
    }: {
      onMessage: (msg: SSEMessage) => void;
      onDone?: () => void;
    }
  ) {
    const token = dummyJWT;
    // Set query params
    const url = new URL(unprocessedGutenbergStream_endpoint);
    
    url.searchParams.set("question", question);

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  
    if (!res.ok || !res.body) {
      throw new Error(`HTTP ${res.status} – failed to open stream`);
    }
  
    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
  
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
  
        buffer += decoder.decode(value, { stream: true });
  
        // SSE messages are separated by a blank line
        const parts = buffer.split(/\r?\n\r?\n/);
        // keep the last (possibly incomplete) segment in buffer
        buffer = parts.pop() ?? "";
  
        for (const part of parts) {
          // Each event can have multiple lines; we care about lines starting with "data:"
          const lines = part.split(/\r?\n/).filter(Boolean);
          for (const line of lines) {
            if (!line.startsWith("data:")) continue;
            const payload = line.slice(6);
  
            if (payload.trim() === "[DONE]") {
              onDone?.();
              reader.cancel().catch(() => {});
              return;
            }
  
            // detect phase markers are emitted server-side
            // "[OPENAI_RAW_RESPONSE]", "[UNPROCESSED_GUTENBERG_RESPONSE]"
            let phase: string | undefined;
            if (/^\[[A-Z_]+\]$/.test(payload.trim())) {
              phase = payload.trim();
              onMessage({ raw: payload, phase });
              continue;
            }
  
            // try JSON parse
            let json: any | undefined;
            if ((payload.startsWith("{") && payload.endsWith("}")) ||
                (payload.startsWith("[") && payload.endsWith("]"))) {
              try { json = JSON.parse(payload); } catch {}
            }
  
            onMessage({ raw: payload, json, phase });
          }
        }
      }
    } finally {
      try { await reader.cancel(); } catch {}
    }
  }

async function healthCheck() {
    const res = await fetch(`${domain}/health`, {
        method: "GET",
        mode: "cors",
    });
    const json_res = await res.json();
    console.log("\n\n\n\n\n\nHealth check response: ", json_res, "\n\n\n\n\n");
    return res.ok;
}

export { messageStream, healthCheck };
