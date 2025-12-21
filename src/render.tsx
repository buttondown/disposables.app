/** @jsx jsx */
/** @jsxImportSource hono/jsx */

import { Fragment } from "hono/jsx";
import { renderToString } from "hono/jsx/dom/server";
import { getAllServices, type DisposableService } from "./data";

const services = getAllServices();

const getFaviconUrl = (domain: string) => {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
};

const FallbackIcon = () => (
  <span class="fallback-icon">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  </span>
);

const ExternalLinkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const CopyIcon = () => (
  <svg
    class="copy-icon"
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="m4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

const CheckIcon = () => (
  <svg
    class="check-icon"
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    style="display: none;"
  >
    <polyline points="20,6 9,17 4,12" />
  </svg>
);

const GitHubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
    />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <line
      x1="18"
      y1="6"
      x2="6"
      y2="18"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
    />
    <line
      x1="6"
      y1="6"
      x2="18"
      y2="18"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
    />
  </svg>
);

const renderStatus = (status: DisposableService["status"]) => {
  return (
    <span class={`status-badge ${status}`}>
      <span class="status-dot" />
      {status}
    </span>
  );
};

const renderFeature = (enabled: boolean) => {
  return enabled ? (
    <span class="feature-yes">Yes</span>
  ) : (
    <span class="feature-no">No</span>
  );
};

export const Rendered = renderToString(
  <Fragment>
    <header>
      <div class="left">
        <h1>Disposables.app</h1>
        <span class="slash"></span>
        <p>An open-source database of disposable email domains</p>
      </div>
      <div class="right">
        <a
          class="github"
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/buttondown/disposables.email"
        >
          <GitHubIcon />
        </a>
        <div class="search-container">
          <input type="text" id="search" placeholder="Search domains" />
          <span class="search-shortcut">⌘K</span>
        </div>
        <button id="help">How to use</button>
      </div>
    </header>
    <table>
      <thead>
        <tr>
          <th class="sortable" data-type="text">
            Domain <span class="sort-indicator"></span>
          </th>
          <th class="sortable" data-type="text">
            Status <span class="sort-indicator"></span>
          </th>
          <th class="sortable" data-type="text">
            Pricing <span class="sort-indicator"></span>
          </th>
          <th class="sortable" data-type="text">
            Retention <span class="sort-indicator"></span>
          </th>
          <th class="sortable" data-type="boolean">
            API <span class="sort-indicator"></span>
          </th>
          <th class="sortable" data-type="boolean">
            Custom Inbox <span class="sort-indicator"></span>
          </th>
          <th class="sortable" data-type="boolean">
            Attachments <span class="sort-indicator"></span>
          </th>
          <th class="sortable" data-type="boolean">
            Replyable <span class="sort-indicator"></span>
          </th>
          <th class="sortable" data-type="number">
            Domains <span class="sort-indicator"></span>
          </th>
          <th>Website</th>
        </tr>
      </thead>
      <tbody>
        {services.map((service) => (
          <tr key={service.domain} data-domain={service.domain}>
            <td>
              <div class="domain-cell">
                <img
                  src={getFaviconUrl(service.domain)}
                  alt=""
                  loading="lazy"
                  onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"
                />
                <FallbackIcon />
                <span class="domain-text">{service.domain}</span>
                <button
                  class="copy-button"
                  onclick={`copyDomain(this, '${service.domain}')`}
                  title="Copy domain"
                >
                  <CopyIcon />
                  <CheckIcon />
                </button>
              </div>
            </td>
            <td>{renderStatus(service.status)}</td>
            <td>{service.pricing}</td>
            <td>{service.retention || "-"}</td>
            <td>{renderFeature(service.features.api)}</td>
            <td>{renderFeature(service.features.customInbox)}</td>
            <td>{renderFeature(service.features.attachments)}</td>
            <td>{renderFeature(service.features.replyable)}</td>
            <td>{service.domainCount}</td>
            <td>
              {service.website ? (
                <a
                  class="website-link"
                  href={service.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={service.website}
                >
                  <ExternalLinkIcon />
                </a>
              ) : (
                "-"
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <div class="stats-bar">
      <span>
        Showing <span class="count" id="visible-count">{services.length}</span> of{" "}
        <span class="count">{services.length}</span> domains
      </span>
    </div>
    <dialog id="modal">
      <div class="header">
        <h2>How to use</h2>
        <button id="close">
          <CloseIcon />
        </button>
      </div>
      <div class="body">
        <h2>What are disposable emails?</h2>
        <p>
          Disposable email addresses (DEAs), also known as throwaway emails or
          temporary emails, are email addresses that are used for a short period
          of time and then discarded. They are commonly used to:
        </p>
        <ul>
          <li>Sign up for services without revealing your real email</li>
          <li>Avoid spam and marketing emails</li>
          <li>Test email functionality during development</li>
          <li>Maintain privacy when registering for websites</li>
        </ul>

        <h2>API</h2>
        <p>
          You can access the full database through our JSON API. Use it to validate
          email addresses or block signups from disposable domains.
        </p>
        <div class="code-block">
          <code>curl https://disposables.app/api.json</code>
        </div>
        <p>
          The API returns an array of all disposable email domains with their
          metadata including status, features, and pricing information.
        </p>

        <h2>Use Cases</h2>
        <ul>
          <li>
            <b>Block fake signups:</b> Validate email addresses during
            registration to prevent users from signing up with disposable emails
          </li>
          <li>
            <b>Email validation:</b> Check if an email domain is known to be
            disposable before sending important communications
          </li>
          <li>
            <b>Research:</b> Find temporary email services for testing or privacy
            purposes
          </li>
          <li>
            <b>Security:</b> Identify potentially fraudulent accounts using
            disposable emails
          </li>
        </ul>

        <h2>Contributing</h2>
        <p>
          This is an open-source project! If you find a disposable email domain
          that's not in our database, or if you notice incorrect information,
          please contribute by submitting a pull request on GitHub.
        </p>
        <p>
          We especially welcome contributions that add detailed metadata for
          existing domains, such as:
        </p>
        <ul>
          <li>Website URLs</li>
          <li>Feature information (API, attachments, etc.)</li>
          <li>Pricing details</li>
          <li>Status updates (active/inactive)</li>
        </ul>
      </div>
      <div class="footer">
        <a
          href="https://github.com/buttondown/disposables.email"
          target="_blank"
          rel="noopener noreferrer"
        >
          Edit on GitHub
        </a>
        <a href="https://models.dev" target="_blank" rel="noopener noreferrer">
          Design by models.dev
        </a>
        <a href="https://buttondown.com" target="_blank" rel="noopener noreferrer">
          Created by Buttondown
        </a>
      </div>
    </dialog>
  </Fragment>
);

export { services };
