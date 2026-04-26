(function () {
  const headings = document.querySelectorAll(".guide-content h1, .guide-content h2, .guide-content h3, .guide-content h4, .guide-content h5, .guide-content h6");
  const links = document.querySelectorAll(".guide-sidebar a");

  if (!headings.length || !links.length) return;

  // Map from slug → sidebar anchor element for fast lookup
  const linkMap = new Map();
  links.forEach(link => {
    const id = link.getAttribute("href")?.slice(1); // strip the leading #
    if (id) linkMap.set(id, link);
  });

  let activeLinkEl = null;

  function setActive(id) {
    const nextLink = linkMap.get(id);
    if (!nextLink || nextLink === activeLinkEl) return;

    activeLinkEl?.classList.remove("is-active");
    nextLink.classList.add("is-active");
    activeLinkEl = nextLink;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      // Among all headings currently intersecting, pick the topmost one
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

      if (visible.length) {
        setActive(visible[0].target.id);
      }
    },
    {
      // Fire when a heading enters the top 20% of the viewport
      rootMargin: "0px 0px -80% 0px",
      threshold: 0,
    }
  );

  headings.forEach(h => { if (h.id) observer.observe(h); });
})();