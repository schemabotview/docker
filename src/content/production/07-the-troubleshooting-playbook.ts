import type { Section } from '../types'

export const theTroubleshootingPlaybook: Section = {
  id: 'the-troubleshooting-playbook',
  title: 'The troubleshooting playbook',
  scene: 'troubleshoot-tree',
  slide: `## Separate the four before you read anything

"Docker is broken" is four unrelated problems. Each has one command that answers it.

**First, two things, always:**
- \`df -h\` and \`docker system df\` — a full disk presents as a dozen unrelated symptoms (§6)
- \`docker context ls\` — are you on the machine you think you're on? (course 1 §8)

**Then:**
1. **Daemon** — \`docker info\` fails? \`journalctl -u docker -n 100\`. Usually disk, or a \`daemon.json\` syntax error (§1)
2. **Container** — \`docker ps -a\` for the **exit code** first (course 2 §4). 137 is memory, 127 is a missing command, 125 is a bad \`run\`. Then \`docker logs\`
3. **Build** — \`--progress=plain --no-cache\` and read the **first** error, not the last
4. **Network** — the four questions in order (course 7 §11)

### The one to internalise
**Read the exit code before the logs.** It's often the whole answer, and it takes two seconds.`,
  narration:
    "Docker is broken covers at least four unrelated problems, and the difference between five minutes and an afternoon is separating them before you start reading anything. So: a playbook. Before any of the four branches, two checks, every time. Df dash h, and docker system df. A full disk is the single most common cause of bizarre Docker behaviour, and it presents as a dozen symptoms that don't obviously point at storage: builds failing with strange errors, containers refusing to start, the daemon becoming unresponsive, pulls hanging. Check it first, always, because it takes two seconds and it explains a startling proportion of incidents. And docker context ls, which is course one, section eight: are you actually on the machine you think you're on? If you use contexts or remote hosts at all, the answer is sometimes no, and you can spend a long time investigating a healthy machine. Then the four branches. First, is the daemon itself up? Docker info is the test — if that fails, nothing below matters. Go to journalctl dash u docker and read the last hundred lines. The two most common causes are a full disk, which you've already checked, and a syntax error in daemon dot json from the last time someone edited it and didn't restart to confirm. Second, a container. And here's the habit worth building: read the exit code before the logs. Docker ps dash a, look at the status column. Course two gave you the table — 137 is SIGKILL, which means memory or a stop that timed out; 127 means the command wasn't found in the image; 126 means it was found and isn't executable; 125 means the docker run command itself was malformed. Any of those is often the entire answer, and it takes two seconds versus scrolling through logs. Then docker logs, and then docker inspect on the specific field you care about. Third, a build. Two flags: dash dash progress equals plain, which prints every line in full rather than the collapsing display, and dash dash no-cache if you suspect a stale layer. And read the first error, not the last — a build failure cascades, and the last message is usually a consequence several steps removed from the cause. Fourth, networking, which is course seven section eleven and has its own four questions: same network, does the name resolve, is anything listening, what is it bound to. In order, because each rules out a layer. Two more tools worth having in reach. When the image has no shell — distroless, scratch — join its namespaces with a debug container: docker run with dash dash net container colon the name, using netshoot. That's course two, section nine, and it gives you a full toolbox looking at exactly the same network stack and process view. And docker events dash dash since, from the last section, for the question that's otherwise nearly unanswerable: what actually happened to this container while nobody was watching. Next: Docker in a pipeline.",
}
