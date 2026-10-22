import { createRedirectDocument } from "./redirect-document";

const template = document.createElement("template");
template.innerHTML = `
  <style>
    :host {
      display: block;
      min-height: 100vh;
      color: #18213c;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background:
        radial-gradient(ellipse at 90% 0%, rgb(203 218 255 / 55%), transparent 34rem),
        #f7f8fc;
    }

    * {
      box-sizing: border-box;
    }

    .page {
      width: min(1060px, calc(100% - 48px));
      margin: 0 auto;
      padding: 40px 0 64px;
    }

    header {
      display: flex;
      align-items: center;
      gap: 11px;
      color: #35436d;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: -0.01em;
    }

    .mark {
      display: grid;
      width: 34px;
      height: 34px;
      place-items: center;
      border-radius: 11px;
      color: #fff;
      background: #435edb;
      box-shadow: 0 5px 14px rgb(67 94 219 / 24%);
    }

    main {
      display: grid;
      grid-template-columns: minmax(0, 0.9fr) minmax(380px, 1.1fr);
      align-items: center;
      gap: clamp(42px, 8vw, 96px);
      padding: clamp(64px, 12vh, 120px) 0 50px;
    }

    .eyebrow {
      margin: 0 0 18px;
      color: #536bd0;
      font-size: 12px;
      font-weight: 750;
      letter-spacing: 0.13em;
      text-transform: uppercase;
    }

    h1 {
      max-width: 460px;
      margin: 0;
      font-size: clamp(42px, 6vw, 64px);
      font-weight: 730;
      letter-spacing: -0.065em;
      line-height: 1.04;
    }

    .intro {
      max-width: 430px;
      margin: 22px 0 0;
      color: #69738d;
      font-size: 17px;
      line-height: 1.7;
    }

    .card {
      padding: clamp(24px, 4vw, 36px);
      border: 1px solid #e8ebf4;
      border-radius: 22px;
      background: rgb(255 255 255 / 92%);
      box-shadow: 0 22px 70px rgb(38 52 99 / 9%);
    }

    .card h2 {
      margin: 0;
      font-size: 20px;
      letter-spacing: -0.035em;
    }

    .card-copy {
      margin: 8px 0 25px;
      color: #78819a;
      font-size: 14px;
      line-height: 1.6;
    }

    label {
      display: block;
      margin-bottom: 9px;
      color: #303b5b;
      font-size: 13px;
      font-weight: 650;
    }

    input {
      width: 100%;
      min-height: 51px;
      padding: 0 15px;
      border: 1px solid #dce1ed;
      border-radius: 10px;
      outline: none;
      color: #1d2744;
      background: #fff;
      font: inherit;
      font-size: 14px;
      transition: border-color 140ms ease, box-shadow 140ms ease;
    }

    input::placeholder {
      color: #a5adbf;
    }

    input:focus {
      border-color: #6379e2;
      box-shadow: 0 0 0 3px rgb(99 121 226 / 15%);
    }

    .hint {
      margin: 9px 0 0;
      color: #8991a7;
      font-size: 12px;
    }

    button {
      display: inline-flex;
      min-height: 48px;
      align-items: center;
      justify-content: center;
      gap: 9px;
      border: 0;
      border-radius: 10px;
      font: inherit;
      font-size: 14px;
      font-weight: 650;
      cursor: pointer;
      transition: background 140ms ease, transform 140ms ease;
    }

    button:focus-visible {
      outline: 3px solid #9caaf3;
      outline-offset: 3px;
    }

    button:active:not(:disabled) {
      transform: translateY(1px);
    }

    .generate {
      width: 100%;
      margin-top: 22px;
      color: #fff;
      background: #435edb;
    }

    .generate:hover {
      background: #354fc8;
    }

    .result {
      margin-top: 28px;
      padding-top: 24px;
      border-top: 1px solid #edf0f6;
    }

    .result[hidden] {
      display: none;
    }

    .result-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 11px;
    }

    .result-heading label {
      margin: 0;
    }

    .ready {
      color: #29866b;
      font-size: 12px;
      font-weight: 650;
    }

    textarea {
      display: block;
      width: 100%;
      min-height: 176px;
      resize: vertical;
      padding: 13px;
      border: 1px solid #e4e8f0;
      border-radius: 9px;
      color: #4c5878;
      background: #f8f9fc;
      font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
      font-size: 11px;
      line-height: 1.6;
    }

    .download {
      width: 100%;
      margin-top: 12px;
      color: #354fc8;
      background: #edf0ff;
    }

    .download:hover {
      background: #e2e7ff;
    }

    .error {
      min-height: 18px;
      margin: 9px 0 0;
      color: #b33b50;
      font-size: 12px;
    }

    footer {
      display: flex;
      justify-content: space-between;
      gap: 18px;
      color: #8a92a7;
      font-size: 12px;
    }

    @media (max-width: 760px) {
      .page {
        width: min(540px, calc(100% - 36px));
        padding-top: 24px;
      }

      main {
        grid-template-columns: 1fr;
        gap: 34px;
        padding: 62px 0 40px;
      }

      .intro {
        font-size: 15px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        scroll-behavior: auto !important;
        transition-duration: 0.01ms !important;
      }
    }
  </style>
  <div class="page">
    <header>
      <span class="mark" aria-hidden="true">↗</span>
      <span>Redirect file generator</span>
    </header>
    <main>
      <section aria-labelledby="page-title">
        <p class="eyebrow">Simple by design</p>
        <h1 id="page-title">One link.<br>One little file.</h1>
        <p class="intro">Create a lightweight HTML file that takes visitors straight to the website you choose. No accounts, no setup, just download and share.</p>
      </section>
      <section class="card" aria-labelledby="form-title">
        <h2 id="form-title">Make your redirect</h2>
        <p class="card-copy">Add the full destination URL and we’ll make your file ready to go.</p>
        <form novalidate>
          <label for="destination">Destination URL</label>
          <input
            id="destination"
            name="destination"
            type="url"
            inputmode="url"
            autocomplete="url"
            placeholder="https://example.com/your-page"
            aria-describedby="url-hint error-message"
            required
          >
          <p id="url-hint" class="hint">Use a full address starting with http:// or https://</p>
          <p id="error-message" class="error" role="alert" aria-live="polite"></p>
          <button class="generate" type="submit">
            Generate redirect file <span aria-hidden="true">→</span>
          </button>
        </form>
        <div class="result" hidden>
          <div class="result-heading">
            <label for="generated-code">Your redirect file</label>
            <span class="ready">Ready to download</span>
          </div>
          <textarea id="generated-code" aria-label="Generated HTML file" readonly spellcheck="false"></textarea>
          <button class="download" type="button">
            Download redirect.html <span aria-hidden="true">↓</span>
          </button>
        </div>
      </section>
    </main>
    <footer>
      <span>Free, private, and runs right in your browser.</span>
      <span>No data is sent anywhere.</span>
    </footer>
  </div>
`;

