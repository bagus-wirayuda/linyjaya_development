/* Editorial content. Unconfirmed company facts are explicitly awaiting approval. */
(function () {
  LJ.editorial = {
    status: "Perlu pengesahan sebelum publikasi",
    pricing:
      "Harga, luas, fasilitas, serta jadwal merupakan rencana penawaran yang perlu dikonfirmasi perusahaan. Rincian yang mengikat mengikuti dokumen resmi unit.",
    record:
      "Status di ruang kerja menunjukkan catatan administrasi. Konfirmasi pemesanan, penerimaan dana, dan persetujuan mengacu pada dokumen resmi perusahaan.",
    draft:
      "Draf administrasi untuk peninjauan. Bukan bukti transfer, kuitansi resmi, atau perjanjian yang telah ditandatangani.",
    form: "Lengkapi rencana konsultasi Anda. Jadwal belum dikonfirmasi oleh tim pemasaran.",
    formResult:
      "Draf konsultasi tersimpan. Belum ada pengiriman atau konfirmasi jadwal dari tim pemasaran.",
    paymentResult:
      "Catatan bukti pembayaran diperbarui. Penerimaan dana belum dikonfirmasi melalui tindakan ini.",
  };
  LJ.publicationNotice = () =>
    `<div class="publication-note">${LJ.icon("info")}<span><strong>Informasi perlu dikonfirmasi</strong><br>${LJ.esc(LJ.editorial.pricing)}</span></div>`;
})();
