(function () {
  const { icon: I, esc: E, btn: B, link: A } = LJ;
  const architecture = () => `
    <section class="hero hero--architecture">
      <div class="container architecture-layout">
        <div class="hero-copy reveal">
          <span class="eyebrow">${I("home")}PENGEMBANG HUNIAN</span>
          <h1>Ruang untuk<br>hidup lebih <span>baik.</span></h1>
          <p>Rumah yang dirancang untuk hari ini dan tahun-tahun berikutnya. Temukan kawasan, tipe hunian, dan ruang yang sesuai dengan cara Anda hidup.</p>
          <div class="hero-actions">${A("Jelajahi Hunian", "properti.html", "primary", "arrow")}${B("Kenali LinyJaya", "brand-story", "", "secondary", "play")}</div>
          <div class="hero-proof"><span class="icon-tile feature-icon-compact">${I("pin", "sm")}</span><span>Jelajahi kawasan kami<br><strong>Bandung · Bekasi · Bogor</strong></span></div>
        </div>
        <figure class="architecture" aria-labelledby="architecture-title">
          <div class="architecture-header">
            <div><span class="architecture-kicker">STUDI ARSITEKTUR</span><figcaption id="architecture-title">Hunian Tropis</figcaption></div>
            <span class="architecture-index">FIG. 01</span>
          </div>
          <div class="architecture-stage">
            <img class="architecture-photo" fetchpriority="high" src="${LJ.image("hero")}" alt="Referensi hunian modern dua lantai dengan taman dan kaca lebar">
            <canvas class="architecture-canvas" tabindex="0" aria-label="Model hunian tropis tiga dimensi" aria-describedby="architecture-help" hidden></canvas>
          </div>
          <div class="architecture-footer">
            <div class="architecture-legend"><span></span><p id="architecture-help">Visual konsep arsitektur</p></div>
            <div class="architecture-controls" hidden>
              <button type="button" data-model-turn="-1" aria-label="Putar model ke kiri">${I("chevron", "sm")}</button>
              <button type="button" data-model-turn="1" aria-label="Putar model ke kanan">${I("chevron", "sm")}</button>
              <button type="button" class="architecture-light" aria-pressed="false"><span class="architecture-light-icon" aria-hidden="true"></span>Senja</button>
            </div>
          </div>
        </figure>
      </div>
    </section>`;
  LJ.searchPanel = () =>
    `<div class="container search-wrap"><div class="search-panel"><div class="search-tabs" role="tablist" aria-label="Tujuan pencarian"><button role="tab" aria-selected="true" class="search-tab active" data-action="search-mode" data-id="hunian">${I("home", "sm")}Cari hunian</button><button role="tab" aria-selected="false" class="search-tab" data-action="search-mode" data-id="investasi">${I("chart", "sm")}Cari investasi</button></div><form id="hero-search" class="search-fields" action="properti.html" method="get"><div class="search-field">${I("pin")}<div><label for="hero-city">Lokasi pilihan</label><select id="hero-city" name="city"><option value="">Semua lokasi</option>${[...new Set(LJ.db.projects.map((p) => p.city))].map((c) => `<option>${E(c)}</option>`).join("")}</select></div></div><div class="search-field">${I("home")}<div><label for="hero-type">Tipe hunian</label><select id="hero-type" name="type"><option value="">Semua tipe</option><option>60/90</option><option>72/105</option><option>90/120</option></select></div></div><div class="search-field">${I("wallet")}<div><label for="hero-price">Rentang harga</label><select id="hero-price" name="price"><option value="">Semua harga</option><option value="750000000">Di bawah Rp 750 jt</option><option value="900000000">Di bawah Rp 900 jt</option><option value="1000000000">Di bawah Rp 1 M</option></select></div></div><button class="btn primary" type="submit">${I("search")}Cari Properti</button></form></div></div>`;
  LJ.lifestyleSection = () =>
    `<section class="section soft"><div class="container"><div class="section-head"><div><span class="eyebrow">${I("leaf")}DIRANCANG UNTUK KEHIDUPAN</span><h2>Rumah yang memahami Anda.</h2><p>Kenyamanan punya banyak bentuk. Temukan ruang yang memberi tempat bagi hal-hal yang Anda sayangi.</p></div></div><div class="grid three">${[
      [
        "users",
        "Untuk keluarga yang bertumbuh",
        "Ruang berkumpul yang hangat, kamar yang nyaman, dan lingkungan untuk menciptakan kenangan bersama.",
        "Ruang untuk kebersamaan",
      ],
      [
        "home",
        "Untuk langkah pertama Anda",
        "Tata ruang yang efisien dan pilihan tipe yang membantu Anda merencanakan rumah pertama dengan lebih terarah.",
        "Rencana yang lebih jelas",
      ],
      [
        "leaf",
        "Untuk hidup yang seimbang",
        "Cahaya alami, sirkulasi udara, dan kedekatan dengan ruang hijau untuk menikmati ritme hidup yang lebih tenang.",
        "Keseharian yang lebih baik",
      ],
    ]
      .map(
        ([icon, title, desc, label]) =>
          `<article class="lifestyle-card"><span class="icon-tile">${I(icon)}</span><h3>${title}</h3><p>${desc}</p><span class="lifestyle-label">${label} ${I("arrow", "sm")}</span></article>`,
      )
      .join("")}</div></div></section>`;
  LJ.pages.public.home = function () {
    const count = LJ.db.projects.length;
    return `${LJ.nav("index.html")}<main id="main">${architecture()}${LJ.searchPanel()}<div class="container benefits">${[
      ["shield", "Komitmen tepercaya", "Transparan di setiap tahapan"],
      ["gem", "Kualitas terencana", "Detail yang mengutamakan Anda"],
      ["pin", "Lokasi pilihan", "Dekat dengan kebutuhan hidup"],
      ["chart", "Nilai untuk masa depan", "Hunian yang tumbuh bersama Anda"],
    ]
      .map(
        ([i, t, d]) =>
          `<div class="benefit"><span class="icon-tile">${I(i)}</span><div><strong>${t}</strong><p>${d}</p></div></div>`,
      )
      .join(
        "",
      )}</div><section class="section"><div class="container"><div class="section-head"><div><span class="eyebrow">${I("layers")}PILIHAN HUNIAN</span><h2>Temukan tempat Anda pulang.</h2><p>Setiap kawasan punya cerita. Pilih hunian dengan ruang, lingkungan,<br>dan karakter yang paling dekat dengan Anda.</p></div>${A("Lihat semua properti", "properti.html", "secondary", "arrow")}</div><div class="grid three">${LJ.db.projects.slice(0, 3).map(LJ.projectCard).join("")}</div><div class="center-link"><a class="text-link" href="properti.html">Jelajahi semua proyek ${I("arrow", "sm")}</a></div></div></section>${LJ.latestUnits()}<section class="section soft"><div class="container split-section"><div class="about-image"><img loading="lazy" src="${LJ.image("interior")}" alt="Interior terang dengan ruang keluarga yang hangat"><div class="image-note"><span class="icon-tile article-feature-icon">${I("leaf")}</span><strong>Lebih dari<br>sekadar rumah.</strong><p>Tempat untuk bertumbuh dan menciptakan kenangan.</p></div></div><div class="about-copy"><span class="eyebrow">${I("building")}TENTANG LINYJAYA</span><h2>Membangun rumah.<br>Menghadirkan kehidupan.</h2><p>Kami percaya rumah yang baik dimulai dari memahami penghuninya. LinyJaya menyatukan perencanaan ruang, kualitas bangunan, dan kenyamanan lingkungan dalam satu visi.</p><div class="check-list">${["Desain fungsional, estetika yang bertahan", "Informasi unit dan tahapan yang transparan", "Pendampingan hingga serah terima rumah"].map((x) => `<div>${I("check")}${x}</div>`).join("")}</div>${A("Cerita di balik LinyJaya", "tentang.html", "secondary", "arrow")}</div></div></section><section class="section article-feature-panel"><div class="container"><div class="stats-strip">${[
      [count, "Rencana kawasan"],
      [
        LJ.db.projects.reduce((sum, p) => sum + p.units, 0),
        "Rencana kapasitas unit",
      ],
      [new Set(LJ.db.projects.map((p) => p.city)).size, "Kota pilihan"],
      ["3", "Pilihan tipe rumah"],
    ]
      .map(([v, l]) => `<div><strong>${v}</strong><p>${l}</p></div>`)
      .join(
        "",
      )}</div><p class="publication-caption">Rencana kawasan dan kapasitas pada katalog perlu dikonfirmasi perusahaan sebelum penawaran diterbitkan.</p></div></section><section class="section"><div class="container"><div class="section-head"><div><span class="eyebrow">${I("arrow")}PERJALANAN MENUJU RUMAH</span><h2>Langkah jelas. Hati lebih tenang.</h2><p>Dari memilih kavling hingga menerima kunci, setiap tahap saling terhubung.</p></div></div><div class="grid four">${[
      [
        "01",
        "Temukan pilihan",
        "Jelajahi proyek, tipe rumah, dan kavling yang sesuai kebutuhan.",
      ],
      [
        "02",
        "Pesan & rencanakan",
        "Ajukan pemesanan, lalu ikuti tahapan verifikasi DP dan kesepakatan.",
      ],
      [
        "03",
        "Pantau pembangunan",
        "Ikuti laporan pekerjaan, dokumentasi, dan jadwal pembangunan rumah Anda.",
      ],
      [
        "04",
        "Selamat datang di rumah",
        "Pemeriksaan akhir, penyelesaian administrasi, dan serah terima kunci.",
      ],
    ]
      .map(
        ([n, t, d]) =>
          `<article class="process-card"><div class="process-num">${n}</div><h3>${t}</h3><p>${d}</p></article>`,
      )
      .join(
        "",
      )}</div></div></section>${LJ.lifestyleSection()}${LJ.partnerStrip()}<section class="section home-cta-section"><div class="container"><div class="section-head"><div><span class="eyebrow">${I("file")}LINYJAYA INSIGHT</span><h2>Inspirasi untuk langkah berikutnya.</h2><p>Kenali rumah Anda lebih dekat, dari perencanaan hingga keseharian.</p></div>${A("Semua artikel", "artikel.html", "secondary", "arrow")}</div><div class="grid three">${LJ.db.articles.slice(0, 3).map(LJ.articleCard).join("")}</div></div></section>${LJ.cta()}</main>${LJ.footer()}`;
  };
})();
