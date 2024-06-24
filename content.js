const greekToEnglishMap = {
  "α": "a", // alpha
  "β": "b", // beta
  "γ": "g", // gamma
  "δ": "d", // delta
  "ε": "e", // epsilon
  "ζ": "z", // zeta
  "η": "h", // eta
  "θ": "t", // theta
  "ι": "i", // iota
  "κ": "k", // kappa
  "λ": "l", // lambda
  "μ": "m", // mu
  "ν": "n", // nu
  "ξ": "x", // xi
  "ο": "o", // omicron
  "π": "p", // pi
  "ρ": "r", // rho
  "σ": "s", // sigma
  "ς": "s", // final sigma
  "τ": "t", // tau
  "υ": "y", // upsilon
  "φ": "f", // phi
  "χ": "x", // chi
  "ψ": "p", // psi
  "ω": "o", // omega
};

function buttonChar(b) {
  return greekToEnglishMap[
    b.textContent[0].toLowerCase().normalize("NFD").replace(
      /[\u0300-\u036f]/g,
      "",
    )
  ] ??
    b.textContent[0].toLowerCase();
}
function setupConsole() {
  const i = FluentElement.make("iframe").style({ display: "none" }).element;
  document.body.appendChild(i);
  window.console = i.contentWindow.console;
}
class FluentElement {
  constructor(element) {
    this.element = element;
  }

  style(dict) {
    Object.assign(this.element.style, dict);
    return this;
  }

  className(name) {
    this.element.classList.add(name);
    return this;
  }

  static make(tagName) {
    return new FluentElement(document.createElement(tagName));
  }

  setAttribute(name, value) {
    this.element.setAttribute(name, value);
    return this;
  }

  setTextContent(text) {
    this.element.textContent = text;
    return this;
  }

  appendChild(child) {
    if (child instanceof FluentElement) {
      this.element.appendChild(child.element);
    } else if (child instanceof HTMLElement) {
      this.element.appendChild(child);
    }
    return this;
  }

  addEventListener(event, handler) {
    this.element.addEventListener(event, handler);
    return this;
  }

  getElement() {
    return this.element;
  }

  appendTo(parent) {
    if (parent instanceof FluentElement) {
      parent.element.appendChild(this.element);
    } else if (parent instanceof HTMLElement) {
      parent.appendChild(this.element);
    }
    return this;
  }
}
const make = (e) => FluentElement.make(e);
const wrap = (e) => new FluentElement(e);
setupConsole();
new MutationObserver((mutationList, observer) => {
  const counter = {};
  const fastLetter = {};
  const lastSelected = [...document.querySelectorAll(".eWdJ5 button")];
  const selectedLetter = !!lastSelected.slice(-1)[0]
    ? buttonChar(lastSelected.slice(-1)[0])
    : "";
  document.querySelectorAll('[data-test="word-bank"] button').forEach((b) => {
    const mychild = b.querySelector(".jack");
    const wrapped = wrap(b);
    if (selectedLetter === buttonChar(b)) {
      if (!b.classList.contains("matches-selected")) {
        b.classList.add("matches-selected");
      }
    } else {
      if (b.classList.contains("matches-selected")) {
        b.classList.remove("matches-selected");
      }
    }
    if (!!mychild) {
      return;
    }
    const letter = buttonChar(b);
    counter[letter] = (counter[letter] ?? -1) + 1;
    wrapped.appendChild(
      make("div").className("jack").setTextContent(
        counter[letter] === 0 ? letter : counter[letter],
      ).style({
        position: "absolute",
        "right": "-10px",
        "bottom": "-10px",
        "background-color": "white",
        "margin": "2px",
        "padding": "2px",
        "border-radius": "2px",
        "border": "solid 1px black",
        "font-size": 7,
        "color": "rgb(170 26 26)",
        "font-weight": "bold",
      }).element,
    );
    if (counter[letter]) {
      let myFast = letter;
      if (fastLetter[letter]) {
        for (const newLetter of "asdfjklgh") {
          if (fastLetter[newLetter]) {
            continue;
          }
          myFast = newLetter;
          break;
        }
      }
      fastLetter[myFast] = true;
      wrap(b).appendChild(
        make("div").className("fast").setTextContent(
          myFast.toUpperCase(),
        ).style({
          position: "absolute",
          "right": "-10px",
          "top": "-10px",
          "background-color": "white",
          "margin": "2px",
          "padding": "2px",
          "border-radius": "2px",
          "border": "solid 1px black",
          "font-size": 7,
          "color": "blue",
          "font-weight": "bold",
        }).element,
      );
    }
  });
}).observe(
  document,
  { childList: true, subtree: true, attributes: true },
);

