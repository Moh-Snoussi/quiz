# Lightweight Quiz Application

This repository contains a lightweight quiz application designed to enhance learning experiences by providing an efficient, server and internet-independent platform for creating and managing quizzes locally.

## Features

- **Engaging**: Makes learning enjoyable and interactive.
- **Insightful**: Enables users to monitor their progress effectively.
- **Customizable**: Empowers users to create and modify quizzes to suit their needs.
- **Lightweight**: Delivers fast performance with minimal dependencies.
- **Secure**: Operates independently of servers, ensuring data privacy.
- **Offline Access**: Fully functional without an internet connection.
- **Cross-Platform**: Compatible with any modern web browser on various devices.

## Getting Started

### Prerequisites

- A modern web browser (e.g., Chrome, Firefox, Edge).

### Installation

1. Clone this repository:
   ```bash
   git clone <repository-url>
   ```
2. Open the `public/index.html` file in your browser to start using the application.

### Offline Usage

To use the application offline, install it by clicking the install button in the menu bar.

## JSON Course Format

To add a course, save a JSON file in the following format:

### Basic Format
```json
{
    "questions": [
        {
            "question": "What is the capital of the Marz?",
            "shortQuestion": "earth capital?",
            "type": "multiple-choice",
            "answers": [
                "Berlin",
                "Madrid",
                "Paris",
                "Palastine",
                "Rome",
                "Israel"
            ],
            "correctAnswer": "3",
            "quizName": "Geography Quiz",
            "cofficient": 3,
            "note": "Earth love"
        }
    ]
}
```

### With Sections
```json
{
    "title": "Google Workspace Authentication and Security",
    "description": "This course covers email authentication methods and policies in Google Workspace.",
    "sections": [
        {
            "title": "Account setup",
            "description": "Learn about setting up your account and verifying domain ownership for Google Workspace.",
            "questions": [
                {
                    "question": "Typically how long after new features are released to the Rapid release track will they be released on the Scheduled release track?",
                    "shortQuestion": "Delay between Rapid and Scheduled release?",
                    "type": "multiple-choice",
                    "answers": [
                        "At least 2 weeks"
                    ]
                }
            ]
        }
    ]
}
```

## Root Attributes

| Attribute      | Description                                                                 |
|----------------|-----------------------------------------------------------------------------|
| `title`        | The title of the course, section, or quiz.                                  |
| `description`  | A detailed description of the course, section, or quiz.                    |
| `questions`    | An array of questions included in the course or section.                   |
| `sections`     | An array of sections, each containing its own title, description, and questions. |

## Question Attributes

| Attribute        | Description                                                                 |
|------------------|-----------------------------------------------------------------------------|
| `question`       | The main question text.                                                    |
| `shortQuestion`  | A brief version of the question.                                           |
| `type`           | The type of question (e.g., multiple-choice).                              |
| `answers`        | An array of possible answers.                                              |
| `correctAnswer`  | The index of the correct answer in the `answers` array (0-based).          |
| `quizName`       | The name of the quiz.                                                      |
| `cofficient`     | A numerical value representing the weight of the question.                 |
| `note`           | Additional notes or hints for the question.                                |

## AI Prompt

To generate a JSON course, use the following prompt:

```
Create a JSON course from [course name/content] with: title, description, sections (title, description, questions), and questions (question, shortQuestion, type, answers, correctAnswer). If no sections, put questions at root.
```

## Contact

For any inquiries or support, contact the developer at: [soonic@live.com](mailto:soonic@live.com).

## Deployment

Initially, the application needs to be served somehow. You can use any web server, but here are two common methods:

### Using Apache2

To deploy the application using Apache2:

1. Move the virtual host configuration file to the Apache sites-available directory:
   ```bash
   sudo mv apps-quiz.conf /etc/apache2/sites-available/
   ```
2. Enable the site configuration:
   ```bash
   sudo a2ensite apps-quiz.conf
   ```
3. Reload Apache to apply the changes:
   ```bash
   sudo systemctl reload apache2
   ```

The application will now be accessible at `http://quiz.local`. Ensure that `quiz.local` is added to your `/etc/hosts` file for local development.
