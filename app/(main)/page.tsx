import Testimonials from "@/app/ui/testimonials";
import HowItWorksRow from "@/app/ui/how-it-works";
import FAQ from "@/app/ui/faq";
import Typed from "@/app/ui/typed";
import Footer from "@/app/ui/footer";
import CTA from "@/app/ui/cta";
import { langInfo } from "@/app/lib/data";

export default async function Landing() {
  const langNames = langInfo.map((info) => info.name);
  return (
    <div className="w-full max-w-7xl flex flex-col items-center gap-y-4 pt-16 md:pt-24 px-2 text-center">
      <div className="text-4xl md:text-7xl font-medium mb-4 leading-tight">
        I can read <br className="block md:hidden" />
        <Typed
          className="text-violet-700 italic"
          strings={langNames}
          typeSpeed={50}
          backSpeed={60}
          backDelay={1000}
          loop
        />
        , <br />
        but can&apos;t speak it.
      </div>
      <p className="text-xl md:text-2xl font-medium w-full max-w-2xl mb-12 leading-loose">
        Learn language through natural conversation topics
      </p>
      <CTA />
      <p className="text-3xl md:text-4xl">Hanasu in 30 seconds!</p>
      <iframe
        src="https://youtube.com/embed/BoAVCpPwDhQ?rel=0"
        title="Hanasu in 30 seconds!"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full max-w-3xl h-96"
      />
      <HowItWorksRow
        index={1}
        title="CHOOSE A TOPIC"
        subtitle="Choose from a rotating set of conversation starters. Feeling creative? Write in a topic of your choice!"
        videoPath="videos/hanasu-tutorial1.mp4"
      />
      <HowItWorksRow
        index={2}
        title="HAVE A CHAT"
        subtitle="Need help? Double tap the message to reveal, and again to automatically translate."
        videoPath="videos/hanasu-tutorial2.mp4"
      />
      <HowItWorksRow
        index={3}
        title="REVIEW"
        subtitle="Save unfamiliar words to your dictionary, and review them with science-backed spaced repetition."
        videoPath="videos/hanasu-tutorial3.mp4"
      />
      <p className="text-4xl md:text-5xl mt-48 mb-12">
        What Our Users are Saying
      </p>
      <Testimonials />
      <p className="text-5xl mt-48 mb-8">Frequently Asked Questions</p>
      <FAQ />
      <p className="text-4xl md:text-7xl font-medium mt-24">
        Speak like a{" "}
        <span className="underline decoration-primary">native</span>
      </p>
      <p className="text-2xl md:text-4xl font-medium w-full max-w-2xl mb-6 leading-loose">
        Get started for free!
      </p>
      <CTA />
      <Footer />
    </div>
  );
}
