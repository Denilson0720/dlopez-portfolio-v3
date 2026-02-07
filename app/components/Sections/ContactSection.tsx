export default function ContactSection() {
  return (
    <section
      id="contact"
      data-section="contact"
      className="min-h-screen py-20 px-8 scroll-mt-20"
    >
      <h2 className="text-5xl font-bold mb-12 text-white">Contact</h2>
      <div className="max-w-4xl">
        <p className="text-gray-400 text-lg mb-8">
          Feel free to reach out if you'd like to collaborate or just say hello!
        </p>
        <div className="space-y-4">
          <a
            href="mailto:contact@denilsonlopez.com"
            className="block text-accent-blue hover:text-accent-blue/80 transition-colors"
          >
            contact@denilsonlopez.com
          </a>
          <div className="flex gap-6 mt-8">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Twitter
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

