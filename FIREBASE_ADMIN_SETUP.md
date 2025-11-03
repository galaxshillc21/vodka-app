# Firebase Admin SDK Setup Guide

## Overview

This project has been enhanced with secure serverless API routes for Firebase event management. Instead of performing admin operations directly from the client-side, all Create, Update, and Delete operations now go through secure API endpoints that validate admin permissions server-side.

## Architecture Changes

### Before (Client-side Firebase)

- ❌ All Firebase operations performed on client-side
- ❌ Admin operations exposed to client
- ❌ No server-side validation
- ❌ Limited security controls

### After (Serverless API Routes)

- ✅ Admin operations moved to secure API routes
- ✅ Server-side authentication and authorization
- ✅ Firebase Admin SDK for enhanced security
- ✅ Client-side limited to read operations only
- ✅ Rate limiting and audit trails possible

## Setup Instructions

### 1. Firebase Service Account

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`blat-vodka-3424d`)
3. Navigate to **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key**
5. Download the JSON file

### 2. Environment Variables

Update your `.env.local` file with the values from the downloaded JSON:

```bash
# Firebase Admin SDK Configuration
FIREBASE_PROJECT_ID=blat-vodka-3424d
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@blat-vodka-3424d.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_ACTUAL_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----"
```

**Important Notes:**

- The private key must be wrapped in quotes
- Keep the literal `\n` characters (don't replace with actual newlines)
- Copy the entire private key from the JSON file, including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`

### 3. Admin User Setup

#### Option A: Use the Admin Setup Page (Recommended) 🚀

1. **Start your development server:**

   ```bash
   npm run dev
   ```

2. **Visit the admin setup page:**

   ```
   http://localhost:3000/en/admin-setup
   ```

3. **Follow the automated setup:**
   - Sign in with your Firebase Auth email/password
   - Click "Setup as Admin" to automatically create your admin user document
   - Verify admin status is active
   - Done! Your admin user is ready

#### Option B: Manual Setup in Firebase Console

1. **Get your Firebase Auth UID:**

   - Firebase Console → Authentication → Users tab
   - Copy your User UID (long string like `abc123def456...`)

2. **Create Users Collection in Firestore:**
   - Firestore Database → Start collection
   - Collection ID: `users`
   - Document ID: Your Firebase Auth UID (paste the copied UID)
   - Add these fields:
     ```
     isAdmin: boolean = true
     email: string = "your-email@example.com"
     role: string = "admin"
     createdAt: timestamp = [current time]
     ```

#### Option C: Firestore Security Rules (Alternative)

You can also set up Firestore rules to automatically check admin permissions:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null;
    }

    // Events - public read, admin write
    match /events/{eventId} {
      allow read: if true; // Public read access
      allow write: if request.auth != null &&
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
  }
}
```

## API Endpoints

### Public Endpoints

- `GET /api/events` - Fetch all events
- `GET /api/events/[id]` - Fetch single event

### Admin Endpoints (Require Authentication)

- `POST /api/events` - Create new event
- `PUT /api/events/[id]` - Update event
- `DELETE /api/events/[id]` - Delete event

## EventService Changes

The `EventService` class has been updated to:

- Use API routes for all admin operations (create, update, delete)
- Keep client-side Firebase for read operations (better performance)
- Automatically handle authentication tokens
- Provide better error handling

## Security Features

1. **Server-side Validation**: All admin operations validated on server
2. **JWT Authentication**: Uses Firebase ID tokens for auth
3. **Admin Role Checking**: Verifies admin status before operations
4. **Input Sanitization**: Validates and sanitizes all input data
5. **Error Handling**: Proper error responses without exposing internals

## Development vs Production

### Development

- Uses `.env.local` for configuration
- Detailed error messages for debugging
- Firebase Admin SDK warnings acceptable

### Production

- Use environment variables in your hosting platform
- Ensure private key is properly escaped
- Monitor for any Firebase Admin SDK initialization errors
- Consider implementing rate limiting

## Troubleshooting

### Build Errors

1. **"Failed to parse private key"**: Check private key format in `.env.local`
2. **"Firebase Admin SDK not configured"**: Ensure all environment variables are set
3. **Authentication errors**: Verify service account has proper permissions

### Runtime Errors

1. **"Unauthorized"**: User doesn't have admin role
2. **"User not authenticated"**: Client needs to be signed in
3. **"Failed to create event"**: Check Firebase Admin SDK permissions

## Next Steps

1. Set up the Firebase service account private key
2. Configure admin users in Firestore
3. Test the API endpoints
4. Deploy with proper environment variables
5. Monitor API usage and security

## Files Modified

- `src/app/api/events/route.ts` - Main events API
- `src/app/api/events/[id]/route.ts` - Individual event API
- `src/lib/eventService.ts` - Updated to use API routes
- `.env.local` - Added Firebase Admin SDK config
- `package.json` - Added firebase-admin dependency
