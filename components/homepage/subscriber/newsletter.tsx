import { Mail } from "lucide-react"; // Import the mail icon
import { Subscription } from "./subscriber";

export function NewsletterSection() {
  return (
    <section className="md:py-10 py-5">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            <Mail className="inline-block mr-2 h-6 w-6 text-blue-600" />{" "}
            {/* Add the Mail icon */}
            Stay Updated with Our Newsletter
          </h2>
          <p className="text-gray-600 mb-6">
            Join our community and be the first to receive exclusive updates,
            special offers, and expert tips directly to your inbox.
          </p>

          <div className="flex justify-center">
            <Subscription />
          </div>

          <p className="text-xs text-gray-500 mt-8">
            We respect your privacy. You can unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