class Manager {
  constructor() {
    this.last = -1;
  }
  async delete() {
    const array = new Array(...document.querySelectorAll(".eWdJ5 button"));
    array.slice(-1)[0].click();
    await Promise.resolve();
  }
}

const manager = new Manager();
document.addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    return;
  }
  if (event.key.toLowerCase() === "backspace") {
    await manager.delete();
    event.stopImmediatePropagation();
    event.stopPropagation();
    return;
  }
  if (/^[a-zA-Z]/.test(event.key)) {
    event.stopImmediatePropagation();
    event.stopPropagation();
    return;
  }
  const key = event.key;
  if (key === ";") {
    const lastTile =
      new Array(...document.querySelectorAll(".eWdJ5 button")).slice(-1)[0];
    if (!!!lastTile) {
      return;
    }
    const last = buttonChar(lastTile);
    event.stopPropagation();
    event.stopImmediatePropagation();

    await manager.delete();
    for (
      const [i, b] of [
        ...document.querySelectorAll(
          '[data-test="word-bank"] button',
        )
          .entries(),
      ].slice(manager.last + 1).filter(([_, v]) => v.ariaDisabled === "false")
    ) {
      if (last === buttonChar(b)) {
        event.stopPropagation();
        b.click();
        manager.last = i;
        return;
      }
    }
    manager.last = -1;
    for (
      const [i, b] of document.querySelectorAll(
        '[data-test="word-bank"] button',
      )
        .entries().filter(([_, v]) => v.ariaDisabled === "false")
    ) {
      if (last === buttonChar(b)) {
        event.stopPropagation();
        b.click();
        manager.last = i;
        return;
      }
    }
  }
  if (/^\d$/.test(key)) {
    const lastTile =
      new Array(...document.querySelectorAll(".eWdJ5 button")).slice(-1)[0];
    if (!!!lastTile) {
      return;
    }
    const last = buttonChar(lastTile);
    event.stopPropagation();
    event.stopImmediatePropagation();
    manager.last = -1;
    for (
      const [i, b] of document.querySelectorAll(
        '[data-test="word-bank"] button',
      )
        .entries().filter(([_, v]) => v.ariaDisabled === "false")
    ) {
      if (
        key === b.querySelector(".jack").textContent &&
        buttonChar(b) === last
      ) {
        await manager.delete();
        b.click();
        return;
      }
    }
  }
}, true);
document.addEventListener("keypress", async (event) => {
  if (event.key === "?") {
    document.querySelector("._1fdKO button")?.click();
    document.querySelector("._1GJVt")?.click();
    event.stopPropagation();
    return;
  }
  if (/^[A-Z]$/.test(event.key)) {
    for (
      const [i, b] of document.querySelectorAll(
        '[data-test="word-bank"] button',
      )
        .entries().filter(([_, v]) => v.ariaDisabled === "false")
    ) {
      const fast = b.querySelector(".fast");
      if (fast && event.key === fast.textContent) {
        event.stopPropagation();
        b.click();
        manager.last = i;
        return;
      }
    }
    return;
  }
  let key = event.key.toLowerCase();
  for (
    const [i, b] of document.querySelectorAll(
      '[data-test="word-bank"] button',
    )
      .entries().filter(([_, v]) => v.ariaDisabled === "false")
  ) {
    if (key === buttonChar(b)) {
      event.stopPropagation();
      b.click();
      manager.last = i;
      return;
    }
  }
}, true);
