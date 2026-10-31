# EP001 — What Actually Happens When You Ask AI a Question?

Status: **draft for owner approval**. About 165 words, roughly 60 s at a natural pace.

## Alternative hooks
- **A (recommended, used below):** "You ask an AI a question. Seconds later, an answer. But it isn't pulling a finished reply from a file. It's predicting one, piece by piece."
- **B:** "This answer took seconds to appear. It was built one tiny piece at a time, and every piece was a prediction."
- **C (original, tightened):** "You ask AI a question. Seconds later, it answers. But what's actually happening behind the screen?"

## Narration (one line = one audio file)

| # | Beat | Line |
|---|---|---|
| 01 | Hook | You ask an AI a question. Seconds later, an answer. |
| 02 | Hook | But it isn't pulling a finished reply from a file. It's predicting one, piece by piece. |
| 03 | Curiosity | Here's what actually happens. |
| 04 | Explain | With popular AI chat apps, your message travels to computers in a data center, running a large language model. |
| 05 | Explain | First, your text is split into tokens: small chunks like words, parts of words, or punctuation. |
| 06 | Explain | During training, the model learned patterns from huge amounts of text. It doesn't look through that text when it answers. The patterns are captured in billions of numbers. |
| 07 | Explain | Now it uses those patterns, and everything in the conversation, to calculate which token is likely to come next. |
| 08 | Explain | It picks one, adds it, and repeats, token by token, until the answer is complete. |
| 09 | Takeaway | That's why AI sounds so fluent. But fluent isn't the same as correct. It can sound confident and still be wrong. |
| 10 | Close | So when an answer appears in seconds, remember: it was built one prediction at a time. Check what matters. |

## Accuracy notes
- Line 04 says "popular AI chat apps" because some models run on the device itself. Not every AI system works this way.
- Line 06 avoids saying the model searches its training data. Tools that search the web are a separate feature. Whatever such a tool retrieves becomes part of "everything in the conversation" in line 07.
- Line 08 is simplified. Models may sample from likely options rather than always taking the single most likely one, and the answer usually streams to the screen as it's generated.
- Lines 09–10 deliver the required takeaway: fluent doesn't mean correct.
- Source log: to be completed in `research/ep001-sources.md` before final approval.
