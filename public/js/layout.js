(function () {
  const { icon: I, esc: E, link: A } = LJ;
  LJ.nav = (active) =>
    `<header class="site-nav"><div class="container nav-inner">${LJ.brand()}<nav id="site-navigation" class="nav-links" aria-label="Navigasi utama">${[
      ["index.html", "Beranda"],
      ["properti.html", "Properti"],
      ["layanan.html", "Layanan"],
      ["galeri.html", "Galeri"],
      ["tentang.html", "Tentang Kami"],
      ["artikel.html", "Insight"],
      ["mitra.html", "Mitra", "optional"],
    ]
      .map(
        ([url, label, cls]) =>
          `<a href="${url}" class="${cls || ""} ${active === url ? "active" : ""}"${active === url ? ' aria-current="page"' : ""}>${label}</a>`,
      )
      .join(
        "",
      )}</nav><div class="nav-actions">${A("Konsultasi Hunian", "kontak.html", "primary", "message")}<button class="icon-btn menu-toggle" data-action="mobile-nav" aria-label="Menu navigasi" aria-controls="site-navigation" aria-expanded="false">${I("menu")}</button></div></div></header>`;
  LJ.footer = () =>
    `<footer class="site-footer"><div class="container"><div class="footer-grid"><div class="footer-brand">${LJ.brand()}<p>Membangun hunian. Merawat harapan.<br>Kami hadir untuk setiap langkah perjalanan menuju rumah Anda.</p><div class="socials">${LJ.iBtn("message", "contact-info", "", "Rencanakan konsultasi")}${LJ.iBtn("mail", "contact-info", "", "Hubungi tim pemasaran")}${LJ.iBtn("pin", "contact-info", "", "Lokasi kantor")}</div></div><div class="footer-col"><strong>Jelajahi LinyJaya</strong><a href="tentang.html">Tentang kami</a><a href="layanan.html">Layanan kami</a><a href="mitra.html">Mitra perusahaan</a><a href="artikel.html">Berita & artikel</a></div><div class="footer-col"><strong>Temukan rumah Anda</strong><a href="properti.html">Semua properti</a><a href="galeri.html">Galeri pembangunan</a><a href="kontak.html">Rencanakan konsultasi</a><a href="properti.html">Pilihan tipe rumah</a></div><div class="footer-col"><strong>Mari terhubung</strong><p>Wilayah pilihan: ${E([...new Set(LJ.db.projects.map((p) => p.city))].join(", "))}</p><p class="u-mt-10">Konsultasi & kunjungan lokasi<br>melalui perjanjian.</p><p class="u-mt-10">Kontak dan jadwal layanan resmi<br>perlu dikonfirmasi perusahaan.</p></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} LinyJaya Development. All rights reserved.</span><span>Hunian terencana. Kehidupan yang bermakna.</span><div class="footer-legal"><a href="kebijakan-privasi.html">Kebijakan Privasi</a><a href="syarat-ketentuan.html">Syarat & Ketentuan</a><a href="faq.html">FAQ</a></div></div></div></footer>`;
  LJ.pageHero = (eyebrow, title, desc) =>
    `<section class="page-hero"><div class="container"><div class="breadcrumbs"><a href="index.html">Beranda</a>${I("chevron", "sm")}<span>${eyebrow}</span></div><span class="eyebrow">${I("layers")}${eyebrow}</span><h1>${title}</h1><p>${desc}</p></div></section>`;
  LJ.cta = () =>
    `<section class="container"><div class="cta-band"><div><h2>Rumah impian dimulai<br>dari percakapan sederhana.</h2><p>Ceritakan kebutuhan Anda. Mari temukan ruang yang tepat bersama.</p></div>${A("Rencanakan konsultasi", "kontak.html", "secondary", "message")}</div></section>`;
})();
