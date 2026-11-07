(function () {
  const { icon: I, esc: E } = LJ;
  LJ.pages.public.contact = function () {
    return `${LJ.pageHero("Kontak kami", "Mari bicarakan rumah Anda.", "Ceritakan kebutuhan ruang, lokasi pilihan, dan rencana Anda. Kami membantu Anda memahami pilihan hunian dengan lebih jelas.")}<div class="container page-body"><div class="grid two align-start"><div class="stack">${LJ.panel(
      "Temui LinyJaya",
      `<div class="stack">${[
        [
          "pin",
          "Wilayah dalam katalog",
          [...new Set(LJ.db.projects.map((p) => p.city))].join(", "),
        ],
        [
          "message",
          "Konsultasi properti",
          "Pilih jadwal melalui formulir konsultasi",
        ],
        ["calendar", "Kunjungan lokasi", "Survei kawasan melalui perjanjian"],
        [
          "clock",
          "Jam layanan",
          "Perlu konfirmasi perusahaan sebelum publikasi",
        ],
      ]
        .map(
          ([i, t, d]) =>
            `<div class="flex"><span class="icon-tile">${I(i)}</span><div><strong class="u-text-11">${t}</strong><p class="contact-detail-copy">${E(d)}</p></div></div>`,
        )
        .join("")}</div>`,
    )}<div class="contact-map" aria-label="Wilayah pilihan dalam katalog, bukan lokasi kantor"><div class="map-pin">${I("pin", "lg")}Bandung, Jawa Barat<small class="muted">Alamat kantor dan titik kunjungan perlu konfirmasi</small></div></div></div>${LJ.panel("Jadwalkan percakapan", `<p class="contact-form-intro">${E(LJ.editorial.form)}</p><form id="contact-form"><div class="form-error" role="alert"></div><div class="form-grid">${LJ.field({ name: "name", label: "Nama lengkap", required: true })}${LJ.field({ name: "phone", label: "Nomor telepon", type: "tel", required: true })}${LJ.field({ name: "email", label: "Email", type: "email", required: true })}${LJ.field({ name: "project", label: "Proyek yang diminati", type: "select", options: [["", "Belum menentukan"], ...LJ.db.projects.map((p) => [p.id, p.name])] })}${LJ.field({ name: "date", label: "Tanggal konsultasi", type: "date", min: LJ.today(), required: true })}${LJ.field({ name: "interest", label: "Topik", type: "select", options: ["Survei lokasi", "Konsultasi KPR", "Pilihan unit", "Kemitraan"] })}${LJ.field({ name: "notes", label: "Ceritakan kebutuhan Anda", type: "textarea", wide: true, required: true })}</div><label class="contact-form-consent"><input type="checkbox" required>Saya memahami catatan ini belum merupakan konfirmasi jadwal atau pemesanan.</label><button type="submit" class="btn primary full">${I("arrow")}Rencanakan konsultasi</button></form>`)}</div></div>`;
  };
})();
