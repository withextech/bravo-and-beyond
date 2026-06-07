const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector(".mobile-nav");
const revealItems = document.querySelectorAll(".reveal");
const helpSection = document.querySelector(".help");
const helpLeft = document.querySelector(".help-left");
const orbit = document.querySelector(".media-orbit");
const bubbles = document.querySelectorAll(".media-orbit .bubble");
const helpSwitcher = document.querySelector(".help-switcher");
const helpCount = document.querySelector("[data-help-count]");
const helpTitle = document.querySelector("[data-help-title]");
const helpCopy = document.querySelector("[data-help-copy]");
const helpDots = document.querySelectorAll("[data-help-dot]");
const contactForm = document.querySelector(".contact-form");
const campaignCards = document.querySelectorAll("[data-campaign-card]");
const campaignControls = document.querySelectorAll("[data-campaign-control]");
const talentSearch = document.querySelector("[data-talent-search]");
const talentFilters = document.querySelectorAll("[data-talent-filter]");
const talentCards = document.querySelectorAll(".talent-card");
const talentEmpty = document.querySelector("[data-talent-empty]");
const serviceCards = document.querySelectorAll("[data-service-card]");
const dealsCounter = document.querySelector("[data-deals-counter]");
const dealsNumber = document.querySelector("[data-deals-number]");
const talentModal = document.querySelector("[data-talent-modal]");
const talentModalImage = document.querySelector("[data-modal-image]");
const talentModalName = document.querySelector("[data-modal-name]");
const talentModalCategory = document.querySelector("[data-modal-category]");
const talentModalEmail = document.querySelector("[data-modal-email]");
const talentModalBio = document.querySelector("[data-modal-bio]");
const talentModalVideos = document.querySelectorAll("[data-talent-video]");
const talentCloseButtons = document.querySelectorAll("[data-talent-close]");
const talentSocialLinks = {
  instagram: document.querySelector("[data-social-instagram]"),
  tiktok: document.querySelector("[data-social-tiktok]"),
  facebook: document.querySelector("[data-social-facebook]"),
  youtube: document.querySelector("[data-social-youtube]"),
};

bubbles.forEach((bubble) => {
  const media = bubble.querySelector("img, video");
  if (!media || media.parentElement.classList.contains("bubble-media")) return;

  const mediaFrame = document.createElement("span");
  mediaFrame.className = "bubble-media";
  bubble.insertBefore(mediaFrame, media);
  mediaFrame.appendChild(media);
});

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

if (menuToggle && mobileNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const helpSteps = [
  {
    count: "Talent Matching",
    title: "Find the Right Voices",
    copy: "Talent recommendations shaped by audience, niche, personality, and campaign fit.",
  },
  {
    count: "Creative Direction",
    title: "Shape the Campaign Story",
    copy: "Briefs, content angles, and deliverables aligned before creators start producing.",
  },
  {
    count: "Campaign Management",
    title: "Manage the Rollout",
    copy: "Coordination across talent, approvals, posting windows, and campaign follow-through.",
  },
];

let activeHelpStep = 0;

const setHelpStep = (index) => {
  if (!helpSwitcher || index === activeHelpStep) return;
  activeHelpStep = index;
  helpSwitcher.classList.add("is-changing");
  window.setTimeout(() => {
    const step = helpSteps[index];
    helpCount.textContent = step.count;
    helpTitle.textContent = step.title;
    helpCopy.textContent = step.copy;
    helpDots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === index);
    });
    helpSwitcher.classList.remove("is-changing");
  }, 120);
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));

if (dealsCounter && dealsNumber) {
  const dealsObserver = new IntersectionObserver(
    ([entry], observer) => {
      if (!entry.isIntersecting) return;

      const target = 1200;
      const duration = 1700;
      const startTime = performance.now();

      const rollNumber = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        dealsNumber.textContent = Math.floor(target * eased).toLocaleString();
        if (progress < 1) window.requestAnimationFrame(rollNumber);
      };

      window.requestAnimationFrame(rollNumber);
      observer.unobserve(entry.target);
    },
    { threshold: 0.2 }
  );

  dealsObserver.observe(dealsCounter);
}

let mobileHelpPinStart = null;
let mobileHelpViewportWidth = null;

