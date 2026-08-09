/**
 * Agri-Direct Production Navbar Component
 * Automatically renders a responsive, role-aware navbar with active link highlighting.
 */

(function renderAgriNavbar() {
  // 1. Get Session & User Role
  let user = {};
  try {
    user = JSON.parse(localStorage.getItem('user') || '{}');
  } catch (e) {
    user = {};
  }

  const token = localStorage.getItem('token');
  const isAdminStorage = localStorage.getItem('isAdmin') === 'true';
  const role = (user.role || (isAdminStorage ? 'ADMIN' : 'FARMER')).toUpperCase();
  const isAdmin = role === 'ADMIN' || isAdminStorage;
  const userName = user.name || 'Agri User';
  const userInitial = userName.charAt(0).toUpperCase();

  // 2. Identify Current Active Page Path
  const currentPath = window.location.pathname.split('/').pop() || 'dashboard.html';

  // 3. Define Helper for Link Active Styling
  function getLinkClass(pageName) {
    const isCurrent = currentPath === pageName || (pageName === 'dashboard.html' && (currentPath === '' || currentPath === 'index.html'));
    if (isCurrent) {
      return 'bg-emerald-50 text-emerald-800 font-extrabold border border-emerald-200/80 px-2.5 py-1.5 xl:px-3.5 xl:py-2 rounded-xl text-xs xl:text-sm flex items-center gap-1.5 shadow-2xs transition shrink-0';
    }
    return 'text-slate-600 hover:text-emerald-800 hover:bg-slate-50 font-semibold px-2.5 py-1.5 xl:px-3.5 xl:py-2 rounded-xl text-xs xl:text-sm flex items-center gap-1.5 transition shrink-0';
  }

  function getMobileLinkClass(pageName) {
    const isCurrent = currentPath === pageName || (pageName === 'dashboard.html' && (currentPath === '' || currentPath === 'index.html'));
    if (isCurrent) {
      return 'bg-emerald-100/80 text-emerald-900 font-extrabold border border-emerald-300 px-4 py-3 rounded-xl text-sm flex items-center gap-3 shadow-xs';
    }
    return 'text-slate-700 hover:bg-slate-100 font-semibold px-4 py-3 rounded-xl text-sm flex items-center gap-3 transition';
  }

  // 4. Role Badge Colors
  let badgeColorClass = 'bg-emerald-100 text-emerald-800 border-emerald-200';
  if (role === 'ADMIN') {
    badgeColorClass = 'bg-purple-100 text-purple-800 border-purple-200';
  } else if (role === 'BUYER') {
    badgeColorClass = 'bg-blue-100 text-blue-800 border-blue-200';
  }

  // 5. Construct HTML Template
  const navbarHTML = `
    <nav class="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 shadow-xs transition-all w-full max-w-full box-border overflow-x-clip">
      <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex justify-between items-center w-full gap-2">
        
        <!-- Left: Brand Logo & Title -->
        <a href="dashboard.html" class="flex items-center gap-2 sm:gap-2.5 group shrink-0">
          <div class="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-600 to-emerald-800 text-white rounded-xl sm:rounded-2xl flex items-center justify-center text-lg sm:text-xl shadow-xs group-hover:scale-105 transition duration-300 border border-emerald-500/30">
            🌱
          </div>
          <div>
            <div class="flex items-center gap-1">
              <span class="text-lg sm:text-xl font-black tracking-tight text-slate-800 group-hover:text-emerald-700 transition">
                Agri-Direct
              </span>
            </div>
            <p class="text-[9px] text-emerald-700 font-bold tracking-wider uppercase hidden 2xl:block">Direct Farmers Portal</p>
          </div>
        </a>

        <!-- Center: Navigation Links (Desktop) -->
        <div class="hidden lg:flex items-center gap-0.5 xl:gap-1.5 shrink min-w-0">
          <a href="dashboard.html" class="${getLinkClass('dashboard.html')}">
            <span>🌾</span> <span>Dashboard</span>
          </a>

          <a href="products.html" class="${getLinkClass('products.html')}">
            <span>🛒</span> <span>Products</span>
          </a>

          <a href="my-crops.html" class="${getLinkClass('my-crops.html')}">
            <span>👨‍🌾</span> <span>My Crops</span>
          </a>

          <a href="orders.html" class="${getLinkClass('orders.html')}">
            <span>📦</span> <span>Orders</span>
          </a>

          <a href="add-crop.html" class="${getLinkClass('add-crop.html')}">
            <span>✨</span> <span>+ Add Crop</span>
          </a>

          <a href="profile.html" class="${getLinkClass('profile.html')}">
            <span>👤</span> <span>Profile</span>
          </a>

          <!-- Role-Based Admin Links -->
          ${isAdmin ? `
            <div class="h-5 w-px bg-slate-200 mx-0.5 shrink-0"></div>
            <a href="admin-users.html" class="${getLinkClass('admin-users.html')} text-purple-700">
              <span>🛡️</span> <span>Admin Users</span>
            </a>
            <a href="admin-products.html" class="${getLinkClass('admin-products.html')} text-purple-700">
              <span>📋</span> <span>Admin Crops</span>
            </a>
          ` : ''}
        </div>

        <!-- Right Side: User Profile, Role Badge & Logout (Desktop) -->
        <div class="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
          <a href="profile.html" class="flex items-center gap-2 p-1 pr-2 rounded-2xl hover:bg-slate-50 transition border border-transparent hover:border-slate-200 shrink-0">
            <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center shadow-2xs shrink-0">
              ${userInitial}
            </div>
            <div class="text-left leading-tight hidden xl:block">
              <p class="text-xs font-extrabold text-slate-800 truncate max-w-[100px] xl:max-w-[120px]">${userName}</p>
              <span class="inline-block px-1.5 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider ${badgeColorClass}">
                ${role}
              </span>
            </div>
          </a>

          <button onclick="logout()" title="Logout of account" class="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 font-bold px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs transition shadow-2xs flex items-center gap-1.5 shrink-0 active:scale-95 cursor-pointer focus:ring-2 focus:ring-rose-500 focus:outline-none">
            <svg class="w-4 h-4 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <span>Logout</span>
          </button>
        </div>

        <!-- Mobile Hamburger Button -->
        <div class="flex items-center lg:hidden gap-2 shrink-0">
          <button id="mobile-menu-toggle" onclick="toggleMobileNavbar()" type="button" aria-label="Toggle navigation menu" class="p-2 sm:p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 focus:outline-none transition border border-slate-200">
            <svg id="hamburger-icon" class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg id="close-icon" class="w-5 h-5 sm:w-6 sm:h-6 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

      </div>

      <!-- Mobile Navigation Drawer -->
      <div id="mobile-navbar-drawer" class="hidden lg:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-2 shadow-lg">
        
        <!-- User Header Info on Mobile -->
        <div class="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 mb-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-700 text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
              ${userInitial}
            </div>
            <div>
              <p class="text-sm font-extrabold text-slate-800">${userName}</p>
              <span class="inline-block px-2 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${badgeColorClass}">
                ${role}
              </span>
            </div>
          </div>
          <a href="profile.html" class="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            View Profile
          </a>
        </div>

        <!-- Links -->
        <div class="space-y-1.5">
          <a href="dashboard.html" class="${getMobileLinkClass('dashboard.html')}">
            <span class="text-base">🌾</span> <span>Dashboard / डॅशबोर्ड</span>
          </a>

          <a href="products.html" class="${getMobileLinkClass('products.html')}">
            <span class="text-base">🛒</span> <span>Products / बाजारपेठ</span>
          </a>

          <a href="my-crops.html" class="${getMobileLinkClass('my-crops.html')}">
            <span class="text-base">👨‍🌾</span> <span>My Crops / माझी पिके</span>
          </a>

          <a href="orders.html" class="${getMobileLinkClass('orders.html')}">
            <span class="text-base">📦</span> <span>Orders / ऑर्डर्स</span>
          </a>

          <a href="add-crop.html" class="${getMobileLinkClass('add-crop.html')}">
            <span class="text-base">✨</span> <span>+ Add Crop / नवीन पीक</span>
          </a>

          <a href="profile.html" class="${getMobileLinkClass('profile.html')}">
            <span class="text-base">👤</span> <span>Profile / माझी माहिती</span>
          </a>

          ${isAdmin ? `
            <div class="pt-2 pb-1 border-t border-slate-200/80 text-[11px] font-extrabold text-purple-700 uppercase tracking-wider px-2">
              Admin Portal
            </div>
            <a href="admin-users.html" class="${getMobileLinkClass('admin-users.html')} text-purple-900">
              <span class="text-base">🛡️</span> <span>Admin Users / युझर्स</span>
            </a>
            <a href="admin-products.html" class="${getMobileLinkClass('admin-products.html')} text-purple-900">
              <span class="text-base">📋</span> <span>Admin Crops / सर्व पिके</span>
            </a>
          ` : ''}
        </div>

        <!-- Logout Action on Mobile -->
        <div class="pt-3 mt-2 border-t border-slate-200">
          <button onclick="logout()" class="w-full bg-rose-600 hover:bg-rose-700 active:scale-[0.99] text-white font-extrabold py-3 px-4 rounded-xl transition shadow-sm text-sm flex items-center justify-center gap-2">
            <svg class="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <span>Logout of Account / बाहेर पडा</span>
          </button>
        </div>
      </div>
    </nav>
  `;

  // 6. Mount Navbar onto <header id="app-navbar"></header> or <nav id="main-navbar"></nav> or body top
  function mount() {
    let container = document.getElementById('app-navbar') || document.getElementById('main-navbar');
    
    if (!container) {
      const existingNav = document.querySelector('nav');
      if (existingNav) {
        container = document.createElement('header');
        container.id = 'app-navbar';
        existingNav.parentNode.replaceChild(container, existingNav);
      } else {
        container = document.createElement('header');
        container.id = 'app-navbar';
        document.body.insertBefore(container, document.body.firstChild);
      }
    }
    
    container.innerHTML = navbarHTML;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();

// Global Toggle Mobile Menu Function
window.toggleMobileNavbar = function() {
  const drawer = document.getElementById('mobile-navbar-drawer');
  const hamburger = document.getElementById('hamburger-icon');
  const close = document.getElementById('close-icon');

  if (drawer) {
    if (drawer.classList.contains('hidden')) {
      drawer.classList.remove('hidden');
      if (hamburger) hamburger.classList.add('hidden');
      if (close) close.classList.remove('hidden');
    } else {
      drawer.classList.add('hidden');
      if (hamburger) hamburger.classList.remove('hidden');
      if (close) close.classList.add('hidden');
    }
  }
};

// Global Logout Function (Preserving Session Clear & Redirect)
window.logout = function() {
  localStorage.clear();
  window.location.href = 'index.html';
};
