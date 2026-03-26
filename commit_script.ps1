$ErrorActionPreference = "Stop"

# 4. Client Landing Refactoring (Route Group & Packages)
git add apps/client/package.json pnpm-lock.yaml apps/client/next-env.d.ts 'apps/client/src/app/(landing)/layout.tsx' 'apps/client/src/app/(landing)/page.tsx' apps/client/src/app/page.tsx apps/client/src/components/landing/LandingNavbar.tsx apps/client/src/components/landing/LandingFooter.tsx
git commit -m "refactor(client): restructure landing page into route group"

# 5. Client Static Pages
git add 'apps/client/src/app/(landing)/about/' 'apps/client/src/app/(landing)/careers/' 'apps/client/src/app/(landing)/contact/' 'apps/client/src/app/(landing)/hipaa/' 'apps/client/src/app/(landing)/privacy/' 'apps/client/src/app/(landing)/security/' 'apps/client/src/app/(landing)/success-stories/' 'apps/client/src/app/(landing)/terms/'
git commit -m "feat(client): implement static company and legal pages"

# 6. Client Book Demo Form
git add 'apps/client/src/app/(landing)/book-demo/'
git commit -m "feat(client): build book demo form and update landing CTAs"

# 7. Admin Dashboard Demo Requests Panel
git add apps/admin/src/app/dashboard/demo-requests/ apps/admin/src/components/sidebar.tsx apps/admin/next-env.d.ts
git commit -m "feat(admin): build demo requests dashboard panel"

# 8. Add any remaining untracked or modified files (catch-all just in case)
git add .
if (git status --porcelain) {
    git commit -m "chore: formatting and minor adjustments for demo request flow"
}

# 9. Push to remote
git push
