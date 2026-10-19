@"
# HotspotHub - Wi-Fi Billing System

HotspotHub is a Wi-Fi billing and network management platform designed
to allow customers to purchase internet packages and administrators to
manage customers, packages, payments, subscriptions, and network sessions.

## Technology Stack

### Frontend
- React
- TypeScript
- Vite
- CSS

### Backend
- Python
- Django
- Django REST Framework
- PostgreSQL

### Planned Integrations
- M-Pesa Daraja API
- Compatible Wi-Fi network hardware
- Network access simulation for development

## Development Approach

The first milestone is a working vertical slice in simulation mode:

1. Display available internet packages.
2. Allow a customer to select a package.
3. Create a purchase record.
4. Simulate payment in development mode.
5. Activate a subscription.
6. Record simulated network access.

Payment and network simulations will be restricted to development.
Real payment and network integrations will be added in later milestones.

## Project Status

Initial repository structure established. Application development is
planned to proceed incrementally with Git commits after meaningful changes.
"@ | Set-Content README.md