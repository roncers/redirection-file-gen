import { createRedirectDocument } from "./redirect-document";
import styles from "./assets/styles/main.css?inline";
import tags from "./tags.html?raw";

const DEFAULT_FILE_NAME = "output";
const MAX_FILE_NAME_LENGTH = 120;

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
  private readonly fileNameInput: HTMLInputElement;
  private readonly fileNameLabel: HTMLElement;
  private readonly errorMessage: HTMLElement;
  private readonly downloadButton: HTMLButtonElement;
  private documentContent = "";

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    this.root.append(template.content.cloneNode(true));

    this.form = this.root.querySelector("form")!;
    this.destinationInput = this.root.querySelector("#destination")!;
    this.schemeSelect = this.root.querySelector("#scheme")!;
    this.fileNameInput = this.root.querySelector("#filename")!;
    this.fileNameLabel = this.root.querySelector("#file-label")!;
    this.errorMessage = this.root.querySelector("#error-message")!;
    this.downloadButton = this.root.querySelector(".download")!;

    this.form.addEventListener("submit", (event) => {
      event.preventDefault();
      this.download();
    });
    this.destinationInput.addEventListener("input", () => this.refresh());
    this.fileNameInput.addEventListener("input", () => this.refresh());
    this.schemeSelect.addEventListener("change", () => this.refresh());

    this.refresh();
  }

  private refresh(): void {
    this.stripScheme();
    this.updateFileNameLabel();

    this.errorMessage.textContent = "";
    this.documentContent = "";
    this.downloadButton.disabled = true;

    if (!this.destinationInput.value.trim()) {
      return;
    }

    try {
      this.documentContent = createRedirectDocument(this.destinationUrl());
    } catch (error: unknown) {
      this.errorMessage.textContent =
        error instanceof Error ? error.message : "Unable to create the redirect file.";
      return;
    }

    this.downloadButton.disabled = false;
  }

  private stripScheme(): void {
    const value = this.destinationInput.value;
    const stripped = value.replace(/^(?:https?:)?\/\//i, "");

    if (stripped !== value) {
      this.destinationInput.value = stripped;
    }
  }

  private destinationUrl(): string {
    const value = this.destinationInput.value
      .trim()
      .replace(/^(?:https?:)?\/\//i, "");

    return `${this.schemeSelect.value}://${value}`;
  }

  private updateFileNameLabel(): void {
    this.fileNameLabel.textContent = this.outputFileName();
  }

  private outputFileName(): string {
    const name = this.fileNameInput.value
      .trim()
      .replace(/\.html$/i, "")
      .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "")
      .replace(/^\.+/, "")
      .slice(0, MAX_FILE_NAME_LENGTH)
      .replace(/[. ]+$/, "")
      .trim();

    return `${name || DEFAULT_FILE_NAME}.html`;
  }

  private download(): void {
    if (!this.documentContent) {
      return;
    }

    const file = new Blob([this.documentContent], { type: "text/html;charset=utf-8" });
    const downloadUrl = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = this.outputFileName();
    link.hidden = true;
    this.root.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
  }
}

customElements.define("redirect-generator", RedirectGenerator);
