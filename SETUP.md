# Mr.Summaries - Setup Guide

## Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/lazer-code/Mr.Summaries.git
cd Mr.Summaries
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
/app
  /page.tsx                    # Main home (platform selection)
  /summaries
    /page.tsx                  # Summary platform home
  /notebooks
    /page.tsx                  # Placeholder "Coming Soon"
  /calendar
    /page.tsx                  # Placeholder "Coming Soon"
  /layout.tsx                  # Root layout
  /globals.css                 # Global styles

/components
  /home
    /PlatformCard.tsx          # Platform selection card
  /summaries
    /SummaryBlock.tsx          # Summary preview card
    /SummaryModal.tsx          # Full summary view popup
    /SummaryUploadForm.tsx     # Upload form
    /SearchBar.tsx             # Search component
    /SummaryContent.tsx        # Renders summary content with LaTeX

/lib
  /utils.ts                    # Utility functions
  /mock-data.ts                # Mock summaries data

/types
  /summary.ts                  # TypeScript types
```

## Features

### Main Home Screen (/)
- Platform selection interface
- Three cards: Notebooks (Coming Soon), Summaries, Calendar & Tasks (Coming Soon)
- Modern design with hover animations

### Summary Platform (/summaries)
- **Search Bar**: Real-time filtering by course number, name, or subject
- **Summary Grid**: Display of all summaries with preview
- **Upload Button**: Create new summaries
- **Summary Blocks**: Click to view full summary

### Summary View Modal
- Full content display
- LaTeX math equation rendering (using KaTeX)
- Support for:
  - Headers (H1, H2, H3)
  - Bold and italic text
  - Tables
  - Code blocks
  - Math equations (inline: `$...$`, display: `$$...$$`)
  - Lists

### Upload Form
- Course number and name inputs
- Summary title and author fields
- Large content textarea
- Markdown and LaTeX support

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Math Rendering**: KaTeX (via CDN)
- **State Management**: React useState hooks

## Design Guidelines

All UI elements follow the design requirements:
- **Rectangular with rounded corners** (rounded-lg, rounded-xl)
- Modern, clean aesthetic
- Responsive design (mobile, tablet, desktop)
- Smooth transitions and hover effects
- Blue color scheme for academic feel

## Mock Data

The application includes 6 sample summaries:
1. MATH 201 - Calculus II (Integration Techniques)
2. PHYS 102 - Physics (Maxwell's Equations)
3. CS 224 - Data Structures (Sorting Algorithms)
4. CHEM 301 - Organic Chemistry (Reaction Mechanisms)
5. ECON 101 - Microeconomics (Supply and Demand)
6. BIO 205 - Cell Biology (Cell Cycle and Mitosis)

## Future Enhancements

- Real database integration (currently uses mock data)
- User authentication
- Image upload support
- Notebook platform implementation
- Calendar & Tasks platform implementation
- Dark mode toggle
- PDF export functionality
- Collaborative editing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.
