(() => {
  const main = document.querySelector('main.wrap');
  const header = document.querySelector('header.site');
  if (!main || !header) return;

  document.body.classList.add('project-detail');
  main.classList.add('project-main');

  const slugify = (value) => value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 54) || 'section';

  const pageTitle = main.querySelector('.page-title');
  const layout = document.createElement('div');
  layout.className = 'project-layout';

  const sidebar = document.createElement('aside');
  sidebar.className = 'project-sidebar';
  sidebar.setAttribute('aria-label', 'Project navigation');
  sidebar.innerHTML = `
    <button class="project-sidebar-close" type="button" aria-label="Close navigation">×</button>
    <div class="project-sidebar-inner">
      <p class="project-sidebar-kicker">On this page</p>
      <p class="project-sidebar-title"></p>
      <nav class="project-nav" aria-label="Table of contents">
        <ol class="project-nav-list"></ol>
      </nav>
      <a class="project-sidebar-home" href="../index.html">← All projects</a>
    </div>`;

  const scrim = document.createElement('button');
  scrim.className = 'project-sidebar-scrim';
  scrim.type = 'button';
  scrim.setAttribute('aria-label', 'Close navigation');

  main.parentNode.insertBefore(layout, main);
  layout.append(sidebar, main);
  document.body.append(scrim);

  sidebar.querySelector('.project-sidebar-title').textContent = pageTitle?.textContent.trim() || 'Project';
  const navList = sidebar.querySelector('.project-nav-list');
  const observed = [];

  const sections = [...main.querySelectorAll(':scope > section.panel')];
  sections.forEach((section, sectionIndex) => {
    const heading = section.querySelector(':scope > .panel-hd h2');
    if (!heading) return;

    const sectionId = `project-section-${sectionIndex + 1}-${slugify(heading.textContent)}`;
    heading.id = sectionId;
    section.setAttribute('aria-labelledby', sectionId);
    observed.push(heading);

    const group = document.createElement('li');
    group.className = 'project-nav-group';
    const sectionLink = document.createElement('a');
    sectionLink.href = `#${sectionId}`;
    sectionLink.dataset.level = 'section';
    sectionLink.textContent = heading.textContent.trim();
    group.append(sectionLink);

    const miniBoxes = [...section.querySelectorAll('.mini-box')];
    if (miniBoxes.length) {
      const sublist = document.createElement('ol');
      sublist.className = 'project-nav-sublist';

      miniBoxes.forEach((box, subIndex) => {
        const miniHead = box.querySelector(':scope > .mini-hd');
        if (!miniHead) return;

        const labels = [...miniHead.children]
          .filter((element) => element.tagName === 'SPAN')
          .map((element) => element.textContent.trim())
          .filter(Boolean);
        const label = labels.length > 1 ? `${labels[1]} · ${labels[0]}` : labels[0];
        if (!label) return;

        const subsectionId = `project-subsection-${sectionIndex + 1}-${subIndex + 1}-${slugify(label)}`;
        box.id = subsectionId;
        observed.push(box);

        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${subsectionId}`;
        link.dataset.level = 'subsection';
        link.textContent = label;
        item.append(link);
        sublist.append(item);
      });

      if (sublist.children.length) group.append(sublist);
    }

    navList.append(group);
  });

  const tocToggle = document.createElement('button');
  tocToggle.className = 'project-toc-toggle';
  tocToggle.type = 'button';
  tocToggle.setAttribute('aria-expanded', 'false');
  tocToggle.innerHTML = '<span aria-hidden="true">☰</span> Contents';
  main.insertBefore(tocToggle, main.firstChild);

  const closeNavigation = () => {
    document.body.classList.remove('toc-open');
    tocToggle.setAttribute('aria-expanded', 'false');
  };

  tocToggle.addEventListener('click', () => {
    const willOpen = !document.body.classList.contains('toc-open');
    document.body.classList.toggle('toc-open', willOpen);
    tocToggle.setAttribute('aria-expanded', String(willOpen));
  });
  sidebar.querySelector('.project-sidebar-close').addEventListener('click', closeNavigation);
  scrim.addEventListener('click', closeNavigation);
  sidebar.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeNavigation));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeNavigation();
  });

  const navLinks = [...sidebar.querySelectorAll('.project-nav a')];
  const linksById = new Map(navLinks.map((link) => [decodeURIComponent(link.hash.slice(1)), link]));
  let activeId = '';
  const setActive = (id) => {
    if (!id || id === activeId) return;
    activeId = id;
    navLinks.forEach((link) => link.classList.toggle('is-active', link === linksById.get(id)));
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setActive(visible[0].target.id);
    }, { rootMargin: '-18% 0px -68% 0px', threshold: [0, 0.01] });
    observed.forEach((element) => observer.observe(element));
  }

  const updatePageState = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    document.body.style.setProperty('--project-progress', progress.toFixed(4));
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };

  updatePageState();
  window.addEventListener('scroll', updatePageState, { passive: true });
  window.addEventListener('resize', updatePageState);
})();
