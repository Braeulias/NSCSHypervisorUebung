# Implementation and verification

Built an English React/TypeScript lab with a responsive hypervisor dashboard, guided objectives and two-stage hints, host resource meters, validated VM creation/editing, three simulated networks, guarded power controls, timestamp-based startup, live infrastructure map, embedded simulated browser, flag gate, completion recap and confirmed reset. Progress persists in localStorage. Runtime requires no external assets or services.

## Passed

- TypeScript validation and Vite production build; relative asset paths generated for subdirectory hosting.
- Thirteen focused automated checks (`npm test`): minimum and maximum valid allocations; five field errors and host capacity bounds; portal responses for powered-off, booting and isolated-network states followed by successful network correction; early/wrong/whitespace-padded flag submission; persisted state recovery including refresh during startup and malformed saves; required troubleshooting evidence and diagnosis; dynamic handover calculations for three allocation sizes including zero remaining capacity; migration of older saves without bypassing new completion requirements.

## Verification limitations

The sandbox denies listening sockets (`EPERM`), preventing the preview server from starting. A direct built-file Playwright attempt also failed because Chromium's socket setup was denied. Consequently, visual layout, keyboard interaction, actual browser localStorage/reload, button sequences and reset were not verified end to end. Review those flows in a normal local browser using `npm run dev`. No hosted deployment was requested or performed.

Package downloads were unavailable here, so the build used an existing local dependency installation. The manifest and lockfile record the versions used. The generated `dist/` is ready for static hosting; development dependencies are not needed by participants.

## Classroom browser checklist

1. Create with 2 vCPUs / 4 GB / 20 GB; reach portal and submit flag.
2. Reset and repeat with 4 / 8 / 40 (or 8 / 16 / 200).
3. Submit default fields; check specific feedback and retained entries.
4. Start on isolated test network; observe failure, shut down, change to company network, save, restart, retry.
5. Open portal while off and during startup; verify appropriate explanations.
6. Enter the correct flag early; verify practical steps are required.
7. Reload after creation and during startup; ensure progress returns and startup finishes.
8. Reset: cancel once, then confirm; reload and verify initial state.
9. Check narrow viewport and keyboard navigation, including reset confirmation.

This is an educational simulation, not a secure CTF or a reproduction of a vendor dashboard.

Updated challenge: the opening briefing gives four ordered phases. An isolated-network failure, correct diagnosis, successful repaired portal visit, resource calculation and private-cloud explanation are now required before completion. Browser verification remains blocked as described above.

Guided-flow update: company-network selection is locked until diagnosis; saving and starting require the network for the current phase. Added checks cover the full network gating sequence and recovery of older company-first saves. Timing estimates were removed from the interface and guides. Browser verification is still unavailable under the sandbox restrictions documented above.

Interactive experiment: preserved the original version on `main` with the annotated `classroom-ready` tag; all experiment changes are on `experiment/interactive-network`. Added a clickable component inspector and manual request walkthrough with endpoint prediction. Completing the trace calls the existing portal-test handler, so it follows the same evidence rules. State changes remount the explorer to discard stale traces. Separate localStorage isolates experimental mission progress. Added three focused checks for network-boundary failures, off/starting/missing VM behavior, and a complete successful request path. Production build and all thirteen automated checks pass. Browser UI verification remains blocked by the environment as previously documented.

Additional browser checks for the experiment: inspect all five components; trace an isolated-network failure; confirm the diagnosis unlocks; repair and trace success; compare a correct and incorrect prediction; change power/network mid-trace and verify it resets; use keyboard controls and narrow viewport; switch to the classroom version and confirm its previous progress remains available.
