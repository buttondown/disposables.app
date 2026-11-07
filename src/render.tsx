/** @jsx jsx */
/** @jsxImportSource hono/jsx */

import { Fragment } from "hono/jsx";
import { renderToString } from "hono/jsx/dom/server";
import { getAllServices } from "./data";
import { COLUMNS, PAGE_SIZE, defaultOrder, renderRow } from "./row";

const services = getAllServices();
const initialRows = [...services].sort(defaultOrder).slice(0, PAGE_SIZE);

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
          href="https://github.com/buttondown/disposables.app"
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
          {COLUMNS.map((column) => (
            <th class="sortable" data-type={column.type} data-key={column.key}>
              {column.label} <span class="sort-indicator"></span>
            </th>
          ))}
          <th>Website</th>
        </tr>
      </thead>
      <tbody
        dangerouslySetInnerHTML={{ __html: initialRows.map(renderRow).join("") }}
      ></tbody>
    </table>
    <div class="load-more">
      <button id="load-more" hidden={initialRows.length >= services.length}>
        Show more
      </button>
    </div>
    <div class="stats-bar">
      <span>
        Showing{" "}
        <span class="count" id="visible-count">
          {initialRows.length.toLocaleString("en-US")}
        </span>{" "}
        of{" "}
        <span class="count" id="matching-count">
          {services.length.toLocaleString("en-US")}
        </span>{" "}
        domains
        <span id="total-note" hidden>
          {" "}
          (<span class="count">{services.length.toLocaleString("en-US")}</span>{" "}
          total)
        </span>
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
          You can access the full database through our JSON API. Use it to
          validate email addresses or block signups from disposable domains.
        </p>
        <div class="code-block">
          <code>curl https://disposables.app/api.json</code>
        </div>
        <p>
          The API returns an array of all disposable email domains with their
          metadata including status, features, and pricing information.
          Alternate domains for a service are nested under{" "}
          <code>altDomains</code>.
        </p>
        <p>
          If you only need the domains, use the plain-text list instead. It has
          one domain per line, alternate domains included.
        </p>
        <div class="code-block">
          <code>curl https://disposables.app/domains.txt</code>
        </div>

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
            <b>Research:</b> Find temporary email services for testing or
            privacy purposes
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
          href="https://github.com/buttondown/disposables.app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Edit on GitHub
        </a>
        <a href="https://models.dev" target="_blank" rel="noopener noreferrer">
          Design by models.dev
        </a>
        <a
          href="https://buttondown.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Created by Buttondown
        </a>
      </div>
    </dialog>
  </Fragment>
);

export { services };
