(function () {
  const faqItems = [
    [
      "Memilih rumah",
      "Apakah rumah yang dipasarkan sudah selesai dibangun?",
      "Periksa status pembangunan pada setiap unit. Kavling dapat memiliki rencana hunian yang belum dibangun, sedang dikerjakan, selesai, atau telah diserahterimakan. Status penjualan ditampilkan terpisah agar tidak disamakan dengan kesiapan bangunan.",
    ],
    [
      "Memilih rumah",
      "Apa arti tipe 60/90, 72/105, dan 90/120?",
      "Angka pertama menunjukkan luas bangunan dan angka kedua menunjukkan luas tanah dalam meter persegi. Jumlah kamar, lantai, denah, serta rincian material perlu diperiksa pada unit yang dipilih dan dikonfirmasi pada spesifikasi resmi.",
    ],
    [
      "Memilih rumah",
      "Apakah foto dan denah sama dengan bangunan yang akan diterima?",
      "Galeri menampilkan referensi arsitektur dan suasana ruang. Denah merupakan konsep perencanaan. Spesifikasi unit dan gambar yang disepakati dalam dokumen resmi menjadi acuan bangunan; foto referensi tidak membuktikan bahwa proyek telah selesai.",
    ],
    [
      "Pemesanan",
      "Bagaimana tahapan menyatakan minat dan memesan unit?",
      "Pilih proyek dan kavling, susun kebutuhan konsultasi, lalu tinjau harga, spesifikasi, serta dokumen unit bersama tim pemasaran. Catatan minat atau pemesanan di halaman ini belum merupakan konfirmasi dari perusahaan atau perjanjian jual beli.",
    ],
    [
      "Pemesanan",
      "Apakah pengisian formulir mengonfirmasi jadwal survei?",
      "Belum. Formulir menyusun draf kebutuhan dan waktu pilihan. Jadwal survei berlaku setelah ada kesepakatan melalui kanal perusahaan yang telah diverifikasi. Kontak layanan resmi masih perlu dilengkapi sebelum publikasi.",
    ],
    [
      "Pembayaran",
      "Berapa DP dan biaya yang harus dipersiapkan?",
      "Rincian unit menggunakan perhitungan awal DP sebesar 20% untuk membantu membaca rencana pembayaran. Nominal akhir, tenggat, biaya pajak dan administrasi, serta jadwal termin harus dikonfirmasi dalam penawaran tertulis. Perhitungan tersebut bukan kebijakan pembayaran yang telah disahkan.",
    ],
    [
      "Pembayaran",
      "Apakah memilih bukti pembayaran berarti dana sudah diterima?",
      "Tidak. Berkas dan status peninjauan merupakan catatan administrasi. Penerimaan dana membutuhkan pemeriksaan rekening dan konfirmasi resmi; perubahan status pada halaman ini tidak memindahkan uang atau membuktikan pembayaran.",
    ],
    [
      "Pembayaran",
      "Apakah pemesanan dapat dibatalkan dan DP dikembalikan?",
      "Syarat pembatalan, potongan biaya, dan pengembalian dana perlu ditetapkan perusahaan dalam perjanjian resmi. Tidak ada janji pengembalian otomatis. Pembatalan catatan pemesanan pada ruang kerja tidak menggantikan proses pembatalan perjanjian.",
    ],
    [
      "Pembangunan",
      "Kapan pembangunan rumah dimulai?",
      "Rencana pembangunan mengikuti kesepakatan unit, kesiapan dokumen, dan hasil verifikasi DP. Tanggal mulai serta target selesai memerlukan konfirmasi tertulis. Penandaan tahap pekerjaan pada ruang kerja adalah pencatatan progres, bukan jaminan pelaksanaan di lapangan.",
    ],
    [
      "Pembangunan",
      "Bagaimana membaca progres dan estimasi selesai?",
      "Persentase merangkum laporan pekerjaan yang telah ditinjau. Lihat tanggal laporan, tahap, dokumentasi, dan kendala secara bersama. Estimasi perlu ditinjau bersama tim proyek dan tidak menggantikan jadwal yang disepakati dalam perjanjian.",
    ],
    [
      "Pembangunan",
      "Bisakah tata ruang atau material diubah?",
      "Ajukan kebutuhan perubahan untuk ditinjau dari sisi teknis, biaya, dan jadwal. Perubahan baru menjadi acuan setelah dituangkan dalam persetujuan tertulis; pengisian permintaan tidak otomatis menyetujui pekerjaan tambahan.",
    ],
    [
      "Dokumen",
      "Apa yang diperiksa sebelum serah terima?",
      "Tinjau hasil pekerjaan, daftar temuan, status pembayaran, dokumen unit, dan berita acara bersama perusahaan. Persyaratan terperinci, masa pemeliharaan, serta tindak lanjut temuan perlu disahkan dalam dokumen resmi sebelum digunakan.",
    ],
  ];
  LJ.legalDocument = (kind) => {
    const privacy = kind === "privacy";
    const title = privacy ? "Kebijakan Privasi" : "Syarat & Ketentuan";
    const sections = privacy
      ? [
          [
            "Ruang lingkup informasi",
            "Layanan yang diperkenalkan mencakup konsultasi properti, rencana pemesanan, administrasi pembayaran, pembangunan, dan dokumen rumah. Pernyataan privasi resmi untuk layanan tersebut masih memerlukan pengesahan perusahaan.",
          ],
          [
            "Data dalam formulir dan administrasi",
            "Formulir konsultasi memuat nama, kontak, proyek pilihan, waktu yang diinginkan, serta kebutuhan hunian. Administrasi pemesanan dapat berkaitan dengan identitas klien, unit, jadwal pembayaran, bukti pembayaran, serta dokumen perjanjian. Jenis data yang benar-benar diwajibkan perlu ditetapkan perusahaan sesuai kebutuhan layanan.",
          ],
          [
            "Tujuan dan dasar pemrosesan — perlu dilengkapi",
            "Perusahaan perlu menetapkan tujuan setiap pengumpulan data, dasar pemrosesan, serta pemberitahuan dan persetujuan yang relevan. Belum ada pernyataan yang disahkan mengenai penggunaan data untuk pemasaran, pembagian data dengan bank atau kontraktor, maupun penggunaan oleh penyedia layanan lain.",
          ],
          [
            "Pengendali data dan kontak — perlu dilengkapi",
            "Nama badan hukum pengendali data, alamat korespondensi, dan kanal kontak privasi resmi belum disahkan untuk publikasi. Detail tersebut wajib ditetapkan sebelum kebijakan ini diberlakukan.",
          ],
          [
            "Penyimpanan, penerima, dan pelindungan — perlu dilengkapi",
            "Masa penyimpanan, kriteria penghapusan, pihak penerima, kemungkinan pemindahan data, serta langkah pelindungan yang benar-benar diterapkan perlu diverifikasi. Tidak ada janji kerahasiaan mutlak, sertifikasi keamanan, atau jaminan transaksi pada naskah ini.",
          ],
          [
            "Permintaan terkait data — perlu dilengkapi",
            "Prosedur untuk meminta informasi, koreksi, pembaruan, penarikan persetujuan, atau penghapusan data perlu dilengkapi dengan kanal resmi, persyaratan verifikasi, dan ketentuan yang berlaku. Tenggat penanganan tidak ditetapkan sebelum proses perusahaan dikonfirmasi.",
          ],
          [
            "Pemberlakuan kebijakan",
            "Tanggal berlaku, penanggung jawab pengesahan, serta cara pemberitahuan perubahan belum ditetapkan. Naskah ini belum merupakan kebijakan privasi resmi yang berlaku dan harus ditinjau sebelum publikasi.",
          ],
        ]
      : [
          [
            "Informasi properti dan penawaran",
            "Katalog membantu peninjauan awal lokasi, tipe, harga, fasilitas, dan rencana pembangunan. Materi pemasaran bukan pengganti pemeriksaan dokumen unit atau penawaran tertulis. Harga dan rincian proyek perlu diverifikasi perusahaan sebelum digunakan sebagai penawaran resmi.",
          ],
          [
            "Konsultasi dan kunjungan",
            "Pengisian draf konsultasi belum mengonfirmasi penerimaan permintaan atau jadwal kunjungan. Waktu dan lokasi kunjungan perlu disepakati melalui kanal perusahaan yang telah diverifikasi.",
          ],
          [
            "Pemesanan dan dokumen unit",
            "Pemilihan kavling dan pencatatan pemesanan tidak dengan sendirinya membentuk perjanjian jual beli. Identitas para pihak, unit, spesifikasi, harga, tenggat, dan persyaratan administrasi harus ditinjau serta disepakati secara tertulis.",
          ],
          [
            "DP, termin, dan konfirmasi pembayaran",
            "Perhitungan DP dan termin pada rincian unit merupakan rencana administrasi. Penerima pembayaran resmi, nominal, tenggat, dan biaya terkait memerlukan pengesahan perusahaan. Pengunggahan bukti atau perubahan status peninjauan tidak membuktikan dana telah diterima.",
          ],
          [
            "Pembatalan dan pengembalian — perlu dilengkapi",
            "Masa berlaku pemesanan, kondisi pembatalan, biaya yang mungkin timbul, serta ketentuan pengembalian DP belum disahkan. Tidak ada pengembalian dana otomatis atau jaminan pembatalan tanpa biaya yang dapat disimpulkan dari halaman ini.",
          ],
          [
            "Pembangunan dan perubahan pekerjaan",
            "Jadwal mulai, tahapan, target selesai, spesifikasi, perubahan desain, serta penyesuaian biaya menjadi bagian yang perlu dikonfirmasi dalam kesepakatan tertulis. Laporan progres membantu pemantauan dan tidak menggantikan pemeriksaan mutu di lapangan.",
          ],
          [
            "Serah terima dan pemeliharaan — perlu dilengkapi",
            "Pemeriksaan bangunan, pelunasan, dokumen unit, berita acara, penanganan temuan, serta masa pemeliharaan perlu ditetapkan perusahaan. Tidak ada jaminan waktu penyelesaian atau layanan purnajual yang dinyatakan sebelum ketentuan resmi tersedia.",
          ],
          [
            "Materi visual dan referensi perusahaan",
            "Foto dan denah memperkenalkan gagasan arsitektur serta perencanaan ruang. Logo perusahaan lain merupakan referensi industri dan bukan pernyataan kerja sama, persetujuan pembiayaan, atau dukungan resmi.",
          ],
          [
            "Pengesahan ketentuan",
            "Identitas badan hukum, kontak layanan, biaya, mekanisme pengaduan dan penyelesaian perbedaan, serta tanggal berlaku perlu dilengkapi dan disahkan sebelum ketentuan ini diberlakukan.",
          ],
        ];
    return `<div class="legal-status">${LJ.icon("file")}<div><strong>${LJ.editorial.status}</strong><p>Identitas, kontak resmi, dan ketentuan yang mengikat belum disahkan. Bagian bertanda perlu dilengkapi sebelum naskah diberlakukan.</p></div></div><div class="legal-sections">${sections.map(([heading, body], i) => `<section><h2><span>${String(i + 1).padStart(2, "0")}</span>${heading}</h2><p>${body}</p></section>`).join("")}</div><div class="legal-related"><a href="faq.html">Pertanyaan umum ${LJ.icon("arrow", "sm")}</a><a href="${privacy ? "syarat-ketentuan.html" : "kebijakan-privasi.html"}">${privacy ? "Syarat & Ketentuan" : "Kebijakan Privasi"} ${LJ.icon("arrow", "sm")}</a></div>`;
  };
  LJ.informationPage = (path) => {
    const faq = path === "faq.html";
    const privacy = path === "kebijakan-privasi.html";
    const title = faq
      ? "Pertanyaan Umum"
      : privacy
        ? "Kebijakan Privasi"
        : "Syarat & Ketentuan";
    return (
      LJ.pageHero(
        "Informasi pelanggan",
        title,
        faq
          ? "Panduan memahami pilihan hunian, pemesanan, pembayaran, dan perjalanan pembangunan."
          : "Informasi untuk memahami hak, tanggung jawab, dan hal-hal yang perlu dipastikan sebelum melanjutkan proses kepemilikan rumah.",
      ) +
      `<div class="container page-body"><div class="legal-layout"><aside class="legal-nav" aria-label="Informasi pelanggan">${[
        ["kebijakan-privasi.html", "Kebijakan Privasi"],
        ["syarat-ketentuan.html", "Syarat & Ketentuan"],
        ["faq.html", "Pertanyaan Umum"],
      ]
        .map(
          ([url, label]) =>
            `<a href="${url}" class="${label === title ? "active" : ""}">${label}${LJ.icon("chevron", "sm")}</a>`,
        )
        .join(
          "",
        )}<p>Pastikan rincian unit dan kesepakatan selalu ditinjau melalui dokumen resmi perusahaan.</p></aside><article class="panel legal-content">${faq ? `<div class="legal-status">${LJ.icon("info")}<div><strong>Kejelasan sebelum mengambil keputusan</strong><p>Jawaban berikut membantu peninjauan awal. Ketentuan DP, biaya, pembangunan, dan layanan mengikuti pengesahan perusahaan serta dokumen unit.</p></div></div>${faqItems.map(([cat, q, a], i) => `<details class="faq-item" ${i === 0 ? "open" : ""}><summary><span><small>${cat}</small>${q}</span>${LJ.icon("plus", "sm")}</summary><p>${a}</p></details>`).join("")}` : LJ.legalDocument(privacy ? "privacy" : "terms")}</article></div></div>`
    );
  };
})();
