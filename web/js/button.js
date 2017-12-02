(function() {
  const searchBox = document.querySelector('#search-input');
  const btn = document.createElement('div');
  btn.innerHTML = '<img src="img/sbx-icon-search-10.svg"/>';
  btn.classList.add('btn-main-action');
  btn.addEventListener('click', () => {
    searchBox.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
  window.addEventListener('scroll', () => {
    const scrollNode = document.scrollingElement || document.documentElement;
    const scroll = scrollNode.scrollTop;
    if(scroll > 100) {
      btn.classList.add('visible');
    }
    else {
      btn.classList.remove('visible');
    }
  });
  document.body.appendChild(btn);
})()
