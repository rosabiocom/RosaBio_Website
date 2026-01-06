# RosaBio Website - Template 1

Dark theme with particle effects background.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Editing Site Content

All site text is centralized in a single file for easy editing:

**`src/data/siteContent.ts`**

### Editable Sections

| Section | What You Can Edit |
|---------|-------------------|
| `hero` | Main title, highlighted text, subtitle, button label |
| `valueProps` | "Smarter. Better. Faster." section - title, subtitle, 3 value cards |
| `technology` | Technology section title, paragraphs, external link |
| `leadership` | Section title, subtitle, team member cards (name, title, bio) |
| `navbar` | Logo text, navigation links |
| `footer` | Logo text, contact text, email, copyright |

### How to Edit

1. Open `src/data/siteContent.ts`
2. Find the section you want to edit
3. Change the text inside the quotes
4. Save the file

### Important Rules

- **Don't delete quotes `""`** or commas `,`
- **Don't change `iconKey` values** unless instructed
- **Multi-line text** uses backticks `` ` `` instead of quotes

### Example

To change the hero subtitle:

```typescript
hero: {
  // ...
  subtitle: "Your new subtitle text here.",
  // ...
},
```

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Particles**: tsparticles

## Deployment

Deployed on [Vercel](https://vercel.com).
