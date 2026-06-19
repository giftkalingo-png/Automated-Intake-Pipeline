# Corporate Data Intake & Underwriting Pipeline Engine

### 🛠️ Core Stack & Integrations
*   **Language Execution:** JavaScript / Google Apps Script Engine
*   **Data Structures:** Google Sheets JSON-to-Matrix Ledger
*   **Infrastructure Automation:** Google Drive File System API, Google Document DOM Tree manipulation
*   **External Protocols:** RESTful API Webhook Multi-Channel Gateway (HTTP JSON POST / Bearer Token Auth)

---

### 📋 Architectural Overview
This repository showcases an end-to-end automated intake framework designed to process raw user submission object graphs, parse data types, perform programmatic risk/rule auditing, compile transactional layouts, and dispatch automated multi-channel alert notifications (SMS/Email). 

By building this custom middleware pipeline, I successfully converted a legacy, highly human-dependent operational workflow into a sub-second, error-proof, fully auditable ingestion mechanism.

### 🌟 Key Functional Architecture & Logic Breakdown

1. **Transactional Integrity & Error Handling:** Encapsulated deep within an end-to-end `try/catch` processing thread. The system isolates multi-stream file generation to prevent database state corruption during hardware execution or payload transfer faults.
2. **Binary Multi-Stream Stream Handling:** Decodes incoming Base64 binary file vectors asynchronously on the fly, auto-converts arrays to clean PDF blobs, maps system permissions, and logs them securely into automated directory subfolders.
3. **Dynamic Template DOM Injection:** Scans and dynamically maps flat file scalar key tokens (e.g., `{{AppId}}`). It evaluates multi-dimensional calculation metrics via a JSON nested array, programmatically rendering an optimized structured summary table directly into the core document's stream index layout.
4. **Prudential Rules & Underwriting Module:** Acts as a gatekeeper metrics engine. It evaluates incoming numerical parameters against pre-programmed business ceilings. If structural criteria are breached (e.g., product flags or rule limits), the engine overrides approval and automatically intercepts the flow, rerouting the tracking object directly to a manual triage desk queue.
5. **REST API Gateway Integration Layer:** Orchestrates external downstream alerting via a high-performance outbound JSON webhook payload, enforcing bearer access authorization, sanitizing international telephone string records (`265` string prefixes), and catching transmission network drops seamlessly.

---

### 📈 Operational Impact Metrics Achieved
*   **Manual Task Eradication:** Reduced application assembly data routing labor from 1.5 hours per profile to a **sub-second** fully automated background pipeline execution.
*   **Data Consistency Guarantee:** Enforced zero configuration mapping drift. System rules logic drops anomalous string payloads prior to spreadsheet data injection.
*   **Instant Customer Transparency:** Improved SLA cycles by immediately delivering signed system verification links via dynamic emails and SMS API text alerts the second a payload is processed.
