# `network_discovery.sh`

A self‑contained Bash script that sweeps your local network, builds a table of live hosts (IP, MAC, hostname, vendor) and lets you archive or automate the results. It is sized for macOS but works on Linux with minor tweaks.

---

## 1  Features

- **One‑line run** – no flags required; auto‑detects your current interface and subnet mask.
- **Fast ping sweep** using `nmap -sn` (no port scan).
- **MAC→vendor lookup** when `arp-scan` is available.
- **Pretty table** printed to stdout; easy to redirect to CSV/Markdown.
- **Clean temporary files** via `mktemp` + `trap`.
- **Launchd‑friendly** – schedule nightly jobs in two steps.

---

## 2  Prerequisites

| Tool        | Install on macOS                                                                                  | Purpose                      |
| ----------- | ------------------------------------------------------------------------------------------------- | ---------------------------- |
| `brew`      | `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"` | Package manager              |
| `nmap`      | `brew install nmap`                                                                               | fast host discovery          |
| `arp-scan`¹ | `brew install arp-scan`                                                                           | OUI/vendor lookup (optional) |

> ¹ If `arp-scan` is absent the script simply omits the *Vendor* column.

---

## 3  Installation

```bash
mkdir -p ~/bin            # keep custom scripts here
curl -O https://raw.githubusercontent.com/<you>/scripts/network_discovery.sh
chmod +x network_discovery.sh
mv network_discovery.sh ~/bin/
```

Add `~/bin` to your `$PATH` (if it is not already):

```bash
echo 'export PATH="$HOME/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc
```

---

## 4  Usage

```bash
network_discovery.sh                # prints table to terminal
network_discovery.sh > scan.csv     # save as CSV for later
```

Sample output:

```
IP              MAC               HOSTNAME                     VENDOR
---------------------------------------------------------------------------
192.168.1.1     84:3d:c6:a1:7b:f0 router.local                Netgear, Inc.
192.168.1.10    3c:22:fb:c9:2e:11 Devin‑MacBook‑Air.local     Apple, Inc.
192.168.1.23    dc:a6:32:12:99:e8 livingroom‑pi.local         Raspberry Pi
```

---

## 5  Automating with **launchd** (macOS)

1. Create a log folder:
   ```bash
   mkdir -p ~/Logs
   ```
2. Save the following as `~/Library/LaunchAgents/com.dev.netdiscover.plist`:
   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
   <plist version="1.0"><dict>
     <key>Label</key><string>com.dev.netdiscover</string>
     <key>ProgramArguments</key><array>
       <string>/Users/$USER/bin/network_discovery.sh</string>
     </array>
     <key>StartCalendarInterval</key><dict>
       <key>Hour</key><integer>3</integer>
       <key>Minute</key><integer>0</integer>
     </dict>
     <key>StandardOutPath</key><string>/Users/$USER/Logs/netdiscover.log</string>
   </dict></plist>
   ```
3. Load it:
   ```bash
   launchctl load ~/Library/LaunchAgents/com.dev.netdiscover.plist
   ```

Each morning you will find an updated inventory in `~/Logs/netdiscover.log`.

---

## 6  Troubleshooting

| Symptom                            | Fix                                                                              |
| ---------------------------------- | -------------------------------------------------------------------------------- |
| `nmap: command not found`          | `brew install nmap`                                                              |
| *MAC column is "--" everywhere*    | `brew install arp-scan` then rerun                                               |
| "Operation not permitted" on macOS | Grant Terminal *Full Disk Access* under **System Settings → Privacy & Security** |

---

## 7  Further reading

- [`nmap` reference guide](https://nmap.org/book/man-briefoptions.html)
- [`arp-scan` project page](https://github.com/royhills/arp-scan)
- [Bash unofficial strict mode](https://bashhackers.org/wiki/doku.php?id=grammar:brief_blastrules)
- [`curl` manpage](https://curl.se/docs/manpage.html)

---

## 8  License

MIT. Attribution appreciated but not required.
