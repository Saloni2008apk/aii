
const topic = document.getElementById("topic");
const level = document.getElementById("level");
const mode = document.getElementById("mode");
const apiKey = document.getElementById("apiKey");
const result = document.getElementById("result");
const status = document.getElementById("status");
const generateBtn = document.getElementById("generateBtn");

// Sample content works without an API key.
document.getElementById("demoBtn").addEventListener("click", () => {
  const examples = {
    notes: `SEMICONDUCTOR PHYSICS

Simple meaning:
A semiconductor conducts electricity better than an
insulator but not as easily as a metal.

Everyday analogy:
Think of a gate that controls how easily people pass through.

Key points:
1. Silicon is a common semiconductor.
2. Semiconductors are used in electronic devices.
3. Temperature can affect conductivity.
4. Electrons and holes carry electric current.
5. Diodes are made using semiconductor materials.

Quiz:
1. Name a common semiconductor.
Answer: Silicon.

2. Name two charge carriers.
Answer: Electrons and holes.`,

    quiz: `MINI QUIZ

1. Which is a common semiconductor?
A. Wood
B. Silicon
C. Paper
D. Rubber

2. What are the two main charge carriers?
A. Electrons and holes
B. Only protons
C. Neutrons
D. None

Answers:
1. B — Silicon
2. A — Electrons and holes`,

    explain: `A semiconductor is a material whose electrical
conductivity lies between that of a conductor and an
insulator.

Example:
Silicon is used to make computer chips.

Remember:
Semiconductors help control electric current in
electronic devices.`
  };

  result.textContent = examples[mode.value];
  status.textContent = "Demo loaded! This is sample content, not live AI.";
});

// Generate content using Gemini.
generateBtn.addEventListener("click", async () => {
  const subject = topic.value.trim();
  const key = apiKey.value.trim();

  if (!subject) {
    status.textContent = "Please enter a study topic.";
    return;
  }

  if (!key) {
    status.textContent = "Enter a Gemini API key or click Try Demo.";
    return;
  }

  const tasks = {
    notes: "Create simple exam-focused notes, key points, an analogy, and five quiz questions with answers.",
    quiz: "Create 10 multiple-choice questions with four options, an answer key, and short explanations.",
    explain: "Explain this topic in simple words, with an everyday analogy and one example."
  };

  generateBtn.disabled = true;
  status.textContent = "Generating your study pack...";
  result.textContent = "";

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
      encodeURIComponent(key),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text:
                "Act as a beginner-friendly tutor. Topic: " +
                subject +
                ". Student level: " + level.value +
                ". Task: " + tasks[mode.value] +
                " Use clear headings and simple language."
            }]
          }]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error?.message || "The API request failed."
      );
    }

    const answer = data.candidates?.[0]?.content?.parts
      ?.map(part => part.text || "")
      .join("\n");

    if (!answer) {
      throw new Error("No answer returned. Try again.");
    }

    result.textContent = answer;
    status.textContent =
      "Study pack created! Check facts before studying.";

  } catch (error) {
    status.textContent = "Error: " + error.message;
    result.textContent =
      "Check your internet, API key, and API access.";
  } finally {
    generateBtn.disabled = false;
  }
});

// Copy generated notes.
document.getElementById("copyBtn").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(result.textContent);
    status.textContent = "Notes copied successfully!";
  } catch {
    status.textContent =
      "Copy unavailable. Select the notes and copy manually.";
  }
});
