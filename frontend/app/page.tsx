"use client";

import Link from "next/link";
import { useAuth, useClerk } from "@clerk/nextjs";
import { useState } from "react";

const NAV_LINKS = ["Features", "How It Works", "FAQ"];

const FEATURES = [
  { icon: "⬡", label: "Open Source" },
  { icon: "◈", label: "Self Hostable" },
  { icon: "⟨/⟩", label: "10+ Languages" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Paste a GitHub URL",
    desc: "Point Repify at any public GitHub repository. It clones, walks every file, and skips noise like node_modules.",
  },
  {
    step: "02",
    title: "Codebase gets indexed",
    desc: "Files are parsed by AST, split into meaningful chunks, embedded with OpenAI, and stored in a vector database.",
  },
  {
    step: "03",
    title: "Ask in plain English",
    desc: "Your question is embedded, matched against the codebase semantically, and the top chunks are sent to GPT-4o-mini.",
  },
  {
    step: "04",
    title: "Get answers with file refs",
    desc: "Repify returns a clear answer with exact file paths — so you know exactly where to look.",
  },
];

const FAQS = [
  { q: "Is Repify free to use?", a: "Yes. You only need a $5 OpenAI API credit. Qdrant runs locally via Docker for free." },
  { q: "Which languages are supported?", a: "JS, TS, Python, Go, Java, C#, Rust, Ruby, PHP, SQL, Markdown, YAML, JSON and more." },
  { q: "Can I upload architecture diagrams?", a: "Yes. Upload any PNG or JPG and Repify will describe all services, connections and data flows using GPT-4o-mini vision." },
  { q: "Does it work with private repos?", a: "Currently only public GitHub repos are supported. Private repo support via GitHub OAuth is on the roadmap." },
  { q: "How accurate are the answers?", a: "Answers are grounded strictly in retrieved code chunks — Repify will not hallucinate beyond what is in your codebase." },
];

