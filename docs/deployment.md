# Deploying Rio Gaia on Hetzner with Coolify

## Architecture

```
                          ┌─── Hetzner VPS (CX42: 8 vCPU, 16 GB RAM) ───┐
                          │                                               │
  riogaia.com ──► Traefik ├──► storefront (Next.js, port 3000)           │
  api.riogaia.com ────────├──► medusa-server (API + Admin, port 9000)    │
  search.riogaia.com ─────├──► meilisearch (port 7700)                   │
                          │                                               │
                          │    medusa-worker (background jobs, no port)   │
                          │    postgres (internal, port 5432)             │
                          │    redis (internal, port 6379)                │
                          └───────────────────────────────────────────────┘
```

Medusa runs as two containers from the same image:
- **server** (`MEDUSA_WORKER_MODE=server`): API + admin dashboard, runs migrations on startup
- **worker** (`MEDUSA_WORKER_MODE=worker`): background jobs, subscribers, scheduled tasks

## Step 1: Provision Hetzner VPS

- **Server**: CX42 (8 vCPU, 16 GB RAM, 160 GB NVMe, ~€16/mo) or CAX31 ARM (~€14/mo)
- **OS**: Ubuntu 22.04
- **Auth**: SSH key only
- **Location**: Falkenstein or Helsinki (closest to Portugal)

## Step 2: Hetzner Cloud Firewall

Create in Hetzner Cloud Console → Firewalls:

| Direction | Protocol | Port | Source |
|-----------|----------|------|--------|
| Inbound | TCP | 22 | Your IP |
| Inbound | TCP | 80 | 0.0.0.0/0 |
| Inbound | TCP | 443 | 0.0.0.0/0 |
| Outbound | All | All | 0.0.0.0/0 |

Attach to the server. Hetzner Cloud Firewall operates at the hypervisor level — Docker cannot bypass it.

## Step 3: SSH Hardening

```bash
ssh root@<server-ip>
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl restart sshd
```

## Step 4: Install Coolify

```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

Access `http://<server-ip>:8000` and create an admin account.

## Step 5: DNS Records

Create A records pointing to your server IP:

| Subdomain | Target |
|-----------|--------|
| `riogaia.com` | `<server-ip>` |
| `www.riogaia.com` | `<server-ip>` |
| `api.riogaia.com` | `<server-ip>` |
| `search.riogaia.com` | `<server-ip>` |

## Step 6: Coolify Configuration

1. **Connect Git repo**: Settings → Sources → Add GitHub/GitLab
2. **Create Project**: "Rio Gaia"
3. **Add Resource**: Docker Compose → select repo → set Compose File Path to `compose.prod.yml`
4. **Set Environment Variables**: Copy all vars from `.env.production.template` into Coolify's Environment Variables. Mark sensitive vars as **Locked**.
5. **Mark Build Variables**: Tick "Build Variable" for all `NEXT_PUBLIC_*` vars
6. **Configure Domains** (in Coolify's Service Configuration):
   - `medusa-server` → `https://api.riogaia.com` (port 9000)
   - `storefront` → `https://riogaia.com` + `https://www.riogaia.com` (port 3000)
   - `meilisearch` → `https://search.riogaia.com` (port 7700)
   - `postgres`, `redis`, `medusa-worker` → no domain (internal only)

## Step 7: Deploy

Click "Deploy" in Coolify. Startup order is enforced by `depends_on` + health checks:

1. `postgres` + `redis` + `meilisearch` (parallel)
2. `medusa-server` (waits for all three, runs migrations, starts API)
3. `medusa-worker` + `storefront` (wait for medusa-server healthy)

## Step 8: Post-Deployment

### Create admin user
```bash
docker exec -it <medusa-server-container> npx medusa user -e admin@riogaia.com -p <password>
```

### Get publishable API key
Go to Admin (`https://api.riogaia.com/app`) → Settings → API Keys

### Create Meilisearch search-only key
```bash
curl -X POST 'https://search.riogaia.com/keys' \
  -H 'Authorization: Bearer <MEILI_MASTER_KEY>' \
  -H 'Content-Type: application/json' \
  --data '{"actions":["search"],"indexes":["products"],"expiresAt":null}'
```

Use the returned key as `NEXT_PUBLIC_MEILISEARCH_API_KEY` and redeploy the storefront.

## Verification

```bash
# API health
curl https://api.riogaia.com/health

# Storefront
curl https://riogaia.com

# Meilisearch health
curl https://search.riogaia.com/health

# Admin dashboard
# Visit https://api.riogaia.com/app
```

## Backup Strategy

| Resource | Method | Frequency | Retention |
|----------|--------|-----------|-----------|
| PostgreSQL | Coolify built-in `pg_dump` → S3 | Every 4 hours | 7 days |
| Redis | Volume snapshot (cache, recoverable) | Daily | 3 days |
| Meilisearch | Re-index from DB (derived data) | On demand | N/A |
| Server | Hetzner Cloud Snapshot | Weekly | 4 weeks |

## Security Checklist

- [x] Non-root containers (both Dockerfiles)
- [x] No hardcoded secrets (fail-fast validation)
- [x] Hetzner Cloud Firewall (only 22, 80, 443)
- [x] SSH key-only auth
- [x] Redis password authentication
- [x] Meilisearch search-only key for browser
- [x] Health checks on every service
- [x] `unless-stopped` restart policy

### Optional hardening
- Install Tailscale VPN for Coolify dashboard access (avoid exposing port 8000)
- Set up Coolify notifications (Telegram/Discord/email) for deploy failures
- Enable Coolify's built-in PostgreSQL backup to S3 (Hetzner Object Storage ~€3/mo)
- Schedule backups: `0 */4 * * *` (every 4 hours)
