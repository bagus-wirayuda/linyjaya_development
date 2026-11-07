(function () {
  const { icon: I, esc: E, btn: B, link: A } = LJ;
  const { role: currentRole, params } = LJ.currentPage;
  let renderedRole = null;
  let dashboardTab = params.get("tab");
  LJ.filters =
    LJ.currentPage.file === "properti.html"
      ? Object.fromEntries(
          ["city", "type", "price"].map((key) => [key, params.get(key) || ""]),
        )
      : {};
  LJ.publicTab = "all";
  LJ.tableQuery = "";
  const compactNavigation = matchMedia("(max-width: 950px)");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const revealObserver =
    typeof IntersectionObserver === "undefined"
      ? null
      : new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.06 },
        );
  function syncNavigation() {
    for (const menu of document.querySelectorAll(".sidebar, .nav-links")) {
      const hidden = compactNavigation.matches && !menu.classList.contains("open");
      menu.inert = hidden;
      menu.setAttribute("aria-hidden", String(hidden));
    }
  }
  function setNavigationOpen(menu, open) {
    menu.classList.toggle("open", open);
    if (menu.id === "workspace-sidebar")
      document.querySelector(".sidebar-overlay").classList.toggle("open", open);
    const toggle = document.querySelector(`[aria-controls="${menu.id}"]`);
    toggle.setAttribute("aria-expanded", String(open));
    if (!open) toggle.focus({ preventScroll: true });
    syncNavigation();
    if (open) menu.querySelector("a[href]")?.focus({ preventScroll: true });
  }
  function syncSidebarSubmenu() {
    const submenu = document.getElementById("workspace-submenu");
    if (!submenu) return;
    const toggle = document.querySelector(".sidebar-submenu-toggle");
    const tabs = [
      ...document.querySelectorAll("#workspace-content > .reveal > .tabs > [data-tab]"),
    ];
    submenu.hidden = toggle.hidden = tabs.length === 0;
    if (!tabs.length) return;
    const links = submenu.firstElementChild;
    if (
      links.children.length !== tabs.length ||
      tabs.some((tab, index) => links.children[index].dataset.sidebarTab !== tab.dataset.tab)
    ) {
      links.innerHTML = tabs
        .map((tab) => `<button type="button" data-sidebar-tab="${E(tab.dataset.tab)}">${E(tab.textContent)}</button>`)
        .join("");
    }
    tabs.forEach((tab, index) =>
      links.children[index].setAttribute("aria-pressed", tab.getAttribute("aria-selected")),
    );
  }
  LJ.render = () => {
    const { file, page, role, menu, id, resource } = LJ.currentPage;
    const active = document.activeElement,
      inputId = active?.id,
      selection = active?.selectionStart;
    if (role && LJ.roles[role]) {
      if (renderedRole !== role || !document.querySelector(".workspace")) {
        document.getElementById("app").innerHTML = LJ.workspaceShell(
          role,
          menu,
        );
        renderedRole = role;
      }
      document.getElementById("workspace-content").innerHTML =
        page === "access"
          ? LJ.pages.client.access(file)
          : page === "property-detail"
            ? LJ.workspaceProperty(LJ.currentPage)
            : LJ.dashboardContent(role, menu, dashboardTab);
      const menuLabel = LJ.roles[role].menus.find(([key]) => key === menu)?.[1];
      document.getElementById("workspace-breadcrumb").textContent =
        page === "property-detail"
          ? resource === "units" ? "Detail Unit" : "Detail Proyek"
          : menuLabel || "Dashboard";
      syncSidebarSubmenu();
      document
        .querySelector(".sidebar .count")
        ?.replaceChildren(
          document.createTextNode(String(LJ.metrics().pending)),
        );
      document.title = `${menuLabel || "Dashboard"} · LinyJaya ${LJ.roles[role].name}`;
    } else {
      renderedRole = null;
      document.getElementById("app").innerHTML = page === "portal"
        ? `<main id="main">${LJ.pages.shared.portal()}</main>`
        : LJ.publicPage(file, id);
      LJ.mountArchitecture?.();
      document.title =
        file === "index.html"
          ? "LinyJaya Development — Ruang untuk hidup lebih baik."
          : (document
              .querySelector("h1")
              ?.textContent?.replace(/\s+/g, " ")
              .trim() || "LinyJaya Development") + " · LinyJaya Development";
    }
    if (inputId) {
      const el = document.getElementById(inputId);
      if (el) {
        el.focus({ preventScroll: true });
        try {
          el.setSelectionRange(selection, selection);
        } catch {}
      }
    }
    syncNavigation();
    revealObserver?.disconnect();
    if (!role && revealObserver && !reducedMotion.matches) {
      document
        .querySelectorAll(
          "#main :is(.section-head, .benefits, .project-card, .article-card, .about-copy, .about-image, .lifestyle-card, .process-card, .partner-card, .stats-strip, .cta-band)",
        )
        .forEach((el) => {
          if (el.getBoundingClientRect().top > innerHeight) {
            el.classList.add("scroll-reveal");
            revealObserver.observe(el);
          }
        });
    }
  };
  function role() {
    return currentRole || "public";
  }
  function actor() {
    return LJ.roles[role()]?.name || "Pengunjung";
  }
  function openPage(file) {
    location.assign(new URL(file, document.baseURI).href);
  }
  function updateKlienName(next) {
    const old = LJ.db.profile.name;
    if (next === old) return;
    ["bookings", "payments", "documents", "tickets", "notifications"].forEach(
      (key) =>
        LJ.db[key].forEach((x) => {
          if (x.client === old) x.client = next;
        }),
    );
    LJ.db.accounts.forEach((a) => {
      if (a.name === old && a.role === "Klien") a.name = next;
    });
    LJ.db.profile.name = next;
  }
  function saveToast(text) {
    const saved = LJ.save(text, actor());
    if (saved) LJ.toast(text);
    return saved;
  }
  function saveConsultation(data, context = {}) {
    const values = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, value.trim()]),
    );
    if (!values.name || !values.phone || !values.email || !values.notes)
      throw Error("Lengkapi nama, kontak, dan kebutuhan hunian.");
    if (!values.date || values.date < LJ.today())
      throw Error("Pilih tanggal hari ini atau sesudahnya.");
    LJ.db.leads.unshift({
      id: LJ.uid("LD"),
      ...values,
      ...context,
      status: "Baru",
    });
    if (!saveToast(LJ.editorial.formResult)) {
      LJ.db.leads.shift();
      throw Error(
        "Draf konsultasi belum dapat disimpan. Pertahankan isian dan coba kembali.",
      );
    }
  }
  const numFields = [
    "price",
    "units",
    "land",
    "building",
    "beds",
    "baths",
    "floors",
    "amount",
    "score",
  ];
  function entityForm(key, id) {
    const cfg = LJ.entityConfig()[key];
    if (!cfg) throw Error("Jenis data tidak ditemukan.");
    const existing = LJ.db[key].find((x) => x.id === id);
    const values = existing ? { ...existing } : {};
    if (key === "projects" && existing)
      values.facilities = existing.facilities.join(", ");
    let fields = cfg.fields;
    LJ.formModal(
      (existing ? "Edit " : "Tambah ") + cfg.title,
      fields,
      values,
      (data) => {
        for (const k of Object.keys(data)) {
          if (typeof data[k] === "string") data[k] = data[k].trim();
          if (numFields.includes(k)) {
            data[k] = Number(data[k]);
            if (!Number.isFinite(data[k]))
              throw Error("Nilai angka tidak valid.");
          }
        }
        for (const f of fields) {
          if (f.required && String(data[f.name] ?? "").trim() === "")
            throw Error("Lengkapi " + f.label.toLowerCase() + ".");
        }
        if (data.start && data.end && data.end < data.start)
          throw Error("Tanggal selesai harus sesudah tanggal mulai.");
        if (
          key === "partners" &&
          data.website &&
          !/^https?:\/\//.test(data.website)
        )
          throw Error("Situs mitra harus menggunakan alamat HTTP atau HTTPS.");
        if (key === "projects") {
          data.facilities = data.facilities
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean);
          if (!existing) data.tag = data.category;
        }
        if (key === "units") {
          if (
            LJ.db.units.some(
              (u) =>
                u.id !== id &&
                u.project === data.project &&
                u.block.toLowerCase() === data.block.toLowerCase() &&
                u.number.toLowerCase() === data.number.toLowerCase(),
            )
          )
            throw Error(
              "Nomor kavling sudah dipakai pada blok dan proyek ini.",
            );
          if (
            existing &&
            existing.sale !== "Tersedia" &&
            (existing.price !== data.price || existing.project !== data.project)
          )
            throw Error(
              "Harga dan proyek unit yang sudah dipesan tidak dapat diubah.",
            );
          if (data.building / data.floors > data.land)
            throw Error("Luas lantai dasar tidak boleh melebihi luas tanah.");
          if (!existing)
            Object.assign(data, {
              sale: "Tersedia",
              construction: "Belum dibangun",
              progress: 0,
              stage: "Persiapan",
            });
        }
        if (key === "employees" && existing && data.name !== existing.name) {
          [
            "tasks",
            "reports",
            "attendance",
            "leave",
            "evaluations",
            "schedules",
          ].forEach((k) =>
            LJ.db[k].forEach((x) => {
              if (x.employee === existing.name) x.employee = data.name;
            }),
          );
          if (existing.id === "EMP-001") LJ.roles.employee.person = data.name;
        }
        if (key === "expenses" && !existing)
          data.status = "Menunggu persetujuan";
        if (key === "messages")
          Object.assign(data, {
            name: LJ.roles[role()]?.person || "Administrator",
            date: LJ.today(),
            status: "Baru",
          });
        if (key === "notifications")
          Object.assign(data, { date: LJ.today(), status: "Baru" });
        if (existing) Object.assign(existing, data);
        else LJ.db[key].unshift({ id: LJ.uid(cfg.prefix), ...data });
        saveToast(
          cfg.title[0].toUpperCase() +
            cfg.title.slice(1) +
            " berhasil disimpan.",
        );
      },
      existing ? "Simpan perubahan" : "Tambahkan data",
    );
  }
  function entityDelete(key, id) {
    const cfg = LJ.entityConfig()[key],
      record = LJ.db[key].find((x) => x.id === id);
    if (!record) return;
    LJ.confirm(
      "Hapus " + cfg.title + "?",
      `Catatan <strong>${E(record.name || record.title || record.subject || id)}</strong> akan dihapus dari daftar ini.`,
      () => {
        if (
          key === "projects" &&
          ["units", "leads", "expenses", "promos"].some((k) =>
            LJ.db[k].some((x) => x.project === id),
          )
        )
          throw Error(
            "Proyek masih digunakan oleh unit, leads, promo, atau pengeluaran. Hapus relasinya terlebih dahulu.",
          );
        if (
          key === "units" &&
          ["bookings", "tasks", "reports", "schedules", "offers"].some((k) =>
            LJ.db[k].some((x) => x.unit === id),
          )
        )
          throw Error(
            "Unit memiliki pemesanan atau aktivitas terkait dan tidak dapat dihapus.",
          );
        if (
          key === "employees" &&
          (id === "EMP-001" ||
            ["tasks", "reports", "attendance", "evaluations", "schedules"].some(
              (k) => LJ.db[k].some((x) => x.employee === record.name),
            ))
        )
          throw Error(
            "Identitas karyawan masih terhubung dengan profil atau penugasan. Gunakan status Nonaktif untuk pengarsipan.",
          );
        if (key === "expenses" && record.status === "Disetujui")
          throw Error(
            "Pengeluaran disetujui dipertahankan sebagai riwayat keuangan.",
          );
        LJ.db[key] = LJ.db[key].filter((x) => x.id !== id);
        saveToast("Data berhasil dihapus.");
      },
    );
  }
  function invoice(id) {
    const p = LJ.db.payments.find((x) => x.id === id);
    if (!p) return;
    const b = LJ.book(p.booking),
      u = LJ.unit(b?.unit),
      project = LJ.project(u?.project);
    LJ.modal(
      p.status === "Terverifikasi"
        ? "Kuitansi pembayaran"
        : "Invoice pembayaran",
      `<div class="invoice"><div class="flex between">${LJ.brand()}<span class="tag blue">DRAF ADMINISTRASI</span></div><div class="divider"></div><div class="flex between"><h2>${p.status === "Terverifikasi" ? "DRAF KUITANSI" : "DRAF INVOICE"}</h2>${LJ.badge(p.status)}</div><div class="invoice-meta"><div><h4>Ditujukan kepada</h4><p>${E(p.client)}<br>${E(project?.name)}<br>${LJ.unitLabel(u?.id)}</p></div><div><h4>${E(p.id)}</h4><p>Pemesanan ${E(b?.id)}<br>Jatuh tempo: ${LJ.date(p.due)}<br>${p.date ? "Tanggal bukti: " + LJ.date(p.date) : ""}</p></div></div>${LJ.table(["Deskripsi", "Jumlah"], [[E(p.kind) + " · " + LJ.unitLabel(u?.id), `<strong>${LJ.money(p.amount)}</strong>`]])}<div class="flex between invoice-total"><strong>Total</strong><strong class="blue">${LJ.money(p.amount)}</strong></div><p class="legal-note u-mt-25">${E(LJ.editorial.draft)} Nominal, penerima, dan dokumen resmi memerlukan konfirmasi perusahaan.</p></div><div class="modal-footer">${B("Unduh ringkasan", "invoice-download", p.id, "secondary", "download")}${B("Cetak / simpan PDF", "print", "", "primary", "print")}</div>`,
      true,
    );
  }
  function paymentVerify(id) {
    const p = LJ.db.payments.find((p) => p.id === id);
    if (!p) return;
    const isAdmin = role() === "admin";
    LJ.modal(
      "Tinjau pembayaran",
      `<div class="notice">${I("info")}Periksa rincian dan lampiran sebelum mencatat hasil peninjauan. Tindakan ini tidak memvalidasi transaksi bank.</div>${LJ.table(
        ["Informasi", "Rincian"],
        [
          ["Klien", E(p.client)],
          ["Pemesanan", E(p.booking)],
          ["Jenis", E(p.kind)],
          ["Jumlah", LJ.money(p.amount)],
          ["Bukti", E(p.proof || "Belum tersedia")],
          ["Status", LJ.badge(p.status)],
        ],
      )}<div class="modal-footer">${p.proof ? B("Lihat bukti", "proof", p.id, "secondary", "eye") : ""}${isAdmin && p.status === "Menunggu verifikasi" ? B("Tolak", "payment-reject", p.id, "danger") + B("Catat verifikasi", "payment-approve", p.id, "primary", "check") : ""}</div>`,
    );
  }
  function reportForm(existingId) {
    const existing = LJ.db.reports.find((r) => r.id === existingId),
      employee = LJ.employeeName(),
      us = LJ.db.units.filter(
        (u) =>
          LJ.db.tasks.some((t) => t.unit === u.id && t.employee === employee) &&
          u.sale === "DP terverifikasi" &&
          u.construction === "Dalam pembangunan",
      );
    if (!us.length) {
      LJ.modal(
        "Belum ada unit aktif",
        `<p>Belum ada unit pembangunan yang ditugaskan kepada Anda. Admin perlu memverifikasi DP, memulai pembangunan, dan memberikan penugasan.</p>`,
      );
      return;
    }
    const fields = [
      {
        name: "unit",
        label: "Unit yang dikerjakan",
        type: "select",
        options: us.map((u) => [u.id, LJ.unitLabel(u.id)]),
        required: true,
      },
      { name: "title", label: "Judul laporan", required: true },
      {
        name: "date",
        label: "Tanggal pekerjaan",
        type: "date",
        max: LJ.today(),
        required: true,
        value: LJ.today(),
      },
      {
        name: "stage",
        label: "Tahap pekerjaan",
        type: "select",
        options: [
          "Persiapan",
          "Pondasi",
          "Struktur & dinding",
          "Atap & instalasi",
          "Finishing",
        ],
        required: true,
      },
      {
        name: "progress",
        label: "Progres kumulatif (%)",
        type: "number",
        min: 0,
        max: 100,
        required: true,
      },
      {
        name: "photo",
        label: "Dokumentasi foto",
        type: "file",
        accept: "image/jpeg,image/png,image/webp",
        hint: "Opsional · maks. 2 MB",
      },
      {
        name: "description",
        label: "Hasil pekerjaan",
        type: "textarea",
        wide: true,
        required: true,
      },
      {
        name: "issue",
        label: "Kendala & tindak lanjut",
        type: "textarea",
        wide: true,
        required: true,
      },
    ];
    LJ.formModal(
      existing ? "Revisi laporan pekerjaan" : "Laporan pekerjaan baru",
      fields,
      existing || {
        unit: us[0].id,
        progress: us[0].progress,
        date: LJ.today(),
        stage: us[0].stage,
      },
      async (data) => {
        const u = LJ.unit(data.unit);
        if (!us.some((x) => x.id === u?.id))
          throw Error("Unit tidak termasuk penugasan Anda.");
        const progress = Number(data.progress);
        if (progress < u.progress)
          throw Error(
            "Progres kumulatif tidak boleh di bawah " + u.progress + "%.",
          );
        if (data.date > LJ.today())
          throw Error("Tanggal pekerjaan tidak boleh di masa depan.");
        if (progress === 100 && data.stage !== "Finishing")
          throw Error("Pilih tahap Finishing untuk progres 100%.");
        if (data.photo.size && !data.photo.type.startsWith("image/"))
          throw Error("Dokumentasi pekerjaan harus berupa gambar.");
        const photoData = await LJ.fileData(data.photo);
        delete data.photo;
        const record = {
          ...data,
          progress,
          employee,
          status: "Menunggu persetujuan",
          image: "construction",
          photoData: photoData || existing?.photoData || "",
        };
        if (existing) Object.assign(existing, record);
        else LJ.db.reports.unshift({ id: LJ.uid("RP"), ...record });
        saveToast(
          "Laporan dicatat untuk peninjauan. Belum ada konfirmasi penerimaan dari penanggung jawab.",
        );
      },
      "Simpan laporan",
      `<div class="demo-note">Persentase kumulatif mengikuti laporan yang telah ditinjau. Lampirkan dokumentasi pekerjaan bila tersedia; gambar referensi tidak menggantikan bukti lapangan.</div>`,
    );
  }
  function reportView(id) {
    const r = LJ.db.reports.find((x) => x.id === id);
    if (!r) return;
    const review = ["admin", "director"].includes(role());
    LJ.modal(
      "Laporan pembangunan",
      `${r.photoData?.startsWith("data:image/") ? `<img class="proof-preview" src="${r.photoData}" alt="Dokumentasi pekerjaan">` : `<img class="proof-preview" src="${LJ.image(r.image || "construction")}" alt="Referensi konstruksi — bukan dokumentasi unit">`}<div class="flex between u-mt-20">${LJ.badge(r.status)}<small class="muted">${LJ.date(r.date)}</small></div><h3 class="modal-detail-heading">${E(r.title)}</h3><p>${E(r.description)}</p>${LJ.progress(r.progress, LJ.unitLabel(r.unit), r.stage)}<div class="notice u-mt-20">${I("info")}<span><strong>Kendala / tindak lanjut</strong><br>${E(r.issue || "Tidak ada kendala.")}<br>PIC: ${E(r.employee)}</span></div><div class="modal-footer">${review && r.status === "Menunggu persetujuan" ? B("Minta revisi", "report-reject", r.id, "danger") + B("Setujui laporan", "report-approve", r.id, "primary", "check") : r.status === "Perlu revisi" && role() === "employee" ? B("Revisi laporan", "report-edit", r.id, "primary", "edit") : B("Tutup", "close", "", "secondary")}</div>`,
      true,
    );
  }
  const actions = {
    close: () => LJ.closeModal(),
    confirm: () => LJ.runModal(),
    "mobile-nav": () => {
      const nav = document.getElementById("site-navigation");
      setNavigationOpen(nav, !nav.classList.contains("open"));
    },
    sidebar: () => {
      const sidebar = document.getElementById("workspace-sidebar");
      setNavigationOpen(sidebar, !sidebar.classList.contains("open"));
    },
    "sidebar-submenu": (id, toggle) => {
      const submenu = document.getElementById("workspace-submenu");
      const open = submenu.classList.toggle("open");
      submenu.inert = !open;
      submenu.setAttribute("aria-hidden", String(!open));
      toggle.setAttribute("aria-expanded", String(open));
    },
    "brand-story": () =>
      LJ.modal(
        "Selamat datang di LinyJaya.",
        `<img src="${LJ.image("interior")}" alt="Ruang keluarga yang nyaman" class="brand-story-image"><h3>Lebih dari alamat. Tempat untuk bertumbuh.</h3><p class="u-mt-14">Jelajahi kawasan yang terencana, temukan tipe hunian yang sesuai, dan kenali setiap detail sebelum menentukan pilihan. Kami hadir untuk mendampingi langkah Anda menuju rumah.</p><div class="modal-footer">${A("Kenali kami lebih dekat", "tentang.html", "primary", "arrow")}</div>`,
      ),
    favorite: (id, el) => {
      const index = LJ.db.favorites.indexOf(id);
      if (index >= 0) LJ.db.favorites.splice(index, 1);
      else LJ.db.favorites.push(id);
      LJ.save("Favorit diperbarui", "Klien");
      el.classList.toggle("active", index < 0);
      el.setAttribute("aria-pressed", index < 0);
      el.setAttribute(
        "aria-label",
        index < 0 ? "Hapus dari favorit" : "Tambahkan ke favorit",
      );
      LJ.toast(
        index < 0
          ? "Proyek disimpan ke favorit."
          : "Proyek dihapus dari favorit.",
      );
    },
    privacy: () =>
      LJ.modal(
        "Kebijakan Privasi",
        LJ.legalDocument("privacy") +
          '<div class="modal-footer">' +
          A(
            "Buka halaman kebijakan",
            "kebijakan-privasi.html",
            "secondary",
            "arrow",
          ) +
          "</div>",
        true,
      ),
    "contact-info": () =>
      LJ.modal(
        "Terhubung dengan LinyJaya",
        `<p>Diskusikan pilihan kawasan, kebutuhan ruang, dan rencana pembelian bersama tim pemasaran. Kunjungan lokasi tersedia melalui perjanjian.</p><div class="modal-footer">${A("Rencanakan konsultasi", "kontak.html", "primary", "message")}</div>`,
      ),
    gallery: (id) => {
      if (
        ![
          "hero",
          "house-1",
          "house-2",
          "house-3",
          "interior",
          "construction",
          "neighborhood",
        ].includes(id)
      )
        return;
      LJ.modal(
        "Galeri arsitektur LinyJaya",
        `<img class="gallery-modal-img" src="${LJ.image(id)}" alt="Kurasi visual arsitektur dan pembangunan"><p class="legal-note u-mt-15">Kurasi visual konsep arsitektur dan suasana hunian. Detail desain setiap unit mengikuti spesifikasi proyek.</p>`,
        true,
      );
    },
    "search-mode": (id, el) => {
      document.querySelectorAll(".search-tab").forEach((x) => {
        x.classList.toggle("active", x === el);
        x.setAttribute("aria-selected", x === el);
      });
      document.getElementById("hero-price").value =
        id === "investasi" ? "1000000000" : "";
      LJ.toast(
        id === "investasi"
          ? "Jelajahi properti sesuai anggaran investasi Anda."
          : "Pilih lokasi dan tipe hunian Anda.",
      );
    },
    "reset-filter": () => {
      LJ.filters = {};
      LJ.render();
    },
    "catalog-view": (id) => {
      LJ.catalogView = id;
      LJ.render();
    },
    "logo-upload": () =>
      LJ.formModal(
        "Perbarui logo perusahaan",
        [
          {
            name: "logo",
            label: "Gambar logo",
            type: "file",
            accept: "image/png,image/webp,image/jpeg",
            required: true,
            wide: true,
            hint: "Gunakan PNG transparan, WebP, atau JPG · maksimal 2 MB.",
          },
        ],
        {},
        async (data) => {
          if (!data.logo.type.startsWith("image/"))
            throw Error("Pilih berkas gambar untuk logo.");
          LJ.db.company.logoData = await LJ.fileData(data.logo);
          saveToast("Logo perusahaan diperbarui.");
          renderedRole = null;
        },
        "Simpan logo",
      ),
    "select-plot": (id) => {
      const u = LJ.unit(id);
      if (!u) return;
      LJ.modal(
        "Kavling " + u.block + "-" + u.number,
        `<p>${E(LJ.project(u.project)?.name)} · Tipe ${E(u.type)}</p><div class="detail-features"><div><small>Luas tanah</small><strong>${u.land} m²</strong></div><div><small>Luas bangunan</small><strong>${u.building} m²</strong></div><div><small>Harga</small><strong>${LJ.money(u.price, true)}</strong></div></div><div class="grid two"><div><p>Penjualan</p>${LJ.badge(u.sale)}</div><div><p>Pembangunan</p>${LJ.badge(u.construction)}</div></div>${LJ.progress(u.progress, u.stage)}<div class="modal-footer">${A("Detail unit", LJ.propertyPage("units", id, role() === "public" ? null : role()), "secondary", "eye")}${u.sale === "Tersedia" ? B(role() === "client" ? "Pilih & pesan" : "Ajukan minat", role() === "client" ? "book" : "interest", id, "primary", "home") : ""}</div>`,
      );
    },
    book: (id) => {
      const u = LJ.unit(id);
      if (!u || role() !== "client") return;
      LJ.formModal(
        "Pemesanan unit " + u.block + "-" + u.number,
        [
          {
            name: "note",
            label: "Catatan kebutuhan",
            type: "textarea",
            wide: true,
          },
          {
            name: "consent",
            label:
              "Saya memahami catatan ini belum merupakan konfirmasi pemesanan atau perjanjian jual beli.",
            type: "checkbox",
            required: true,
            wide: true,
          },
        ],
        {},
        (data) => {
          if (!data.consent)
            throw Error(
              "Konfirmasikan pemahaman Anda sebelum melanjutkan pencatatan.",
            );
          LJ.bookUnit(id, data.note);
          LJ.toast(
            "Catatan pemesanan dibuat. Rencana DP tersedia untuk ditinjau; konfirmasi perusahaan masih diperlukan.",
          );
          openPage("client/bookings.html");
        },
        "Simpan rencana pemesanan",
        `<div class="notice">${I("home")}<span><strong>${E(LJ.project(u.project)?.name)} · ${LJ.unitLabel(id)}</strong><br>Klien: ${E(LJ.db.profile.name)}<br>Harga: ${LJ.money(u.price)} · Rencana DP 20%: ${LJ.money(u.price * 0.2)}</span></div>`,
      );
    },
    interest: (id) => {
      const unit = LJ.unit(id);
      if (!unit) return;
      actions.consult(unit.project, unit);
    },
    consult: (id, selectedUnit) => {
      const p = LJ.project(id);
      const unit =
        selectedUnit?.type && selectedUnit?.project ? selectedUnit : null;
      LJ.formModal(
        "Rencanakan konsultasi",
        [
          { name: "name", label: "Nama lengkap", required: true },
          {
            name: "phone",
            label: "Nomor telepon",
            type: "tel",
            required: true,
          },
          { name: "email", label: "Email", type: "email", required: true },
          {
            name: "date",
            label: "Tanggal konsultasi",
            type: "date",
            min: LJ.today(),
            required: true,
          },
          {
            name: "notes",
            label: "Kebutuhan Anda",
            type: "textarea",
            wide: true,
            required: true,
          },
        ],
        role() === "client"
          ? {
              name: LJ.db.profile.name,
              email: LJ.db.profile.email,
              phone: LJ.db.profile.phone,
            }
          : {},
        (data) => {
          saveConsultation(data, {
            project: p?.id || "",
            interest: unit
              ? "Minat unit " + LJ.unitLabel(unit.id)
              : "Konsultasi properti",
            unit: unit?.id || "",
          });
        },
        "Simpan draf konsultasi",
        `<div class="consult-note">${p ? E(p.name) : "Konsultasi hunian LinyJaya"}${unit ? " · " + LJ.unitLabel(unit.id) : ""}<br>Susun kebutuhan dan waktu pilihan. Jadwal belum dikonfirmasi oleh tim pemasaran.</div>`,
      );
    },
    "entity-add": (key) => entityForm(key),
    "entity-edit": (id) => {
      const [key, recordId] = id.split(":");
      entityForm(key, recordId);
    },
    "entity-delete": (id) => {
      const [key, recordId] = id.split(":");
      entityDelete(key, recordId);
    },
    "entity-view": (id) => {
      const [key, recordId] = id.split(":"),
        cfg = LJ.entityConfig()[key],
        x = LJ.db[key]?.find((x) => x.id === recordId);
      if (!x) return;
      LJ.modal(
        "Detail " + cfg.title,
        LJ.table(
          ["Informasi", "Rincian"],
          cfg.fields.map((f) => [
            f.label,
            E(Array.isArray(x[f.name]) ? x[f.name].join(", ") : x[f.name]),
          ]),
        ),
      );
    },
    "unit-view": (id) => {
      const u = LJ.unit(id);
      if (!u) return;
      LJ.modal(
        "Unit " + u.block + "-" + u.number,
        `${LJ.blueprint(u.type)}<div class="detail-features"><div><small>Tanah / bangunan</small><strong>${u.land} / ${u.building} m²</strong></div><div><small>Harga</small><strong>${LJ.money(u.price, true)}</strong></div></div><div class="flex wrap">${LJ.badge(u.sale)}${LJ.badge(u.construction)}</div>${LJ.progress(u.progress, u.stage)}<div class="modal-footer">${A("Buka detail lengkap", LJ.propertyPage("units", id, role() === "public" ? null : role()), "secondary", "arrow")}${role() === "client" && u.sale === "Tersedia" ? B("Pesan unit", "book", id, "primary", "home") : ""}</div>`,
        true,
      );
    },
    "booking-view": (id) => {
      const b = LJ.book(id),
        u = LJ.unit(b?.unit);
      if (!b) return;
      LJ.modal(
        "Detail pemesanan",
        LJ.table(
          ["Informasi", "Rincian"],
          [
            ["Pemesanan", E(b.id)],
            ["Klien", E(b.client)],
            ["Proyek", E(LJ.project(u?.project)?.name)],
            ["Unit", LJ.unitLabel(b.unit)],
            ["Harga", LJ.money(u.price)],
            ["Tanggal", LJ.date(b.date)],
            ["Status", LJ.badge(b.status)],
            ["Catatan", E(b.note || "—")],
          ],
        ) +
          `<div class="divider"></div><h3 class="u-mb-15">Jadwal pembayaran</h3>${LJ.paymentTable(
            LJ.db.payments.filter((p) => p.booking === b.id),
            role(),
          )}`,
        true,
      );
    },
    "booking-cancel": (id) =>
      LJ.confirm(
        "Batalkan pemesanan?",
        "Unit akan tersedia kembali jika pembayaran belum diajukan atau diverifikasi.",
        () => {
          if (LJ.cancelBooking(id))
            LJ.toast(
              "Catatan pemesanan dibatalkan. Ketentuan perjanjian resmi tetap berlaku.",
            );
        },
      ),
    "construction-start": (id) =>
      LJ.confirm(
        "Mulai pembangunan?",
        "DP telah diverifikasi. Unit akan masuk tahap persiapan dengan progres awal 5%.",
        () => {
          if (LJ.startConstruction(id))
            LJ.toast(
              "Tahap persiapan dicatat. Jadwal pelaksanaan memerlukan konfirmasi penanggung jawab proyek.",
            );
        },
      ),
    handover: (id) =>
      LJ.confirm(
        "Konfirmasi serah terima",
        "Pembangunan harus 100% dan seluruh pembayaran terverifikasi. Draf berita acara akan tersedia untuk peninjauan.",
        () => {
          if (LJ.handover(id))
            LJ.toast(
              "Catatan serah terima diperbarui. Pengesahan tetap mengacu pada berita acara resmi.",
            );
        },
      ),
    invoice: invoice,
    print: () => window.print(),
    "invoice-download": (id) => {
      const p = LJ.db.payments.find((x) => x.id === id);
      LJ.download(
        "LinyJaya-" + id + ".txt",
        `DRAF ADMINISTRASI — UNTUK PENINJAUAN\nLinyJaya Development\n${p.id}\nKlien: ${p.client}\nJenis: ${p.kind}\nJumlah: ${LJ.money(p.amount)}\nJatuh tempo: ${LJ.date(p.due)}\nStatus: ${p.status}\nUnit: ${LJ.unitLabel(LJ.book(p.booking)?.unit)}`,
      );
      LJ.toast("Ringkasan pembayaran disiapkan untuk diunduh.");
    },
    proof: (id) => {
      const p = LJ.db.payments.find((x) => x.id === id);
      if (!p) return;
      LJ.modal(
        "Bukti pembayaran",
        `<div class="notice">${I("file")}<span>${E(p.proof || "Tidak ada bukti")}<br>Referensi: ${E(p.reference || "Belum dilengkapi")}</span></div>${p.proofData?.startsWith("data:image/") ? `<img class="proof-preview" src="${p.proofData}" alt="Bukti pembayaran yang dipilih">` : p.proofData?.startsWith("data:application/pdf") ? `<object data="${p.proofData}" type="application/pdf" width="100%" height="350"><p>Tinjauan PDF tidak tersedia. Gunakan unduhan bukti.</p></object>` : `<div class="invoice"><h3>LAMPIRAN BELUM TERSEDIA</h3><p class="u-mt-20">${E(p.client)} · ${E(p.kind)}</p><h2 class="blue modal-detail-amount">${LJ.money(p.amount)}</h2><p>Nama lampiran tercantum dalam catatan, tetapi berkas aslinya belum tersedia untuk ditinjau.</p></div>`}${p.proofData ? `<div class="modal-footer">${B("Unduh lampiran", "proof-download", id, "secondary", "download")}</div>` : ""}`,
      );
    },
    "proof-download": (id) => {
      const p = LJ.db.payments.find((x) => x.id === id);
      if (!p?.proofData) return;
      const a = document.createElement("a");
      a.href = p.proofData;
      a.download = p.proof;
      a.click();
    },
    "pay-upload": (id) => {
      const p = LJ.db.payments.find((x) => x.id === id);
      if (!p) return;
      LJ.formModal(
        "Ajukan bukti pembayaran",
        [
          {
            name: "reference",
            label: "Referensi pembayaran",
            required: true,
            wide: true,
          },
          {
            name: "proof",
            label: "Berkas bukti",
            type: "file",
            required: true,
            wide: true,
            hint: "JPG, PNG, WebP, atau PDF · maksimal 2 MB",
          },
        ],
        {},
        async (data) => {
          const proofData = await LJ.fileData(data.proof);
          LJ.submitPayment(id, data.proof.name, data.reference, proofData);
          LJ.toast(LJ.editorial.paymentResult);
        },
        "Tambahkan ke catatan",
        `<div class="notice">${I("wallet")}<span>${E(p.kind)} · ${LJ.money(p.amount)}<br>Pilih lampiran untuk catatan peninjauan. Tindakan ini bukan pembayaran dan tidak mengonfirmasi dana diterima.</span></div>`,
      );
    },
    "payment-verify": paymentVerify,
    "payment-approve": (id) => {
      const saved = LJ.verifyPayment(id, true);
      LJ.closeModal();
      LJ.render();
      if (saved)
        LJ.toast(
          "Hasil peninjauan dicatat. Status tagihan diperbarui. Konfirmasi penerimaan dana tetap mengikuti catatan bank dan perusahaan.",
        );
    },
    "payment-reject": (id) => {
      const saved = LJ.verifyPayment(id, false);
      LJ.closeModal();
      LJ.render();
      if (saved)
        LJ.toast(
          "Hasil peninjauan dicatat: perlu perbaikan bukti. Lampiran pengganti dapat ditambahkan.",
        );
    },
    "payment-new": () => {
      const bs = LJ.db.bookings.filter((b) => b.status === "DP terverifikasi");
      if (!bs.length) {
        LJ.toast("Belum ada pemesanan dengan DP terverifikasi.", "error");
        return;
      }
      LJ.formModal(
        "Tambah tagihan termin",
        [
          {
            name: "booking",
            label: "Pemesanan",
            type: "select",
            options: bs.map((b) => [
              b.id,
              b.client + " · " + LJ.unitLabel(b.unit),
            ]),
            required: true,
            wide: true,
          },
          {
            name: "kind",
            label: "Jenis tagihan",
            type: "select",
            options: ["Termin 2", "Termin 3", "Pelunasan"],
            required: true,
          },
          {
            name: "amount",
            label: "Jumlah (Rp)",
            type: "number",
            min: 1,
            required: true,
          },
          { name: "due", label: "Jatuh tempo", type: "date", required: true },
        ],
        {},
        (data) => {
          const b = LJ.book(data.booking),
            u = LJ.unit(b?.unit);
          const billed = LJ.db.payments
            .filter((p) => p.booking === b.id && p.status !== "Dibatalkan")
            .reduce((s, p) => s + p.amount, 0);
          if (Number(data.amount) > u.price - billed)
            throw Error(
              "Sisa yang belum ditagihkan: " + LJ.money(u.price - billed),
            );
          LJ.db.payments.push({
            id: LJ.uid("PAY"),
            ...data,
            amount: Number(data.amount),
            client: b.client,
            status: "Belum dibayar",
            date: "",
            proof: "",
          });
          saveToast("Tagihan termin dibuat.");
        },
        "Buat tagihan",
      );
    },
    "report-new": () => reportForm(),
    "report-edit": (id) => reportForm(id),
    "report-view": reportView,
    "report-approve": (id) => {
      const saved = LJ.approveReport(id, true, actor());
      LJ.closeModal();
      LJ.render();
      if (saved)
        LJ.toast(
          "Hasil peninjauan dicatat. Ringkasan progres dan urutan tahapan diperbarui.",
        );
    },
    "report-reject": (id) => {
      const saved = LJ.approveReport(id, false, actor());
      LJ.closeModal();
      LJ.render();
      if (saved) LJ.toast("Catatan peninjauan diperbarui: Perlu revisi.");
    },
    "task-view": (id) => {
      const t = LJ.db.tasks.find((t) => t.id === id);
      if (!t) return;
      LJ.modal(
        "Detail penugasan",
        `<div class="flex between">${LJ.badge(t.priority)}${LJ.badge(t.status)}</div><h3 class="modal-detail-heading">${E(t.title)}</h3><p>${E(t.description)}</p><div class="divider"></div>${LJ.table(
          ["Informasi", "Rincian"],
          [
            ["Unit", LJ.unitLabel(t.unit)],
            ["PIC", E(t.employee)],
            ["Deadline", LJ.date(t.deadline)],
          ],
        )}<div class="modal-footer">${t.status === "Baru" ? B("Mulai kerjakan", "task-start", id, "primary", "play") : t.status === "Dikerjakan" ? B("Tandai selesai", "task-finish", id, "primary", "check") : ""}${role() === "employee" ? B("Buat laporan", "report-new", "", "secondary", "file") : ""}</div>`,
      );
    },
    "task-start": (id) => {
      const t = LJ.db.tasks.find((x) => x.id === id);
      t.status = "Dikerjakan";
      saveToast("Status tugas: Dikerjakan.");
      LJ.closeModal();
      LJ.render();
    },
    "task-finish": (id) => {
      const t = LJ.db.tasks.find((x) => x.id === id);
      t.status = "Selesai";
      saveToast("Tugas selesai. Lengkapi laporan pekerjaan Anda.");
      LJ.closeModal();
      LJ.render();
    },
    "project-review": (id) => {
      const p = LJ.project(id);
      LJ.formModal(
        "Peninjauan proyek",
        [
          {
            name: "status",
            label: "Status proyek",
            type: "select",
            options: ["Perencanaan", "Pemasaran", "Pembangunan", "Selesai"],
            required: true,
          },
          {
            name: "evaluation",
            label: "Catatan evaluasi / persetujuan",
            type: "textarea",
            required: true,
            wide: true,
          },
        ],
        p,
        (data) => {
          Object.assign(p, data);
          saveToast("Proyek ditinjau dan evaluasi disimpan.");
        },
        "Simpan keputusan",
      );
    },
    "expense-review": (id) => {
      const e = LJ.db.expenses.find((x) => x.id === id);
      if (!e) return;
      LJ.modal(
        "Peninjauan anggaran",
        `<h3>${E(e.title)}</h3><h2 class="blue modal-detail-amount">${LJ.money(e.amount)}</h2><p>${E(e.description)}</p><p class="u-mt-15">${E(LJ.project(e.project)?.name)} · ${LJ.date(e.date)}</p><div class="u-mt-20">${LJ.badge(e.status)}</div><div class="modal-footer">${e.status === "Menunggu persetujuan" && role() === "director" ? B("Tolak", "expense-reject", id, "danger") + B("Setujui anggaran", "expense-approve", id, "primary", "check") : ""}</div>`,
      );
    },
    "expense-approve": (id) => {
      const e = LJ.db.expenses.find((x) => x.id === id);
      if (e.status !== "Menunggu persetujuan")
        throw Error("Anggaran sudah diproses.");
      e.status = "Disetujui";
      saveToast("Catatan keputusan anggaran diperbarui: Disetujui.");
      LJ.closeModal();
      LJ.render();
    },
    "expense-reject": (id) => {
      const e = LJ.db.expenses.find((x) => x.id === id);
      e.status = "Ditolak";
      saveToast("Catatan keputusan anggaran diperbarui: Ditolak.");
      LJ.closeModal();
      LJ.render();
    },
    document: (id) => {
      const doc = LJ.db.documents.find((x) => x.id === id),
        b = LJ.book(doc?.booking),
        u = LJ.unit(b?.unit);
      if (!doc) return;
      const preview = doc.fileData?.startsWith("data:image/")
        ? `<img class="proof-preview" src="${doc.fileData}" alt="Dokumen yang diunggah">`
        : doc.fileData?.startsWith("data:application/pdf")
          ? `<object data="${doc.fileData}" type="application/pdf" width="100%" height="350"><p>Gunakan cetak atau berkas asli untuk melihat PDF.</p></object>`
          : doc.kind === "Teknis"
            ? LJ.blueprint(u.type)
            : `<p>Ringkasan ini menghubungkan identitas klien dengan unit dalam catatan pemesanan. Spesifikasi, pembayaran, hak, kewajiban, dan jadwal perlu dituangkan dalam dokumen resmi yang disepakati para pihak.</p>`;
      LJ.modal(
        "Preview dokumen",
        `<div class="invoice"><span class="tag blue">DRAF DOKUMEN</span><h2 class="invoice-document-title">${E(doc.title)}</h2><p>${E(doc.id)} · ${LJ.date(doc.date)}</p><div class="u-mt-12">${LJ.badge(doc.status)}</div><div class="divider"></div><p>Klien: ${E(doc.client)}<br>Proyek: ${E(LJ.project(u?.project)?.name)}<br>Unit: ${LJ.unitLabel(u?.id)}</p><div class="divider"></div>${preview}<p class="legal-note u-mt-25">Draf ini belum merupakan dokumen yang diterbitkan atau ditandatangani perusahaan. Status pencatatan tidak menggantikan pengesahan resmi.</p></div><div class="modal-footer">${role() === "director" && doc.status === "Menunggu persetujuan" ? B("Tolak", "document-reject", id, "danger") + B("Setujui dokumen", "document-approve", id, "primary", "check") : B("Cetak / simpan PDF", "print", "", "primary", "print")}</div>`,
        true,
      );
    },
    "document-new": () => {
      const bs = LJ.db.bookings.filter((b) => b.status !== "Dibatalkan");
      LJ.formModal(
        "Tambahkan dokumen client",
        [
          {
            name: "booking",
            label: "Pemesanan",
            type: "select",
            options: bs.map((b) => [
              b.id,
              b.client + " · " + LJ.unitLabel(b.unit),
            ]),
            required: true,
            wide: true,
          },
          { name: "title", label: "Judul dokumen", required: true },
          {
            name: "kind",
            label: "Jenis dokumen",
            type: "select",
            options: ["Perjanjian", "Administrasi", "Teknis", "Serah terima"],
            required: true,
          },
          {
            name: "file",
            label: "Berkas dokumen",
            type: "file",
            wide: true,
            hint: "Opsional · PDF, JPG, PNG, WebP · maksimal 2 MB.",
          },
        ],
        {},
        async (data) => {
          const fileData = await LJ.fileData(data.file);
          delete data.file;
          const b = LJ.book(data.booking);
          if (!b) throw Error("Pilih pemesanan aktif.");
          LJ.db.documents.unshift({
            id: LJ.uid("DOC"),
            ...data,
            client: b.client,
            date: LJ.today(),
            status: "Menunggu persetujuan",
            fileData,
          });
          LJ.notify("Dokumen perlu peninjauan", data.title, "Pimpinan");
          saveToast("Draf dokumen dicatat untuk peninjauan pimpinan.");
        },
        "Ajukan dokumen",
      );
    },
    "document-approve": (id) => {
      const doc = LJ.db.documents.find((x) => x.id === id);
      doc.status = "Disetujui";
      saveToast("Hasil peninjauan dokumen dicatat: Disetujui.");
      LJ.closeModal();
      LJ.render();
    },
    "document-reject": (id) => {
      const doc = LJ.db.documents.find((x) => x.id === id);
      doc.status = "Ditolak";
      saveToast("Hasil peninjauan dokumen dicatat: Ditolak.");
      LJ.closeModal();
      LJ.render();
    },
    "ticket-new": () =>
      LJ.formModal(
        "Permintaan layanan",
        [
          { name: "title", label: "Judul permintaan", required: true },
          {
            name: "category",
            label: "Kategori",
            type: "select",
            options: [
              "Konsultasi marketing",
              "Pertanyaan",
              "Komplain",
              "Perubahan desain",
            ],
            required: true,
          },
          {
            name: "message",
            label: "Detail permintaan",
            type: "textarea",
            wide: true,
            required: true,
          },
        ],
        {},
        (data) => {
          LJ.db.tickets.unshift({
            id: LJ.uid("TK"),
            ...data,
            client: LJ.db.profile.name,
            date: LJ.today(),
            status: "Baru",
            reply: "",
          });
          saveToast(
            "Draf permintaan dicatat. Belum ada konfirmasi penanganan dari tim.",
          );
        },
        "Buat permintaan",
      ),
    "ticket-reply": (id) => {
      const t = LJ.db.tickets.find((x) => x.id === id);
      LJ.formModal(
        "Tanggapi permintaan",
        [
          {
            name: "status",
            label: "Status keputusan",
            type: "select",
            options: ["Baru", "Diproses", "Disetujui", "Ditolak", "Selesai"],
            required: true,
          },
          {
            name: "reply",
            label: "Tanggapan untuk client",
            type: "textarea",
            wide: true,
            required: true,
          },
        ],
        t,
        (data) => {
          Object.assign(t, data);
          saveToast("Catatan tanggapan diperbarui pada rincian permintaan.");
        },
        "Simpan tanggapan",
      );
    },
    "client-view": (name) => {
      const bs = LJ.db.bookings.filter((b) => b.client === name),
        profile = name === LJ.db.profile.name ? LJ.db.profile : null;
      LJ.modal(
        "Profil client",
        `<h3>${E(name)}</h3><p class="modal-client-contact">${profile ? E([profile.email, profile.phone].filter(Boolean).join(" · ") || "Kontak klien perlu dikonfirmasi") : "Kontak klien perlu dikonfirmasi"}</p>${LJ.bookingTable(bs, "admin")}`,
        true,
      );
    },
    attendance: () => {
      let a = LJ.db.attendance.find(
        (x) => x.employee === LJ.employeeName() && x.date === LJ.today(),
      );
      const time = new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Jakarta",
      });
      if (a?.out) {
        LJ.toast("Kehadiran hari ini sudah lengkap.");
        return;
      }
      if (a) a.out = time;
      else
        LJ.db.attendance.unshift({
          id: LJ.uid("AT"),
          employee: LJ.employeeName(),
          date: LJ.today(),
          in: time,
          out: "",
          status: "Hadir",
        });
      saveToast(a ? "Check-out dicatat." : "Check-in dicatat.");
      LJ.render();
    },
    "leave-new": () =>
      LJ.formModal(
        "Pengajuan izin / cuti",
        [
          {
            name: "date",
            label: "Tanggal",
            type: "date",
            min: LJ.today(),
            required: true,
          },
          {
            name: "kind",
            label: "Jenis",
            type: "select",
            options: ["Izin", "Cuti", "Sakit"],
            required: true,
          },
          {
            name: "reason",
            label: "Alasan",
            type: "textarea",
            wide: true,
            required: true,
          },
        ],
        {},
        (data) => {
          LJ.db.leave.unshift({
            id: LJ.uid("LV"),
            ...data,
            employee: LJ.employeeName(),
            status: "Menunggu persetujuan",
          });
          saveToast("Pengajuan izin disimpan.");
        },
        "Ajukan izin",
      ),
    "leave-review": (id) => {
      const leave = LJ.db.leave.find((x) => x.id === id);
      LJ.formModal(
        "Peninjauan izin / cuti",
        [
          {
            name: "status",
            label: "Keputusan",
            type: "select",
            options: ["Disetujui", "Ditolak"],
            required: true,
          },
        ],
        {},
        (data) => {
          leave.status = data.status;
          saveToast("Pengajuan izin " + data.status.toLowerCase() + ".");
        },
        "Simpan keputusan",
        `<div class="notice">${I("calendar")}<span>${E(leave.employee)} · ${LJ.date(leave.date)}<br>${E(leave.kind)}: ${E(leave.reason)}</span></div>`,
      );
    },
    notifications: () => {
      const roleName = LJ.roles[role()]?.name;
      const preferences =
        role() === "client"
          ? LJ.db.profile
          : role() === "employee"
            ? LJ.db.employees.find((x) => x.id === "EMP-001")
            : null;
      if (
        !LJ.db.settings.notifications ||
        preferences?.notifications === false
      ) {
        LJ.modal(
          "Notifikasi",
          `<p>Notifikasi dinonaktifkan. Aktifkan kembali melalui preferensi profil atau konfigurasi Administrator.</p>`,
        );
        return;
      }
      const ns = LJ.db.notifications.filter(
        (n) =>
          (!roleName || n.role === roleName) &&
          (role() !== "client" || !n.client || n.client === LJ.db.profile.name),
      );
      LJ.modal(
        "Notifikasi workspace",
        ns.length
          ? ns
              .map(
                (n) =>
                  `<div class="activity"><span class="icon-tile">${I("bell")}</span><div><strong>${E(n.title)}</strong><p>${E(n.message)}</p><p>${LJ.date(n.date)} · ${E(n.status)}</p></div></div>`,
              )
              .join("") +
              `<div class="modal-footer">${B("Tandai sudah dibaca", "notifications-read", "", "secondary", "check")}</div>`
          : LJ.empty(
              "Anda sudah mengikuti semuanya",
              "Pembaruan kegiatan akan tampil saat ada catatan baru.",
            ),
      );
    },
    "notifications-read": () => {
      LJ.db.notifications
        .filter(
          (n) =>
            n.role === LJ.roles[role()]?.name &&
            (role() !== "client" ||
              !n.client ||
              n.client === LJ.db.profile.name),
        )
        .forEach((n) => (n.status = "Dibaca"));
      saveToast("Notifikasi ditandai dibaca.");
      LJ.closeModal();
    },
    "global-search": () => {
      LJ.modal(
        "Cari di ruang kerja",
        `<label for="global-query" class="muted u-text-11">Proyek, unit, atau catatan ruang kerja</label><input class="form-control u-mt-10" id="global-query" type="search" placeholder="Ketik untuk mencari…"><div id="global-results" class="u-mt-18">${LJ.empty("Apa yang ingin Anda temukan?", "Cari nama proyek, nomor unit, tugas, atau artikel.")}</div>`,
      );
    },
    "export-report": (tab) => {
      let data =
        tab === "audit"
          ? LJ.db.audit
          : tab === "team"
            ? LJ.db.employees
            : tab === "marketing"
              ? LJ.db.leads
              : tab === "finance"
                ? LJ.db.payments
                : tab === "build"
                  ? LJ.db.units
                  : LJ.db.bookings;
      const keys = [...new Set(data.flatMap((x) => Object.keys(x)))].filter(
          (k) => !k.endsWith("Data"),
        ),
        cell = (x) =>
          '"' +
          String(x ?? "")
            .replace(/"/g, '""')
            .replace(/^[=+@-]/, "'$&") +
          '"';
      LJ.download(
        "LinyJaya-laporan-" + tab + ".csv",
        "\uFEFF" +
          [
            keys.join(","),
            ...data.map((r) => keys.map((k) => cell(r[k])).join(",")),
          ].join("\r\n"),
        "text/csv;charset=utf-8",
      );
      LJ.toast("Berkas laporan disiapkan untuk diunduh.");
    },
    backup: () =>
      LJ.download(
        "linyjaya-catatan-administrasi.json",
        JSON.stringify(LJ.db, null, 2),
        "application/json",
      ),
    "reset-demo": () =>
      LJ.confirm(
        "Pulihkan data awal?",
        "Perubahan catatan pemesanan, berkas, dan laporan akan dihapus. Tindakan ini tidak membatalkan perjanjian atau transaksi di luar ruang kerja.",
        () => LJ.reset(),
      ),
  };
  document.addEventListener("click", async (e) => {
    if (e.target.closest(".skip-link")) {
      e.preventDefault();
      const main = document.getElementById("main");
      main?.setAttribute("tabindex", "-1");
      main?.focus();
      main?.scrollIntoView({ block: "start" });
      return;
    }
    const tab = e.target.closest("[data-tab], [data-sidebar-tab]");
    if (tab) {
      if (currentRole) {
        LJ.tableQuery = "";
        dashboardTab = tab.dataset.tab || tab.dataset.sidebarTab;
      } else {
        LJ.publicTab = tab.dataset.tab;
      }
      LJ.render();
      return;
    }
    const action = e.target.closest("[data-action]");
    if (action) {
      e.preventDefault();
      try {
        await actions[action.dataset.action]?.(action.dataset.id, action);
      } catch (err) {
        LJ.toast(err.message, "error");
      }
      return;
    }
    if (e.target.closest(".modal-overlay") && !e.target.closest(".modal"))
      LJ.closeModal();
  });
  document.addEventListener("keydown", (e) => {
    const modal = document.querySelector(".modal-overlay:not(.is-closing) .modal");
    if (!modal) {
      if (e.key === "Escape" && compactNavigation.matches) {
        const openMenu = document.querySelector(".sidebar.open, .nav-links.open");
        if (openMenu) setNavigationOpen(openMenu, false);
      }
      return;
    }
    if (e.key === "Escape") LJ.closeModal();
    if (e.key === "Tab") {
      const els = [
        ...modal.querySelectorAll(
          'a[href],button:not([disabled]),input,select,textarea,[tabindex="0"]',
        ),
      ].filter((el) => el.offsetParent !== null);
      const first = els[0],
        last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }
  });
  document.addEventListener("submit", async (e) => {
    const form = e.target;
    if (form.id === "hero-search") return;
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const data = Object.fromEntries(new FormData(form)),
      err = form.querySelector(".form-error");
    if (err) err.textContent = "";
    try {
      if (form.id === "modal-form") {
        await LJ.runModal(form);
        return;
      }
      if (form.id === "contact-form") {
        saveConsultation(data);
        form.reset();
        return;
      }
      if (form.id === "company-form") {
        Object.assign(LJ.db.company, data);
        saveToast("Informasi perusahaan diperbarui.");
        return;
      }
      if (form.id === "profile-form") {
        if (form.dataset.role === "client") {
          updateKlienName(data.name);
          Object.assign(LJ.db.profile, data);
          LJ.roles.client.person = data.name;
        } else {
          const employee = LJ.db.employees.find((x) => x.id === "EMP-001"),
            old = employee.name;
          [
            "tasks",
            "reports",
            "attendance",
            "leave",
            "evaluations",
            "schedules",
          ].forEach((k) =>
            LJ.db[k].forEach((x) => {
              if (x.employee === old) x.employee = data.name;
            }),
          );
          Object.assign(employee, data);
          LJ.roles.employee.person = data.name;
        }
        saveToast("Profil berhasil diperbarui.");
        renderedRole = null;
        LJ.render();
        return;
      }
      if (form.id === "register-form") {
        updateKlienName(data.name);
        Object.assign(LJ.db.profile, data);
        LJ.roles.client.person = data.name;
        saveToast(
          "Profil pencatatan diperbarui. Identitas dan akses akun belum diverifikasi.",
        );
        openPage("client/index.html");
        return;
      }
      if (form.id === "forgot-form") {
        LJ.modal(
          "Bantuan akses akun",
          `<p>Belum ada pesan pemulihan yang dikirim. Kanal bantuan akun dan verifikasi identitas perlu dikonfirmasi perusahaan. Anda dapat kembali ke profil Anda.</p><div class="modal-footer">${A("Kembali ke profil", "client/profile.html", "primary", "user")}</div>`,
        );
        return;
      }
    } catch (error) {
      if (err) err.textContent = error.message;
      else LJ.toast(error.message, "error");
    }
  });
  document.addEventListener("change", (e) => {
    const el = e.target;
    if (el.closest("#catalog-filter")) {
      LJ.filters = Object.fromEntries(new FormData(el.closest("form")));
      document.getElementById("catalog-results").innerHTML =
        LJ.catalogResults();
    }
    if (el.id === "progress-unit") {
      LJ.selectedUnit = el.value;
      LJ.render();
    }
    if (el.id === "article-cat") {
      LJ.articleCategory = el.value;
      LJ.render();
    }
    if (el.dataset.setting) {
      LJ.db.settings[el.dataset.setting] = el.checked;
      saveToast("Konfigurasi disimpan.");
    }
    if (el.dataset.profileNotification) {
      const p =
        el.dataset.profileNotification === "client"
          ? LJ.db.profile
          : LJ.db.employees.find((x) => x.id === "EMP-001");
      p.notifications = el.checked;
      saveToast("Preferensi notifikasi disimpan.");
    }
  });
  document.addEventListener("input", (e) => {
    const el = e.target;
    if (el.name === "q" && el.closest("#catalog-filter")) {
      LJ.filters = Object.fromEntries(new FormData(el.closest("form")));
      document.getElementById("catalog-results").innerHTML =
        LJ.catalogResults();
    }
    if (el.id === "table-search") {
      LJ.tableQuery = el.value;
      LJ.render();
    }
    if (el.id === "global-query") {
      const q = el.value.toLowerCase().trim();
      let results = [];
      if (q) {
        LJ.db.projects
          .filter((p) => (p.name + " " + p.location).toLowerCase().includes(q))
          .forEach((p) =>
            results.push([
              p.name,
              LJ.propertyPage("projects", p.id, role()),
              "layers",
            ]),
          );
        LJ.db.units
          .filter((u) => LJ.unitLabel(u.id).toLowerCase().includes(q))
          .forEach((u) =>
            results.push([
              LJ.unitLabel(u.id),
              LJ.propertyPage("units", u.id, role()),
              "home",
            ]),
          );
        if (role() === "admin")
          LJ.db.articles
            .filter((a) => a.title.toLowerCase().includes(q))
            .forEach((a) =>
              results.push([a.title, "admin/settings.html?tab=content", "file"]),
            );
        if (["admin", "director", "employee"].includes(role()))
          LJ.db.tasks
            .filter(
              (t) =>
                t.title.toLowerCase().includes(q) &&
                (role() !== "employee" || t.employee === LJ.employeeName()),
            )
            .forEach((t) =>
              results.push([
                t.title,
                LJ.rolePage(
                  role(),
                  role() === "admin" ? "construction" : "tasks",
                ) + (role() === "admin" ? "?tab=tasks" : ""),
                "clipboard",
              ]),
            );
      }
      document.getElementById("global-results").innerHTML = results.length
        ? results
            .slice(0, 12)
            .map(
              ([title, url, icon]) =>
                `<a href="${url}" class="activity">${I(icon)}<strong>${E(title)}</strong>${I("arrow", "sm")}</a>`,
            )
            .join("")
        : LJ.empty(
            q ? "Tidak ada hasil" : "Mulai pencarian",
            q
              ? "Gunakan kata kunci yang lebih singkat."
              : "Cari proyek, unit, atau artikel.",
          );
    }
  });
  compactNavigation.addEventListener("change", syncNavigation);
  window.addEventListener("storage", (e) => {
    if (e.key === "linyjaya-demo-v1" && e.newValue) {
      try {
        const next = JSON.parse(e.newValue);
        if (next.version === LJ.seed.version) {
          Object.keys(LJ.db).forEach((k) => delete LJ.db[k]);
          Object.assign(LJ.db, next);
          LJ.render();
        }
      } catch {}
    }
  });
  function animatePageArrival() {
    const main = document.getElementById("main");
    if (!main) return;
    if (main.classList.contains("page-arriving")) {
      main.classList.remove("page-arriving");
      void main.offsetWidth;
    }
    main.classList.add("page-arriving");
  }

  window.addEventListener("pageshow", (event) => {
    if (event.persisted) animatePageArrival();
  });
  LJ.render();
  animatePageArrival();
})();
