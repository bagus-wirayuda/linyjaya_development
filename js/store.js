/* Frontend state adapter. Replace this layer with PHP endpoints during integration. */
(function () {
  const KEY = "linyjaya-demo-v1";
  const clone = (x) => JSON.parse(JSON.stringify(x));
  let db;
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    db = saved?.version === LJ.seed.version ? saved : clone(LJ.seed);
  } catch {
    db = clone(LJ.seed);
  }
  // Refresh the original marketing fixtures without losing reservations or uploads.
  if ((db.contentRevision || 1) < 3) {
    const previousNames = [
      "Bank Mitra",
      "Studio Arsitektur",
      "Material Partner",
      "Legal Partner",
    ];
    db.partners = db.partners.map((p) =>
      previousNames.includes(p.name)
        ? clone(LJ.seed.partners.find((x) => x.id === p.id) || p)
        : p,
    );
    if (db.company.address === "Bandung, Jawa Barat — alamat kantor contoh")
      db.company.address = LJ.seed.company.address;
    if (db.company.phone === "Nomor WhatsApp belum dikonfigurasi")
      db.company.phone = LJ.seed.company.phone;
    db.articles.forEach((article) => {
      article.body = article.body
        .replace(
          "Jadwal pada demo ini bersifat ilustratif.",
          "Periksa pembaruan jadwal secara berkala dan diskusikan kebutuhan Anda dengan tim proyek.",
        )
        .replace(
          "Melalui portal client, dokumentasi dan laporan progres dapat dilihat dalam satu timeline.",
          "Dokumentasi dan laporan progres membantu Anda memahami perkembangan rumah dalam satu rangkaian tahapan.",
        );
    });
    db.contentRevision = 3;
    try {
      localStorage.setItem(KEY, JSON.stringify(db));
    } catch {}
  }
  if ((db.contentRevision || 1) < 4) {
    const rename = {
      "Bukti transfer demo.pdf": "Lampiran pembayaran PAY-001",
      "DP Andi demo.pdf": "Lampiran pembayaran PAY-003",
      "Simulasi konsultasi awal penataan ruang.":
        "Konsultasi awal untuk memahami kebutuhan dan alternatif penataan ruang.",
    };
    for (const key of ["payments", "promos"])
      db[key].forEach((record) =>
        Object.keys(record).forEach((field) => {
          if (rename[record[field]]) record[field] = rename[record[field]];
        }),
      );
    db.projects.forEach((p) => {
      p.facilities = p.facilities.map((f) =>
        f === "Keamanan 24 jam" ? "Rencana pengelolaan keamanan" : f,
      );
    });
    for (const person of [
      db.company,
      db.profile,
      ...db.employees,
      ...db.accounts,
    ]) {
      if (person.role === "Client") person.role = "Klien";
    }
    db.notifications.forEach((record) => {
      if (record.role === "Client") record.role = "Klien";
    });
    db.audit.forEach((log) => {
      if (log.actor === "Demo") log.actor = "Pengelola";
    });
    db.contentRevision = 4;
    try {
      localStorage.setItem(KEY, JSON.stringify(db));
    } catch {}
  }
  LJ.db = db;
  LJ.uid = (prefix) =>
    prefix +
    "-" +
    Date.now().toString(36) +
    "-" +
    Math.random().toString(36).slice(2, 6);
  LJ.today = () =>
    new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Singapore" });
  LJ.save = (action = "Perubahan disimpan", role = "Pengelola") => {
    const previousAudit = db.audit;
    db.audit = [
      {
        id: LJ.uid("LOG"),
        date: new Date().toISOString(),
        actor: role,
        action,
      },
      ...previousAudit,
    ].slice(0, 150);
    try {
      localStorage.setItem(KEY, JSON.stringify(db));
      return true;
    } catch {
      db.audit = previousAudit;
      LJ.toast?.(
        "Catatan belum dapat disimpan. Siapkan salinan catatan sebelum meninggalkan halaman dan coba kembali.",
        "error",
      );
      return false;
    }
  };
  LJ.reset = () => {
    localStorage.removeItem(KEY);
    location.reload();
  };
  LJ.project = (id) => db.projects.find((x) => x.id === id);
  LJ.unit = (id) => db.units.find((x) => x.id === id);
  LJ.employeeName = () =>
    db.employees.find((x) => x.id === "EMP-001")?.name || "Rafi Hidayat";
  LJ.roles.employee.person = LJ.employeeName();
  LJ.roles.client.person = db.profile.name;
  LJ.book = (id) => db.bookings.find((x) => x.id === id);
  LJ.unitLabel = (id) => {
    const u = LJ.unit(id);
    return u ? `${u.block}-${u.number} · Tipe ${u.type}` : "Unit diarsipkan";
  };
  LJ.clientBookings = () =>
    db.bookings.filter((x) => x.client === db.profile.name);
  LJ.clientPayments = () =>
    db.payments.filter((x) =>
      LJ.clientBookings().some((b) => b.id === x.booking),
    );
  LJ.notify = (title, message, role, client = "") =>
    db.notifications.unshift({
      id: LJ.uid("NT"),
      title,
      message,
      role,
      client,
      date: LJ.today(),
      status: "Baru",
    });
  LJ.bookUnit = (id, note = "") => {
    const u = LJ.unit(id);
    if (!u || u.sale !== "Tersedia")
      throw Error("Unit ini sudah tidak tersedia. Pilih kavling lain.");
    const b = {
      id: LJ.uid("BK"),
      unit: id,
      client: db.profile.name,
      date: LJ.today(),
      status: "Menunggu DP",
      note,
    };
    db.bookings.unshift(b);
    u.sale = "Dipesan";
    const due = new Date();
    due.setDate(due.getDate() + 7);
    db.payments.unshift({
      id: LJ.uid("PAY"),
      booking: b.id,
      client: b.client,
      kind: "DP",
      amount: Math.round(u.price * 0.2),
      due: due.toLocaleDateString("en-CA", { timeZone: "Asia/Singapore" }),
      date: "",
      status: "Belum dibayar",
      proof: "",
    });
    if (
      !LJ.save(
        `Catatan pemesanan ${b.id} dibuat untuk ${LJ.unitLabel(id)}`,
        "Klien",
      )
    ) {
      db.bookings.shift();
      db.payments.shift();
      u.sale = "Tersedia";
      throw Error("Catatan pemesanan belum dapat disimpan. Coba kembali.");
    }
    return b;
  };
  LJ.cancelBooking = (id) => {
    const b = LJ.book(id);
    if (!b || b.status !== "Menunggu DP")
      throw Error(
        "Pembatalan pemesanan dengan catatan DP terverifikasi memerlukan peninjauan ketentuan dan persetujuan perusahaan.",
      );
    const payments = db.payments.filter((p) => p.booking === id);
    if (
      payments.some(
        (p) =>
          p.status === "Menunggu verifikasi" || p.status === "Terverifikasi",
      )
    )
      throw Error("Selesaikan peninjauan pembayaran sebelum pembatalan.");
    b.status = "Dibatalkan";
    LJ.unit(b.unit).sale = "Tersedia";
    payments.forEach((p) => (p.status = "Dibatalkan"));
    return LJ.save(`Catatan pemesanan ${id} dibatalkan`, "Klien");
  };
  LJ.submitPayment = (id, proof, reference, proofData = "") => {
    const p = db.payments.find((p) => p.id === id);
    if (!p || !["Belum dibayar", "Ditolak"].includes(p.status))
      throw Error("Pembayaran tidak dapat diajukan lagi.");
    if (!proof) throw Error("Pilih berkas bukti pembayaran.");
    if (LJ.book(p.booking)?.status === "Dibatalkan")
      throw Error("Pemesanan telah dibatalkan.");
    const previous = { ...p };
    p.status = "Menunggu verifikasi";
    p.date = LJ.today();
    p.proof = proof;
    p.reference = reference;
    p.proofData = proofData;
    LJ.notify(
      "Bukti pembayaran baru",
      p.client + " mengajukan bukti " + p.kind + " untuk " + p.booking + ".",
      "Administrator",
    );
    if (
      !LJ.save(`Lampiran pembayaran ${id} dicatat untuk peninjauan`, "Klien")
    ) {
      for (const key of ["reference", "proofData"])
        if (!(key in previous)) delete p[key];
      Object.assign(p, previous);
      db.notifications.shift();
      throw Error(
        "Lampiran belum dapat disimpan. Coba gunakan berkas yang lebih kecil.",
      );
    }
  };
  LJ.verifyPayment = (id, approved) => {
    const p = db.payments.find((p) => p.id === id);
    if (!p || p.status !== "Menunggu verifikasi")
      throw Error("Pembayaran sudah diproses atau belum memiliki bukti.");
    p.status = approved ? "Terverifikasi" : "Ditolak";
    if (approved && p.kind === "DP") {
      const b = LJ.book(p.booking),
        u = LJ.unit(b.unit);
      b.status = "DP terverifikasi";
      u.sale = "DP terverifikasi";
      db.documents.unshift({
        id: LJ.uid("DOC"),
        booking: b.id,
        client: b.client,
        title: "Konfirmasi pemesanan " + LJ.unitLabel(u.id),
        kind: "Perjanjian",
        date: LJ.today(),
        status: "Tersedia",
      });
      if (!db.payments.some((x) => x.booking === b.id && x.kind === "Termin 1"))
        db.payments.push({
          id: LJ.uid("PAY"),
          booking: b.id,
          client: b.client,
          kind: "Termin 1",
          amount: Math.round(u.price * 0.3),
          due: u.estimate,
          date: "",
          status: "Belum dibayar",
          proof: "",
        });
    }
    LJ.notify(
      approved
        ? "Hasil peninjauan bukti dicatat"
        : "Bukti pembayaran perlu diperbarui",
      p.kind + " · " + p.booking + (approved ? " · Status pencatatan: Terverifikasi" : ""),
      "Klien",
      p.client,
    );
    return LJ.save(
      `Hasil peninjauan pembayaran ${id} dicatat: ${approved ? "Terverifikasi" : "Ditolak"}`,
      "Administrator",
    );
  };
  LJ.startConstruction = (id) => {
    const u = LJ.unit(id);
    if (!u || u.sale !== "DP terverifikasi")
      throw Error("Pembangunan hanya dimulai setelah DP terverifikasi.");
    if (u.construction !== "Belum dibangun")
      throw Error("Pembangunan unit sudah dimulai.");
    u.construction = "Dalam pembangunan";
    u.stage = "Persiapan";
    u.progress = 5;
    return LJ.save(
      `Tahap persiapan ${LJ.unitLabel(id)} dicatat`,
      "Administrator",
    );
  };
  LJ.approveReport = (id, approved, actor = "Pimpinan") => {
    const r = db.reports.find((x) => x.id === id);
    if (!r || r.status !== "Menunggu persetujuan")
      throw Error("Laporan ini sudah diproses.");
    const u = LJ.unit(r.unit);
    if (approved && u.sale !== "DP terverifikasi")
      throw Error("DP unit belum terverifikasi.");
    if (approved && u.construction !== "Dalam pembangunan")
      throw Error("Unit belum dalam pembangunan atau telah selesai.");
    if (
      !Number.isFinite(Number(r.progress)) ||
      r.progress < 0 ||
      r.progress > 100
    )
      throw Error("Progres laporan harus antara 0 dan 100.");
    if (approved && r.progress < u.progress)
      throw Error(
        "Progres laporan lebih rendah dari progres saat ini. Minta revisi laporan.",
      );
    r.status = approved ? "Disetujui" : "Perlu revisi";
    if (approved) {
      u.progress = Number(r.progress);
      u.stage = r.stage;
      u.construction = r.progress === 100 ? "Selesai" : "Dalam pembangunan";
      LJ.notify(
        "Progres rumah diperbarui",
        LJ.unitLabel(u.id) +
          " mencapai " +
          u.progress +
          "% pada tahap " +
          u.stage +
          ".",
        "Klien",
        db.bookings.find((b) => b.unit === u.id && b.status !== "Dibatalkan")
          ?.client || "",
      );
    } else
      LJ.notify(
        "Laporan perlu revisi",
        r.title + " · " + LJ.unitLabel(u.id),
        "Karyawan",
      );
    return LJ.save(`Laporan ${id} ${r.status.toLowerCase()}`, actor);
  };
  LJ.handover = (id) => {
    const u = LJ.unit(id),
      b = db.bookings.find((x) => x.unit === id && x.status !== "Dibatalkan");
    if (!u || u.progress !== 100 || u.construction !== "Selesai")
      throw Error("Pembangunan harus selesai 100%.");
    const paid = db.payments
      .filter((x) => x.booking === b?.id && x.status === "Terverifikasi")
      .reduce((s, x) => s + x.amount, 0);
    if (paid < u.price)
      throw Error(
        "Pembayaran harus lunas sebelum serah terima. Tambahkan dan verifikasi termin pelunasan.",
      );
    u.construction = "Diserahterimakan";
    u.sale = "Terjual";
    b.status = "Selesai";
    db.documents.unshift({
      id: LJ.uid("DOC"),
      booking: b.id,
      client: b.client,
      title: "Berita acara serah terima " + LJ.unitLabel(id),
      kind: "Serah terima",
      date: LJ.today(),
      status: "Tersedia",
    });
    return LJ.save(
      `Catatan serah terima ${LJ.unitLabel(id)} diperbarui`,
      "Administrator",
    );
  };
  LJ.metrics = () => ({
    available: db.units.filter((u) => u.sale === "Tersedia").length,
    building: db.units.filter((u) => u.construction === "Dalam pembangunan")
      .length,
    revenue: db.payments
      .filter((p) => p.status === "Terverifikasi")
      .reduce((s, p) => s + p.amount, 0),
    pending:
      db.payments.filter((p) => p.status === "Menunggu verifikasi").length +
      db.reports.filter((r) => r.status === "Menunggu persetujuan").length +
      db.expenses.filter((e) => e.status === "Menunggu persetujuan").length,
  });
})();
