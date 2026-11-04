import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  confirmStudentPayment,
  disputeStudentPayment,
  getOwnerPayments,
  getStudentPayments,
  recordOwnerPayment,
} from "../utils/api";
import { apiRequest } from "../utils/api";

const statusStyles = {
  "Awaiting Confirmation": "bg-amber-100 text-amber-900",
  Completed: "bg-green-100 text-green-900",
  Disputed: "bg-red-100 text-red-900",
  Pending: "bg-blue-100 text-blue-900",
};

function PaymentStatus({ status }) {
  return (
    <span
      className={`px-2 py-1 text-[10px] font-mono uppercase ${
        statusStyles[status] || "bg-neutral-100 text-neutral-800"
      }`}
    >
      {status}
    </span>
  );
}

function PaymentRows({ payments, student, onConfirm, onDispute }) {
  const [disputeId, setDisputeId] = useState(null);
  const [reason, setReason] = useState("");

  if (payments.length === 0) {
    return (
      <p className="border border-neutral-300 p-5 text-xs font-mono text-neutral-500">
        No payment records yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {payments.map((payment) => (
        <article
          key={payment.payment_id}
          className="border border-neutral-300 bg-[#F3F3EF] p-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <h4 className="font-bold uppercase tracking-tight">
                {payment.project_title || "Project payment"}
              </h4>
              <p className="text-xs text-neutral-600 mt-1">
                {student
                  ? `From ${payment.owner_name || payment.owner_email || "Project Owner"}`
                  : `For ${payment.student_name || payment.student_email || "Student"}`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold">₹{payment.amount}</span>
              <PaymentStatus status={payment.status} />
            </div>
          </div>
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-xs font-mono">
            <div>
              <dt className="text-[10px] uppercase text-neutral-500">Method</dt>
              <dd>{payment.payment_method}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase text-neutral-500">Reference</dt>
              <dd className="truncate">{payment.transaction_reference}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase text-neutral-500">Payment date</dt>
              <dd>{new Date(payment.payment_date).toLocaleDateString()}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase text-neutral-500">Recorded</dt>
              <dd>{new Date(payment.created_at).toLocaleDateString()}</dd>
            </div>
          </dl>
          {payment.dispute_reason && (
            <p className="mt-3 text-xs text-red-800">
              Dispute: {payment.dispute_reason}
            </p>
          )}
          {student && payment.status === "Awaiting Confirmation" && (
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => onConfirm(payment.payment_id)}
                className="border border-black bg-black text-white px-3 py-2 text-[10px] font-mono uppercase tracking-wider hover:bg-neutral-800"
              >
                Confirm Receipt
              </button>
              {disputeId === payment.payment_id ? (
                <div className="flex flex-1 gap-2">
                  <input
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    placeholder="Reason for dispute"
                    className="min-w-0 flex-1 border border-black bg-white px-3 py-2 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      onDispute(payment.payment_id, reason);
                      setDisputeId(null);
                      setReason("");
                    }}
                    className="border border-black px-3 py-2 text-[10px] font-mono uppercase"
                  >
                    Submit
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setDisputeId(payment.payment_id)}
                  className="border border-black px-3 py-2 text-[10px] font-mono uppercase hover:bg-white"
                >
                  Raise Dispute
                </button>
              )}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}

export default function PaymentSection({ role }) {
  const isOwner = role === "owner";
  const [payments, setPayments] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState({
    application_id: "",
    amount: "",
    payment_method: "UPI",
    transaction_reference: "",
    payment_date: new Date().toISOString().slice(0, 10),
  });

  const loadPayments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      if (isOwner) {
        const [paymentResponse, applicationResponse] = await Promise.all([
          getOwnerPayments(),
          apiRequest("/api/owner/applications"),
        ]);
        const applicationData = await applicationResponse.json();
        if (!applicationResponse.ok || !applicationData.success) {
          throw new Error(applicationData.error || "Could not load accepted applications.");
        }
        setPayments(paymentResponse);
        setApplications(
          (applicationData.applications || []).filter(
            (application) => application.status === "Accepted"
          )
        );
      } else {
        setPayments(await getStudentPayments());
      }
    } catch (loadError) {
      setError(loadError.message || "Could not load payments.");
    } finally {
      setLoading(false);
    }
  }, [isOwner]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const acceptedApplications = useMemo(
    () =>
      applications.filter(
        (application) =>
          !payments.some(
            (payment) =>
              payment.application_id === application.application_id &&
              payment.status === "Awaiting Confirmation"
          )
      ),
    [applications, payments]
  );

  async function submitPayment(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    try {
      await recordOwnerPayment(form);
      setForm((current) => ({
        ...current,
        application_id: "",
        amount: "",
        transaction_reference: "",
      }));
      setNotice("Payment recorded and awaiting student confirmation.");
      await loadPayments();
    } catch (submitError) {
      setError(submitError.message || "Could not record payment.");
    }
  }

  async function updateStudentPayment(action, id, reason) {
    setError("");
    setNotice("");
    try {
      if (action === "confirm") {
        await confirmStudentPayment(id);
        setNotice("Receipt confirmed. Payment marked completed.");
      } else {
        await disputeStudentPayment(id, reason);
        setNotice("Payment dispute submitted.");
      }
      await loadPayments();
    } catch (updateError) {
      setError(updateError.message || "Could not update payment.");
    }
  }

  return (
    <section className="mb-14 border border-black bg-white p-6" aria-labelledby={`${role}-payments-heading`}>
      <div className="mb-5">
        <span className="text-xs uppercase tracking-widest font-mono text-neutral-500">
          Manual payment tracking
        </span>
        <h3 id={`${role}-payments-heading`} className="text-xl font-bold uppercase tracking-tight mt-1">
          {isOwner ? "Payments" : "Payments received"}
        </h3>
        <p className="text-xs text-neutral-600 mt-2">
          Payments happen outside ProjeX. This section records confirmation status only.
        </p>
      </div>

      {loading && <p className="font-mono text-sm">Loading payments...</p>}
      {!loading && error && (
        <div className="border border-red-300 bg-red-50 p-4 text-sm">
          <p role="alert">{error}</p>
          <button type="button" onClick={loadPayments} className="mt-3 underline font-mono text-xs uppercase">
            Retry
          </button>
        </div>
      )}
      {!loading && notice && <p className="mb-4 border border-green-300 bg-green-50 p-3 text-sm">{notice}</p>}

      {!loading && isOwner && (
        <form onSubmit={submitPayment} className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-3 border border-neutral-300 p-4">
          <select
            required
            value={form.application_id}
            onChange={(event) => setForm({ ...form, application_id: event.target.value })}
            className="border border-black bg-white px-3 py-2 text-xs"
          >
            <option value="">Accepted application</option>
            {acceptedApplications.map((application) => (
              <option key={application.application_id} value={application.application_id}>
                {application.project_title} — {application.applicant_name || application.user_email}
              </option>
            ))}
          </select>
          <input required min="0.01" step="0.01" type="number" placeholder="Amount (INR)" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} className="border border-black px-3 py-2 text-xs" />
          <select value={form.payment_method} onChange={(event) => setForm({ ...form, payment_method: event.target.value })} className="border border-black bg-white px-3 py-2 text-xs">
            <option>UPI</option>
            <option>Bank Transfer</option>
            <option>Other</option>
          </select>
          <input required maxLength={160} placeholder="Transaction reference" value={form.transaction_reference} onChange={(event) => setForm({ ...form, transaction_reference: event.target.value })} className="border border-black px-3 py-2 text-xs" />
          <button type="submit" className="bg-black text-white px-3 py-2 text-[10px] font-mono uppercase tracking-wider hover:bg-neutral-800">
            Record Payment
          </button>
          <input required type="date" value={form.payment_date} onChange={(event) => setForm({ ...form, payment_date: event.target.value })} className="border border-black px-3 py-2 text-xs md:col-start-2" />
        </form>
      )}

      {!loading && !error && (
        <PaymentRows
          payments={payments}
          student={!isOwner}
          onConfirm={(id) => updateStudentPayment("confirm", id)}
          onDispute={(id, reason) => updateStudentPayment("dispute", id, reason)}
        />
      )}
    </section>
  );
}
