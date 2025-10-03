window.addEventListener("DOMContentLoaded", () => {
  const intro   = document.getElementById("intro");
  const page    = document.getElementById("page");
  const appbar  = document.querySelector(".appbar");
  const footer  = document.querySelector(".footer");
  const headerLogo = document.getElementById("headerLogo");

  const isMobile = window.matchMedia("(max-width:1050px)").matches;

  /* Heights -> CSS vars */
  function setBarsHeights(){
    const ah = appbar ? appbar.offsetHeight : 0;
    const fh = footer ? footer.offsetHeight : 0;
    document.documentElement.style.setProperty("--appbar-h", ah + "px");
    document.documentElement.style.setProperty("--footer-h", fh + "px");
  }

  /* Milestone layout (desktop) */
  function layoutMilestones(){
    if (isMobile) return;
    const box = document.querySelector(".milestones");
    const vr  = document.querySelector(".v-roadmap");
    const item = box ? box.querySelector(".ms") : null;
    if(!box || !vr || !item) return;

    const H = box.clientHeight;
    const cs = getComputedStyle(vr);
    const padTop    = parseFloat(cs.getPropertyValue("--rail-pad-top")) || 0;
    const padBottom = parseFloat(cs.getPropertyValue("--rail-pad-bottom")) || 0;
    const offTop    = parseFloat(cs.getPropertyValue("--rail-offset-top")) || 0;
    const offBottom = parseFloat(cs.getPropertyValue("--rail-offset-bottom")) || 0;

    let trackTop    = padTop + offTop;
    let trackBottom = (H - padBottom) + offBottom;

    trackTop = Math.max(0, trackTop);
    trackBottom = Math.min(H, trackBottom);
    if (trackBottom <= trackTop) trackBottom = Math.min(H, trackTop + 1);

    const trackH = trackBottom - trackTop;

    const h = item.getBoundingClientRect().height;
    let top = trackTop + (trackH - h) / 2;
    top = Math.max(0, Math.min(top, H - h));
    item.style.top = Math.round(top) + "px";
  }

  /* Floating capsules */
  function spawnFloaters(n = 14){
    const layer = document.querySelector(".floaters");
    if(!layer) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    for (let i = 0; i < n; i++){
      const el = document.createElement("img");
      el.src = "/assets/icon-pumpfun.png";
      el.alt = "";
      el.style.position = "absolute";
      el.style.left = Math.round(Math.random() * vw) + "px";
      el.style.top  = Math.round(Math.random() * vh) + "px";
      const size = Math.round(24 + Math.random() * 40); // 24–64 px
      el.style.width = size + "px";
      el.style.height = size + "px";
      el.style.opacity = (0.55 + Math.random() * 0.35).toFixed(2);
      el.style.filter = "drop-shadow(0 2px 2px rgba(0,0,0,.25))";
      el.style.willChange = "transform";
      layer.appendChild(el);

      animateFloater(el);
    }
  }

  function animateFloater(el){
    const dx = (Math.random() * 600 - 300);
    const dy = (Math.random() * 400 - 200);
    const rot = (Math.random() * 720 - 360);
    const dur = 5000 + Math.random() * 7000;
    const delay = Math.random() * 2000;

    el.animate(
        [
          { transform: "translate(0,0) rotate(0deg)" },
          { transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)` }
        ],
        {
          duration: dur,
          direction: "alternate",
          iterations: Infinity,
          easing: "ease-in-out",
          delay
        }
    );
  }

  /* Text color picker */
  function initColorPicker(){
    const input = document.getElementById("textColor");
    if(!input) return;
    const saved = localStorage.getItem("textColor");
    const initial = saved || input.value || "#111111";
    document.documentElement.style.setProperty("--text-color", initial);
    input.value = initial;

    input.addEventListener("input", () => {
      const val = input.value;
      document.documentElement.style.setProperty("--text-color", val);
      localStorage.setItem("textColor", val);
    });
  }

  /* Debounced resize */
  let rid;
  window.addEventListener("resize", () => {
    clearTimeout(rid);
    rid = setTimeout(() => { setBarsHeights(); layoutMilestones(); }, 80);
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => { setBarsHeights(); layoutMilestones(); });
  }

  /* Intro */
  const flying = document.createElement("img");
  flying.src = headerLogo.src;
  flying.alt = "Logo";
  flying.className = "pulse";
  flying.style.width = "min(64vw, 448px)";
  document.getElementById("intro").appendChild(flying);

  const loadMs = 1200;

  setTimeout(() => {
    if (isMobile) {
      headerLogo.classList.add("pulse");
      document.getElementById("intro").remove();
      page.classList.add("show");
      setBarsHeights();
      initColorPicker();
      spawnFloaters(14);
      return;
    }

    const dst = headerLogo.getBoundingClientRect();
    const start = flying.getBoundingClientRect();

    flying.classList.remove("pulse");
    flying.style.position = "fixed";
    flying.style.left = start.left + "px";
    flying.style.top = start.top + "px";
    flying.style.width = start.width + "px";

    const anim = flying.animate(
        [
          { left: start.left + "px", top: start.top + "px", width: start.width + "px" },
          { left: dst.left + "px",   top: dst.top + "px",   width: dst.width + "px" }
        ],
        { duration: 700, easing: "cubic-bezier(.22,.61,.36,1)", fill: "forwards" }
    );

    anim.addEventListener("finish", () => {
      document.getElementById("intro").remove();
      page.classList.add("show");
      setBarsHeights();
      initColorPicker();
      requestAnimationFrame(() => layoutMilestones());
      spawnFloaters(14);
    });
  }, loadMs);
});
