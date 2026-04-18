export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero-badge" aria-label="Status">
        <span className="hero-badge-dot" aria-hidden="true" />
        Fake Review Detector
      </div>
      <h1 id="hero-heading">
        Spot Fake Reviews <span>Instantly</span>
      </h1>
      <p>
        Analyze product reviews using multi-signal AI heuristics — detecting
        spam keywords, sentiment manipulation, repetition, and more.
      </p>
    </section>
  );
}
