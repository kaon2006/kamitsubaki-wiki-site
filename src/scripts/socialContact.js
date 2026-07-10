document.addEventListener('DOMContentLoaded', () => {
  const widgets = document.querySelectorAll('[data-social-contact]');

  widgets.forEach((widget) => {
    const toggle = widget.querySelector('[data-social-contact-toggle]');
    const panel = widget.querySelector('[data-social-contact-panel]');
    const close = widget.querySelector('[data-social-contact-close]');

    if (!(toggle instanceof HTMLButtonElement) || !(panel instanceof HTMLElement)) {
      return;
    }

    const setOpen = (nextOpen) => {
      widget.classList.toggle('is-open', nextOpen);
      panel.hidden = !nextOpen;
      toggle.setAttribute('aria-expanded', String(nextOpen));
    };

    toggle.addEventListener('click', () => {
      setOpen(!widget.classList.contains('is-open'));
    });

    close?.addEventListener('click', () => setOpen(false));

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    });

    document.addEventListener('pointerdown', (event) => {
      if (!widget.contains(event.target)) {
        setOpen(false);
      }
    });
  });
});
