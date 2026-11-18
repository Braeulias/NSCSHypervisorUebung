# AlpenTech Virtualization Lab

An English, beginner-friendly educational simulation for a guided classroom activity. All VM actions, startup output, networking and the portal are simulated locally. No backend or real IP requests.

## Run

Node.js 22.18+ (24 recommended) and npm are needed for development only.

```sh
npm install
npm run dev
```

Open the URL printed by Vite. To verify and build:

```sh
npm test
npm run build
npm run preview
```

Deploy the contents of `dist/` to any static host. Relative asset paths support hosting under a subdirectory; no SPA rewrite rules are required. Dependencies are bundled, with no CDN, external fonts or runtime services. Participants need only a browser.

## Lab

Inspect the host, create `intranet-web` from the prepared Ubuntu portal template with at least 2 vCPUs / 4 GB RAM / 20 GB disk, save the isolated test network, start the VM and test the embedded browser. Diagnose the connection failure, shut down, connect to the company network and restart. Reach the portal, complete the remaining-capacity and private-cloud handover, then submit the flag. Larger allocations up to host capacity are valid. The isolated-network failure and diagnosis are required milestones. The handover calculation uses the chosen allocation, so larger VMs yield different answers.

Progress is saved under `alpentech-lab-interactive-v1` in localStorage. Refreshing during boot resumes its timestamp-based startup simulation. A reset requires confirmation. Browser storage must be available to persist progress; a warning appears otherwise. Client-side flags are intentionally inspectable; this is not a secure CTF platform.

`src/lab.ts` contains validation and recovery rules; `src/main.tsx` implements the interface; `tests/lab.test.ts` checks core behavior. See `INSTRUCTOR.md` for the German instructor guide. No scoring is used. The activity includes discussion and a networking troubleshooting exercise.

## Interactive experiment

This checkout is on `experiment/interactive-network`. The original classroom version is preserved on `main` and tagged `classroom-ready` (`fb976e1`). Return to it with:

```sh
./repo-git switch main
npm run build
```

Switch back to this experiment with `./repo-git switch experiment/interactive-network` and rebuild if serving `dist/`.

The optional **Follow the connection** explorer adds clickable infrastructure components and a prediction exercise. Select a predicted endpoint, click **Send test request**, then **Next hop** to follow the request. A finished trace performs the same portal test as **Open portal** and records mission evidence. Both routes retain the required isolated-test → diagnosis → company-network sequence. Changes to power, allocation or network clear the trace. Trace playback and predictions are temporary UI state; mission evidence persists.

Experiment progress uses a separate localStorage key, leaving the original classroom version’s saved progress intact. This simulation abstracts the request path; it is not a packet capture or network diagnostic tool.
