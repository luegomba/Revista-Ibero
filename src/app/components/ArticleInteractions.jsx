"use client";
// src/app/components/ArticleInteractions.jsx
// Porta toda la lógica de /js/script.js del PHP de referencia al frontend Next.js.
// Props:
//   audioSrc      — URL del mp3 (puede ser null)
//   prevArticle   — URL del artículo anterior (puede ser null)
//   nextArticle   — URL del artículo siguiente (puede ser null)

import { useEffect } from "react";

export default function ArticleInteractions({ audioSrc, prevArticle, nextArticle }) {
    useEffect(() => {
        // ── Utilidades ────────────────────────────────────────────────
        function showToast(msg) {
            const t = document.getElementById("toast");
            if (!t) return;
            t.textContent = msg;
            t.classList.add("show");
            setTimeout(() => t.classList.remove("show"), 3000);
        }

        // ── 1. Scroll To Top ──────────────────────────────────────────
        function setupScrollToTop() {
            const btn = document.getElementById("scrollToTopBtn");
            if (!btn) return;
            const showAfter = 300;
            function toggle() {
                const top = window.pageYOffset || document.documentElement.scrollTop;
                btn.classList.toggle("visible", top > showAfter);
            }
            function smoothUp() {
                const start = window.pageYOffset;
                const t0 = performance.now();
                const dur = 500;
                function frame(now) {
                    const p = Math.min((now - t0) / dur, 1);
                    const ease = p < 0.5 ? 4 * p * p * p : (p - 1) * (2 * p - 2) * (2 * p - 2) + 1;
                    window.scrollTo(0, start * (1 - ease));
                    if (p < 1) requestAnimationFrame(frame);
                }
                requestAnimationFrame(frame);
            }
            window.addEventListener("scroll", toggle, { passive: true });
            btn.addEventListener("click", (e) => { e.preventDefault(); smoothUp(); });
            btn.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") { e.preventDefault(); smoothUp(); }
            });
            toggle();
        }

        // ── 2. Header Observer ────────────────────────────────────────
        function setupHeaderObserver() {
            const header = document.getElementById("header");
            const container = document.getElementById("revista-container");
            if (!header || !container) return;
            const ro = new ResizeObserver((entries) => {
                for (const e of entries) {
                    const h = e.contentRect.height;
                    container.style.marginTop = h + "px";
                    const nav = document.querySelector(".article-navigation");
                    if (nav) nav.style.top = h + 20 + "px";
                }
            });
            ro.observe(header);
            return () => ro.disconnect();
        }

        // ── 3. Sticky Audio Player (title show/hide on scroll) ────────
        function initStickyAudioPlayer() {
            const audioMedia = document.querySelector(".article-media");
            const audioTitle = document.querySelector(".audio-title");
            const origTitle = document.querySelector(".article-title");
            if (!audioMedia || !audioTitle) return;

            function getThreshold() {
                return origTitle ? origTitle.offsetTop + origTitle.offsetHeight : 200;
            }
            let ticking = false;
            function check() {
                const y = window.scrollY;
                const show = y > getThreshold();
                audioTitle.classList.toggle("show", show);
                audioMedia.classList.toggle("title-visible", show);
                ticking = false;
            }
            function onScroll() {
                if (!ticking) { requestAnimationFrame(check); ticking = true; }
            }
            check();
            window.addEventListener("scroll", onScroll, { passive: true });
            window.addEventListener("resize", check, { passive: true });
        }

        // ── 4. Active Navigation (IntersectionObserver) ───────────────
        function initActiveNavigation() {
            const navLinks = document.querySelectorAll('.article-navigation a[href^="#"]');
            if (!navLinks.length) return;
            const sections = [];
            navLinks.forEach((link) => {
                const id = link.getAttribute("href").substring(1);
                const el = document.getElementById(id);
                if (el) sections.push({ id, element: el, link });
            });
            if (!sections.length) return;

            let currentActive = null;
            function setActive(id) {
                if (currentActive === id) return;
                navLinks.forEach((l) => l.classList.remove("active"));
                if (id) {
                    const s = sections.find((s) => s.id === id);
                    if (s) s.link.classList.add("active");
                }
                currentActive = id;
            }

            const observer = new IntersectionObserver(
                (entries) => {
                    let top = Infinity, active = null;
                    entries.forEach((e) => {
                        if (e.isIntersecting && e.boundingClientRect.top < top) {
                            top = e.boundingClientRect.top;
                            active = e.target.id;
                        }
                    });
                    if (active) setActive(active);
                },
                { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
            );
            sections.forEach((s) => observer.observe(s.element));

            // Smooth scroll for nav links
            navLinks.forEach((link) => {
                link.addEventListener("click", (e) => {
                    e.preventDefault();
                    const target = document.getElementById(link.getAttribute("href").substring(1));
                    if (!target) return;
                    const headerH = parseInt(
                        getComputedStyle(document.documentElement).getPropertyValue("--header-height")
                    ) || 140;
                    const audioH = document.querySelector(".article-media")?.offsetHeight || 0;
                    const buffer = window.scrollY > 330 ? 20 : 220;
                    let elTop = 0, el = target;
                    while (el) { elTop += el.offsetTop; el = el.offsetParent; }
                    window.scrollTo({ top: Math.max(0, elTop - headerH - audioH - buffer), behavior: "smooth" });
                });
            });
        }

        // ── 5. Marquee para el título de audio ────────────────────────
        function setupMarquee() {
            const speed = 50, gap = 50, minDur = 5;
            document.querySelectorAll(".audio-title").forEach((titleEl) => {
                const content = titleEl.querySelector(".marquee-content");
                if (!content) return;
                titleEl.classList.add("smooth-scroll", "fade-edges");
                function update() {
                    const cw = titleEl.clientWidth;
                    const sw = content.scrollWidth;
                    if (sw > cw) {
                        const dur = Math.max((sw + gap) / speed, minDur);
                        titleEl.style.setProperty("--marquee-duration", `${dur}s`);
                        titleEl.style.setProperty("--marquee-state", "running");
                        content.style.paddingRight = `${gap}px`;
                    } else {
                        titleEl.style.setProperty("--marquee-state", "paused");
                    }
                }
                titleEl.addEventListener("mouseenter", () =>
                    titleEl.style.setProperty("--marquee-state", "paused"));
                titleEl.addEventListener("mouseleave", () => {
                    if (content.scrollWidth > titleEl.clientWidth)
                        titleEl.style.setProperty("--marquee-state", "running");
                });
                update();
                window.addEventListener("resize", update, { passive: true });
            });
        }

        // ── 6. Audio Container Toggle (⋮ dots button) ────────────────
        function setupAudioContainerToggle() {
            const container = document.querySelector(".audio-container");
            const dotsBtn = document.querySelector(".option-dots");
            if (!container || !dotsBtn) return;
            dotsBtn.setAttribute("aria-expanded", "false");
            dotsBtn.setAttribute("aria-label", "Toggle audio options");
            dotsBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                container.classList.toggle("active");
                dotsBtn.setAttribute("aria-expanded", container.classList.contains("active"));
            });
            document.addEventListener("keydown", (e) => {
                if (e.key === "Escape" && container.classList.contains("active")) {
                    container.classList.remove("active");
                    dotsBtn.setAttribute("aria-expanded", "false");
                    dotsBtn.focus();
                }
            });
        }

        // ── 7. Custom Audio Player ────────────────────────────────────
        function setupCustomPlayer() {
            const audio = document.getElementById("article-voice");
            const playBtn = document.getElementById("playButton");
            const progressBar = document.getElementById("progressBar");
            const progressFill = document.getElementById("progressFill");
            const progressHandle = document.getElementById("progressHandle");
            const timeDisplay = document.getElementById("timeDisplay");
            const volBtn = document.getElementById("volumeButton");
            const volSlider = document.getElementById("volumeSlider");
            const audioPlayer = document.getElementById("audioPlayer");
            const articleMedia = document.getElementById("articleMedia");
            const mobileCloseBtn = document.getElementById("mobile-player-close");
            // EQ SVG group — se anima cuando el audio corre
            const eqGroup = document.getElementById("eq");

            if (!audio || !playBtn) return;

            const mobileQ = window.matchMedia("(max-width: 500px)");
            let isPlaying = false;
            let isDragging = false;
            let activePtr = null;

            const PLAY_SVG = `<svg id="play-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16.68 15.09"><path class="svg-color-inverse" d="M16.24,6.86L1.05.07C.56-.16,0,.21,0,.75v13.6c0,.54.56.9,1.05.68l15.19-6.8c.59-.26.59-1.1,0-1.36Z"/></svg>`;
            const PAUSE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16.66 15.62"><g><rect class="svg-color-inverse" width="5.7" height="15.62" rx=".75" ry=".75"/><rect class="svg-color-inverse" x="10.96" width="5.7" height="15.62" rx=".75" ry=".75"/></g></svg>`;

            function fmt(s) {
                const m = Math.floor(s / 60), sec = Math.floor(s % 60);
                return `${m}:${sec.toString().padStart(2, "0")}`;
            }
            function updateTime() {
                if (timeDisplay)
                    timeDisplay.textContent = `${fmt(audio.currentTime || 0)} / ${fmt(audio.duration || 0)}`;
            }
            function setVolIcon(v) {
                if (!volBtn) return;
                volBtn.classList.remove("volume-high", "volume-medium", "volume-low", "volume-muted");
                if (v === 0 || audio.muted) volBtn.classList.add("volume-muted");
                else if (v < 0.33) volBtn.classList.add("volume-low");
                else if (v < 0.66) volBtn.classList.add("volume-medium");
                else volBtn.classList.add("volume-high");
            }
            function seekAt(clientX) {
                if (!audio.duration || !progressBar) return;
                const rect = progressBar.getBoundingClientRect();
                const pct = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
                audio.currentTime = pct * audio.duration;
                const s = (pct * 100).toFixed(3) + "%";
                if (progressFill) progressFill.style.width = s;
                if (progressHandle) progressHandle.style.left = s;
                updateTime();
            }

            // Play/Pause
            playBtn.addEventListener("click", () => {
                if (isPlaying) {
                    audio.pause();
                    playBtn.innerHTML = PLAY_SVG;
                    isPlaying = false;
                    eqGroup?.classList.add("paused");      // ← pausa barras
                } else {
                    audio.play();
                    playBtn.innerHTML = PAUSE_SVG;
                    isPlaying = true;
                    eqGroup?.classList.remove("paused");   // ← activa barras
                    if (mobileQ.matches && articleMedia)
                        articleMedia.classList.add("mobile-player");
                }
            });

            // Mobile query change
            mobileQ.addEventListener("change", (e) => {
                if (!e.matches && articleMedia)
                    articleMedia.classList.remove("mobile-player");
            });

            // Audio events
            audio.addEventListener("loadedmetadata", updateTime);
            audio.addEventListener("timeupdate", () => {
                if (!isDragging && audio.duration) {
                    const pct = ((audio.currentTime / audio.duration) * 100).toFixed(3) + "%";
                    if (progressFill) progressFill.style.width = pct;
                    if (progressHandle) progressHandle.style.left = pct;
                    updateTime();
                }
            });
            audio.addEventListener("ended", () => {
                isPlaying = false;
                playBtn.innerHTML = PLAY_SVG;
                eqGroup?.classList.add("paused");          // ← pausa barras al terminar
                if (progressFill) progressFill.style.width = "0%";
                if (progressHandle) progressHandle.style.left = "0%";
                audio.currentTime = 0;
                updateTime();
            });
            if (audioPlayer) {
                audio.addEventListener("loadstart", () => audioPlayer.classList.add("loading"));
                audio.addEventListener("canplay", () => audioPlayer.classList.remove("loading"));
            }

            // Progress bar pointer scrubbing
            if (progressBar) {
                progressBar.addEventListener("pointerdown", (e) => {
                    if (e.pointerType === "mouse" && e.button !== 0) return;
                    isDragging = true;
                    activePtr = e.pointerId;
                    progressBar.setPointerCapture?.(e.pointerId);
                    progressBar.classList.add("dragging");
                    e.preventDefault();
                    seekAt(e.clientX);
                });
                window.addEventListener("pointermove", (e) => {
                    if (!isDragging || e.pointerId !== activePtr) return;
                    seekAt(e.clientX);
                });
                const endDrag = (e) => {
                    if (e.pointerId !== activePtr) return;
                    isDragging = false; activePtr = null;
                    progressBar.releasePointerCapture?.(e.pointerId);
                    progressBar.classList.remove("dragging");
                };
                window.addEventListener("pointerup", endDrag);
                window.addEventListener("pointercancel", endDrag);
                progressBar.addEventListener("keydown", (e) => {
                    if (!audio.duration) return;
                    const step = 5;
                    let pct = (audio.currentTime / audio.duration) * 100;
                    if (e.key === "ArrowRight") pct = Math.min(100, pct + step);
                    else if (e.key === "ArrowLeft") pct = Math.max(0, pct - step);
                    else return;
                    e.preventDefault();
                    audio.currentTime = (pct / 100) * audio.duration;
                    const s = pct.toFixed(3) + "%";
                    if (progressFill) progressFill.style.width = s;
                    if (progressHandle) progressHandle.style.left = s;
                    updateTime();
                });
            }

            // Volume
            if (volSlider) {
                volSlider.style.setProperty("--volume-progress", "100%");
                volSlider.addEventListener("input", (e) => {
                    const v = e.target.value / 100;
                    audio.volume = v;
                    audio.muted = false;
                    volSlider.style.setProperty("--volume-progress", e.target.value + "%");
                    setVolIcon(v);
                });
            }
            if (volBtn) {
                volBtn.addEventListener("click", () => {
                    if (audio.muted) {
                        audio.muted = false;
                        if (volSlider) {
                            volSlider.value = audio.volume * 100;
                            volSlider.style.setProperty("--volume-progress", audio.volume * 100 + "%");
                        }
                        setVolIcon(audio.volume);
                    } else {
                        audio.muted = true;
                        if (volSlider) {
                            volSlider.value = 0;
                            volSlider.style.setProperty("--volume-progress", "0%");
                        }
                        setVolIcon(0);
                    }
                });
            }

            // Mobile close button
            if (mobileCloseBtn && articleMedia) {
                mobileCloseBtn.addEventListener("click", () =>
                    articleMedia.classList.remove("mobile-player"));
            }

            // Autoplay if ?mp=true or sessionStorage flag
            try {
                const params = new URLSearchParams(location.search);
                const auto = params.get("mp") === "true" || sessionStorage.getItem("autoplayNext") === "1";
                sessionStorage.removeItem("autoplayNext");
                if (auto) {
                    audio.play().then(() => {
                        isPlaying = true;
                        playBtn.innerHTML = PAUSE_SVG;
                        eqGroup?.classList.remove("paused"); // ← activa barras en autoplay
                        if (mobileQ.matches && articleMedia)
                            articleMedia.classList.add("mobile-player");
                    }).catch(() => { });
                }
            } catch (_) { }
        }

        // ── 8. Share button toggle ────────────────────────────────────
        function setupShare() {
            const shareBtn = document.querySelector("button.share");
            const shareBar = document.querySelector(".share-bar");
            if (!shareBtn || !shareBar) return;
            shareBtn.addEventListener("click", function () {
                this.classList.toggle("active");
                this.classList.toggle("tooltip-css");
                shareBar.classList.toggle("active");
            });
            // Intercept share links → popup
            shareBar.querySelectorAll('a[target="_blank"]').forEach((a) => {
                a.addEventListener("click", (e) => {
                    e.preventDefault();
                    const w = 600, h = 600;
                    const y = window.top.outerHeight / 2 + window.top.screenY - h / 2;
                    const x = window.top.outerWidth / 2 + window.top.screenX - w / 2;
                    window.open(a.href, "_blank", `width=${w},height=${h},left=${x},top=${y},noopener`);
                });
            });
        }

        // ── 9. EQ SVG centering ───────────────────────────────────────
        function centerEq() {
            const svg = document.querySelector(".player-art svg");
            if (!svg) return;
            const group = svg.querySelector("#eq");
            const rect = svg.querySelector("#bar");
            if (!group || !rect) return;
            const vb = svg.viewBox?.baseVal;
            const vw = vb?.width || parseFloat((svg.getAttribute("viewBox") || "0 0 350 350").split(" ")[2]) || 350;
            const uses = group.querySelectorAll("use");
            if (!uses.length) return;
            let minX = Infinity, maxX = -Infinity;
            uses.forEach((u) => {
                const x = parseFloat(u.getAttribute("x") || "0");
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
            });
            const bw = parseFloat(rect.getAttribute("width") || "0");
            const offset = (vw - (maxX - minX + bw)) / 2 - minX;
            group.setAttribute("transform", `translate(${offset},0)`);
        }

        // ── EQ toggle (play button data-eq-toggle) ────────────────────
        function initEqToggle() {
            document.querySelectorAll("[data-eq-toggle]").forEach((btn) => {
                const sels = (btn.getAttribute("data-eq-toggle") || "").split(",").map((s) => s.trim()).filter(Boolean);
                const groups = sels.map((s) => document.querySelector(s)).filter(Boolean);
                if (!groups.length) return;
                const isPaused = groups.every((g) => g.classList.contains("paused"));
                btn.setAttribute("aria-pressed", String(isPaused));
                btn.addEventListener("click", () => {
                    const next = !groups[0].classList.contains("paused");
                    groups.forEach((g) => g.classList.toggle("paused", next));
                    btn.setAttribute("aria-pressed", String(next));
                });
            });
        }

        // ── Inicializar todo ──────────────────────────────────────────
        setupScrollToTop();
        const cleanupRO = setupHeaderObserver();
        initStickyAudioPlayer();
        initActiveNavigation();
        setupMarquee();
        setupAudioContainerToggle();
        setupCustomPlayer(); // EQ ya está integrado aquí
        setupShare();
        centerEq();
        window.addEventListener("resize", centerEq, { passive: true });

        return () => {
            if (typeof cleanupRO === "function") cleanupRO();
            window.removeEventListener("resize", centerEq);
        };
    }, []);

    return null;
}
