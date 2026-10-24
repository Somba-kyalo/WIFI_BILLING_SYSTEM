import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getApiErrorMessage } from "../../api/errors";
import {
  packageService,
  type InternetPackage,
} from "../../features/packages/packageService";
import "./packages.css";

function PackagesPage() {
  const [packages, setPackages] = useState<InternetPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPackage, setSelectedPackage] =
    useState<InternetPackage | null>(null);

  async function loadPackages() {
    setIsLoading(true);
    setError("");

    try {
      const availablePackages = await packageService.getPackages();
      setPackages(availablePackages);
    } catch (err: unknown) {
      setError(
        getApiErrorMessage(
          err,
          "We could not load the internet packages. Please try again.",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadPackages();
  }, []);

  function formatPrice(price: string) {
    const amount = Number(price);

    return new Intl.NumberFormat("en-KE", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  return (
    <main className="packages-page">
      <header className="packages-header">
        <Link to="/dashboard" className="packages-brand">
          Hotspot<span>Hub</span>
        </Link>

        <nav className="packages-navigation" aria-label="Main navigation">
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/profile">My account</Link>
        </nav>
      </header>

      <section className="packages-hero">
        <span className="packages-badge">
          <span className="status-dot" />
          FLEXIBLE INTERNET PLANS
        </span>

        <h1>
          The right connection.
          <br />
          <span>Your way.</span>
        </h1>

        <p>
          Choose an internet package that fits your needs. Whether you need
          an hour of browsing or a month of connectivity, we have an option
          for you.
        </p>

        <div className="packages-hero-stats">
          <div>
            <strong>Simple</strong>
            <span>Clear pricing</span>
          </div>
          <div>
            <strong>Flexible</strong>
            <span>Different durations</span>
          </div>
          <div>
            <strong>Reliable</strong>
            <span>Managed connectivity</span>
          </div>
        </div>
      </section>

      <section className="packages-content">
        <div className="packages-section-heading">
          <div>
            <p className="packages-eyebrow">FIND YOUR PLAN</p>
            <h2>Internet packages</h2>
            <p className="packages-section-description">
              Compare available plans and choose the one that works for you.
            </p>
          </div>

          {!isLoading && !error && (
            <span className="packages-count">
              {packages.length} {packages.length === 1 ? "plan" : "plans"}{" "}
              available
            </span>
          )}
        </div>

        {isLoading && (
          <div className="packages-state" role="status" aria-live="polite">
            <span className="packages-spinner" />
            <h3>Finding your packages</h3>
            <p>Connecting to HotspotHub...</p>
          </div>
        )}

        {!isLoading && error && (
          <div className="packages-state packages-error" role="alert">
            <span className="packages-state-icon">!</span>
            <h3>We could not load your packages</h3>
            <p>{error}</p>
            <button
              type="button"
              className="packages-button"
              onClick={() => void loadPackages()}
            >
              Try again
            </button>
          </div>
        )}

        {!isLoading && !error && packages.length === 0 && (
          <div className="packages-state">
            <h3>No packages are available right now</h3>
            <p>Please check back later for available internet plans.</p>
            <button
              type="button"
              className="packages-button"
              onClick={() => void loadPackages()}
            >
              Refresh packages
            </button>
          </div>
        )}

        {!isLoading && !error && packages.length > 0 && (
          <div className="packages-grid">
            {packages.map((internetPackage, index) => {
              const isFeatured = index === packages.length - 1;

              return (
                <article
                  className={`package-card${isFeatured ? " package-card-featured" : ""}`}
                  key={internetPackage.id}
                >
                  {isFeatured && (
                    <span className="package-featured-label">
                      LONG-STAY PLAN
                    </span>
                  )}

                  <div className="package-card-top">
                    <span className="package-icon" aria-hidden="true">
                      {internetPackage.duration_hours <= 1
                        ? "◷"
                        : internetPackage.duration_hours <= 24
                          ? "◴"
                          : internetPackage.duration_hours <= 168
                            ? "◷"
                            : "✦"}
                    </span>

                    <span className="package-speed">
                      {internetPackage.speed_mbps} Mbps
                    </span>
                  </div>

                  <h3>{internetPackage.name}</h3>

                  <p className="package-description">
                    {internetPackage.description ||
                      "A flexible internet plan designed for your connectivity needs."}
                  </p>

                  <div className="package-price">
                    <span className="package-currency">KES</span>
                    <strong>{formatPrice(internetPackage.price)}</strong>
                  </div>

                  <p className="package-duration">
                    {internetPackage.duration_display}
                  </p>

                  <div className="package-divider" />

                  <ul className="package-features">
                    <li>
                      <span className="package-check" aria-hidden="true">
                        ✓
                      </span>
                      <span>
                        <strong>{internetPackage.speed_mbps} Mbps</strong>
                        <small>Internet speed</small>
                      </span>
                    </li>

                    <li>
                      <span className="package-check" aria-hidden="true">
                        ✓
                      </span>
                      <span>
                        <strong>{internetPackage.duration_display}</strong>
                        <small>Package duration</small>
                      </span>
                    </li>

                    <li>
                      <span className="package-check" aria-hidden="true">
                        ✓
                      </span>
                      <span>
                        <strong>{internetPackage.data_limit_display}</strong>
                        <small>Data allowance</small>
                      </span>
                    </li>
                  </ul>

                  <button
                    type="button"
                    className={`package-select-button${isFeatured ? " package-select-featured" : ""}`}
                    onClick={() => setSelectedPackage(internetPackage)}
                  >
                    Choose this package
                    <span aria-hidden="true">→</span>
                  </button>
                </article>
              );
            })}
          </div>
        )}

        {selectedPackage && (
          <div
            className="package-selection"
            role="status"
            aria-live="polite"
          >
            <div>
              <p className="packages-eyebrow">YOUR SELECTED PLAN</p>
              <h3>{selectedPackage.name}</h3>
              <p>
                KES {formatPrice(selectedPackage.price)} ·{" "}
                {selectedPackage.duration_display} ·{" "}
                {selectedPackage.speed_mbps} Mbps
              </p>
              <p className="package-selection-note">
                Your selection is saved on this page. Checkout and internet
                activation are not yet connected.
              </p>
            </div>

            <button
              type="button"
              className="package-selection-close"
              onClick={() => setSelectedPackage(null)}
              aria-label="Clear selected package"
            >
              Clear selection
            </button>
          </div>
        )}
      </section>

      <footer className="packages-footer">
        <Link to="/">HotspotHub</Link>
        <p>Smarter connectivity. Simpler choices.</p>
      </footer>
    </main>
  );
}

export default PackagesPage;
