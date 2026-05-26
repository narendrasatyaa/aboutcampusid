"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SubpageShell from "../components/SubpageShell";
import {
  FOLLOW_TARGET_ACCOUNT,
  REQUIRED_FOLLOW_COUNT,
  parsePastedList,
} from "../../lib/partnership-requirements";

const ORDER_DRAFT_KEY = "aboutcampus_order_draft";
const ORDER_TOKEN_KEY = "fb_id_token";

const initialForm = {
  customerName: "",
  phone: "",
  serviceType: "Media Officer Partnership",
  orderType: "FREE",
  instagramUsername: "",
  followChecklistConfirmed: false,
  likeChecklistConfirmed: false,
  followedAccountsRaw: "",
  orderDetails: "",
  paymentProofFileName: "",
  posterFileNames: [],
  notes: "",
};

function OrderPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPlan = searchParams.get("plan") === "PAID" ? "PAID" : "FREE";
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [proofLoading, setProofLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [paidOrderNumber, setPaidOrderNumber] = useState("");
  const [paidFlowStep, setPaidFlowStep] = useState(1);
  const [paidProofDone, setPaidProofDone] = useState(false);

  const resetPaidFlow = () => {
    setPaidOrderNumber("");
    setPaidFlowStep(1);
    setPaidProofDone(false);
    setProofLoading(false);
  };

  useEffect(() => {
    resetPaidFlow();
    setMessage("");

    let restoredForm = {
      ...initialForm,
      orderType: selectedPlan,
    };

    try {
      const rawDraft = sessionStorage.getItem(ORDER_DRAFT_KEY);
      if (rawDraft) {
        const draft = JSON.parse(rawDraft);
        restoredForm = {
          ...restoredForm,
          ...draft,
          orderType: selectedPlan,
        };
      }
    } catch {
      // ignore draft parse errors
    }

    setForm(restoredForm);
  }, [selectedPlan]);

  const saveDraft = (nextForm) => {
    try {
      sessionStorage.setItem(
        ORDER_DRAFT_KEY,
        JSON.stringify({
          ...nextForm,
          orderType: selectedPlan,
        })
      );
    } catch {
      // ignore storage errors
    }
  };

  const clearDraft = () => {
    try {
      sessionStorage.removeItem(ORDER_DRAFT_KEY);
    } catch {
      // ignore storage errors
    }
  };

  const followedAccounts = parsePastedList(form.followedAccountsRaw);

  const handlePaymentProofChange = (event) => {
    const selectedFile = event.target.files?.[0];
    setForm((prev) => ({
      ...prev,
      paymentProofFileName: selectedFile ? selectedFile.name : "",
    }));
  };

  const handlePosterFilesChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (selectedFiles.length > 5) {
      setMessage("Maksimal upload poster adalah 5 file. Silakan pilih ulang.");
    }

    setForm((prev) => ({
      ...prev,
      posterFileNames: selectedFiles.slice(0, 5).map((file) => file.name),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    const idToken = typeof window !== "undefined" ? localStorage.getItem(ORDER_TOKEN_KEY) : "";
    if (!idToken) {
      saveDraft(form);
      const nextUrl = `/order?plan=${selectedPlan}`;
      router.push(`/login?next=${encodeURIComponent(nextUrl)}`);
      return;
    }

    setLoading(true);

    if (!form.orderDetails.trim()) {
      setMessage("Detail order wajib diisi.");
      setLoading(false);
      return;
    }

    if (form.posterFileNames.length === 0) {
      setMessage("Minimal upload 1 poster.");
      setLoading(false);
      return;
    }

    if (
      selectedPlan === "FREE" &&
      (!form.followChecklistConfirmed || !form.likeChecklistConfirmed)
    ) {
      setMessage("Checklist syarat FREE wajib dicentang semua sebelum kirim order.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          customerName: form.customerName,
          phone: form.phone,
          serviceType: "Media Officer Partnership",
          orderType: form.orderType,
          instagramUsername: form.instagramUsername,
          followChecklistConfirmed: form.followChecklistConfirmed,
          likeChecklistConfirmed: form.likeChecklistConfirmed,
          followedAccounts,
          orderDetails: form.orderDetails,
          paymentProofFileName: "",
          posterFileNames: form.posterFileNames,
          notes: form.notes,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || "Terjadi kesalahan saat kirim order.");
      } else {
        if (form.orderType === "PAID") {
          setPaidOrderNumber(result.orderNumber);
          setPaidFlowStep(2);
          setPaidProofDone(false);
          setMessage(`Order PAID berhasil dibuat dengan nomor ${result.orderNumber}. Lanjut ke payment.`);
        } else {
          setMessage(
            `Order berhasil dibuat dengan nomor ${result.orderNumber}. Tim admin akan segera memproses.`
          );
          clearDraft();
          setForm(initialForm);
        }
      }
    } catch {
      setMessage("Server tidak merespons. Coba lagi beberapa saat.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPaymentProof = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!paidOrderNumber) {
      setMessage("Nomor order PAID belum tersedia.");
      return;
    }

    if (!form.paymentProofFileName) {
      setMessage("Upload bukti payment dulu sebelum konfirmasi.");
      return;
    }

    setProofLoading(true);
    try {
      const response = await fetch("/api/orders/payment-proof", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderNumber: paidOrderNumber,
          paymentProofFileName: form.paymentProofFileName,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || "Gagal mengirim bukti payment.");
      } else {
        setPaidProofDone(true);
        setMessage("Bukti payment berhasil dikirim, admin akan melakukan verifikasi.");
      }
    } catch {
      setMessage("Server tidak merespons saat kirim bukti payment.");
    } finally {
      setProofLoading(false);
    }
  };

  const renderPaidFlow = selectedPlan === "PAID" && paidOrderNumber;

  return (
    <SubpageShell>
      <section className="order-section">
        <div className="wrap">
          <div className="mb-12">
            {/* <div className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-primary">Order Online</div> */}
            <h1 className="mb-6 font-['Bricolage_Grotesque',sans-serif] text-[clamp(1.8rem,3vw,2.8rem)] font-extrabold leading-[1.15] text-info">
              Order Partnership 
              {/* <em className="not-italic text-secondary">FREE / PAID</em> */}
            </h1>
            <div className="order-progress">
              {[
                "Isi Form",
                "Payment",
                "Bukti",
              ].map((label, index) => (
                <span
                  key={label}
                  className={`order-progress-pill ${index + 1 <= (selectedPlan === "PAID" ? paidFlowStep : 1) ? "is-active" : ""}`}
                >
                  <span className={`order-progress-dot ${index + 1 <= (selectedPlan === "PAID" ? paidFlowStep : 1) ? "is-active" : ""}`}>
                    {index + 1}
                  </span>
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* {!selectedPlan && (
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 text-slate-500 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
              Pilih FREE atau PAID di atas untuk mulai.
            </div>
          )} */}
          
          {!renderPaidFlow && (
          <form className="order-form" style={{ marginTop: 18 }} onSubmit={handleSubmit}>
            <label>
              Nama Lengkap
              <input
                required
                type="text"
                value={form.customerName}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, customerName: event.target.value }))
                }
              />
            </label>

            <label>
              Nomor WhatsApp
              <input
                required
                type="tel"
                placeholder="0812xxxx"
                value={form.phone}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, phone: event.target.value }))
                }
              />
            </label>

            <div className="requirement-box" style={{ marginTop: 0 }}>
              <h4>Layanan</h4>
              <p>Media Officer Partnership</p>
            </div>

            <label>
              Username Instagram Instansi/Organisasi
              <input
                required={selectedPlan === "FREE"}
                type="text"
                placeholder="contoh: @aboutcampus_id"
                value={form.instagramUsername}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, instagramUsername: event.target.value }))
                }
              />
            </label>

            {selectedPlan === "FREE" && (
              <>
                <div className="requirement-box">
                  <h4>Syarat FREE Partnership</h4>
                  <p>
                    Kumpulkan minimal {REQUIRED_FOLLOW_COUNT} akun panitia yang sudah follow akun admin @{FOLLOW_TARGET_ACCOUNT}.
                  </p>
                </div>

                <label>
                  Paste list akun panitia yang sudah follow @{FOLLOW_TARGET_ACCOUNT} (pisah baris/koma)
                  <textarea
                    rows={5}
                    placeholder="@panitia_humas\n@panitia_acara\n@panitia_publikasi"
                    value={form.followedAccountsRaw}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, followedAccountsRaw: event.target.value }))
                    }
                  />
                </label>
                <p className={followedAccounts.length >= REQUIRED_FOLLOW_COUNT ? "order-ok" : "order-warning"}>
                  Terbaca {followedAccounts.length} akun panitia. Minimum {REQUIRED_FOLLOW_COUNT} akun.
                </p>

                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    required={selectedPlan === "FREE"}
                    checked={form.followChecklistConfirmed}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, followChecklistConfirmed: event.target.checked }))
                    }
                  />
                  Saya konfirmasi akun panitia pada list di atas sudah follow @{FOLLOW_TARGET_ACCOUNT}.
                </label>

                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    required={selectedPlan === "FREE"}
                    checked={form.likeChecklistConfirmed}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, likeChecklistConfirmed: event.target.checked }))
                    }
                  />
                  Saya konfirmasi syarat like post sudah saya kerjakan.
                </label>

                <p className={form.followChecklistConfirmed && form.likeChecklistConfirmed ? "order-ok" : "order-warning"}>
                  {form.followChecklistConfirmed && form.likeChecklistConfirmed
                    ? "Checklist FREE sudah lengkap. Kamu bisa lanjut kirim order."
                    : "Wajib centang 2 checklist konfirmasi di atas sebelum kirim order FREE."}
                </p>
              </>
            )}

            <label>
              Detail Order
              <textarea
                rows={4}
                required
                placeholder="Contoh: Nama event, tanggal publikasi yang diinginkan, CTA caption, dan target audiens."
                value={form.orderDetails}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, orderDetails: event.target.value }))
                }
              />
            </label>

            <label>
              Upload Poster (Maksimal 5)
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePosterFilesChange}
              />
              {form.posterFileNames.length > 0 && (
                <small>{form.posterFileNames.length} file dipilih: {form.posterFileNames.join(", ")}</small>
              )}
            </label>

            <label>
              Catatan Tambahan (Opsional)
              <textarea
                rows={4}
                value={form.notes}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, notes: event.target.value }))
                }
              />
            </label>

            <button
              type="submit"
              disabled={
                loading ||
                form.posterFileNames.length === 0 ||
                !form.orderDetails.trim() ||
                (selectedPlan === "FREE" && followedAccounts.length < REQUIRED_FOLLOW_COUNT)
              }
              className="bg-primary text-info hover:bg-primary/90 disabled:hover:bg-primary"
            >
              {loading ? "Mengirim..." : selectedPlan === "PAID" ? "Lanjut ke Payment" : "Kirim Order"}
            </button>
            {message && <p className="order-message">{message}</p>}
          </form>
          )}

          {renderPaidFlow && (
            <div className="order-form" style={{ maxWidth: 900 }}>
              <div className="service-subnav" style={{ marginTop: 0 }}>
                <span className={paidFlowStep >= 1 ? "is-current" : ""}>1 Form</span>
                <span className={paidFlowStep >= 2 ? "is-current" : ""}>2 Payment</span>
                <span className={paidFlowStep >= 3 ? "is-current" : ""}>3 Bukti</span>
              </div>

              <div className="requirement-box" style={{ marginTop: 4 }}>
                <h4>Order PAID: {paidOrderNumber}</h4>
                <p>Form sudah terkirim. Lanjut payment, lalu upload bukti.</p>
              </div>

              {paidFlowStep >= 2 && (
                <div className="qris-box">
                  <h4>Payment via QRIS</h4>
                  <div className="qris-placeholder">
                    <img src="/images/qris-static.png" alt="QRIS Pembayaran" className="qris-image" />
                  </div>
                  {paidFlowStep === 2 && (
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => setPaidFlowStep(3)}
                    >
                      Saya Sudah Bayar, Lanjut Upload Bukti
                    </button>
                  )}
                </div>
              )}

              {paidFlowStep >= 3 && (
                <form onSubmit={handleSubmitPaymentProof} style={{ display: "grid", gap: 12 }}>
                  <label>
                    Upload Bukti Payment
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handlePaymentProofChange}
                    />
                    {form.paymentProofFileName && <small>Berkas: {form.paymentProofFileName}</small>}
                  </label>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={proofLoading || paidProofDone || !form.paymentProofFileName}
                  >
                    {proofLoading ? "Mengirim Bukti..." : paidProofDone ? "Bukti Terkirim" : "Kirim Bukti Payment"}
                  </button>
                </form>
              )}

              {message && <p className="order-message">{message}</p>}
            </div>
          )}
        </div>
      </section>
    </SubpageShell>
  );
}

export default function OrderPage() {
  return (
    <Suspense fallback={null}>
      <OrderPageContent />
    </Suspense>
  );
}
