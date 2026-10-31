# EP001 source log — What Actually Happens When You Ask AI a Question?

Status: **draft. Owner review is required before publishing.** Last updated 2026-10-31.
"Checked" means the source was located and its relevant claim confirmed through web search in this session. "To re-check" means it's a well-known primary source whose wording should be re-read before publishing.

| # | Script claim (line) | Sources | Status | Notes |
|---|---|---|---|---|
| 1 | Text is split into **tokens**: words, parts of words, or punctuation (05) | OpenAI Help Center, "What are tokens and how to count them?" https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them · Google ML Crash Course, LLMs: https://developers.google.com/machine-learning/crash-course/llm | Checked (2 independent) | Both describe tokens as words, subwords or characters. Our split "rain / bows" is an **illustrative** example; real tokenizers vary by model. |
| 2 | Models calculate which token is **likely to come next** and generate token by token (02, 07, 08) | Google ML Crash Course (language model = probability of tokens in a sequence) · Radford et al. 2019, "Language Models are Unsupervised Multitask Learners" (GPT-2) · Brown et al. 2020, arXiv:2005.14165 | Google checked; papers to re-check | "Picks one" simplifies sampling: models may sample rather than always take the top token. The video labels the bars as illustrative. |
| 3 | Patterns learned in training are **captured in billions of numbers**; the model doesn't look through its training text when answering (06) | Brown et al. 2020, GPT-3 has 175 billion parameters, arXiv:2005.14165 · Lewis et al. 2020, RAG: knowledge in "parametric memory" vs a separate retrieval index, arXiv:2005.11401 | RAG checked; GPT-3 to re-check | Retrieval and web search are add-on tools. What they fetch enters "the conversation" (line 07). |
| 4 | Popular chat apps send your message to **data-center computers** running a large language model (04) | Provider documentation for cloud-hosted assistants · counter-example of on-device models: Apple, "Apple Intelligence Foundation Language Models", arXiv:2407.21075 | To re-check | The wording "popular AI chat apps" avoids implying that all AI runs in the cloud. |
| 5 | **Fluent isn't the same as correct**: models can sound confident and still be wrong (09) | Kalai, Nachum, Vempala & Zhang 2025, "Why Language Models Hallucinate", arXiv:2509.04664, plus OpenAI explainer https://openai.com/index/why-language-models-hallucinate/ · Lewis et al. 2020 (parametric-only models can hallucinate) | Checked (2) | Core takeaway required by the brief. |
| 6 | Example: "The sky looks blue because sunlight scatters off tiny air molecules." (visual only) | Rayleigh scattering, any physics reference, e.g. NASA SpacePlace "Why is the sky blue?" | To re-check | A simplified but accurate one-line explanation. Only appears on screen. |

## Simplifications stated in the video
- The probability bars are illustrative, not real model output.
- The token boundaries shown are illustrative.
- The globe, server and chip sequence is a visual metaphor for a cloud service, not a specific provider's infrastructure.

## Not claimed
- Nothing about human-like understanding or consciousness.
- No company names, logos or product-specific claims.
