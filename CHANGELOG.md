# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/) and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Changed
- Standardize on Node.js 22 LTS (`.nvmrc`, `engines`, Dockerfiles, CI) — previously 20 in docs/scripts
- Frontend API client now targets the versioned `/api/v1` backend prefix (fixes login flow 404)

### Fixed
- Frontend login flow: API calls now resolve against the `/api/v1` mount
- Remove all `no-explicit-any` lint warnings across backend and worker

## v2.0.0

### Added
- Authentication
- Dashboard
- Monitor Management
- Analytics
- Alerts
- Worker Service

### Fixed
- Dashboard authentication loading issue
- Prisma schema synchronization issues
