/* ================================================================
   common.js — 공통 네비/푸터 렌더링 (수정 불필요)
   ================================================================ */

// 깃허브 Pages 경로 자동 감지
const IS_LOCAL = location.hostname === 'localhost' || location.protocol === 'file:';
const BASE = IS_LOCAL ? '' : '/' + (location.pathname.split('/').filter(Boolean)[0] || '');
const ROOT = BASE + '/';

function img(path){ return BASE + '/' + path.replace(/^\//,''); }

// pages/ 폴더 안인지 감지
const IN_PAGES = location.pathname.includes('/pages/');
const PAGE_ROOT = IN_PAGES ? '../' : '';

function href(path){ return BASE + '/' + path; }

// 테마 적용
function applyTheme(){
  const t = CONFIG.theme;
  const r = document.documentElement.style;
  r.setProperty('--g',  t.g);
  r.setProperty('--g2', t.g2);
  r.setProperty('--gl', t.gl);
  r.setProperty('--gp', t.gp);
  r.setProperty('--y',  t.y);
  r.setProperty('--cr', t.cr);
}

// 네비 렌더링
function renderNav(activePage){
  const p = CONFIG.pension;
  const nav = document.getElementById('nav');
  if(!nav) return;

  const menuItems = [
    { label:'펜션소개', href:'pages/about.html', sub:[] },
    { label:'객실안내', href:'pages/rooms.html', sub:
      CONFIG.rooms.map(r => ({ label: r.no + '호 · ' + r.name, href: 'pages/room-' + r.no + '.html' }))
    },
    { label:'부대시설', href:'pages/facilities.html', sub:[] },
    { label:'주변관광', href:'pages/spots.html', sub:[] },
    { label:'예약/문의', href:'pages/reservation.html', sub:[
      { label:'예약안내',  href:'pages/reservation.html' },
      { label:'환불규정',  href:'pages/refund.html' },
      { label:'이용안내',  href:'pages/notice.html' },
    ]},
  ];

  // 데스크탑 메뉴
  const desktopMenu = menuItems.map(item => {
    const subHtml = item.sub.length
      ? '<div class="dropdown">' + item.sub.map(s =>
          '<a href="' + href(s.href) + '">' + s.label + '</a>'
        ).join('') + '</div>'
      : '';
    const arr = item.sub.length ? '<span class="arr">▼</span>' : '';
    const isOn = activePage === item.label ? ' on' : '';
    return '<li><a href="' + href(item.href) + '" class="' + isOn + '">' + item.label + arr + '</a>' + subHtml + '</li>';
  }).join('');

  // 모바일 메뉴
  const mobileMenu = menuItems.map(item => {
    const hasSub = item.sub.length > 0;
    const subHtml = hasSub
      ? '<div class="mob-sub">' + item.sub.map(s =>
          '<a href="' + href(s.href) + '">' + s.label + '</a>'
        ).join('') + '</div>'
      : '';
    const arr = hasSub ? '<span class="arr">▾</span>' : '';
    const onclick = hasSub ? ' onclick="toggleMobSub(this)"' : '';
    return '<div class="mob-item"><a href="' + (hasSub ? '#' : href(item.href)) + '"' + onclick + '>' + item.label + arr + '</a>' + subHtml + '</div>';
  }).join('');

  nav.innerHTML =
    '<div class="nav-inner">' +
      '<a href="' + href('index.html') + '" class="nlogo">' + p.name_en + '<small>' + p.name_ko + '</small></a>' +
      '<ul class="nav-menu">' + desktopMenu + '</ul>' +
      '<a href="' + href('pages/reservation.html') + '" class="nrsv">예약 문의</a>' +
      '<button class="nav-hamburger" id="hamburger" onclick="toggleMobileMenu()" aria-label="메뉴"><span></span><span></span><span></span></button>' +
    '</div>';

  // 모바일 메뉴 삽입
  let mob = document.getElementById('mobile-menu');
  if(!mob){
    mob = document.createElement('div');
    mob.id = 'mobile-menu';
    document.body.appendChild(mob);
  }
  mob.innerHTML = mobileMenu + '<a href="' + href('pages/reservation.html') + '" class="mob-rsv">예약 문의하기</a>';

  // 스크롤
  window.addEventListener('scroll', () => {
    nav.classList.toggle('sc', scrollY > 40);
  });
}

function toggleMobileMenu(){
  const mob = document.getElementById('mobile-menu');
  const btn = document.getElementById('hamburger');
  mob.classList.toggle('on');
  btn.classList.toggle('on');
  document.body.style.overflow = mob.classList.contains('on') ? 'hidden' : '';
}

function toggleMobSub(el){
  el.parentElement.classList.toggle('open');
  el.preventDefault && el.preventDefault();
}

// 푸터 렌더링
function renderFooter(){
  const p = CONFIG.pension;
  const c = CONFIG.contact;
  const b = CONFIG.biz;
  let footer = document.getElementById('footer');
  if(!footer) return;

  footer.innerHTML =
    '<div class="footer-grid">' +
      '<div>' +
        '<span class="footer-logo">' + p.name_en + '</span>' +
        '<p class="footer-copy">' + p.name_ko + '<br>' + c.address + '<br>사업자등록번호: ' + b.reg_no + ' | 대표: ' + b.ceo + '</p>' +
      '</div>' +
      '<div class="footer-col"><h4>Quick Menu</h4>' +
        '<a href="' + href('pages/about.html') + '">펜션소개</a>' +
        '<a href="' + href('pages/rooms.html') + '">객실안내</a>' +
        '<a href="' + href('pages/facilities.html') + '">부대시설</a>' +
        '<a href="' + href('pages/spots.html') + '">주변관광</a>' +
        '<a href="' + href('pages/reservation.html') + '">예약/문의</a>' +
      '</div>' +
      '<div class="footer-col"><h4>Contact</h4>' +
        '<p>📞 ' + c.tel + '</p>' +
        '<p>📍 ' + c.address + '</p>' +
        '<p>체크인 ' + c.checkin + ' · 체크아웃 ' + c.checkout + '</p>' +
        '<a href="' + c.kakao_url + '" style="margin-top:10px;display:inline-block;background:#FEE500;color:#3a1d1d;padding:7px 16px;font-size:.78rem;font-weight:700;text-decoration:none;">💬 카카오톡 문의</a>' +
      '</div>' +
    '</div>' +
    '<div class="footer-bottom">ⓒ ' + b.year + ' ' + p.name_ko + '. All rights reserved.</div>';
}

// 스크롤 reveal
function initReveal(){
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('on'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.rv').forEach(el => obs.observe(el));
}
