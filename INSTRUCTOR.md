# Lehrkräfte-Leitfaden – AlpenTech

Die Oberfläche ist auf Wunsch Englisch. Die Übung umfasst Einführung, Fehlersuche und Reflexion. Keine echten VMs, Betriebssystemstarts oder Netzwerkzugriffe. Das Dashboard ist herstellerneutral.

## Ablauf

- Szenario lesen. Host und Type-1-Hypervisor erklären: Dieser verwaltet virtuelle Hardware auf dem physischen Server.
- Host inspizieren, „Create VM“ wählen. Anforderungen vergleichen und VM erstellen. Vorbereitete Vorlage erklären: Ubuntu allein bringt kein Mitarbeiterportal mit.
- Bewusst „Isolated test network“ speichern, VM starten und Portal öffnen. Verbindungsfehler besprechen und die verpflichtende Diagnosefrage unter dem simulierten Browser beantworten. Richtige Ursache: VM und Arbeitsplatz sind auf nicht verbundenen Netzen. Herunterfahren, „Company network“ wählen, speichern und erneut starten. „Running“ bedeutet nicht automatisch „Dienst erreichbar“.
- Portal nach der Diagnose erneut öffnen. Handover ausfüllen: verbleibende Ressourcen berechnen, Cloud-Frage beantworten und Flag prüfen.
- Ressourcenanzeige und drei Erkenntnisse besprechen. Einzelhost-Virtualisierung ist noch keine vollständige private Cloud. Hyper-V, VMware ESXi und Proxmox VE einordnen; Proxmox nutzt KVM für VMs.

## Musterlösung

Name `intranet-web`, Image „Ubuntu Server – Prepared portal“, mindestens 2 vCPUs, 4 GB RAM und 20 GB Disk; beispielsweise 4/8/40 ist ebenfalls gültig. Maximale Hostkapazität: 8 CPU-Kerne, 16 GB RAM, 200 GB Disk. Netzwerk „Company network“ speichern, „Start VM“, nach etwa 2,7 Sekunden „Open portal“ bzw. „Retry“ wählen.

Handover bei Minimalbelegung: **6 CPU-Kerne, 12 GB RAM, 180 GB Disk** frei; bei 4/8/40: **4, 8, 160**. Bei 8/16/200 bleibt überall 0. Cloud-Antwort: Es fehlen zusätzliche Fähigkeiten wie Self-Service, Automatisierung und gemeinsame Ressourcenverwaltung.

Flag: `FLAG{VM_ERFOLGREICH_GESTARTET}`. Vorher muss das Portal erfolgreich erreicht worden sein. Umgebende Leerzeichen werden ignoriert.

## Hinweise für die Durchführung

Hardware und Netzwerk lassen sich nur ausgeschaltet ändern. Disk wird bei Erstellung reserviert; CPU/RAM erscheinen ab Start als genutzt. Host-Overhead, CPU-Overcommitment und Thin Provisioning werden bewusst ausgelassen. Falsche Eingaben sind ohne Strafe korrigierbar; kontextbezogene Hinweise helfen in zwei Stufen.

Fortschritt bleibt nach Neuladen erhalten; im privaten Browsermodus gelten dessen Speicherregeln. „Reset lab“ und „Delete progress“ beginnen neu. Die Fehlerreproduktion und Diagnose gehören jetzt verpflichtend zum Lab; für schnelle Gruppen die Reflexion vertiefen.

Das Firmennetz wird erst nach aufgezeichnetem Fehler im isolierten Testnetz und korrekter Diagnose freigegeben. „Next action“ nennt jeweils die konkreten nächsten Klicks. Das isolierte Testnetz ist kein externes Netz und kein Internetanschluss.

## Interaktive Testversion

Diese Variante liegt auf `experiment/interactive-network`; die vorherige Unterrichtsversion bleibt auf `main` und unter dem Tag `classroom-ready` erhalten. Im optionalen Explorer können Lernende Komponenten anklicken, den Endpunkt einer Anfrage vorhersagen und die Anfrage mit „Next hop“ schrittweise verfolgen. Der abgeschlossene Trace führt denselben Portaltest aus wie „Open portal“ und speichert dessen Nachweis. Keine zusätzlichen Pflichtaufgaben; der bestehende Lösungsweg bleibt gültig. Die Testversion nutzt einen eigenen Browserspeicher, sodass der Fortschritt der Unterrichtsversion erhalten bleibt.
