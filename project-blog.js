document.addEventListener('DOMContentLoaded', () => {
  const main = document.querySelector('main.wrap');
  if (!main || main.closest('.project-docs-layout')) return;

  main.classList.add('project-article');

  const sections = Array.from(main.querySelectorAll(':scope > section.panel'));
  if (!sections.length) return;

  const layout = document.createElement('div');
  layout.className = 'project-docs-layout';

  const aside = document.createElement('aside');
  aside.className = 'project-toc';
  aside.setAttribute('aria-label', 'Project contents');

  const label = document.createElement('p');
  label.className = 'project-toc-label';
  label.textContent = 'On this page';

  const nav = document.createElement('nav');
  const links = [];

  sections.forEach((section, index) => {
    const heading = section.querySelector(':scope > .panel-hd h2');
    if (!heading) return;

    const sectionId = `project-section-${index + 1}`;
    const headingId = `${sectionId}-title`;
    section.id = sectionId;
    heading.id = headingId;
    section.setAttribute('aria-labelledby', headingId);

    const link = document.createElement('a');
    link.href = `#${sectionId}`;
    link.textContent = heading.textContent.trim();
    if (index === 0) link.classList.add('is-active');
    nav.append(link);
    links.push(link);
  });

  aside.append(label, nav);
  main.before(layout);
  layout.append(aside, main);

  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (!visible) return;

      links.forEach(link => {
        link.classList.toggle('is-active', link.hash === `#${visible.target.id}`);
      });
    },
    { rootMargin: '-18% 0px -68% 0px', threshold: 0 }
  );

  sections.forEach(section => observer.observe(section));
});
