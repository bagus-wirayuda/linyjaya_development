(function () {
  const { icon: I } = LJ;
  LJ.pages.shared.portal = () =>
    `<section class="auth-layout"><div class="auth-visual"><div><h2>Satu ruang kerja.<br>Perjalanan rumah yang terarah.</h2><p>Tinjau catatan unit, rencana pembayaran, laporan lapangan, dan dokumen dalam satu tempat.</p></div></div><div class="auth-content"><div class="auth-box"><span class="eyebrow u-mb-18">RUANG KERJA LINYJAYA</span><h1>Dashboard LinyJaya.</h1><p>Buka halaman sesuai bidang kegiatan.</p><div class="role-grid">${Object.entries(LJ.roles)
      .map(([id, role]) => `<a class="role-card" href="${LJ.rolePage(id)}"><span class="icon-tile">${I(role.icon)}</span><strong>${role.name}</strong><p>${role.subtitle}</p></a>`)
      .join("")}</div></div></div></section>`;
})();
