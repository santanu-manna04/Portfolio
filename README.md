# Santanu Manna — Portfolio

A static React + Vite portfolio. It runs without a backend, API, or database. Page content is stored in the frontend source and images are served from `frontend/public`.

## Run locally

Requires Node.js 18 or newer.

```bash
cd frontend
npm install
npm run dev
```

## Update the portfolio

Edit `frontend/src/data/defaults.js` to update the profile, skills, projects, certificates, services, and About page content. The site uses these local values directly; there is no admin dashboard.

### Add project images

1. Copy image files into `frontend/public/images/projects/`.
2. Set a project's `thumbnail` to a path such as `/images/projects/my-project.png`.
3. Add any additional project image paths to that project's `screenshots` array.

Example:

```js
{
  _id: 'my-project',
  title: 'My Project',
  description: 'Project description.',
  technologies: ['React'],
  features: ['Responsive design'],
  categories: ['React'],
  githubUrl: 'https://github.com/your-name/my-project',
  liveUrl: '',
  thumbnail: '/images/projects/my-project.png',
  screenshots: ['/images/projects/my-project-detail.png'],
}
```

### Add certificate images

1. Copy certificate images into `frontend/public/images/certificates/`.
2. Add an item to `defaultCertificates` in `frontend/src/data/defaults.js`. Set `file` to a path such as `/images/certificates/my-certificate.png` and `fileType` to `'image'`. PDF files can also be added with `fileType: 'pdf'`.

Example:

```js
{
  _id: 'my-certificate',
  title: 'Course Certificate',
  organization: 'Course Provider',
  issueDate: '2026-01-01',
  category: 'Development',
  credentialId: '',
  file: '/images/certificates/my-certificate.png',
  fileType: 'image',
}
```

Place your profile image and resume in `frontend/public/images/profile/`, then set `profileImage` or `resumeUrl` in `defaultProfile` to paths such as `/images/profile/photo.png` or `/images/profile/resume.pdf`. Set `defaultProfile.email` there too; the contact form opens a prefilled email draft using that address.

## Build and deploy

```bash
cd frontend
npm run build
```

Publish `frontend/dist` to any static hosting provider. Configure the host to serve `index.html` for unknown paths so React Router routes work on refresh. The optional `frontend/Dockerfile` builds and serves the same static site.

### GitHub Pages

The GitHub Actions workflow builds and deploys the site whenever changes are pushed to `main`. In the repository settings, open **Pages** and set the build and deployment source to **GitHub Actions**. The project is configured for the repository URL (`/Portfolio/`) and includes a Pages fallback for client-side routes.
