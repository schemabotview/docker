import type { Section } from '../types'

export const authentication: Section = {
  id: 'authentication',
  title: 'Authentication',
  scene: 'registry-auth',
  slide: `## A 401, then a scoped token

The client always tries anonymously first. The **401** carries a \`Www-Authenticate\` header naming the auth service and the **scope** — \`repository:library/nginx:pull\`. The client fetches a short-lived token for exactly that scope and retries.

So a leaked token is narrow and expires. That's a better shape than a long-lived credential on every request.

### What \`docker login\` leaves on your disk
By default, \`~/.docker/config.json\` with your password **base64-encoded** — which is encoding, not encryption, and anything that reads your home directory can decode it.

Set a \`credsStore\` so it goes in the OS keychain instead. One line, and it removes a real exposure.

### In CI, don't \`login\` with a password
\`--password-stdin\` from a secret, and a **token**, not your account password. Better still, a short-lived OIDC credential — GitHub, GitLab and the cloud registries all issue them now.`,
  narration:
    "How does a pull authenticate? The answer is a small dance that explains a couple of otherwise confusing behaviours. The client always starts anonymously. It sends the manifest request with no credentials at all, and for a public image on Docker Hub that succeeds, which is why you can pull nginx without an account. For anything private, or once you've hit a rate limit, the registry replies 401 — and crucially, it replies with a Www-Authenticate header that says where to get a token and what scope to ask for. The scope looks like repository colon library slash nginx colon pull: a specific repository and a specific action. The client goes to the named auth service, presents whatever credentials it has, and gets back a short-lived bearer token for exactly that scope. Then it retries the original request with the token. That's a good design. The token is narrow — it grants pull on one repository, not access to your account — and it expires in minutes. So a token captured from a process list or a log is a much smaller problem than a captured password. It also explains a behaviour people find odd: pulling several images from a private registry produces several token requests, because each repository needs its own scope. Now, what docker login actually does, and this is worth knowing because the default is worse than most people assume. By default, docker login writes your credentials to a file in your home directory — dot docker slash config dot json — with the username and password concatenated and base64-encoded. Base64 is encoding, not encryption. It's reversible with one command and no key. So any process that can read your home directory — a compromised npm postinstall script, a backup tool, a colleague on a shared machine — has your registry password. The fix is one line in that same file: a credsStore entry naming a credential helper, which stores the secret in the operating system's keychain instead. Docker Desktop configures this for you on Mac and Windows. On Linux you install docker-credential-secretservice or docker-credential-pass. It takes five minutes and it removes a genuine exposure. And then CI, where the advice is different again. Don't run docker login with a password on a command line at all, because command lines end up in process listings and in CI logs. Use dash dash password-stdin and pipe the secret in. Use a registry token or a robot account rather than your personal password, so the credential can be scoped to push to one repository and revoked without changing your own login. And best of all, use a short-lived credential minted for that job: GitHub Actions can get a token for its own registry automatically; AWS, Google and Azure all issue short-lived registry credentials from workload identity. Then there's no long-lived secret in your CI configuration at all, which removes the most common way registry credentials leak. One last thing to know: the config file also holds credentials per registry host, so you can be logged into several at once, and dockerd reads it for pulls initiated by the daemon. That's why a pull can fail with unauthorised in a context where your shell can pull fine — different user, different home directory, different config file. Next: pushing.",
}
