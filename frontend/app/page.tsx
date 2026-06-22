import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4">
      {/* Hero */}
      <div className="text-center max-w-3xl">
        <div className="inline-flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-full px-4 py-1.5 text-sm text-gray-400 mb-8">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          AI-Powered Codebase Assistant
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Ask your codebase <span className="text-blue-400">anything</span>
        </h1>

        <p className="text-xl text-gray-400 mb-10 leading-relaxed">
          Paste a GitHub URL. Ask questions in plain English. Get answers with exact file references — in seconds.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <SignedOut>
            <Link href="/sign-up" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-lg transition-colors text-lg">
              Get Started Free
            </Link>
            <Link href="/sign-in" className="border border-gray-700 hover:border-gray-500 text-gray-300 font-semibold px-8 py-3 rounded-lg transition-colors text-lg">
              Sign In
            </Link>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-lg transition-colors text-lg">
              Go to Dashboard
            </Link>
          </SignedIn>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-4xl w-full">
        {[
          { icon: "🔍", title: "Instant Code Search", desc: "Semantic search across your entire codebase. Find functions, flows, and logic in seconds." },
          { icon: "🤖", title: "AI Explanations", desc: "Ask how authentication works, where Razorpay is integrated, which API handles purchases." },
          { icon: "🗺️", title: "Diagram Support", desc: "Upload architecture diagrams and ask the AI to explain services and connections." },
        ].map((f) => (
          <div key={f.title} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Example questions */}
      <div className="mt-20 max-w-2xl w-full">
        <p className="text-center text-gray-500 text-sm mb-4">Example questions you can ask</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {["How does login work?", "Where is Razorpay integrated?", "Which API handles user purchases?", "Explain this architecture diagram", "Where is JWT generated?", "What does authMiddleware do?"].map((q) => (
            <span key={q} className="bg-gray-800 border border-gray-700 text-gray-300 text-sm px-3 py-1.5 rounded-full">{q}</span>
          ))}
        </div>
      </div>

      <p className="mt-16 text-gray-600 text-sm">Built with Next.js · FastAPI · Qdrant · OpenAI</p>
    </main>
  );
}
