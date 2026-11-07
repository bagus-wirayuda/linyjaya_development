(function () {
  const { icon: I, esc: E, btn: B } = LJ;
  LJ.unitDetail = (u, role) => {
    const p = LJ.project(u.project);
    return `${LJ.publicationNotice()}<div class="detail-hero"><img src="${LJ.image(u.image)}" alt="Visual arsitektur tipe ${E(u.type)}"><span class="card-label">${I("home")}UNIT ${E(u.block + "-" + u.number)} · DESAIN HUNIAN</span></div><div class="detail-layout"><div class="stack"><div><a class="text-link" href="${LJ.propertyPage("projects", p.id, role)}">${E(p.name)} ${I("arrow", "sm")}</a><h1 class="unit-card-amenities">Rumah ${E(u.block + "-" + u.number)} <span class="muted">/ ${E(u.type)}</span></h1><p class="u-text-12">${I("pin", "sm")} ${E(p.location)}</p><div class="detail-features">${[
      ["Luas tanah", u.land + " m²"],
      ["Luas bangunan", u.building + " m²"],
      ["Kamar tidur", u.beds],
      ["Kamar mandi", u.baths],
      ["Jumlah lantai", u.floors],
    ]
      .map(([l, v]) => `<div><small>${l}</small><strong>${v}</strong></div>`)
      .join(
        "",
      )}</div></div>${LJ.panel("Status unit", `<div class="grid two"><div><p>Penjualan</p><div class="u-mt-10">${LJ.badge(u.sale)}</div></div><div><p>Pembangunan</p><div class="u-mt-10">${LJ.badge(u.construction)}</div></div></div>${LJ.progress(u.progress, u.stage)}<p class="publication-caption">Target rencana ${LJ.date(u.estimate)}. Tanggal pelaksanaan dan penyelesaian mengikuti kesepakatan tertulis.</p>`)}${LJ.panel("Konsep denah rumah", LJ.blueprint(u.type), "", "Konsep denah lantai dasar. Ukuran dan gambar kerja resmi perlu disahkan untuk unit yang dipilih.")}${LJ.panel(
      "Rencana spesifikasi bangunan",
      LJ.table(
        ["Komponen", "Rencana spesifikasi bangunan"],
        [
          ["Pondasi", "Beton bertulang sesuai perencanaan struktur"],
          ["Dinding", "Bata ringan dengan lapisan akhir cat"],
          ["Lantai", "Ubin homogen 60 × 60 cm"],
          ["Atap", "Rangka baja ringan"],
          ["Kusen & jendela", "Aluminium dan kaca"],
          ["Sanitasi", "Air bersih dan tangki septik individual"],
          ["Daya listrik", "Rencana daya 2.200 VA"],
        ],
      ),
    )}${LJ.panel("Tahapan menuju pemesanan", `<ol class="property-steps"><li>Tinjau kavling, denah, dan rencana spesifikasi bersama tim pemasaran.</li><li>Pastikan ketersediaan, harga akhir, jadwal, dan dokumen unit melalui penawaran tertulis.</li><li>Konfirmasikan DP serta termin melalui informasi pembayaran resmi setelah kesepakatan tercapai.</li><li>Tinjau progres pembangunan dan persyaratan serah terima dalam perjanjian.</li></ol>${!role ? `<a class="text-link" href="faq.html">Baca pertanyaan umum ${I("arrow", "sm")}</a>` : ""}`)}</div><aside class="panel detail-price"><p>Harga indikatif unit</p><h2 class="blue unit-detail-price">${LJ.money(u.price, true)}</h2><p class="u-text-10">Perhitungan awal DP 20% · ${LJ.money(u.price * 0.2, true)}</p><div class="divider"></div>${u.sale === "Tersedia" && (!role || role === "client") ? B(role ? "Pesan unit" : "Ajukan minat", role ? "book" : "interest", u.id, "primary full", "clipboard") : LJ.badge(u.sale)}<div class="u-mt-12">${!role || role === "client" ? B("Tanyakan unit ini", "consult", p.id, "secondary full", "message") : ""}</div><p class="legal-note u-mt-18">Harga, rencana DP, jadwal, dan spesifikasi perlu dikonfirmasi perusahaan. Peninjauan unit mengikuti penawaran serta kesepakatan tertulis.</p></aside></div>`;
  };
})();
