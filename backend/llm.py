import os
import base64
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def answer_question(question: str, chunks: list[dict]) -> str:
    if not chunks:
        return "No relevant code found. Please make sure a repository is indexed."

    context = ""
    for i, chunk in enumerate(chunks, 1):
        context += f"\n--- File: {chunk['file_path']} ---\n{chunk['content']}\n"

    prompt = f"""You are an expert code assistant called Repify.
Answer the developer's question using ONLY the code context provided below.
Always mention the exact file paths where relevant code is found.
Format your answer clearly with file references like: `filename.js`

Code Context:
{context}

Question: {question}

Answer:"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
    )

    return response.choices[0].message.content


def analyze_diagram(image_bytes: bytes, mime_type: str = "image/png") -> str:
    base64_image = base64.b64encode(image_bytes).decode("utf-8")

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "You are an expert software architect. Analyze this architecture diagram in detail. List all services, databases, APIs, and connections you can see. Describe the data flow between components. Be specific and technical."
                    },
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:{mime_type};base64,{base64_image}"}
                    }
                ]
            }
        ],
        max_tokens=1000,
    )

    return response.choices[0].message.content