const updateOrbit = () => {
  if (!orbit || !helpSection) return;
  const rect = helpSection.getBoundingClientRect();
  const isMobileHelp = window.innerWidth <= 620;
  const isDesktopHelp = window.innerWidth >= 981;
  const viewportChanged = mobileHelpViewportWidth !== window.innerWidth;

  if (viewportChanged) {
    mobileHelpViewportWidth = window.innerWidth;
    mobileHelpPinStart = null;
  }

  if (isMobileHelp && helpLeft && mobileHelpPinStart === null) {
    mobileHelpPinStart = window.scrollY + helpLeft.getBoundingClientRect().top;
  }

  const shouldPinMobileHelp =
    isMobileHelp &&
    mobileHelpPinStart !== null &&
    window.scrollY >= mobileHelpPinStart &&
    rect.bottom >= window.innerHeight;

  helpSection.classList.toggle(
    "is-mobile-pinned",
    shouldPinMobileHelp
  );
  helpSection.classList.toggle(
    "is-mobile-ended",
    isMobileHelp && rect.bottom < window.innerHeight
  );
  helpSection.classList.toggle(
    "is-desktop-pinned",
    isDesktopHelp && rect.top <= 0 && rect.bottom >= window.innerHeight
  );
  helpSection.classList.toggle(
    "is-desktop-ended",
    isDesktopHelp && rect.bottom < window.innerHeight
  );

  const rawProgress = Math.min(
    Math.max(-rect.top / (rect.height - window.innerHeight), 0),
    1
  );
  const progress = Math.min(Math.max(rawProgress + 0.08, 0), 1);

  const stepIndex = rawProgress < 0.36 ? 0 : rawProgress < 0.72 ? 1 : 2;
  setHelpStep(stepIndex);

  const bubbleStarts = [-0.22, -0.12, -0.04, 0.05, 0.18, 0.34, 0.5];

  bubbles.forEach((bubble, index) => {
    const start = bubbleStarts[index] ?? -0.12 + index * 0.12;
    const end = index === bubbles.length - 1 ? 1.04 : start + 0.78;
    const localProgress = Math.min(Math.max((progress - start) / (end - start), 0), 1);
    const isMobile = window.innerWidth <= 620;
    const y = isMobile ? 190 - localProgress * 390 : 430 - localProgress * 690;
    const scale = 0.8 + localProgress * 0.2;
    const fadeOut = localProgress > 0.94 ? (1 - localProgress) / 0.06 : 1;
    const opacity = localProgress <= 0.015 ? 0 : Math.max(0, Math.min(localProgress * 2.1, fadeOut));

    bubble.classList.toggle("is-active", opacity > 0.12);
    bubble.style.opacity = opacity.toFixed(3);
    bubble.style.setProperty("--bubble-y", `${y.toFixed(1)}px`);
    bubble.style.setProperty("--bubble-scale", scale.toFixed(3));
  });
};

updateOrbit();
window.addEventListener("scroll", updateOrbit, { passive: true });
window.addEventListener("resize", updateOrbit);

let orbitFrame = null;
const syncOrbit = () => {
  updateOrbit();
  orbitFrame = window.requestAnimationFrame(syncOrbit);
};

if (orbit && !orbitFrame) {
  orbitFrame = window.requestAnimationFrame(syncOrbit);
}

let activeCampaign = 0;

const shortestCarouselDistance = (index, active, total) => {
  let distance = index - active;
  if (distance > total / 2) distance -= total;
  if (distance < -total / 2) distance += total;
  return distance;
};

const playVideo = (video) => {
  if (!video) return;
  const playPromise = video.play();
  if (playPromise) playPromise.catch(() => {});
};

const setActiveCampaign = (index, resetVideo = true) => {
  if (!campaignCards.length) return;
  activeCampaign = (index + campaignCards.length) % campaignCards.length;

  campaignCards.forEach((card, cardIndex) => {
    const video = card.querySelector("video");
    const distance = shortestCarouselDistance(cardIndex, activeCampaign, campaignCards.length);
    const abs = Math.abs(distance);
    const isActive = distance === 0;
    const x = distance * 205;
    const scale = isActive ? 1 : abs === 1 ? 0.68 : 0.48;
    const opacity = isActive ? 1 : abs === 1 ? 0.55 : 0.28;
    const z = 10 - abs;

    card.classList.toggle("is-active", isActive);
    card.style.setProperty("--x", `${x}px`);
    card.style.setProperty("--scale", scale);
    card.style.setProperty("--opacity", opacity);
    card.style.setProperty("--z", z);
    card.style.setProperty("--gray", isActive ? 0 : 1);
    card.style.setProperty("--bright", isActive ? 1 : 0.58);

    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.loop = !isActive;
    if (isActive && resetVideo) video.currentTime = 0;
    playVideo(video);
  });

  campaignControls.forEach((control, controlIndex) => {
    control.classList.toggle("is-active", controlIndex === activeCampaign);
  });
};

campaignControls.forEach((control) => {
  control.addEventListener("click", () => {
    setActiveCampaign(Number(control.dataset.campaignControl));
  });
});

campaignCards.forEach((card, index) => {
  const video = card.querySelector("video");
  video.addEventListener("ended", () => {
    if (index === activeCampaign) setActiveCampaign(activeCampaign + 1);
  });
});

