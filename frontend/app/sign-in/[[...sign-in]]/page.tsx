import { SignIn } from "@clerk/nextjs";

const clerkAppearance = {
  variables: {
    colorBackground: "#111111",
    colorText: "#ffffff",
    colorPrimary: "#ffffff",
    colorInputBackground: "#1e1e1e",
    colorInputText: "#ffffff",
    colorTextSecondary: "#cccccc",
    colorTextOnPrimaryBackground: "#000000",
    colorNeutral: "#ffffff",
    colorDanger: "#ff6b6b",
    fontFamily: "'JetBrains Mono', monospace",
    borderRadius: "2px",
    fontSize: "13px",
  },
  elements: {
    rootBox: { width: "100%", display: "flex", justifyContent: "center" },
    card: {
      backgroundColor: "#111111",
      border: "1px solid #333333",
      boxShadow: "none",
      color: "#ffffff",
    },
    headerTitle: { color: "#ffffff", fontSize: "18px", fontWeight: "700" },
    headerSubtitle: { color: "#aaaaaa" },
    socialButtonsBlockButton: {
      backgroundColor: "#1a1a1a",
      border: "1px solid #444444",
      color: "#ffffff",
    },
    socialButtonsBlockButtonText: { color: "#ffffff", fontWeight: "500" },
    socialButtonsBlockButtonArrow: { color: "#ffffff" },
    dividerLine: { backgroundColor: "#333333" },
    dividerText: { color: "#666666" },
    formFieldLabel: { color: "#cccccc", fontSize: "12px" },
    formFieldInput: {
      backgroundColor: "#1e1e1e",
      border: "1px solid #444444",
      color: "#ffffff",
      caretColor: "#ffffff",
    },
    formFieldInputShowPasswordButton: { color: "#888888" },
    formFieldHintText: { color: "#888888" },
    formFieldErrorText: { color: "#ff6b6b" },
    formButtonPrimary: {
      backgroundColor: "#ffffff",
      color: "#000000",
      fontWeight: "700",
      border: "none",
    },
    footerActionText: { color: "#888888" },
    footerActionLink: { color: "#ffffff", fontWeight: "600" },
    identityPreviewText: { color: "#ffffff" },
    identityPreviewEditButton: { color: "#aaaaaa" },
    formHeaderTitle: { color: "#ffffff" },
    formHeaderSubtitle: { color: "#aaaaaa" },
    otpCodeFieldInput: {
      backgroundColor: "#1e1e1e",
      border: "1px solid #444",
      color: "#ffffff",
    },
    alternativeMethodsBlockButton: {
      backgroundColor: "#1a1a1a",
      border: "1px solid #333",
      color: "#ffffff",
    },
  },
};

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 w-full">
      <p className="font-bold text-lg tracking-widest uppercase text-white mb-8"
         style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        REPIFY
      </p>
      <SignIn appearance={clerkAppearance} />
    </div>
  );
}
