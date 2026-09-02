import Link from "next/link"
import { ArrowRight, Phone, Mail } from "lucide-react"

export function FinalCTA() {
  return (
    <section id="final-cta" className="py-16 md:py-24 relative overflow-hidden" style={{ backgroundColor: "rgb(18, 26, 33)" }}>
      <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4fd3d4_1px,transparent_1px),linear-gradient(to_bottom,#4fd3d4_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight max-w-3xl mx-auto">
          Send the drawing. We&apos;ll tell you what it should cost.
        </h2>
        <p className="mt-5 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
          Engineering review, should-cost model, and a manufacturing plan, before you commit to a process or a
          price.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-6 mb-10">
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-emuski-teal-light" />
            <div className="text-left">
              <div className="text-xs text-gray-400">Contact</div>
              <div className="text-white font-medium">+91-86670-88060</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-emuski-teal-light" />
            <div className="text-left">
              <div className="text-xs text-gray-400">Email</div>
              <div className="text-white font-medium">enquiries@emuski.com</div>
            </div>
          </div>
        </div>

        <Link
          href="/contact"
          className="inline-flex items-center gap-2 bg-emuski-teal hover:bg-emuski-teal-light text-black px-8 py-4 rounded-lg font-semibold transition-colors"
        >
          Start a Manufacturing Project
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  )
}
