(function () {
  const { icon: I, esc: E } = LJ;
  LJ.pages.public.about = function () {
    return `${LJ.pageHero("Tentang kami", "Ruang yang baik. Kehidupan yang berarti.", "LinyJaya Development menghadirkan hunian terencana dengan ruang yang nyaman, desain fungsional, dan informasi yang transparan.")}<div class="container page-body"><div class="split-section"><img src="${LJ.image("hero")}" alt="Hunian dengan lanskap terencana" class="about-page-photo"><div class="about-copy"><span class="eyebrow">CERITA LINYJAYA</span><h2>Membangun dengan hati.<br>Merencanakan untuk esok.</h2><p>Rumah menjadi latar bagi banyak momen penting. Karena itu, setiap pilihan ruang, material, dan lingkungan layak direncanakan dengan cermat.</p><p class="u-mt-15">Dari memilih kawasan hingga menerima kunci, kami mendampingi Anda memahami pilihan tipe, spesifikasi, dan tahapan pembangunan. Kejelasan informasi menjadi bagian penting dari pengalaman memiliki rumah.</p><p class="u-mt-18">Tiga karakter kawasan—modern tropis, kontemporer, dan dekat alam—memberi ruang untuk menemukan hunian yang paling sesuai dengan keseharian Anda.</p></div></div><div class="section grid two">${LJ.panel("Visi kami", `<p>${E(LJ.db.company.vision)}</p>`)}${LJ.panel("Misi kami", `<p>${E(LJ.db.company.mission)}</p>`)}</div><div class="section-head"><div><span class="eyebrow">NILAI YANG KAMI BAWA</span><h2>Fondasi setiap keputusan.</h2></div></div><div class="grid four">${[
      [
        "shield",
        "Integritas",
        "Informasi yang jujur dan proses yang dapat ditelusuri.",
      ],
      [
        "gem",
        "Kualitas",
        "Perencanaan dan pengerjaan dengan perhatian pada detail.",
      ],
      [
        "users",
        "Kepedulian",
        "Ruang yang menjawab kebutuhan nyata penghuninya.",
      ],
      [
        "leaf",
        "Keberlanjutan",
        "Kawasan yang mempertimbangkan kehidupan jangka panjang.",
      ],
    ]
      .map(
        ([i, t, d]) =>
          `<div class="process-card"><span class="icon-tile">${I(i)}</span><h3 class="u-mt-20">${t}</h3><p>${d}</p></div>`,
      )
      .join("")}</div><div class="section">${LJ.panel(
      "Keputusan yang nyaman dimulai dari informasi yang jelas",
      `<div class="notice">${I("info")}Tim kami mendampingi peninjauan informasi proyek, spesifikasi, dan dokumen terkait sebelum Anda menentukan pilihan hunian.</div>${LJ.table(
        ["Dokumen", "Keterangan"],
        [
          [
            "Konsultasi kebutuhan",
            "Pilihan lokasi, ruang, dan rencana anggaran",
          ],
          ["Informasi proyek", "Tinjau rincian kawasan dan ketersediaan unit"],
          ["Dokumen unit", "Dapat ditinjau bersama tim saat konsultasi"],
        ],
      )}`,
    )}</div></div>${LJ.cta()}`;
  };
})();
