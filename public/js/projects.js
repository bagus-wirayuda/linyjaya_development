(function () {
  const { icon: I, esc: E, btn: B, link: A } = LJ;
  LJ.projectDetail = (p, role) => {
    const units = LJ.db.units.filter((u) => u.project === p.id);
    const price = units.length
      ? Math.min(...units.map((u) => u.price))
      : p.price;
    return `${LJ.publicationNotice()}<div class="detail-hero"><img src="${LJ.image(p.image)}" alt="Referensi arsitektur untuk ${E(p.name)}"><span class="card-label">${I("pin")}${E(p.location)}</span></div><div class="detail-layout"><div class="stack"><div><div class="flex between"><span class="eyebrow">${E(p.category)}</span>${LJ.badge(p.status)}</div><h1 class="u-mt-16">${E(p.name)}</h1><p class="project-detail-intro">${E(p.description)}</p></div>${LJ.panel("Rencana kawasan", `<div class="facility-list"><div>${I("pin")}${E(p.location)}</div><div>${I("home")}${p.units} unit direncanakan</div><div>${I("layers")}${E(p.category)}</div><div>${I("clipboard")}Titik survei perlu dikonfirmasi</div></div>`)}${LJ.panel("Rencana fasilitas kawasan", `<div class="facility-list">${p.facilities.map((f) => `<div>${I("check")}${E(f)}</div>`).join("")}</div>`)}${LJ.panel("Pilih kavling Anda", LJ.sitePlan(p.id), "", "Klik kavling untuk melihat tipe, harga, dan status pembangunan.")}${LJ.panel(
      "Unit dalam proyek",
      LJ.table(
        ["Unit / tipe", "Harga", "Penjualan", "Pembangunan", ""],
        units.map((u) => [
          `<strong>${LJ.unitLabel(u.id)}</strong><small>LT ${u.land} / LB ${u.building} m²</small>`,
          LJ.money(u.price, true),
          LJ.badge(u.sale),
          LJ.badge(u.construction),
          A(
            "Detail",
            LJ.propertyPage("units", u.id, role),
            "secondary small",
            "arrow",
          ),
        ]),
      ),
    )}${LJ.panel("Galeri suasana", `<div class="grid two">${[p.image, "interior"].map((i) => `<button data-action="gallery" data-id="${i}" class="icon-btn project-gallery-button"><img src="${LJ.image(i)}" alt="Galeri ${E(p.name)}" class="project-gallery-photo"></button>`).join("")}</div>`)}</div><aside class="panel detail-price"><p class="u-text-10">Harga indikatif mulai</p><h2 class="blue project-detail-price">${LJ.money(price, true)}</h2><p class="project-detail-copy">Bandingkan luas, status pembangunan, dan posisi kavling sebelum menentukan pilihan.</p><div class="divider"></div><div class="flex between u-text-11"><span>Kavling tercatat tersedia</span><strong>${units.filter((u) => u.sale === "Tersedia").length} unit</strong></div><div class="u-mt-20">${!role || role === "client" ? B("Konsultasi proyek", "consult", p.id, "primary full", "message") : ""}</div><p class="legal-note u-mt-14">Materi visual merupakan referensi arsitektur. Lokasi, fasilitas, harga, dan ketersediaan unit perlu dikonfirmasi melalui penawaran resmi.</p></aside></div>`;
  };
})();
