# Cyberpunk Red Character Manager

A web application to create, manage, and store character sheets for the Cyberpunk RED tabletop roleplaying game.

## Deployment to GitHub Pages

This project is now configured for easy deployment to GitHub Pages using GitHub Actions.

### 1. Repository Name Configuration

Before deploying, you **must** update the `base` path in the `vite.config.ts` file to match your GitHub repository name.

- Open `vite.config.ts`.
- Find the line `base: '/cyberpunk-red-character-manager/',`.
- Change `/cyberpunk-red-character-manager/` to `/<your-repo-name>/`. For example, if your repository URL is `https://github.com/your-username/my-cyberpunk-app`, you would set `base: '/my-cyberpunk-app/',`.

### 2. GitHub Pages Settings

You need to configure your repository to use GitHub Pages with the GitHub Actions build workflow.

1.  Go to your repository on GitHub.
2.  Click on the **"Settings"** tab.
3.  In the left sidebar, click on **"Pages"**.
4.  Under "Build and deployment", select **"GitHub Actions"** as the source.

### 3. Deployment

The deployment will automatically trigger every time you push code to your `main` branch (or `master`, depending on your repository's default).

- Commit and push all the new configuration files (`package.json`, `vite.config.ts`, etc.) to your repository.
- Go to the **"Actions"** tab in your GitHub repository to monitor the deployment progress.
- Once the workflow is complete, your application will be live at the URL provided in the "Pages" settings (usually `https://<your-username>.github.io/<your-repo-name>/`).

---

## Local Development

To run the application locally, you need to have [Node.js](https://nodejs.org/) installed.

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Run the development server:**
    ```bash
    npm run dev
    ```

This will start a local server, and you can view the application in your browser at the URL provided in the console.
