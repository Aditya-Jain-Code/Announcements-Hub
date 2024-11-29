# Announcement Hub

## Project Overview
The **Announcement Hub** is a centralized platform designed to streamline university announcements. It offers features like categorization, email subscriptions, and AI-powered summarizations to improve the user experience. The platform is adaptable for any university, addressing common challenges in existing announcement systems.

---

## Features

1. **Centralized Announcements**: All announcements in one place.
2. **Categorization**: Easily browse announcements by category.
3. **AI Summarization**: Quickly understand announcement details.
4. **Dark and Light Modes**: User-friendly interface options.
5. **Administrator Dashboard**: Full dashboard for managing announcements, including upload and delete functionalities.

---

## Tech Stack

- **Frontend**: Next.js, React
- **Backend**: Node.js, MongoDB
- **AI Integration**: Gemini AI for summarization

---

## Database Schemas

### 1. Announcement Schema
```json
{
  "title": "String",
  "slug": "String (required)",
  "description": "String",
  "newscategory": "String",
  "tags": "Array of Strings",
  "status": "String (draft/publish)",
  "publishedAt": "Date",
  "timestamps": {
    "createdAt": "Date",
    "updatedAt": "Date"
  }
}
```
---

## Installation and Setup

### Prerequisites
- Node.js
- MongoDB

### Steps
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd announcement-hub
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure environment variables:
   - Create a `.env` file.
   - Add the following:
     ```
     MONGO_URI=<Your MongoDB URI>
     GEMINI_API_KEY=<Your API Key>
     ```
5. Start the development server:
   ```bash
   npm run dev
   ```

---

## Usage

- Navigate to the home page to view categorized announcements.
- Use the search bar for specific announcements.

---

## Future Work

- Expand the platform to include:
  - Event calendars.
  - Multilingual support.

---

## License
This project is licensed under the MIT License.
