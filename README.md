# Cyberpunk Red Character Manager

A web application to create, manage, and store character sheets for the Cyberpunk RED tabletop roleplaying game.

## Deployment to GitHub Pages

This project is configured for easy deployment to GitHub Pages.

### Step 1: Update Repository Name in `vite.config.ts` (Important!)

Before deploying, you **must** update the `base` path in the `vite.config.ts` file to match your GitHub repository name.

1.  Open `vite.config.ts`.
2.  Find the line `base: '/cyberpunk-red-character-manager/',`.
3.  Change `/cyberpunk-red-character-manager/` to `/<your-repo-name>/`.
    *   For example, if your repository URL is `https://github.com/your-username/my-cyberpunk-app`, you would set `base: '/my-cyberpunk-app/',`.

### Step 2: Configure GitHub Repository Settings

You only need to do this once for your repository.

1.  Go to your repository page on GitHub.
2.  Click on the **"Settings"** tab.
3.  In the left sidebar, click on **"Pages"**.
4.  Under "Build and deployment", in the "Source" dropdown, select **"GitHub Actions"**.

### Step 3: Push Your Code

That's it! A deployment will automatically start every time you push code to your `main` branch.

- Commit and push all your files (including the new workflow file) to your repository.
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
