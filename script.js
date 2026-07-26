/* ==========================================================
   1) STAGGERED ENTRANCE REVEAL
   Every element with [data-reveal] starts hidden (via CSS).
   On load, we add a fade/rise-in class to each one in turn,
   spaced 90ms apart, so the page assembles top to bottom
   instead of popping in all at once.
   ========================================================== */
function revealOnLoad(){
  const items = document.querySelectorAll('[data-reveal]');
  items.forEach((el, i) => {
    setTimeout(() => el.classList.add('is-visible'), 120 + i * 90);
  });

  const avatar = document.getElementById('avatarWrap');
  const divider = document.getElementById('divider');

  setTimeout(() => {
    avatar.style.opacity = '1';
    avatar.style.transform = 'translateY(0)';
    avatar.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  }, 200);

  setTimeout(() => {
    divider.style.transition = 'transform 0.5s ease';
    divider.style.transform = 'scaleX(1)';
  }, 500);
}

/* ==========================================================
   2) ROTATING EYEBROW TEXT
   The small gold label above the name cycles through a
   short list of role tags with a simple typewriter effect.
   ========================================================== */
function typewriterCycle(el, words, opts = {}){
  const typeSpeed = opts.typeSpeed || 55;
  const eraseSpeed = opts.eraseSpeed || 30;
  const holdTime = opts.holdTime || 1600;
  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick(){
    const current = words[wordIndex];

    if (!deleting){
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length){
        deleting = true;
        return setTimeout(tick, holdTime);
      }
      return setTimeout(tick, typeSpeed);
    }

    charIndex--;
    el.textContent = current.slice(0, charIndex);
    if (charIndex === 0){
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      return setTimeout(tick, 250);
    }
    setTimeout(tick, eraseSpeed);
  }

  tick();
}

/* ==========================================================
   3) SUBTLE PHOTO TILT ON MOUSE MOVE
   As the pointer moves across the maroon panel, the photo
   card tilts gently toward it (a small 3D parallax touch).
   ========================================================== */
function initTilt(panel, card){
  const maxTilt = 6; // degrees

  panel.addEventListener('mousemove', (e) => {
    const rect = panel.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * maxTilt * 2;
    const rotateX = (0.5 - y) * maxTilt * 2;
    card.style.transform = `translateY(0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  panel.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.5s ease';
    card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
    setTimeout(() => { card.style.transition = 'transform 0.15s ease-out'; }, 500);
  });
}

/* ==========================================================
   4) RESUME DOWNLOAD HANDLER
   Clicking "Resume" tries to fetch the CV file. If found,
   the browser downloads it. If missing, a toast explains
   what to do instead of a silent broken link.
   ========================================================== */
function initResumeButton(button){
  const RESUME_PATH = 'Sasikumar_V_CV.pdf'; // <-- point this at your real file

  button.addEventListener('click', async () => {
    button.classList.add('is-loading');
    try{
      const res = await fetch(RESUME_PATH, { method: 'HEAD' });
      if (!res.ok) throw new Error('not found');

      const link = document.createElement('a');
      link.href = RESUME_PATH;
      link.download = RESUME_PATH;
      document.body.appendChild(link);
      link.click();
      link.remove();
      showToast('Downloading resume…');
    } catch(err){
      showToast('Add your CV file as "Sasikumar_V_CV.pdf" next to this page.');
    } finally {
      button.classList.remove('is-loading');
    }
  });
}

/* ==========================================================
   5) TOAST NOTIFICATION
   A tiny reusable helper for brief on-screen messages.
   ========================================================== */
let toastTimer = null;
function showToast(message){
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

/* ==========================================================
   INIT — wire everything up once the DOM is ready
   ========================================================== */
document.addEventListener('DOMContentLoaded', () => {
  revealOnLoad();

  typewriterCycle(
    document.getElementById('eyebrowText'),
    ['Data & Python', 'Analytics', 'Machine Learning', 'Full-Stack']
  );

  initTilt(
    document.getElementById('photoPanel'),
    document.getElementById('avatarWrap')
  );

  initResumeButton(document.getElementById('resumeBtn'));
});
