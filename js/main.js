const slides = [
  {
    src: "general_banner_1.jpg",
    alt: "Команда центра на стенде с демонстрацией разработок"
  },
  {
    src: "general_banner_2.jpg",
    alt: "Участники III Байкальского ИТ-форума 2026"
  },
  {
    src: "general_banner_3.jpg",
    alt: "Разработчик за ноутбуком с кодом"
  },
  {
    src: "general_banner_4.jpg",
    alt: "Команда с грамотами и кубком на III Байкальском ИТ-форуме 2026"
  }
];

const form = document.querySelector("#consult-form");
const success = document.querySelector(".consult__success");
const mobileNav = document.querySelector("#mobile-nav");
const burger = document.querySelector(".burger");
const dropItem = document.querySelector(".nav__item");
const dropButton = document.querySelector(".nav__link--drop");

function clearErrors() {
  form.querySelectorAll(".is-error").forEach((node) => node.classList.remove("is-error"));
  form.querySelectorAll(".field__hint").forEach((node) => {
    node.textContent = "";
  });
}

function setError(input, message) {
  input.classList.add("is-error");
  const hint = input.closest("label")?.querySelector(".field__hint") || form.querySelector(".field__hint--check");
  if (hint) hint.textContent = message;
}

function validate() {
  clearErrors();
  const name = form.elements.name;
  const phone = form.elements.phone;
  const consent = form.elements.consent;
  let ok = true;

  if (name.value.trim().length < 2) {
    setError(name, "Укажите имя");
    ok = false;
  }

  const digits = phone.value.replace(/\D/g, "");
  if (digits.length < 10) {
    setError(phone, "Укажите номер телефона");
    ok = false;
  }

  if (!consent.checked) {
    consent.closest(".check").classList.add("is-error");
    form.querySelector(".field__hint--check").textContent = "Нужно согласие на обработку данных";
    ok = false;
  }

  return ok;
}

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validate()) return;
    form.hidden = true;
    success.hidden = false;
  });

  form.addEventListener("input", (event) => {
    const target = event.target;
    if (target.classList.contains("is-error")) target.classList.remove("is-error");
    const hint = target.closest("label")?.querySelector(".field__hint");
    if (hint) hint.textContent = "";
    if (target.name === "consent") {
      target.closest(".check").classList.remove("is-error");
      form.querySelector(".field__hint--check").textContent = "";
    }
  });
}

function closeDrop() {
  dropItem.classList.remove("is-open");
  dropButton.setAttribute("aria-expanded", "false");
}

dropButton.addEventListener("click", () => {
  const open = dropItem.classList.toggle("is-open");
  dropButton.setAttribute("aria-expanded", String(open));
});

document.addEventListener("click", (event) => {
  if (!dropItem.contains(event.target)) closeDrop();
});

function openMobileNav() {
  mobileNav.hidden = false;
  burger.setAttribute("aria-expanded", "true");
  document.body.classList.add("no-scroll");
}

function closeMobileNav() {
  mobileNav.hidden = true;
  burger.setAttribute("aria-expanded", "false");
  document.body.classList.remove("no-scroll");
}

burger.addEventListener("click", openMobileNav);
mobileNav.querySelector(".nav-panel__close").addEventListener("click", closeMobileNav);

const mobileDrop = mobileNav.querySelector(".nav-panel__drop");
const mobileSub = mobileNav.querySelector(".nav-panel__sub");
mobileDrop.addEventListener("click", () => {
  const open = mobileSub.hidden;
  mobileSub.hidden = !open;
  mobileDrop.setAttribute("aria-expanded", String(open));
});

mobileNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMobileNav);
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!mobileNav.hidden) closeMobileNav();
  else closeDrop();
});

const frame = document.querySelector(".gallery__frame img");
const dots = document.querySelector(".gallery__dots");
let slideIndex = 0;

function renderSlide(index) {
  slideIndex = (index + slides.length) % slides.length;
  frame.src = slides[slideIndex].src;
  frame.alt = slides[slideIndex].alt;
  dots.querySelectorAll("button").forEach((dot, i) => {
    dot.setAttribute("aria-current", String(i === slideIndex));
  });
}

if (frame && dots) {
  slides.forEach((slide, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Слайд ${index + 1}`);
    dot.addEventListener("click", () => renderSlide(index));
    dots.appendChild(dot);
  });

  renderSlide(0);

  document.querySelector(".gallery__arrow--prev").addEventListener("click", () => {
    renderSlide(slideIndex - 1);
  });

  document.querySelector(".gallery__arrow--next").addEventListener("click", () => {
    renderSlide(slideIndex + 1);
  });
}

document.querySelectorAll('a[href="#policy"]').forEach((link) => {
  link.addEventListener("click", (event) => event.preventDefault());
});

const tabs = document.querySelector(".tabs");
if (tabs) {
  const cards = [...document.querySelectorAll(".case")];
  const empty = document.querySelector(".cases-empty");

  tabs.addEventListener("click", (event) => {
    const button = event.target.closest(".tab");
    if (!button) return;

    tabs.querySelectorAll(".tab").forEach((tab) => {
      const selected = tab === button;
      tab.classList.toggle("is-active", selected);
      tab.setAttribute("aria-selected", String(selected));
    });

    const filter = button.dataset.filter;
    let shown = 0;
    cards.forEach((card) => {
      const tags = (card.dataset.tags || "").split(/\s+/);
      const visible = filter === "all" || tags.includes(filter);
      card.hidden = !visible;
      if (visible) shown += 1;
    });
    if (empty) empty.hidden = shown > 0;

    const url = new URL(location.href);
    if (filter === "all") url.searchParams.delete("filter");
    else url.searchParams.set("filter", filter);
    history.replaceState(null, "", url);
  });

  const initial = new URLSearchParams(location.search).get("filter");
  const start = initial && tabs.querySelector(`.tab[data-filter="${initial}"]`);
  if (start) start.click();
}
