# Technical Front-End UI/UX Specification: TerraCascade EAP Command
**Project:** TerraCascade EAP Command (Flood Scoped Only)
**Target Audience:** Front-End Developer / UI-UX Engineer
**Design Philosophy:** Dark control-room aesthetic. Priority is on operational clarity, attention-grabbing approval prompts, and strict grounding of data via "epistemic status" labels. No red used as decorative accents.

---

## 1. Global Theme, Styling, & Terminology

### A. Design Tokens
*   **Base Theme:** Deep, calm dark theme (e.g., Slate-900 `#0f172a` or Zinc-950 `#09090b`) to emulate a professional emergency operations centre (EOC) dashboard.
*   **Colors by Severity (Accessible Contrast):**
    *   🔴 **Red Alert / Failure State:** `#ef4444` (Used strictly for active Red EAP states, imminent failures, or blocked critical paths).
    *   🟠 **Orange Alert / Controlled Release:** `#f97316` (Used for controlled spillage, rule curve breaches).
    *   🔵 **Blue Alert / Watch State:** `#3b82f6` (Used for weather forecasts, initial watch conditions).
    *   🟢 **Normal / Secure State:** `#22c55e` (Completed actions, open routes, fully funded states).
*   **Layout Grid:** A multi-panel, non-overlapping dashboard layout ensuring a complete operational overview can be comprehended in **under 10 seconds**.

### B. Mandatory Terminology & Labels
To respect institutional and statutory legal boundaries under India’s Dam Safety Act, the interface must strictly display these exact phrases:
*   Use **"Recommend for Approval"** or **"Advisory Alert"**—*NEVER* display "Order Evacuation" or "Order Release".
*   Use **"Rule-curve context"**—*NEVER* display "Open dam gates now".
*   Use **"Draft for authorised publication"** or **"Draft Only"** on all messaging previews—*NEVER* use "Send alert".
*   Use **"Portfolio recommendation"**—*NEVER* label budget decisions as a "Government funding decision".
*   Use **"ViT-derived flood extent (pre-computed)"**—*NEVER* label maps as "live satellite feed" or "real-time detection".

---

## 2. Shared Map Architecture (Central Command Hub)

The map is the central focus of the command centre, serving as a shared operational layer visible to all authorities (though interactive components shift by role).

### A. Layers & Legend Specification
The map must include a robust layer controller and a persistent legend. The legend must explicitly partition layers by their **epistemic status**:

1.  **Hydrological Layer (Pre-Computed ViT):**
    *   **Source Data:** Polygon overlay derived from NASA/IBM's `Prithvi-100M-sen1floods11` geospatial foundation model (cached Sentinel-2 L2A segmentation).
    *   **Required On-Map Label:** Include a small floating tag in the map corner stating: `"ViT-derived flood extent (pre-computed) - Source: Prithvi-100M-sen1floods11 / Sentinel-2 / L2A"`.
    *   **Styling:** Semi-transparent blue fill (`rgba(59, 130, 246, 0.4)`) indicating segmented flood water.
2.  **Verified Physical Assets (Ground Truth):**
    *   Swollen reservoirs (Idamalayar coordinates: `10.2217° N, 76.7064° E`).
    *   Downstream Barrages (Bhoothathankettu Periyar Barrage).
    *   Topographical infrastructure (roads, bridges, schools, and hospitals).
3.  **Assumed / Scenario Assets (Labelled "Demo Assumptions"):**
    *   Vulnerable local households, emergency helipads, and local boat deployments that are not yet agency-validated.

### B. Interactive Map Markers (Idamalayar Basin Data)
*   **Bridges (Submersion States):**
    *   *Pooyamkutty Bridge (B1)*, *Thattekadu Bridge (B2)*, *Neriamangalam Bridge (B3)*, *Bhoothathankettu Barrage (B4)*, *Malayattoor Kodanad Bridge (B5)*.
    *   *Interactivity:* Clicking a bridge marker pulls up an info window: `[Bridge Name] | EAP Status: Submerged / Inundated | Depth: [x]m | Water Velocity: [y] m/s`.
