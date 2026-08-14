import type { AlertDraft, EapState } from "@/lib/types";

// Malayalam copy is an unreviewed translation draft — flagged inline rather
// than presented as agency-verified text, per the project's own claim-boundary
// rules (never overstate verification we haven't done).

export const ALERT_DRAFTS: Record<EapState, AlertDraft> = {
  blue: {
    id: "alert-blue",
    eapState: "blue",
    affectedZone: "Internal only — no public zone designated at Blue state",
    approvalState: "draft",
    en: {
      headline: "Internal watch note — Idamalayar EAP Blue state (draft, not for release)",
      body:
        "This is an internal monitoring note only. No public advisory is authorised at Blue state. KSEB EPM is running the standing inspection checklist for the watch scenario. This text is not for external distribution.",
    },
    ml: {
      headline: "ആന്തരിക നിരീക്ഷണ കുറിപ്പ് — ഇടമലയാർ EAP ബ്ലൂ നില (ഡ്രാഫ്റ്റ്, പ്രസിദ്ധീകരണത്തിന് അല്ല)",
      body:
        "ഇത് ആന്തരിക നിരീക്ഷണത്തിനുള്ള കുറിപ്പ് മാത്രമാണ്. ബ്ലൂ നിലയിൽ പൊതുജന അറിയിപ്പ് അനുവദനീയമല്ല. ഈ വാചകം പുറത്തേക്ക് വിതരണം ചെയ്യാൻ ഉദ്ദേശിച്ചതല്ല.",
    },
  },
  orange: {
    id: "alert-orange",
    eapState: "orange",
    affectedZone: "Advisory readiness — Kuttampuzha and Bhoothathankettu panchayats (scenario assumption)",
    approvalState: "pending_approval",
    en: {
      headline: "Advisory readiness note — Idamalayar EAP Orange state (draft for authorised publication)",
      body:
        "Draft for authorised publication only — not yet approved. Under the current rule-curve context, residents of low-lying areas in Kuttampuzha and Bhoothathankettu panchayats should review evacuation routes and keep emergency contacts ready. This is advisory readiness, not an evacuation order.",
    },
    ml: {
      headline: "മുൻകരുതൽ തയ്യാറെടുപ്പ് കുറിപ്പ് — ഇടമലയാർ EAP ഓറഞ്ച് നില (അധികാരപ്പെടുത്തിയ പ്രസിദ്ധീകരണത്തിനുള്ള ഡ്രാഫ്റ്റ്)",
      body:
        "അധികാരപ്പെടുത്തിയ പ്രസിദ്ധീകരണത്തിനുള്ള ഡ്രാഫ്റ്റ് മാത്രം — ഇതുവരെ അംഗീകരിച്ചിട്ടില്ല. നിലവിലെ റൂൾ-കർവ് സന്ദർഭത്തിൽ, കുട്ടമ്പുഴ, ഭൂതത്താൻകെട്ട് പഞ്ചായത്തുകളിലെ താഴ്ന്ന പ്രദേശങ്ങളിലെ താമസക്കാർ ഒഴിപ്പിക്കൽ വഴികൾ പരിശോധിക്കുകയും അടിയന്തര ബന്ധപ്പെടാനുള്ള വിവരങ്ങൾ തയ്യാറാക്കുകയും ചെയ്യണം. ഇത് ഒരു മുൻകരുതൽ തയ്യാറെടുപ്പ് മാത്രമാണ്, ഒഴിപ്പിക്കൽ ഉത്തരവല്ല.",
    },
  },
  red: {
    id: "alert-red",
    eapState: "red",
    affectedZone: "Recommend for approval — Bhoothathankettu, Kuttampuzha and Kothamangalam low-lying wards (scenario assumption)",
    approvalState: "pending_approval",
    en: {
      headline: "Public alert — Idamalayar EAP Red state (draft for authorised publication)",
      body:
        "DRAFT FOR AUTHORISED PUBLICATION ONLY. Not sent. Under the modeled large-release scenario, evacuation of low-lying areas in Bhoothathankettu, Kuttampuzha and Kothamangalam wards is recommended for approval by the District Authority. Move to the nearest designated shelter. Avoid the Kuttampuzha–Bhoothathankettu–Kothamangalam bridge segment, modeled impassable. This draft requires Collector or authorised-communicator sign-off before any publication.",
    },
    ml: {
      headline: "പൊതു മുന്നറിയിപ്പ് — ഇടമലയാർ EAP റെഡ് നില (അധികാരപ്പെടുത്തിയ പ്രസിദ്ധീകരണത്തിനുള്ള ഡ്രാഫ്റ്റ്)",
      body:
        "അധികാരപ്പെടുത്തിയ പ്രസിദ്ധീകരണത്തിനുള്ള ഡ്രാഫ്റ്റ് മാത്രം. അയച്ചിട്ടില്ല. മോഡൽ ചെയ്ത വലിയ റിലീസ് സാഹചര്യത്തിൽ, ഭൂതത്താൻകെട്ട്, കുട്ടമ്പുഴ, കോതമംഗലം വാർഡുകളിലെ താഴ്ന്ന പ്രദേശങ്ങൾ ഒഴിപ്പിക്കാൻ ജില്ലാ അധികാരികളുടെ അംഗീകാരത്തിനായി ശുപാർശ ചെയ്യുന്നു. ഏറ്റവും അടുത്ത ദുരിതാശ്വാസ ക്യാമ്പിലേക്ക് മാറുക. കുട്ടമ്പുഴ–ഭൂതത്താൻകെട്ട്–കോതമംഗലം പാലം ഭാഗം ഒഴിവാക്കുക. ഈ ഡ്രാഫ്റ്റ് പ്രസിദ്ധീകരിക്കുന്നതിന് മുൻപ് കളക്ടർ അല്ലെങ്കിൽ അധികാരപ്പെടുത്തിയ ആശയവിനിമയക്കാരന്റെ അംഗീകാരം ആവശ്യമാണ്.",
    },
  },
};

export const ALERT_TRANSLATION_NOTE =
  "Malayalam text is an unreviewed translation draft, not agency-verified copy.";
