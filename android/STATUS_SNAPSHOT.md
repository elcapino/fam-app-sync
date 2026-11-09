# HMK local status snapshot

The Android command center reads one JSON object. It does not fetch news or any other service. The bundled file `app/src/main/assets/status-snapshot.sample.json` is a labelled sample (`"sample": true`). A file chosen in the system document picker replaces only this snapshot, after confirmation. It never writes `hmk_workspace_v1`.

Storage key: `hmk_status_snapshot_v1`.

## Fields

| Field | Type | Notes |
| --- | --- | --- |
| sample | boolean, optional | `true` shows the sample label. Omit it on a real local snapshot. |
| generatedAt | string | Shown on the home screen. Required. |
| ceoNow | string[] | What the assistant reference lists now. |
| tools | object[] | `name`, `state` (`running`, `idle`, `stopped`), `lastRun`. |
| computers | object[] | `name`, `online` (boolean), `lastSeen`. |
| brief | object[] | `title`, `source`, `url`, `date`. `url` is displayed, never opened for a fetch. |
| happened | string[] | Timeline, past. |
| now | string[] | Timeline, current. |
| next | string[] | Timeline, upcoming. |
| ideas | string[] | Reference ideas, not personal drafts. |
| programs | string[] | Reference programs, not personal projects. |

Arrays may be empty. An empty section shows a short empty line. Unknown extra fields are ignored. A file that is not this object, or that breaks a listed type, is rejected and the previous snapshot stays. Limits match the workspace file: 200000 bytes, 50 items in each array, 400 characters in each string.