if (campaignCards.length) setActiveCampaign(0, false);

const campaignObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        campaignCards.forEach((card) => playVideo(card.querySelector("video")));
      }
    });
  },
  { threshold: 0.2 }
);

const campaignSection = document.querySelector(".campaigns");
if (campaignSection) campaignObserver.observe(campaignSection);

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
  });
}

let activeTalentFilter = "all";

const updateTalentDirectory = () => {
  if (!talentCards.length) return;
  const query = talentSearch ? talentSearch.value.trim().toLowerCase() : "";
  let visibleCount = 0;

  talentCards.forEach((card) => {
    const name = card.dataset.name.toLowerCase();
    const category = card.dataset.category.toLowerCase();
    const matchesFilter = activeTalentFilter === "all" || category.includes(activeTalentFilter);
    const matchesQuery = !query || name.includes(query) || category.includes(query);
    const isVisible = matchesFilter && matchesQuery;

    card.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });

  if (talentEmpty) {
    talentEmpty.classList.toggle("is-visible", visibleCount === 0);
  }
};

talentFilters.forEach((button) => {
  button.addEventListener("click", () => {
    activeTalentFilter = button.dataset.talentFilter;
    talentFilters.forEach((filter) => {
      filter.classList.toggle("is-active", filter === button);
    });
    updateTalentDirectory();
  });
});

if (talentSearch) {
  talentSearch.addEventListener("input", updateTalentDirectory);
}

updateTalentDirectory();

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .trim();

const stopTalentVideos = (exceptVideo = null) => {
  talentModalVideos.forEach((video) => {
    if (video === exceptVideo) return;
    video.pause();
    video.currentTime = 0;
  });
};

const openTalentModal = (card) => {
  if (!talentModal) return;
  const name = card.dataset.name;
  const category = card.querySelector("span")?.textContent ?? "";
  const image = card.querySelector("img");
  const slug = slugify(name);
  const email = `${slug}@bravoandbeyond.ph`;

  talentModalImage.src = image.src;
  talentModalImage.alt = name;
  talentModalName.textContent = name;
  talentModalCategory.textContent = category;
  talentModalEmail.textContent = email;
  talentModalEmail.href = `mailto:${email}`;
  if (talentModalBio) {
    talentModalBio.textContent = `${name} creates ${category.toLowerCase()} content with a polished, camera-ready style for brand campaigns.`;
  }

  if (talentSocialLinks.instagram) {
    talentSocialLinks.instagram.href = `https://www.instagram.com/${slug}/`;
    talentSocialLinks.instagram.querySelector(".social-username").textContent = `@${slug}`;
  }
  if (talentSocialLinks.tiktok) {
    talentSocialLinks.tiktok.href = `https://www.tiktok.com/@${slug}`;
    talentSocialLinks.tiktok.querySelector(".social-username").textContent = `@${slug}`;
  }
  if (talentSocialLinks.facebook) {
    talentSocialLinks.facebook.href = `https://www.facebook.com/${slug}`;
    talentSocialLinks.facebook.querySelector(".social-username").textContent = `/${slug}`;
  }
  if (talentSocialLinks.youtube) {
    talentSocialLinks.youtube.href = `https://www.youtube.com/@${slug}`;
    talentSocialLinks.youtube.querySelector(".social-username").textContent = `/${slug}`;
  }

  stopTalentVideos();
  talentModal.hidden = false;
  document.body.classList.add("modal-open");
  talentModal.querySelector(".talent-modal-close")?.focus();
};

const closeTalentModal = () => {
  if (!talentModal || talentModal.hidden) return;
  stopTalentVideos();
  talentModal.hidden = true;
  document.body.classList.remove("modal-open");
};

talentCards.forEach((card) => {
  card.addEventListener("click", () => openTalentModal(card));
  card.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openTalentModal(card);
  });
});

talentCloseButtons.forEach((button) => {
  button.addEventListener("click", closeTalentModal);
});

talentModalVideos.forEach((video) => {
  video.addEventListener("play", () => {
    stopTalentVideos(video);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeTalentModal();
});

serviceCards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const xRatio = x / rect.width - 0.5;
    const yRatio = y / rect.height - 0.5;

    card.style.setProperty("--card-x", `${x}px`);
    card.style.setProperty("--card-y", `${y}px`);
    card.style.setProperty("--tilt-x", `${(xRatio * 7).toFixed(2)}deg`);
    card.style.setProperty("--tilt-y", `${(yRatio * -7).toFixed(2)}deg`);
  });

  card.addEventListener("pointerleave", () => {
    card.style.setProperty("--card-x", "50%");
    card.style.setProperty("--card-y", "50%");
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
  });
});
