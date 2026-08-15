"use client";

import { useState } from "react";
import { AlertOctagon, ChevronDown, Languages, MapPin, Send, MessageSquare, CheckCircle, AlertCircle } from "lucide-react";
import type { AlertDraft } from "@/lib/types";
import { GlassCard } from "@/components/shared/GlassCard";
import { ALERT_TRANSLATION_NOTE } from "@/lib/fixtures/alerts";
import { SlideToApprove } from "@/components/alerts/SlideToApprove";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/cn";

const APPROVAL_LABEL: Record<AlertDraft["approvalState"], string> = {
  draft: "Draft",
  pending_approval: "Pending approval",
  approved: "Approved for authorised publication",
};

export function AlertPreview({
  alert,
  canApprove,
  onApprove,
}: {
  alert: AlertDraft;
  canApprove: boolean;
  onApprove: () => void;
}) {
  const [lang, setLang] = useState<"en" | "ml">("en");
  const [showPayload, setShowPayload] = useState(false);
  const [sendingSms, setSendingSms] = useState(false);
  const [smsStatus, setSmsStatus] = useState<string | null>(null);
  const [smsResults, setSmsResults] = useState<any[] | null>(null);

  const copy = alert[lang];
  const capPayload = {
    identifier: alert.id,
    status: alert.approvalState === "approved" ? "Actual" : "Draft",
    msgType: "Alert",
    scope: "Restricted",
    info: {
      language: lang === "en" ? "en-IN" : "ml-IN",
      category: "Met",
      event: "Flood",
      urgency: alert.eapState === "red" ? "Immediate" : "Expected",
      severity: alert.eapState === "red" ? "Severe" : alert.eapState === "orange" ? "Moderate" : "Minor",
      certainty: "Likely",
      headline: copy.headline,
      description: copy.body,
      area: { areaDesc: alert.affectedZone },
    },
  };

  const handleSendSms = async () => {
    setSendingSms(true);
    setSmsStatus("Dispatching via Twilio REST API...");
    try {
      const res = await apiClient.dispatchSmsAlert(alert.eapState, ["+919539367173", "+919074121510"]);
      setSmsResults(res.smsResults || []);
      const successful = (res.smsResults || []).filter((r: any) => r.success);
      if (successful.length > 0) {
        setSmsStatus(`Twilio SMS sent successfully! SID: ${successful[0].messageSid}`);
      } else {
        setSmsStatus("SMS dispatch attempted via Twilio API");
      }
    } catch (err: any) {
      setSmsStatus(`Twilio error: ${err.message || "Failed"}`);
    } finally {
      setSendingSms(false);
    }
  };

  return (
    <GlassCard tint="red" className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-2 rounded-2xl bg-red-600 px-4 py-3 text-xs font-extrabold uppercase tracking-wide text-white">
        <div className="flex items-center gap-2">
          <AlertOctagon className="h-4 w-4 shrink-0" aria-hidden />
          {alert.approvalState === "approved"
            ? "Authorised Alert Broadcast Active"
            : "Draft for authorised publication — human sign-off required"}
        </div>
        <span className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold">
          <MessageSquare className="h-3 w-3" />
          Twilio SMS Live
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 rounded-full bg-white/60 px-3 py-1 text-[11px] font-bold text-gray-700">
          <MapPin className="h-3.5 w-3.5" aria-hidden />
          {alert.affectedZone}
        </span>
        <span className="rounded-full bg-white/60 px-3 py-1 text-[11px] font-extrabold uppercase text-gray-700">
          {APPROVAL_LABEL[alert.approvalState]}
        </span>
      </div>

      {/* Twilio Target Contacts display */}
      <div className="rounded-xl border border-gray-200/80 bg-white/80 p-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wide text-gray-600">
            Emergency SMS Alert Contacts (Twilio):
          </span>
          <span className="text-[10px] font-bold text-emerald-700">From +14754656961</span>
        </div>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[11px] font-bold text-blue-900">
            📱 +91 95393 67173
          </span>
          <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[11px] font-bold text-blue-900">
            📱 +91 90741 21510
          </span>
        </div>
      </div>

      <div className="flex gap-1.5">
        {(["en", "ml"] as const).map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            className={
              lang === code
                ? "rounded-full bg-blue-600 px-4 py-1.5 text-xs font-bold text-white"
                : "rounded-full bg-white/60 px-4 py-1.5 text-xs font-bold text-gray-600"
            }
          >
            {code === "en" ? "English" : "Malayalam"}
          </button>
        ))}
      </div>

      <div className="rounded-2xl bg-white/70 p-4">
        <h3 className="text-sm font-extrabold text-gray-900">{copy.headline}</h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-700">{copy.body}</p>
      </div>

      {lang === "ml" && (
        <p className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-700">
          <Languages className="h-3.5 w-3.5" aria-hidden />
          {ALERT_TRANSLATION_NOTE}
        </p>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white/60">
        <button
          type="button"
          onClick={() => setShowPayload((v) => !v)}
          className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-xs font-bold text-gray-700"
        >
          View CAP payload (JSON)
          <ChevronDown className={cn("h-4 w-4 transition-transform", showPayload && "rotate-180")} aria-hidden />
        </button>
        {showPayload && (
          <pre className="custom-scrollbar max-h-56 overflow-auto border-t border-gray-100 px-4 py-3 text-[10px] leading-relaxed text-gray-600">
            {JSON.stringify(capPayload, null, 2)}
          </pre>
        )}
      </div>

      {/* Manual Twilio SMS Dispatch button */}
      <div className="rounded-2xl bg-white/80 p-3.5 flex flex-col gap-2">
        <button
          type="button"
          onClick={handleSendSms}
          disabled={sendingSms}
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2.5 px-4 transition-all shadow-md active:scale-95 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          {sendingSms ? "Broadcasting Twilio SMS..." : "Dispatch Emergency SMS via Twilio Now"}
        </button>

        {smsStatus && (
          <div className="rounded-lg bg-gray-900 p-2.5 text-white text-[11px] font-mono leading-snug">
            <p className="text-emerald-400 font-bold">{smsStatus}</p>
            {smsResults && (
              <div className="mt-1 flex flex-col gap-1 border-t border-gray-800 pt-1 text-[10px]">
                {smsResults.map((res: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span>{res.recipient}:</span>
                    {res.success ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 inline" /> Queued ({res.messageSid})
                      </span>
                    ) : (
                      <span className="text-amber-400 font-bold flex items-center gap-1">
                        <AlertCircle className="h-3 w-3 inline" /> {res.error}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-center text-[11px] font-semibold text-gray-500">
          Human-in-the-loop: no message is broadcast without physical magistrate authentication.
        </p>
        <SlideToApprove
          disabled={!canApprove}
          approved={alert.approvalState === "approved"}
          onApprove={onApprove}
        />
        {!canApprove && (
          <p className="text-center text-[11px] font-semibold text-gray-400">
            Only the District Collector / authorised communicator role can approve.
          </p>
        )}
      </div>
    </GlassCard>
  );
}

