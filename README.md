This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load Geist, a new font family from Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out the [Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=nextjs&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

# How the Error Was Resolved

The error you were facing was most likely related to **React Query not being properly configured** in the application, combined with an API response format mismatch.

## Step-by-Step Resolution:

### Step 1: Identified the Problem
- The application was trying to use React Query hooks (`useQuery`) but the `QueryClientProvider` was not wrapping the app
- The API was returning data in a different format than what the frontend expected

### Step 2: Added QueryClientProvider
- In `src/Provider.tsx`, added `QueryClient` and `QueryClientProvider` to wrap the children
- This is **required** for React Query to work - without it, any `useQuery` or `useMutation` hooks will fail

### Step 3: Fixed API Response Format
- Modified `src/app/api/auth/property/get/route.ts` to return an object with `properties` array and `pagination` object instead of just an array
- Added pagination logic with `page`, `limit`, and `skip` calculations

### Step 4: Updated Frontend to Handle New Response Format
- Changed `src/app/dashboard/page.tsx` to access `res.data.properties` instead of `res.data`
- Updated `src/app/dashboard/properties/[status]/page.tsx` to use `useQuery` and properly type the response

### Step 5: Added Proper Loading States
- Replaced simple loading boolean with proper loading spinners and states using React Query's `isLoading` and `isFetching`

## Key Takeaway
When using React Query (TanStack Query) in Next.js:
1. Always wrap your app with `QueryClientProvider`
2. Make sure your API response format matches what the frontend expects
3. Use TypeScript interfaces for proper type safety

The following changes were made to resolve the error:

## 1. Provider.tsx - Added React Query Client Provider
- Wrapped the application with `QueryClientProvider` from `@tanstack/react-query`
- This was missing and likely caused issues with data fetching

## 2. src/app/api/auth/property/get/route.ts - Added Pagination Support
- Added `page` and `limit` query parameters support
- Changed the API response from returning just an array to returning an object with:
  - `properties`: The array of property data
  - `pagination`: Object containing `page`, `limit`, `total`, and `totalPages`

## 3. src/app/dashboard/page.tsx - Updated Data Handling
- Added `params: { limit: 100 }` to the API call
- Changed `setProperties(res.data)` to `setProperties(res.data.properties || [])`
- This handles the new response format from the API

## 4. src/app/dashboard/properties/[status]/page.tsx - Major Refactor
- Replaced `useEffect` + `axios` with `useQuery` from React Query
- Added proper TypeScript interfaces for Property, PaginationInfo, and ApiResponse
- Added pagination UI with:
  - Page number display
  - Previous/Next buttons
  - Dynamic page number rendering
  - "Showing X to Y of Z properties" info
- Added loading states with spinner
- Added filter change handlers that reset to page 1

## 5. next.config.ts - Removed comment
- Minor cleanup, removed commented config placeholder