*   **Shelters / Relief Camps (Ref: Annexure 9a/9b):**
    *   Map shelters *S1 (SNDP HSS Adimali)* through *S12 (Bhavan's College, Kakkanad)*.
    *   *Visual Indicator:* If a shelter’s access road is blocked by the flood overlay, render the marker with a hazard border and status badge: `"Access Road Blocked - Deploy Amphibious Support"`.

---

## 3. Role-Based Dashboard Specifications

The front-end must allow the user to toggle between four distinct operational profiles via a top-navigation role selector. Each role alters the interactive panels, widgets, and action items.

### ROLE 1: KSEB Emergency Preparedness Manager (EPM)
*   **Focus:** Dam safety monitoring, gate operational logic, and technical EAP execution.
*   **Key Widgets:**
    1.  **Active EAP State Indicator:** Large, color-coded header showing the current dam-hazard state (Blue: Watch, Orange: Controlled spillage, Red: Imminent Failure/Major spillway discharge > 300 m³/s).
    2.  **Interactive EAP Action Board:**
        *   Renders a checklist of protocol-cited actions mapped directly from the Idamalayar EAP Action Sheets.
        *   *Checklist Lifecycle:* `Draft` -> `Pending Approval` -> `Acknowledged` -> `In Progress` -> `Complete`.
        *   *Examples of Actions to Render:*
            *   *Blue (Watch SHEET B1):* "AE Susamma: Initiate hourly monitoring of catchments and private upstream rain gauges."
            *   *Orange (Controlled Release SHEET B2):* "EPM Biju P.N: Notify District Collectors of spillage levels under 300 m³/s."
            *   *Red (Large Controlled Release SHEET B3):* "Chief Engineer: Trigger automated warning sirens (less than 2-hour arrival zone) and generate evacuation recommendations."
    3.  **Dynamic Protocol Citation Drawer:**
        *   Clicking any action card slides open a right-side drawer containing the verbatim EAP source text (e.g., *"EAP Idamalayar (May 2020) - Section 6.1, Responsibilities of Emergency Planning Manager"*).
    4.  **Manual Action Override Prompt:**
        *   If the EPM marks an EAP step as "Sypassed" or "Overridden," the UI must force a modal prompt: `"EAP Protocol Deviation: Enter legal/operational justification to persist change to immutable audit trail."`

### ROLE 2: District Emergency Operations Centre (EOC) Coordinator
*   **Focus:** Inter-agency resource management, downstream asset protection, and logistics.
*   **Key Widgets:**
    1.  **Critical Dependency Cascade Graph:**
        *   A node-based dependency flow visualization (e.g., using a library like React Flow) representing active cascade risks.
        *   *Example Cascade Chain:* `Substation 4 (Flooded State) ──> Water Pump 2 (Power Knockout) ──> General Hospital (Life Support Threat / Generator Fuel Window: 4 hours)`.
        *   *Visual Styling:* Nodes transition from green to pulsing orange/red as water levels approach critical elevations.
    2.  **Downstream Resource Grid:**
        *   A grid tracking the availability and positioning of emergency assets: `Amphibious Vehicles (3/5 active)`, `Emergency Inflatable Boats (12 deployed)`, `Raised Shelters (6/12 operating at 90% capacity)`.
    3.  **Map Route Blocker Controller:**
        *   Linked directly to the map. Shows road segments (e.g., *R19 Malayattoor-Kodanad Road*) as blocked on the map, dynamically rerouting downstream logistics.

### ROLE 3: District Collector (Authorised Communicator)
*   **Focus:** Public alerting and community-level hazard warning.
*   **Key Widgets:**
    1.  **CAP Alert Preview Composer:**
        *   A structured preview of the Common Alerting Protocol (CAP) JSON payload.
        *   Features a bilingual toggle to show alerts in both English and Malayalam (complying with NDMA CAP Sachet guidelines).
        *   *Pre-filled Alert Content Example:*
            *   **Headline (English):** "Evacuation Recommendation: Ayyampuzha Panchayat."
            *   **Instructions (English):** "Water levels on the Periyar are rising. Evacuation is strongly recommended for all households below the 500-meter mark in Ayyampuzha (Tiles 1, 3, 4, 6) by 2:00 PM. Proceed to Shelter S1 (SNDP HSS Adimali)."
    2.  **Human-in-the-Loop "Approve & Draft" CTA:**
        *   The main action button must be heavily guarded to prevent accidental triggers: require a "Slide to Approve" slider.
        *   The entire screen must feature an overlay warning banner: `"WARNING: This interface drafts alerts for authorized emergency networks. No message will be broadcast without physical magistrate authentication."`

### ROLE 4: Disaster Mitigation Budget Planner
*   **Focus:** Turning a fixed regional mitigation budget into an explainable, optimized project portfolio.
*   **Key Widgets:**
    1.  **Mitigation Budget Slider:**
        *   An interactive drag slider spanning from `₹0` to `₹20 Crores` (with standard increments).
    2.  **Optimal Portfolio Decision Table:**
        *   Consumes the output of the backend's 0/1 knapsack-style dynamic program.
        *   Renders a side-by-side list of projects:
            *   *Funded/Selected List:* e.g., "Reinforce Malayattoor Bridge Embankments | Cost: ₹2.5 Cr | Protected Pop: 4,200 | Benefit-Cost: 1.8".
            *   *Unfunded/Excluded List:* e.g., "Build Concrete Retaining Wall, Kuttampuzha | Cost: ₹15 Cr | Protected Pop: 1,500 | Benefit-Cost: 0.4".
    3.  **Explainable Optimization Rationale Panel:**
        *   A text component displaying the dynamic "why" for each budget slider state: `"At a budget of ₹10 Crores, the algorithm maximized population protection by bundling four highly localized, high-yield interventions, excluding the Kuttampuzha retaining wall due to budget exhaustion and low population density density return."`

---

## 4. Master Source & Audit Timeline

### A. Immutable Audit Timeline Panel
*   Renders a chronological timeline tracking every system interaction.
*   *Audit Log Structure:*
    *   **Timestamp:** e.g., `2026-08-14 02:14:05`
    *   **Actor:** e.g., `EPM Biju P.N (KSEB_EPM_04)`
    *   **Event:** e.g., `Acknowledged Blue Alert Watch Action SHEET B1.1`
    *   **Protocol Source Tag:** `[Idamalayar EAP - Section 6.1]`
    *   **Epistemic Validation Status:** Green check badge for `[Verified Action]` or yellow warning badge for `[Demo Simulation Override]`.

### B. UI/UX Verification Checklist (Definition of Done)
1.  **The "10-Second" Operational Rule:** A first-time observer must immediately understand the current hazard level, the number of pending approvals, and the flood extent map boundaries.
2.  **Zero Unlabeled Metrics:** Ensure every single number, pool level elevation, and cost indicator features a small trailing tooltip icon specifying its source status:
    *   🏷️ `[Official Rule Curve]`
    *   🧪 `[Demo Simulation Assumption]`
    *   🛰️ `[Pre-Computed ViT Model Output]`
    *   📋 `[Needs Agency Verification]`
