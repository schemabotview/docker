import type { Section } from '../types'

export const whyContainers: Section = {
  id: 'why-containers',
  title: 'Why containers',
  scene: 'works-on-my-machine',
  slide: `## The bug is the environment

You shipped \`app.py\` and a requirements file. You did **not** ship the Python that runs it, the OpenSSL it links, or the glibc underneath — each host filled those in from itself, differently.

### Why the old fixes weren't enough
- **"Document the setup"** — prose drifts from reality within a week
- **A config-management script** — converges a host *towards* a state; never guarantees it
- **A whole VM per app** — correct, but a gigabyte and a boot sequence per service

### What a container does instead
Ship the whole lower stack **as the artifact**: code, libraries, interpreter, system libraries. One file, byte-identical everywhere, and **nothing is filled in by the host**.

### The one thing it does not carry
The **kernel**. That's borrowed from the host — the trade that makes it small, and the subject of §2.`,
  narration:
    "Start with the failure, because containers are an answer to a specific one, and if you don't hold the failure clearly the answer looks like fashion. You wrote an application. You tested it. It works. You hand over app dot py and a requirements file, and on the CI runner it fails, and on the production host it fails differently. Now look at what you actually shipped versus what the program actually needs. You shipped your source and a list of library names. The program also needs a Python interpreter of a particular version, and the libraries compiled against a particular OpenSSL, and underneath all of that a system C library of a particular vintage. None of that was in the handover. Every host filled it in from its own filesystem, and no two hosts agreed. That is the whole of works-on-my-machine. It is not carelessness and it is not a mystery. It is an unwritten contract — the environment — and an unwritten contract is honoured differently by everyone who reads it. The industry tried three fixes before this one. The first was documentation: write the setup down. That fails because prose and reality drift apart within about a week, and nothing checks. The second was configuration management — Puppet, Chef, Ansible — which is a real improvement, because now the setup is code. But notice what it does: it takes a host that is in some unknown state and pushes it towards a desired state. It converges. It doesn't guarantee, and it certainly doesn't guarantee that two hosts end up identical. The third fix was the virtual machine, and the virtual machine actually works. You ship a whole disk image, the kernel included, and it genuinely runs the same everywhere. The trouble is the price: about a gigabyte per image, half a minute of boot, and a full operating system to patch, for every single service. So here is the container's move, on the bottom of the diagram. Take that row of things the host was quietly supplying — your code, the libraries, the interpreter, the system libraries — and put the row itself inside the artifact. Now the thing you ship is the environment. It is byte-identical on your laptop, the CI runner and the production host, because it is the same file, and nothing is being filled in by anybody. And there is exactly one thing that is still borrowed from the host, deliberately: the kernel. That single omission is what makes a container fifty megabytes instead of a gigabyte, and it is also the source of every real limitation containers have. So that is where we go next — precisely what a container is not.",
}