export default function Home() {
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>

      {/* ── Navbar ── */}
      <nav className="border-b border-[#222] px-6 py-4 flex items-center justify-between sticky top-0 bg-black z-50">
        <span className="font-bold text-lg tracking-widest uppercase">REPIFY</span>
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`} className="text-sm text-[#888] hover:text-white transition-colors">
              {l}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="border border-white text-white text-sm px-4 py-1.5 hover:bg-white hover:text-black transition-colors">
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ redirectUrl: "/" })}
                className="text-sm text-[#888] hover:text-white transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link href="/sign-in" className="text-sm text-[#888] hover:text-white transition-colors">
                Sign In
              </Link>
              <Link href="/sign-up" className="border border-white text-white text-sm px-4 py-1.5 hover:bg-white hover:text-black transition-colors">
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 border border-[#333] text-[#888] text-xs px-3 py-1 mb-8">
            <span className="w-1.5 h-1.5 bg-white rounded-full" />
            Semantic codebase search, powered by AI
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Ask your<br />
            codebase{" "}
            <span className="bg-white text-black px-2">anything</span>
          </h1>
          <p className="text-[#888] text-sm leading-relaxed mb-10 max-w-md">
            Paste a GitHub URL. Index the entire repo. Ask questions in plain English and get answers with exact file references — in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            {isSignedIn ? (
              <Link href="/dashboard" className="bg-white text-black text-sm font-bold px-6 py-3 hover:bg-[#e0e0e0] transition-colors text-center">
                GO TO CHAT →
              </Link>
            ) : (
              <>
                <Link href="/sign-up" className="bg-white text-black text-sm font-bold px-6 py-3 hover:bg-[#e0e0e0] transition-colors text-center">
                  GET STARTED →
                </Link>
                <a href="https://github.com/sompattjoshi61/repify" target="_blank" rel="noopener noreferrer" className="border border-[#444] text-white text-sm px-6 py-3 hover:border-white transition-colors text-center">
                  VIEW ON GITHUB ↗
                </a>
              </>
            )}
          </div>
          <div className="flex flex-wrap gap-6">
            {FEATURES.map((f) => (
              <div key={f.label} className="flex items-center gap-2 text-xs text-[#888]">
                <span>{f.icon}</span>
                <span>{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Code preview panel */}
        <div className="border border-[#222] bg-[#0a0a0a]">
          <div className="border-b border-[#222] px-4 py-2 flex items-center justify-between">
            <span className="text-xs text-[#555]">repify / query</span>
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#333]" />
              <div className="w-3 h-3 rounded-full bg-[#333]" />
              <div className="w-3 h-3 rounded-full bg-[#333]" />
            </div>
          </div>
          <div className="p-5 text-xs leading-7 text-[#888]">
            <p><span className="text-[#555]">$</span> <span className="text-white">repify index</span> https://github.com/org/project</p>
            <p className="text-[#555]">  → Cloning repository...</p>
            <p className="text-[#555]">  → Parsing 847 files with tree-sitter</p>
            <p className="text-[#555]">  → Embedding 3,241 chunks</p>
            <p className="text-green-400">  ✓ Indexed in 12.4s</p>
            <br />
            <p><span className="text-[#555]">$</span> <span className="text-white">repify ask</span> <span className="text-[#aaa]">"How does auth work?"</span></p>
            <br />
            <p className="text-white">Authentication uses JWT tokens.</p>
            <br />
            <p><span className="text-[#555]">1.</span> Login hits <span className="text-white">`/api/login`</span></p>
            <p className="text-[#555] pl-4">→ backend/auth/login.js</p>
            <p><span className="text-[#555]">2.</span> JWT generated in <span className="text-white">`jwt.js`</span></p>
            <p className="text-[#555] pl-4">→ services/jwt.js</p>
            <p><span className="text-[#555]">3.</span> Protected routes use <span className="text-white">`authMiddleware`</span></p>
            <p className="text-[#555] pl-4">→ middleware/auth.js</p>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="border-t border-[#222] py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-xs text-[#555] tracking-widest uppercase mb-12">HOW IT WORKS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
            {HOW_IT_WORKS.map((item, i) => (
              <div key={item.step} className={`p-8 ${i < HOW_IT_WORKS.length - 1 ? "border-r border-[#222]" : ""}`}>
                <p className="text-[#333] text-4xl font-bold mb-6">{item.step}</p>
                <h3 className="text-white text-sm font-bold mb-3">{item.title}</h3>
                <p className="text-[#666] text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="border-t border-[#222] py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-xs text-[#555] tracking-widest uppercase mb-12">FEATURES</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-[#222]">
            {[
              { title: "Semantic Search", desc: "Finds code by meaning, not keywords. Ask naturally — get the right chunks back every time.", tag: "VECTOR" },
              { title: "AST-Based Chunking", desc: "Code is split at function and class boundaries using tree-sitter, not arbitrary character counts.", tag: "ACCURATE" },
              { title: "Diagram Analysis", desc: "Upload architecture PNGs and ask the AI to explain services, databases, and data flows.", tag: "MULTIMODAL" },
              { title: "File References", desc: "Every answer cites exact file paths so you know precisely where to look in the codebase.", tag: "GROUNDED" },
              { title: "Multi-language", desc: "Supports JS, TS, Python, Go, Java, Rust, SQL, Markdown, YAML, JSON and more.", tag: "10+ LANGS" },
              { title: "Instant Indexing", desc: "A medium-sized repo of ~500 files is fully indexed and queryable in under 30 seconds.", tag: "FAST" },
            ].map((f, i) => (
              <div key={f.title} className={`p-8 ${i % 3 !== 2 ? "border-r border-[#222]" : ""} ${i < 3 ? "border-b border-[#222]" : ""}`}>
                <div className="inline-block border border-[#333] text-[#555] text-[10px] px-2 py-0.5 mb-4 tracking-wider">{f.tag}</div>
                <h3 className="text-white text-sm font-bold mb-2">{f.title}</h3>
                <p className="text-[#666] text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Example Questions ── */}
      <section className="border-t border-[#222] py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-xs text-[#555] tracking-widest uppercase mb-12">EXAMPLE QUERIES</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "How does login work in this project?",
              "Where is Razorpay integrated?",
              "Which API is called when a user purchases a course?",
              "Explain this architecture diagram",
              "Where is JWT generated and validated?",
              "What does the authMiddleware check for?",
              "Which service talks to Redis?",
              "Which table stores user subscriptions?",
            ].map((q) => (
              <div key={q} className="border border-[#222] px-5 py-3 text-xs text-[#888] flex items-center gap-3 hover:border-[#444] hover:text-white transition-colors cursor-default">
                <span className="text-[#444]">›</span>
                {q}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="border-t border-[#222] py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-center text-2xl font-bold tracking-widest uppercase mb-2">FREQUENTLY ASKED QUESTIONS</h2>
          <p className="text-center text-[#555] text-xs mb-12">Everything you need to know about Repify</p>
          <div className="divide-y divide-[#222]">
            {FAQS.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left text-sm hover:text-white text-[#aaa] transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className="text-[#555] ml-4">{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && (
                  <p className="text-[#666] text-xs leading-relaxed pb-5">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-[#222] py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Start asking questions.</h2>
          <p className="text-[#666] text-sm mb-8">Index your first repository in under 30 seconds.</p>
          <Link href={isSignedIn ? "/dashboard" : "/sign-up"} className="inline-block bg-white text-black font-bold text-sm px-8 py-3 hover:bg-[#e0e0e0] transition-colors">
            GET STARTED →
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#222] py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <p className="font-bold text-lg tracking-widest uppercase mb-3">REPIFY</p>
            <p className="text-[#555] text-xs leading-relaxed">
              AI-powered codebase assistant. Ask any question about any GitHub repository in plain English.
            </p>
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest text-[#555] uppercase mb-4">Product</p>
            <div className="flex flex-col gap-2">
              {["Features", "How It Works", "FAQ"].map((l) => (
                <a key={l} href="#" className="text-xs text-[#666] hover:text-white transition-colors">{l}</a>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest text-[#555] uppercase mb-4">Resources</p>
            <div className="flex flex-col gap-2">
              {["GitHub", "Documentation", "Changelog"].map((l) => (
                <a key={l} href="#" className="text-xs text-[#666] hover:text-white transition-colors">{l}</a>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest text-[#555] uppercase mb-4">Stack</p>
            <div className="flex flex-col gap-2">
              {["Next.js", "FastAPI", "Qdrant", "OpenAI"].map((l) => (
                <span key={l} className="text-xs text-[#666]">{l}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 mt-12 pt-6 border-t border-[#222]">
          <p className="text-[#444] text-xs text-center">© 2026 Repify. Built for developers.</p>
        </div>
      </footer>
    </div>
  );
}
