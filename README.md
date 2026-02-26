# Prime Fix 🔧

A modern, beautifully designed home services booking app built with React Native and Expo. Book verified professionals for plumbing, electrical work, cleaning, appliance repair, and more—all in one tap.

## Features ✨

- **Service Discovery** – Browse categorized home services with real-time search and filtering.
- **Smart Filtering** – Search by service name to instantly narrow down options.
- **Service Cards** – Beautiful gradient-styled card UI with status indicators (active, selected, coming soon).
- **User-Friendly Forms** – Multi-step request flow with validation and error handling.
  - Step 1: Choose Service
  - Step 2: Fill Details (name, phone, address, issue description)
  - Step 3: Submit & Confirm
- **Email Integration** – Submit requests via native mail composer with clipboard fallback.
- **Promotional Banners** – Eye-catching limited-time offers and trust badges.
- **Professional UI** – Urban Company–inspired design with teal-to-blue gradients, shadows, and modern typography.
- **Cross-Platform** – Runs seamlessly on iOS and Android.

## Tech Stack 🛠️

- **Framework:** React Native with Expo
- **Routing:** Expo Router (file-based)
- **Typography & Design:** Custom design tokens (colors, spacing, typography)
- **Styling:** React Native StyleSheet + expo-linear-gradient
- **State Management:** React Hooks
- **Email:** expo-mail-composer (with optional serverless endpoint)
- **Other:** expo-clipboard, @react-native-masked-view, react-native-reanimated

## Installation 📦

1. **Clone the repository**

   ```bash
   git clone https://github.com/Jkverma1/PrimeFix.git
   cd PrimeFix
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment (optional)**

   For serverless email support, create a `.env` file:

   ```
   EMAIL_ENDPOINT=https://your-serverless-endpoint.com/send-email
   ```

## Running the App 🚀

### Development Mode

```bash
npx expo start
```

Then choose:

- **iOS Simulator:** Press `i`
- **Android Emulator:** Press `a`
- **Expo Go:** Scan QR code with Expo Go app on physical device

### Production Build

**For iOS:**

```bash
npx eas build --platform ios
```

**For Android:**

```bash
npx eas build --platform android
```

Detailed build instructions: [EAS Build Docs](https://docs.expo.dev/build/introduction/)

## Project Structure 📁

```
PrimeFix/
├── app/
│   ├── _layout.tsx          # Navigation setup
│   ├── index.tsx            # Home screen (services browse & filter)
│   ├── request.tsx          # Service request form
│   └── success.tsx          # Confirmation screen
├── components/
│   ├── AppButton.tsx        # Custom button with gradient
│   ├── AppInput.tsx         # Custom text input with validation UI
│   └── ServiceCard.tsx      # Service card component
├── constants/
│   ├── colors.ts            # Design tokens (colors, spacing, typography)
│   └── services.ts          # Service list data
├── hooks/
│   └── useServiceRequest.ts # Email submission logic
├── types/
│   └── index.ts             # TypeScript type definitions
├── services/
│   └── api.ts               # API placeholder
└── assets/
    └── images/              # App logo, icons, splash screens
```

## Key Screens 📱

### 1. Home Screen (`/`)

- Gradient header with app logo
- Search bar for filtering services
- Promotional banner with offers
- Service grid (2-column layout)
- Sticky footer with "Request Service" button

### 2. Request Screen (`/request`)

- Gradient header showing selected service
- 3-step progress indicator
- Form card with fields:
  - Your Name
  - Phone Number
  - Address
  - Describe the Issue
- Trust badges
- Sticky submit button

### 3. Success Screen (`/success`)

- Confirmation message
- Request ID display
- Copy to clipboard & email sharing options

## Customization 🎨

### Edit Services

Modify `constants/services.ts` to add/remove/update services:

```typescript
export const SERVICES: Service[] = [
  {
    id: "plumber",
    label: "Plumbing",
    icon: "🔧",
    price: 499,
    comingSoon: false,
  },
  // ...
];
```

### Update Colors & Fonts

Edit `constants/colors.ts` for design tokens:

```typescript
const Colors = {
  primary: "#1A6FD4",
  success: "#1DB8A0",
  // ...
};
```

### Replace Logo & Splash

- Add your logo as `assets/images/app_logo.png`
- Update the splash screen image (`assets/images/splash-icon.png`)
- Configure in `app.json`

## Configuration 📋

Update `app.json` for app metadata:

```json
{
  "expo": {
    "name": "Prime Fix",
    "slug": "prime-fix",
    "ios": { "supportsTablet": true },
    "android": { "adaptiveIcon": { ... } }
  }
}
```

## Email Setup (Optional) 📧

By default, the app uses the native mail composer. To add a serverless backend:

1. Deploy an email endpoint (e.g., AWS Lambda, Vercel)
2. Set `EMAIL_ENDPOINT` in `.env`
3. The app will POST requests and fall back to mail composer if unavailable

## Troubleshooting 🐛

**Button Not Appearing?**

- Ensure footer is outside KeyboardAvoidingView for sticky positioning

**Search Not Filtering?**

- Verify service labels in `constants/services.ts` match expected names

**Styles Not Applying?**

- Clear Metro cache: `npx expo start -c`

**Build Failing?**

- Run `npm install` and ensure all peer dependencies are met
- Check `package.json` for conflicting versions

## Future Enhancements 🚀

- [ ] User authentication & profiles
- [ ] Real-time booking status tracking
- [ ] Payment integration
- [ ] Review & ratings system
- [ ] Saved addresses & favorites
- [ ] Push notifications
- [ ] Admin dashboard

## License 📄

This project is open source and available under the MIT License.

## Support & Feedback 💬

For issues, feature requests, or feedback, please open an issue on [GitHub](https://github.com/Jkverma1/PrimeFix/issues).

---

**Built with ❤️ using React Native & Expo**
