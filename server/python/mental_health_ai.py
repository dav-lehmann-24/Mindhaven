import json
import os
import sys


def emit(payload):
    sys.stdout.write(json.dumps(payload))
    sys.stdout.flush()


def build_fallback_reply(user_message):
    lower_message = user_message.lower()

    tips = [
        "Try taking a few slow breaths and relaxing your shoulders for a minute.",
        "It may help to focus on one small, manageable step instead of everything at once.",
    ]

    if any(word in lower_message for word in ["anxious", "anxiety", "panic", "overwhelmed", "stress"]):
        tips = [
            "Try slowing your breathing and grounding yourself by noticing a few things you can see and hear around you.",
            "It may help to step away for a moment, drink some water, and focus on one small task instead of the whole day.",
        ]
    elif any(word in lower_message for word in ["sad", "low", "depressed", "empty", "lonely"]):
        tips = [
            "Try one gentle step today, like getting some fresh air, eating something nourishing, or texting someone you trust.",
            "Small routines can help when things feel heavy, even if all you do is one manageable thing right now.",
        ]

    return (
        "I'm sorry you're going through that, and I'm glad you reached out. "
        f"{tips[0]} {tips[1]} "
        "You do not have to carry this alone, so if you can, talk to a trusted buddy, friend, counselor, or therapist for real support. "
        "If this feels like too much to manage on your own, reaching out to a mental health professional would be a strong next step."
    )


def looks_unreliable(reply):
    lower_reply = reply.lower()
    bad_patterns = [
        "i've been feeling",
        "therapist or therapist",
        "i can't help you",
        "thank you for your support",
        "no, don't be a therapist",
    ]
    return len(reply.strip()) < 80 or any(pattern in lower_reply for pattern in bad_patterns)


def main():
    if len(sys.argv) < 2:
      emit({"error": "A user message is required"})
      return

    user_message = sys.argv[1].strip()
    if not user_message:
      emit({"error": "A non-empty user message is required"})
      return

    try:
      from transformers import T5ForConditionalGeneration, T5Tokenizer
    except Exception as exc:
      emit(
          {
              "error": "transformers dependencies are not installed",
              "details": {
                  "hint": "Run: pip install transformers torch sentencepiece",
                  "python_error": str(exc),
              },
          }
      )
      return

    model_name = os.environ.get("LOCAL_AI_MODEL", "google/flan-t5-base")
    prompt = (
        "Task: write a warm, supportive mental health check-in reply.\n"
        "Rules:\n"
        "- Be empathetic, calm, and conversational.\n"
        "- Reply to the message in a supportive way and make coherrent sentences.\n"
        "- Mention 2 practical coping tips.\n"
        "- Encourage talking to a trusted buddy, counselor, or therapist.\n"
        "- Do not diagnose.\n"
        "- Do not say you are a therapist.\n"
        "- If there is immediate danger, tell them to contact emergency services or a crisis hotline now.\n"
        "- Response length: 4 to 6 sentences.\n\n"
        "Example 1\n"
        "User: I feel really anxious and overwhelmed today.\n"
        "Response: I'm sorry you're carrying so much right now. It may help to slow things down for a moment by taking a few steady breaths and focusing on one small task instead of everything at once. If you can, drink some water, step away from the noise for a few minutes, and notice a few things around you to ground yourself. You do not have to handle this alone, so reaching out to a trusted buddy, counselor, or therapist could really help.\n\n"
        "Example 2\n"
        "User: I've been feeling low and unmotivated all week.\n"
        "Response: That sounds really heavy, and I'm glad you said it out loud. Sometimes it helps to lower the pressure and aim for one gentle step today, like getting out of bed, taking a short walk, or eating something nourishing. You could also message a friend or buddy just to say you're having a hard day instead of keeping it all inside. If this low feeling keeps sticking around, talking to a therapist or counselor would be a strong next step.\n\n"
        f"User: {user_message}\n"
        "Response:"
    )

    try:
      tokenizer = T5Tokenizer.from_pretrained(model_name)
      model = T5ForConditionalGeneration.from_pretrained(model_name)
      input_ids = tokenizer(prompt, return_tensors="pt", truncation=True, max_length=512).input_ids
      outputs = model.generate(
          input_ids,
          max_new_tokens=180,
          min_new_tokens=60,
          num_beams=4,
          do_sample=False,
          no_repeat_ngram_size=3,
          early_stopping=True,
      )
      reply = tokenizer.decode(outputs[0], skip_special_tokens=True).strip()
      if looks_unreliable(reply):
          reply = build_fallback_reply(user_message)
      emit({"reply": reply})
    except Exception as exc:
      emit(
          {
              "error": "Local model inference failed",
              "details": {
                  "python_error": str(exc),
              },
          }
      )


if __name__ == "__main__":
    main()