class RedirectGenerator extends HTMLElement {
  private readonly root: ShadowRoot;
  private readonly form: HTMLFormElement;
  private readonly destinationInput: HTMLInputElement;
  private readonly errorMessage: HTMLElement;
  private readonly result: HTMLElement;
  private readonly generatedCode: HTMLTextAreaElement;
  private readonly downloadButton: HTMLButtonElement;
  private documentContent = "";

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    this.root.append(template.content.cloneNode(true));

    this.form = this.root.querySelector("form")!;
    this.destinationInput = this.root.querySelector("#destination")!;
    this.errorMessage = this.root.querySelector("#error-message")!;
    this.result = this.root.querySelector(".result")!;
    this.generatedCode = this.root.querySelector("#generated-code")!;
    this.downloadButton = this.root.querySelector(".download")!;

    this.form.addEventListener("submit", (event) => this.generate(event));
    this.destinationInput.addEventListener("input", () => {
      this.errorMessage.textContent = "";
    });
    this.downloadButton.addEventListener("click", () => this.download());
  }

  private generate(event: SubmitEvent): void {
    event.preventDefault();
    this.errorMessage.textContent = "";

    try {
      this.documentContent = createRedirectDocument(this.destinationInput.value);
      this.generatedCode.value = this.documentContent;
      this.result.hidden = false;
    } catch (error: unknown) {
      this.documentContent = "";
      this.result.hidden = true;
      this.errorMessage.textContent =
        error instanceof Error ? error.message : "Unable to create the redirect file.";
    }
  }

  private download(): void {
    if (!this.documentContent) {
      return;
    }

    const file = new Blob([this.documentContent], { type: "text/html;charset=utf-8" });
    const downloadUrl = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "redirect.html";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
  }
}

customElements.define("redirect-generator", RedirectGenerator);
