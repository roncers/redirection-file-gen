import { createRedirectDocument } from "./redirect-document";
import styles from "./assets/styles/main.css?inline";
import tags from "./tags.html?raw";

const template = document.createElement("template");
template.innerHTML = `
  <style>
    ${styles}
  </style>
  ${tags}
`;

class RedirectGenerator extends HTMLElement {
  private readonly root: ShadowRoot;
  private readonly form: HTMLFormElement;
  private readonly destinationInput: HTMLInputElement;
  private readonly schemeSelect: HTMLSelectElement;
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
    this.schemeSelect = this.root.querySelector("#scheme")!;
    this.errorMessage = this.root.querySelector("#error-message")!;
    this.result = this.root.querySelector(".result")!;
    this.generatedCode = this.root.querySelector("#generated-code")!;
    this.downloadButton = this.root.querySelector(".download")!;

    this.form.addEventListener("submit", (event) => this.generate(event));
    this.destinationInput.addEventListener("input", () => {
      this.errorMessage.textContent = "";
      this.stripScheme();
      this.invalidateResult();
    });
    this.schemeSelect.addEventListener("change", () => {
      this.errorMessage.textContent = "";
      this.invalidateResult();
    });
    this.downloadButton.addEventListener("click", () => this.download());
  }

  private stripScheme(): void {
    const value = this.destinationInput.value;
    const stripped = value.replace(/^(?:https?:)?\/\//i, "");

    if (stripped !== value) {
      this.destinationInput.value = stripped;
    }
  }

  private invalidateResult(): void {
    this.result.hidden = true;
    this.documentContent = "";
  }

  private destinationUrl(): string {
    const value = this.destinationInput.value
      .trim()
      .replace(/^(?:https?:)?\/\//i, "");

    return `${this.schemeSelect.value}://${value}`;
  }

  private generate(event: SubmitEvent): void {
    event.preventDefault();
    this.errorMessage.textContent = "";

    try {
      this.documentContent = createRedirectDocument(this.destinationUrl());
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
