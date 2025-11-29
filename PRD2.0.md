# Product Requirements Document (PRD)
## Context Switch Minimizer 2.0: The Collaboration & Intelligence Update
**Document Version:** 2.0
**Status:** Planning / RFC (Request for Comments)
**Previous Version:** 1.0 (MVP)

---

## 1. Executive Summary
**Vision:** Evolve from a personal utility into a **team-wide productivity operating system**. While v1.0 helped individuals reclaim focus, v2.0 aims to solve the "Culture of Interruption" at the organizational level.

**Primary Objectives:**
1.  **Unlock B2B Revenue:** Launch "Team Plans" to increase Average Revenue Per User (ARPU) and reduce churn.
2.  **Close the Loop:** Expand blocking to websites (via extension) and mobile devices (via companion app) to prevent "device hopping" distractions.
3.  **Automate Friction:** Use AI and integrations to start sessions automatically, removing the need for manual activation.

---

## 2. Strategic Pillars

### Pillar A: "Team Pulse" (B2B Expansion)
Managers need visibility into team burnout and focus trends without invasive surveillance. Teams need a way to signal "Do Not Disturb" synchronously across all communication channels.

### Pillar B: "360° Focus" (Ecosystem)
Blocking desktop apps isn't enough if the user just picks up their phone or opens Reddit in a browser tab. v2.0 introduces a Browser Extension and Mobile Companion App.

### Pillar C: "Intelligent Flows" (AI & Automation)
Manual session entry is friction. v2.0 syncs with Calendars and learns user habits to suggest or auto-start focus modes.

---

## 3. New Feature Epics

### Epic 5: Team Collaboration & Sync
**User Story 5.1: Shared Team Templates**
*   **Description:** Team leads can create "Standard Focus Protocols" (e.g., "Sprint Deep Work") that are instantly pushed to all team members' dashboards.
*   **Value:** Reduces setup time for new employees; establishes team norms.

**User Story 5.2: Sync Status (Slack/Teams Integration)**
*   **Description:** When a user enters a Focus Session in CSM, their Slack/Teams status automatically updates to ⛔ *Focusing - Back at 3:00 PM* and pauses notifications.
*   **Value:** Prevents the "Hey, quick question?" interruption loop.

**User Story 5.3: Team Insights Dashboard**
*   **Description:** Aggregated, anonymized view for managers showing "Total Deep Work Hours" vs. "Meeting Hours."
*   **Privacy Constraint:** Managers *cannot* see individual app usage or specific times, only aggregate team trends to prevent micromanagement fears.

### Epic 6: Total Blocking Ecosystem
**User Story 6.1: Intelligent Website Blocking**
*   **Implementation:** Chrome/Edge/Firefox Extension.
*   **Behavior:** When a Desktop Session is active, the extension blocks "Distraction" category sites (Social Media, News) with the same Gentle Redirect overlay.
*   **Sync:** Extension communicates with Desktop App via local host messaging.

**User Story 6.2: Mobile Companion Mode**
*   **Implementation:** iOS/Android App.
*   **Behavior:** When Desktop Session starts, the phone enters "CSM Mode" (blocks notifications, dims screen, or shows a "Focusing..." lock screen).
*   **Value:** Prevents the user from picking up their phone when they get stuck on a coding problem.

### Epic 7: Smart Automation
**User Story 7.1: Calendar Guard**
*   **Integration:** Google Calendar / Outlook 365.
*   **Behavior:** If an event is named "Focus Time" or "Deep Work," CSM automatically prompts (or auto-starts) the corresponding session when the event begins.

**User Story 7.2: Flow State Prediction (AI)**
*   **Description:** Analyze usage patterns to suggest the optimal time for deep work.
*   **Notification:** "You usually hit peak focus around 10:00 AM. Start a session now?"

---

## 4. Technical Architecture Upgrades

### 4.1 Cloud Sync (Supabase + TRPC)
*   **Transition:** Move from Local-Only (v1.0) to "Local-First with Sync" (v2.0).
*   **Requirement:** Pro/Team users need their sessions and stats synced across multiple computers (e.g., Work Laptop + Home Desktop).
*   **Data Model:**
    ```typescript
    interface SyncedSession {
      userId: string;
      deviceId: string;
      lastSyncedAt: Date;
      // ... encrypted blob of session data
    }
    ```

### 4.2 Real-Time Status Engine
*   **Technology:** WebSockets (Supabase Realtime).
*   **Use Case:** Updating "Team Pulse" dashboard live; syncing Desktop start command to Mobile App instantly.

### 4.3 Browser Extension Bridge
*   **Communication:** Native Messaging Host API to allow the Chrome Extension to read the state of the Electron App securely.

---

## 5. Monetization Strategy (v2.0)

| Tier | Price | v1.0 Features | **New v2.0 Features** |
| :--- | :--- | :--- | :--- |
| **Free** | $0 | 3 Sessions, Local Stats | Basic Website Blocking |
| **Pro** | $8/mo | Unlimited, History, Export | Cloud Sync, Calendar Integration, Mobile App |
| **Team** | **$12/user/mo** | All Pro Features | Slack/Teams Sync, Shared Templates, Team Analytics, Admin Console |

---

## 6. Migration Plan

1.  **Database Migration:** Update local SQLite schema to support `sync_id` and `team_id` fields.
2.  **Legacy Support:** Ensure v1.0 users who don't want cloud features can remain strictly local (Legacy Mode).
3.  **Grandfathering:** Existing Pro users get v2.0 Pro features at their original v1.0 price point ($8/mo vs potential price hike).

---

## 7. Risks & Mitigations

*   **Risk:** Privacy backlash regarding Team Analytics.
    *   *Mitigation:* "Privacy by Design." Hard-code anonymity thresholds (e.g., no data shown for teams < 5 people). Make individual data viewable ONLY by the individual, never the manager.
*   **Risk:** Browser Extension store rejection.
    *   *Mitigation:* Ensure strict adherence to Manifest V3 and clearly disclose permissions. Avoid "reading" browsing history; only check URLs against the blocklist.
