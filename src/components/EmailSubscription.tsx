import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Recaptcha } from "./ui/recaptcha";
import { Check, Mail, AlertCircle, Loader2 } from "lucide-react";

interface SubscriptionResponse {
  success: boolean;
  message: string;
  subscriberId?: string;
}

export const EmailSubscription = ({ className = "", variant = "default" }: { className?: string, variant?: "default" | "compact" | "sidebar" }) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address");
      return;
    }

    // For non-compact variants, check for token
    if (variant !== "compact" && !recaptchaToken) {
      setStatus("error");
      setMessage("Please complete the security verification");
      return;
    }

    setStatus("loading");

    try {
      // Simulate API call - replace with your actual endpoint
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          source: "blog",
          interests: ["manufacturing", "engineering", "AI"],
          subscribeDate: new Date().toISOString()
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const data: SubscriptionResponse = await response.json();

      if (data.success) {
        setStatus("success");
        setMessage("Successfully subscribed! Check your email for confirmation.");
        setEmail("");
        setRecaptchaToken(null);

        // Track subscription event
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'subscribe', {
            'event_category': 'engagement',
            'event_label': 'email_newsletter'
          });
        }
      } else {
        setStatus("error");
        setMessage(data.message || "Subscription failed. Please try again.");
      }
    } catch (error) {
      // Send email notification for new subscription
      const emailData = {
        to: 'enquiries@emuski.com',
        from: 'noreply@EMUSKI.com',
        subject: 'New Email Subscription - EMUSKI',
        html: `
          <h2>New Email Subscription</h2>
          <p><strong>Email:</strong> ${email.trim().toLowerCase()}</p>
          <p><strong>Source:</strong> Blog/Website</p>
          <p><strong>Interests:</strong> Manufacturing, Engineering, AI</p>
          <p><strong>Subscribed:</strong> ${new Date().toLocaleString()}</p>
        `
      };
      
      console.log('📧 SUBSCRIPTION EMAIL TO SEND TO enquiries@emuski.com:', emailData);
      
      // Fallback: Store in localStorage for now (replace with proper backend)
      const subscribers = JSON.parse(localStorage.getItem("emuski_subscribers") || "[]");
      const existingSubscriber = subscribers.find((sub: any) => sub.email === email.trim().toLowerCase());
      
      if (existingSubscriber) {
        setStatus("error");
        setMessage("You're already subscribed to our newsletter!");
      } else {
        const newSubscriber = {
          id: Date.now().toString(),
          email: email.trim().toLowerCase(),
          subscribeDate: new Date().toISOString(),
          status: "active",
          source: "blog",
          interests: ["manufacturing", "engineering", "AI"],
          recaptchaToken
        };
        
        subscribers.push(newSubscriber);
        localStorage.setItem("emuski_subscribers", JSON.stringify(subscribers));

        setStatus("success");
        setMessage("Successfully subscribed! You'll receive our daily manufacturing insights.");
        setEmail("");
        setRecaptchaToken(null);
      }
    }

    // Reset status after 5 seconds
    setTimeout(() => {
      setStatus("idle");
      setMessage("");
    }, 5000);
  };

  const renderCompactForm = () => (
    <div className={`space-y-2 ${className}`}>
      {/* Header */}
      <div className="mb-2">
        <h3 className="text-base font-bold text-white mb-1">Stay Updated</h3>
        <p className="text-xs text-white/90">Get daily manufacturing insights delivered to your inbox</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          id="email-compact"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emuski-teal-darker focus:border-transparent"
          disabled={status === "loading" || status === "success"}
        />
        <Button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="bg-emuski-teal-darker hover:bg-emuski-teal/90 text-white px-6 py-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {status === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : status === "success" ? (
            <Check className="h-4 w-4" />
          ) : (
            "Subscribe"
          )}
        </Button>
      </form>

      {message && (
        <div className={`flex items-center space-x-2 text-sm ${
          status === "success" ? "text-green-100" : "text-red-100"
        }`}>
          {status === "success" ? (
            <Check className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <span>{message}</span>
        </div>
      )}

      {status !== "success" && (
        <p className="text-xs text-white/70 mt-1">Join 5,000+ professionals</p>
      )}
    </div>
  );

  const renderSidebarForm = () => (
    <Card className={`p-6 bg-gradient-to-br from-emuski-teal/5 to-emuski-teal/10 border-emuski-teal/20 ${className}`}>
      <div className="flex items-center space-x-2 mb-3">
        <Mail className="h-5 w-5 text-emuski-teal-darker" />
        <h3 className="text-lg font-bold text-gray-900">Daily Insights</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">Get expert manufacturing insights delivered to your inbox every day.</p>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          id="email-sidebar"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emuski-teal-darker focus:border-transparent"
          disabled={status === "loading" || status === "success" || !recaptchaToken}
        />
        <Button 
          type="submit"
          disabled={status === "loading" || status === "success" || !recaptchaToken}
          className="w-full bg-emuski-teal-darker hover:bg-emuski-teal/90 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Subscribing...
            </>
          ) : status === "success" ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Subscribed!
            </>
          ) : (
            "Subscribe Now"
          )}
        </Button>
      </form>

      {/* reCAPTCHA for sidebar variant */}
      <div className="mt-3">
        <Recaptcha 
          onVerify={setRecaptchaToken}
          onError={() => setRecaptchaToken(null)}
          theme="light"
          size="compact"
        />
      </div>

      {message && (
        <div className={`mt-3 flex items-center space-x-2 text-sm ${
          status === "success" ? "text-green-600" : "text-red-600"
        }`}>
          {status === "success" ? (
            <Check className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <span>{message}</span>
        </div>
      )}
      
      {status !== "success" && (
        <p className="text-xs text-gray-500 mt-3">
          Join 5,000+ manufacturing professionals.
        </p>
      )}
    </Card>
  );

  const renderDefaultForm = () => (
    <div className={`max-w-4xl mx-auto text-center space-y-6 ${className}`}>
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Daily Manufacturing Insights
          </h2>
        </div>
        <p className="text-xl text-white/90 max-w-2xl mx-auto">
          Get expert insights on manufacturing excellence, engineering innovation, and AI-powered solutions delivered to your inbox every morning.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            id="email-default"
            name="email"
            placeholder="Enter your professional email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emuski-teal-darker focus:border-transparent shadow-sm"
            disabled={status === "loading" || status === "success" || !recaptchaToken}
          />
          <Button 
            type="submit"
            disabled={status === "loading" || status === "success" || !recaptchaToken}
            className="bg-emuski-teal-darker hover:bg-emuski-teal/90 text-white px-12 py-4 text-lg font-semibold whitespace-nowrap h-auto min-h-[3rem] flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Subscribing...
              </>
            ) : status === "success" ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Subscribed!
              </>
            ) : (
              "Subscribe Free"
            )}
          </Button>
        </div>
        
        {/* reCAPTCHA for default variant */}
        <div className="mt-4 flex justify-center">
          <Recaptcha 
            onVerify={setRecaptchaToken}
            onError={() => setRecaptchaToken(null)}
            theme="light"
            size="normal"
          />
        </div>
      </form>

      {message && (
        <div className={`flex items-center justify-center space-x-2 ${
          status === "success" ? "text-green-600" : "text-red-600"
        }`}>
          {status === "success" ? (
            <Check className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <span>{message}</span>
        </div>
      )}
      
      {status !== "success" && (
        <div className="text-center space-y-2">
          <p className="text-sm text-white/80">
            Join 5,000+ manufacturing professionals who trust EMUSKI insights.
          </p>
          <div className="flex items-center justify-center space-x-6 text-xs text-white/70">
            <span className="flex items-center space-x-1">
              <Check className="h-3 w-3" />
              <span>Daily insights</span>
            </span>
            <span className="flex items-center space-x-1">
              <Check className="h-3 w-3" />
              <span>Expert analysis</span>
            </span>
            <span className="flex items-center space-x-1">
            </span>
          </div>
        </div>
      )}
    </div>
  );

  switch (variant) {
    case "compact":
      return renderCompactForm();
    case "sidebar":
      return renderSidebarForm();
    default:
      return renderDefaultForm();
  }
};