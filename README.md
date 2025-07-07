# Notes Editor - Frontend Technical Test

Rich text editor developed with Next.js that allows creating, viewing, editing and deleting notes with offline support.

## 🚀 Features

- **Rich text editor** with TipTap
- **Authentication** with JWT and middleware protection
- **Offline support** - Notes are saved locally when there's no connection
- **Automatic synchronization** when connection is restored
- **Notes management** - Create, read, edit and delete
- **Modal visualization** for reading notes
- **Responsive design** with Tailwind CSS

## 📋 Editor Features

- Text formatting: **bold**, *italic*, <u>underline</u>
- Ordered and unordered lists
- Headers (H1-H5)
- Automatic content saving

## 🛠️ Technologies Used

- **Next.js 14** - React Framework
- **TypeScript** - Static typing
- **TipTap** - Rich text editor
- **Tailwind CSS** - Styling
- **React Icons** - Iconography
- **cookies-next** - Cookie management
- **JWT** - Authentication

## 📁 Project Structure

```
src/
├── api/                    # API configuration
│   └── index.tsx          # Centralized API functions
├── app/
│   ├── login/             # Login page
│   ├── register/          # Register page
│   └── page.tsx           # Main page
├── components/
│   └── ui-pages/
│       └── text-editor/   # Editor components
├── types/                 # TypeScript type definitions
├── utils/                 # Utilities and helpers
└── middleware.ts          # Authentication middleware
```

## 🚀 Installation and Setup

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm or bun

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd prueba-tecnica-frontend
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. **Configure environment variables**

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_API_URL=example/api
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. **Open the application**

Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Authentication

### Register
- Endpoint: `POST /api/register`
- Fields: `username`, `email`, `password`

### Login
- Endpoint: `POST /api/login`
- Fields: `email`, `password`
- Response: JWT token with expiration date

### Middleware
- Protects authenticated routes (`/`)
- Verifies token expiration
- Redirects to `/login` if not authenticated

## 📝 Notes Management

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/notas` | Get all user notes |
| POST   | `/api/nota` | Create a new note |
| DELETE | `/api/nota/:id` | Delete a note |

### Note Structure

```typescript
interface Note {
  id: number;
  title: string;
  content: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}
```

## 💾 Offline Functionality

### Local Storage
- **Pending notes**: Saved in `localStorage` under the key `pendingNotes`
- **Pending deletions**: Saved in `localStorage` under the key `pendingDeleteNotes`

### Synchronization
- **Connection detection**: Uses `navigator.onLine` and `online` events
- **Automatic sending**: When connection is restored, all pending notes are sent
- **Notification**: Alert with number of synchronized notes

### Offline Flow

1. **No connection**: Notes are saved locally with temporary ID
2. **Visualization**: Local notes are shown marked with `(local)`
3. **Deletion**: Local notes are removed from localStorage
4. **Connection restored**: All pending notes are automatically synchronized

## 🎨 Main Components

### `Tiptap` (Main Component)
- Manages global editor state
- Handles online/offline synchronization
- Coordinates all sub-components

### `NoteViewer`
- Component for viewing notes in read mode
- Displayed when clicking on a note from the list

### `NotesList`
- List of notes with selection and deletion options
- Visually distinguishes between synchronized and local notes

### `EditorToolbar`
- Text editor toolbar
- Formatting buttons: bold, italic, underline, lists, headers

### `NoteEditor`
- Main editor with title input and content area
- Integrates TipTap for rich text

## 🔧 Available Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production application
npm run start

# Linter
npm run lint
```

## 🌐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | API base URL | `https://api.example.com/api` |

## 📱 Application Routes

| Route | Description | Protected |
|-------|-------------|-----------|
| `/` | Main page with editor | ✅ |
| `/login` | Login page | ❌ |
| `/register` | Register page | ❌ |

## 🛡️ Security

- **JWT Tokens**: Token-based authentication
- **Middleware**: Server-side route protection
- **Expiration**: Automatic verification of expired tokens
- **Authorization headers**: `Bearer token` in all authenticated requests

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/NewFeature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

## 📄 License

This project is under the MIT License. See the `LICENSE` file for more details.

## 👨‍💻 Developed by

Miguel Mateo - Frontend Technical Test

---

**Note**: This project was developed as part of a technical test to demonstrate skills in React, Next.js, TypeScript and complex state management with offline
