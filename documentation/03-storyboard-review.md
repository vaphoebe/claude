# Review of the supplied storyboard ("What Actually Happens When You Ask AI a Question?")

Source: `character/reference/storyboard-reference.webp`, 16 panels, about 45 s.
The robot in this image is used as the **character reference**. I treat the panel artwork as a mood guide, not as final frames.

## Accuracy issues (must fix before scripting)

| Panel | Current line or visual | Problem | Proposed fix |
|---|---|---|---|
| 05–06 | "reach powerful computers called servers. Those servers run a massive AI model." | True for most cloud chat services, but some models run on the device itself (the brief says not to imply all AI works the same way). | "For most AI chat apps, your message travels to data-center servers running a large language model." |
| 08 | "looks at patterns it learned from huge amounts of data" + neural-network visual | "Looks at" suggests it searches its training data when it answers. The brief explicitly forbids that implication. | "It uses patterns it learned during training, stored as billions of numbers, not as a library it searches." |
| 09 | "Option 1 / 2 / 3" cards, "one selected" | Suggests the model chooses between whole finished answers. In reality it scores possible *next tokens*, one step at a time. | Visual: probability bars over a few candidate next tokens. One is picked, then it repeats. |
| 07 | "breaks your question into smaller pieces" | Correct (tokenization). | Keep. Show real-looking token splits (e.g. "un", "believ", "able") with a note that this is a simplified view. |
| 11 | "then sent back to you in seconds" | Many apps *stream* the answer as it's generated, so sending isn't a separate final step. | "...and streams back to your screen as it's written." |
| 12–13 | "It doesn't think or understand like a human." | Disputed philosophical claim; scientists don't agree on it. | Replace with the required takeaway: **"Fluent doesn't mean correct. It predicts likely text, so it can sound sure and still be wrong. Check what matters."** |
| (missing) | — | Brief point 7 (fluency ≠ factual accuracy) is absent. | Covered by the fix above; it becomes the key-takeaway beat at about 40–55 s. |

## Brand and policy issues

| Issue | Where | Fix |
|---|---|---|
| **OpenAI logo** on the laptop | Panel 11 | Remove third-party logos. Use a generic chat interface. |
| Different tagline: "Curious Today, Brighter Tomorrow" | Panel 16 | Use the approved tagline *"Big questions. Simple explanations."* and the name placeholder. |
| Bold, two-colour text built into every frame | All panels | Against the brief: subtitles must be Inter 400 only, with no bold and orange used sparingly. Subtitles become a separate layer. |
| Photo-realistic 3D renders (globe, server room, chip) | 04–06 | Redraw as clean 2D vector scenes in the brand palette. Use 3D only if depth genuinely helps. |
| Hook "You ask AI a question." | 01 | Generic. Stronger alternatives will be proposed with the script (Step 6). |
| Length about 45 s | — | Brief target is about 60 s. Expand the explanation and takeaway beats. |
| End card with logo | 16 | Fine at the end, as long as there's no logo animation at the opening. |

## What carries over
The beat order, the robot's acting choices (curious look at camera, pointing, explaining with an open hand, thinking with a hand at the chin, laptop scene, confident close) and the transition ideas (push into the processor, data streams, word-by-word generation) all transfer directly to the 2D system.
